'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { FileUploadState, MindMapData } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';

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

	// Configuration
	const maxSizeInMB = 10;
	const acceptedFileTypes = useMemo(
		() => ['.txt', '.pdf', '.doc', '.docx'],
		[]
	);
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
			console.log('🔄 Getting presigned URL...');
			const presignedData = await mindmapApi.getPresignedUrl(
				state.selectedFile.name,
				state.selectedFile.type
			);
			console.log('✅ Got presigned URL:', presignedData);

			// Step 2: Upload to S3
			setState(prev => ({ ...prev, uploadProgress: 50 }));
			console.log('🔄 Uploading to S3...');
			const uploadUrl = presignedData.upload_url || presignedData.presigned_url;
			if (!uploadUrl) {
				throw new Error('No upload URL received from backend');
			}
			await mindmapApi.uploadFileToS3(
				uploadUrl,
				state.selectedFile,
				state.selectedFile.type
			);
			console.log('✅ File uploaded to S3');

			// Step 3: Wait for processing
			setState(prev => ({
				...prev,
				uploadProgress: 70,
				processingStatus: 'processing',
			}));
			console.log('🔄 Waiting for processing...');

			// Poll for completion
			let attempts = 0;
			const maxAttempts = 90; // 15 minutes with 10-second intervals
			const pollInterval = 10000; // 10 seconds

			while (attempts < maxAttempts) {
				console.log(`📊 Polling attempt ${attempts + 1}/${maxAttempts}...`);

				const processingProgress =
					70 + Math.min(25, (attempts / maxAttempts) * 25);
				setState(prev => ({ ...prev, uploadProgress: processingProgress }));

				try {
					const graphResponse = await mindmapApi.getSavedGraph(
						presignedData.file_id
					);
					console.log('📋 Graph response:', graphResponse);

					if (
						graphResponse.status === 'completed' &&
						graphResponse.graph_data
					) {
						console.log('✅ Processing completed!');
						setState(prev => ({
							...prev,
							isProcessing: false,
							mindMapData: graphResponse.graph_data || null,
							fileId: presignedData.file_id,
							uploadProgress: 100,
							processingStatus: 'completed',
						}));
						return;
					} else if (graphResponse.status === 'error') {
						throw new Error(graphResponse.error || 'File processing failed');
					} else if (graphResponse.status === 'processing') {
						console.log('📊 Still processing... continuing to poll');
						// Continue polling - this is expected
					}
				} catch (pollingError) {
					// If there's an unexpected error during polling, log it but continue
					console.warn(
						`⚠️ Polling attempt ${attempts + 1} failed:`,
						pollingError
					);
					// Only throw if it's the last attempt
					if (attempts === maxAttempts - 1) {
						throw pollingError;
					}
				}

				await new Promise(resolve => setTimeout(resolve, pollInterval));
				attempts++;
			}

			throw new Error(
				'Processing timeout after 15 minutes - please try again later'
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
	};
};
