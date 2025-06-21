'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { FileUploadState } from '../types/mindmap';

export const useFileUpload = () => {
	const [state, setState] = useState<FileUploadState>({
		isDragOver: false,
		uploadedFile: null,
		isProcessing: false,
		error: null,
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

	const processFile = useCallback(
		async (file: File) => {
			const validationError = validateFile(file);
			if (validationError) {
				setState(prev => ({ ...prev, error: validationError }));
				return;
			}

			setState(prev => ({
				...prev,
				error: null,
				isProcessing: true,
				uploadedFile: file,
			}));

			// Simulate file processing
			await new Promise(resolve => setTimeout(resolve, 1500));

			setState(prev => ({ ...prev, isProcessing: false }));
		},
		[validateFile]
	);

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
			if (files[0]) processFile(files[0]);
		},
		[processFile]
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) processFile(file);
		},
		[processFile]
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
	};
};
