'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FileUploadState, MindMapData } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';
import { transformGraphData, BackendGraphData } from '../lib/graph-transform';

interface ExtendedFileUploadState extends FileUploadState {
	mindMapData: MindMapData | null;
	fileId: string | null;
	uploadProgress: number;
	processingStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
	selectedFile: File | null; // New: store selected file without processing
}

export const useFileUpload = () => {
	const [state, setState] = useState<ExtendedFileUploadState>({
		isDragOver: false,
		uploadedFile: null,
		isProcessing: false,
		error: null,
		mindMapData: null,
		fileId: null,
		uploadProgress: 0,
		processingStatus: 'idle',
		selectedFile: null,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Polling abort controller ref for smart polling management
	const pollingAbortControllerRef = useRef<AbortController | null>(null);

	// Configuration
	const maxSizeInMB = 10;
	const acceptedFileTypes = useMemo(() => ['.pdf'], []);
	const maxSizeBytes = useMemo(() => maxSizeInMB * 1024 * 1024, [maxSizeInMB]);
	const acceptedTypesString = useMemo(
		() => acceptedFileTypes.join(','),
		[acceptedFileTypes]
	);
	const supportedTypesDisplay = useMemo(
		() => acceptedFileTypes.join(', '),
		[acceptedFileTypes]
	);

	const formatFileSize = useCallback((bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}, []);

	const validateFile = useCallback(
		(file: File): string | null => {
			if (file.size > maxSizeBytes) {
				return `File size must be less than ${maxSizeInMB}MB`;
			}

			const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
			if (
				!acceptedFileTypes.some(type => type.toLowerCase() === fileExtension)
			) {
				return `File type not supported. Please upload: ${supportedTypesDisplay}`;
			}

			return null;
		},
		[maxSizeBytes, maxSizeInMB, acceptedFileTypes, supportedTypesDisplay]
	);

	// Step 1: Just select and validate the file (no upload yet)
	const selectFile = useCallback(
		(file: File) => {
			const validationError = validateFile(file);
			if (validationError) {
				setState(prev => ({
					...prev,
					error: validationError,
					processingStatus: 'error',
					selectedFile: null,
				}));
				return;
			}

			// Just store the selected file, don't upload yet
			setState(prev => ({
				...prev,
				error: null,
				selectedFile: file,
				uploadedFile: null,
				isProcessing: false,
				mindMapData: null,
				fileId: null,
				uploadProgress: 0,
				processingStatus: 'idle',
			}));
		},
		[validateFile]
	);

	// Simplified upload that works with current backend
	// Step 2: Upload to S3 and process using individual API methods
	const uploadAndProcessFile = useCallback(async () => {
		if (!state.selectedFile) {
			setState(prev => ({
				...prev,
				error: 'No file selected. Please select a file first.',
				processingStatus: 'error',
			}));
			return;
		}

		// Create abort controller for this upload session
		pollingAbortControllerRef.current = new AbortController();

		setState(prev => ({
			...prev,
			error: null,
			isProcessing: true,
			uploadedFile: state.selectedFile,
			mindMapData: null,
			fileId: null,
			uploadProgress: 0,
			processingStatus: 'uploading',
		}));

		try {
			// Step 1: Get presigned URL
			setState(prev => ({ ...prev, uploadProgress: 10 }));
			const presignedData = await mindmapApi.getPresignedUrl(
				state.selectedFile.name,
				state.selectedFile.type
			);

			// Step 2: Upload to S3
			setState(prev => ({ ...prev, uploadProgress: 50 }));
			const uploadUrl = presignedData.upload_url || presignedData.presigned_url;
			if (!uploadUrl) {
				throw new Error('No upload URL received from backend');
			}
			await mindmapApi.uploadFileToS3(
				uploadUrl,
				state.selectedFile,
				state.selectedFile.type
			);

			// Step 3: Smart polling with initial delay to reduce 404 errors
			setState(prev => ({
				...prev,
				uploadProgress: 70,
				processingStatus: 'processing',
			}));

			// Smart polling strategy to reduce 404 errors
			let attempts = 0;
			const maxAttempts = 30; // 15 minutes with adaptive intervals
			const baseInterval = 15000; // Start with 15 seconds
			const maxInterval = 60000; // Cap at 60 seconds
			const initialDelay = 25000; // Wait 25 seconds before first check

			// Initial delay - give the backend time to register the file for processing
			setState(prev => ({ ...prev, uploadProgress: 72 }));
			await new Promise(resolve => {
				const timeoutId = setTimeout(resolve, initialDelay);
				// Allow cancellation during initial wait
				pollingAbortControllerRef.current?.signal.addEventListener(
					'abort',
					() => {
						clearTimeout(timeoutId);
						resolve(undefined);
					}
				);
			});

			// Check if cancelled during initial delay
			if (pollingAbortControllerRef.current?.signal.aborted) {
				return;
			}

			while (attempts < maxAttempts) {
				// Check if polling was cancelled
				if (pollingAbortControllerRef.current?.signal.aborted) {
					return;
				}

				// Calculate adaptive interval with exponential backoff
				const currentInterval = Math.min(
					baseInterval + attempts * 2000, // Increase by 2s each attempt
					maxInterval
				);

				// Smooth progress calculation - more responsive early, slower later
				const earlyPhaseProgress = attempts < 10 ? (attempts / 10) * 15 : 15;
				const latePhaseProgress =
					attempts >= 10 ? ((attempts - 10) / 20) * 10 : 0;
				const processingProgress =
					75 + Math.min(20, earlyPhaseProgress + latePhaseProgress);
				setState(prev => ({
					...prev,
					uploadProgress: Math.round(processingProgress),
				}));

				try {
					const graphResponse = await mindmapApi.getSavedGraph(
						presignedData.file_id
					);

					if (
						graphResponse.status === 'completed' &&
						graphResponse.graph_data
					) {
						// Transform backend data format to frontend format
						const backendData = graphResponse.graph_data as BackendGraphData;
						const transformedData = transformGraphData(backendData);

						// Clean completion - ensure all processing flags are properly reset
						setState(prev => ({
							...prev,
							isProcessing: false,
							mindMapData: transformedData,
							fileId: presignedData.file_id,
							uploadProgress: 100,
							processingStatus: 'completed',
							error: null,
						}));

						// Clear abort controller
						pollingAbortControllerRef.current = null;

						return;
					} else if (graphResponse.status === 'error') {
						const errorMessage =
							graphResponse.error || 'File processing failed on the server';
						console.error('❌ Server reported processing error:', errorMessage);
						throw new Error(errorMessage);
					} else if (graphResponse.status === 'processing') {
						// Continue polling - this is expected during processing
					} else {
						console.warn(`⚠️ Unexpected status: ${graphResponse.status}`);
					}
				} catch (pollingError) {
					// Smart error handling - distinguish between "not ready yet" vs "real errors"
					const isNotReadyError =
						pollingError &&
						typeof pollingError === 'object' &&
						'response' in pollingError &&
						(pollingError as { response?: { status?: number } }).response
							?.status === 404;

					if (isNotReadyError && attempts >= 5) {
						// After several attempts, log as a warning but continue
						console.warn(
							`⚠️ File still not ready (attempt ${attempts + 1}/${maxAttempts}) - continuing to poll...`
						);
					} else if (!isNotReadyError) {
						// Handle other types of errors
						console.warn(
							`⚠️ Polling attempt ${attempts + 1}/${maxAttempts} failed:`,
							pollingError
						);
					}

					// If it's the last attempt, give up and throw the error
					if (attempts === maxAttempts - 1) {
						console.error('❌ Final polling attempt failed, giving up');
						throw pollingError;
					}
				}

				// Wait before next polling attempt with adaptive interval
				await new Promise(resolve => {
					const timeoutId = setTimeout(resolve, currentInterval);
					// Allow cancellation during wait
					pollingAbortControllerRef.current?.signal.addEventListener(
						'abort',
						() => {
							clearTimeout(timeoutId);
							resolve(undefined);
						}
					);
				});
				attempts++;
			}

			// Timeout reached
			console.error(
				`❌ Polling timeout reached after ${maxAttempts} attempts (15 minutes)`
			);
			throw new Error(
				`Processing timeout after 15 minutes (${maxAttempts} attempts). The file might still be processing - please try again later or contact support if the issue persists.`
			);
		} catch (error) {
			console.error('❌ Upload and processing failed:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Upload failed';
			setState(prev => ({
				...prev,
				isProcessing: false,
				error: errorMessage,
				uploadedFile: null,
				mindMapData: null,
				fileId: null,
				uploadProgress: 0,
				processingStatus: 'error',
			}));
		} finally {
			// Clean up abort controller
			pollingAbortControllerRef.current = null;
		}
	}, [state.selectedFile]);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setState(prev => ({ ...prev, isDragOver: true }));
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setState(prev => ({ ...prev, isDragOver: false }));
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setState(prev => ({ ...prev, isDragOver: false }));

			const files = Array.from(e.dataTransfer.files);
			if (files[0]) selectFile(files[0]);
		},
		[selectFile]
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) selectFile(file);
		},
		[selectFile]
	);

	const handleBrowseClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleRemoveFile = useCallback(() => {
		// Cancel any ongoing polling
		if (pollingAbortControllerRef.current) {
			pollingAbortControllerRef.current.abort();
			pollingAbortControllerRef.current = null;
		}

		setState({
			isDragOver: false,
			uploadedFile: null,
			isProcessing: false,
			error: null,
			mindMapData: null,
			fileId: null,
			uploadProgress: 0,
			processingStatus: 'idle',
			selectedFile: null,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, []);

	const resetUpload = useCallback(() => {
		// Cancel any ongoing polling
		if (pollingAbortControllerRef.current) {
			pollingAbortControllerRef.current.abort();
			pollingAbortControllerRef.current = null;
		}

		setState({
			isDragOver: false,
			uploadedFile: null,
			isProcessing: false,
			error: null,
			mindMapData: null,
			fileId: null,
			uploadProgress: 0,
			processingStatus: 'idle',
			selectedFile: null,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, []);

	// Cancel ongoing processing
	const cancelProcessing = useCallback(() => {
		if (pollingAbortControllerRef.current) {
			console.log('🛑 User cancelled processing');
			pollingAbortControllerRef.current.abort();
			pollingAbortControllerRef.current = null;

			setState(prev => ({
				...prev,
				isProcessing: false,
				processingStatus: 'idle',
				uploadProgress: 0,
				error: 'Processing cancelled by user',
			}));
		}
	}, []);

	// Cleanup effect to cancel polling on unmount
	useEffect(() => {
		return () => {
			// Cancel any ongoing polling when component unmounts
			if (pollingAbortControllerRef.current) {
				console.log('🧹 Cleaning up polling on component unmount');
				pollingAbortControllerRef.current.abort();
				pollingAbortControllerRef.current = null;
			}
		};
	}, []);

	return {
		...state,
		fileInputRef,
		acceptedTypesString,
		supportedTypesDisplay,
		maxSizeInMB,
		formatFileSize,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileSelect,
		handleBrowseClick,
		handleRemoveFile,
		resetUpload,
		selectFile,
		uploadAndProcessFile,
		cancelProcessing,
	};
};
