'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/constants';
import { UploadContent } from './uploader';
import { ProcessingContent } from './processing';
import { SuccessContent } from './success';
import { ErrorMessage } from './error';

interface FileUploadCardProps {
	isDragOver: boolean;
	uploadedFile: File | null;
	selectedFile: File | null; // New: selected file before upload
	isProcessing: boolean;
	processingStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
	uploadProgress: number;
	error: string | null;
	acceptedTypesString: string;
	supportedTypesDisplay: string;
	maxSizeInMB: number;
	formatFileSize: (bytes: number) => string;
	onDragOver: (e: React.DragEvent) => void;
	onDragLeave: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBrowseClick: () => void;
	onRemoveFile: () => void;
	onGenerateMindMap: () => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
	isDragOver,
	uploadedFile,
	selectedFile,
	isProcessing,
	processingStatus,
	uploadProgress,
	error,
	acceptedTypesString,
	supportedTypesDisplay,
	maxSizeInMB,
	formatFileSize,
	onDragOver,
	onDragLeave,
	onDrop,
	onFileSelect,
	onBrowseClick,
	onRemoveFile,
	onGenerateMindMap,
	fileInputRef,
}) => {
	return (
		<motion.div {...animations.stagger}>
			<Card className="overflow-hidden shadow-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 transition-colors duration-300">
				<CardContent className="p-0">
					<div
						className={`relative p-12 text-center transition-colors duration-300 ${
							isDragOver
								? 'bg-gradient-to-br from-emerald-50 to-green-50'
								: 'bg-gradient-to-br from-gray-50 to-white'
						}`}
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
					>
						<input
							ref={fileInputRef}
							type="file"
							onChange={onFileSelect}
							accept={acceptedTypesString}
							className="hidden"
							aria-label="File upload input"
						/>

						<AnimatePresence mode="wait">
							{/* Step 1: File Selection (before upload) */}
							{!selectedFile &&
								!uploadedFile &&
								!isProcessing &&
								processingStatus === 'idle' && (
									<UploadContent
										isDragOver={isDragOver}
										supportedTypesDisplay={supportedTypesDisplay}
										maxSizeInMB={maxSizeInMB}
										onBrowseClick={onBrowseClick}
									/>
								)}

							{/* Step 2: File Selected, ready to upload */}
							{selectedFile && !isProcessing && processingStatus === 'idle' && (
								<div className="space-y-6">
									<div className="text-center">
										<div className="text-emerald-600 text-5xl mb-4">📄</div>
										<h3 className="text-xl font-semibold mb-2">
											File Ready to Upload
										</h3>
										<p className="text-gray-600 mb-4">
											{selectedFile.name} ({formatFileSize(selectedFile.size)})
										</p>
										<div className="space-y-3">
											<button
												onClick={onGenerateMindMap}
												className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
											>
												🚀 Upload & Generate Mind Map
											</button>
											<button
												onClick={onRemoveFile}
												className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
											>
												Choose Different File
											</button>
										</div>
									</div>
								</div>
							)}

							{/* Step 3: Processing (uploading/processing) */}
							{isProcessing &&
								(processingStatus === 'uploading' ||
									processingStatus === 'processing') && (
									<ProcessingContent
										processingStatus={processingStatus}
										uploadProgress={uploadProgress}
									/>
								)}

							{/* Step 4: Success */}
							{uploadedFile &&
								!isProcessing &&
								processingStatus === 'completed' && (
									<SuccessContent
										uploadedFile={uploadedFile}
										formatFileSize={formatFileSize}
										onRemoveFile={onRemoveFile}
										onGenerateMindMap={onGenerateMindMap}
									/>
								)}
						</AnimatePresence>

						<ErrorMessage error={error} />
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
