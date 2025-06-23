'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/constants';
import { UploadContent } from './uploader';
import { ProcessingContent } from './processing';
import { SuccessContent } from './success';
import { GeneratingContent } from './generator';
import { ErrorMessage } from './error';

interface FileUploadCardProps {
	isDragOver: boolean;
	uploadedFile: File | null;
	isProcessing: boolean;
	isGenerating: boolean;
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
	fileInputRef: React.RefObject<HTMLInputElement>;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
	isDragOver,
	uploadedFile,
	isProcessing,
	isGenerating,
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
			<Card className="overflow-hidden shadow-xl border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors duration-300">
				<CardContent className="p-0">
					<div
						className={`relative p-12 text-center transition-colors duration-300 ${
							isDragOver
								? 'bg-gradient-to-br from-purple-50 to-pink-50'
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
							{!uploadedFile && !isProcessing && (
								<UploadContent
									isDragOver={isDragOver}
									supportedTypesDisplay={supportedTypesDisplay}
									maxSizeInMB={maxSizeInMB}
									onBrowseClick={onBrowseClick}
								/>
							)}

							{isProcessing && <ProcessingContent />}

							{uploadedFile && !isProcessing && !isGenerating && (
								<SuccessContent
									uploadedFile={uploadedFile}
									formatFileSize={formatFileSize}
									onRemoveFile={onRemoveFile}
									onGenerateMindMap={onGenerateMindMap}
								/>
							)}

							{isGenerating && <GeneratingContent />}
						</AnimatePresence>

						<ErrorMessage error={error} />
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
