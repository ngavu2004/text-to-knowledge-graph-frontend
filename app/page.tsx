'use client';
import React from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useMindMapGeneration } from '@/hooks/useMapGenerate';
import { useShare } from '@/hooks/useShare';
import { Header } from '@/components/home/header';
import { FileUploadCard } from '@/components/home/file-upload';
import { MindMapPreview } from '@/components/home/map-preview';
import { ShareModal } from '@/components/home/share';
import { DotPattern } from '@/components/magicui/dot-pattern';

const MindMapProductPage: React.FC = () => {
	const fileUpload = useFileUpload();
	const mindMapGeneration = useMindMapGeneration();
	const share = useShare();

	const handleGenerateMindMap = () => {
		if (fileUpload.uploadedFile) {
			mindMapGeneration.handleGenerateMindMap(fileUpload.uploadedFile);
		}
	};

	const handleStartOver = () => {
		fileUpload.resetUpload();
		mindMapGeneration.resetMindMap();
	};

	const handleCopyLink = () => {
		if (mindMapGeneration.generatedMindMap) {
			share.handleCopyLink(mindMapGeneration.generatedMindMap);
		}
	};

	const handleSocialShare = (platform: string) => {
		if (mindMapGeneration.generatedMindMap) {
			share.handleSocialShare(platform, mindMapGeneration.generatedMindMap);
		}
	};

	return (
		<>
			<div className="relative">
				<DotPattern />
				<div className="container relative z-10 max-w-7xl mx-auto px-6 py-12">
					<div className="max-w-4xl mx-auto">
						<Header />

						<div className="space-y-8">
							{/* File Upload Section */}
							{!mindMapGeneration.generatedMindMap && (
								<FileUploadCard
									isDragOver={fileUpload.isDragOver}
									uploadedFile={fileUpload.uploadedFile}
									isProcessing={fileUpload.isProcessing}
									isGenerating={mindMapGeneration.isGenerating}
									error={fileUpload.error}
									acceptedTypesString={fileUpload.acceptedTypesString}
									supportedTypesDisplay={fileUpload.supportedTypesDisplay}
									maxSizeInMB={fileUpload.maxSizeInMB}
									formatFileSize={fileUpload.formatFileSize}
									onDragOver={fileUpload.handleDragOver}
									onDragLeave={fileUpload.handleDragLeave}
									onDrop={fileUpload.handleDrop}
									onFileSelect={fileUpload.handleFileSelect}
									onBrowseClick={fileUpload.handleBrowseClick}
									onRemoveFile={fileUpload.handleRemoveFile}
									onGenerateMindMap={handleGenerateMindMap}
									fileInputRef={
										fileUpload.fileInputRef as React.RefObject<HTMLInputElement>
									}
								/>
							)}

							{mindMapGeneration.generatedMindMap && (
								<MindMapPreview
									generatedMindMap={mindMapGeneration.generatedMindMap}
									onStartOver={handleStartOver}
									onShare={share.openShareModal}
								/>
							)}
						</div>
					</div>
				</div>

				{mindMapGeneration.generatedMindMap && (
					<ShareModal
						isOpen={share.isShareOpen}
						generatedMindMap={mindMapGeneration.generatedMindMap}
						shortUrl={share.shortUrl}
						isCopied={share.isCopied}
						onClose={share.closeShareModal}
						onCopyLink={handleCopyLink}
						onSocialShare={handleSocialShare}
					/>
				)}
			</div>
		</>
	);
};

export default MindMapProductPage;
