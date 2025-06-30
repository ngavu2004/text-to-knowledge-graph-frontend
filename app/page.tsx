'use client';
import React, { useState, useEffect } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Header } from '@/components/home/header';
import { FileUploadCard } from '@/components/home/file-upload';
import { MindMapPreview } from '@/components/home/map-preview';
import { ShareModal } from '@/components/home/share';
import { PolicyDialog } from '@/components/policy-dialog';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';

const Home: React.FC = () => {
	// Custom hooks for state management
	const fileUpload = useFileUpload();

	// Policy dialog state
	const [showPolicyDialog, setShowPolicyDialog] = useState(false);

	// Share modal state
	const [isShareOpen, setIsShareOpen] = useState(false);

	// Check if user has already accepted policies on mount
	useEffect(() => {
		const hasAcceptedPolicies = localStorage.getItem(
			'mind-graph-policies-accepted'
		);
		const hasVisitedBefore = localStorage.getItem('mind-graph-visited');

		// If already visited and policies not accepted, show dialog immediately
		if (hasVisitedBefore && !hasAcceptedPolicies) {
			setShowPolicyDialog(true);
		}

		// Listen for the custom event from loading context
		const handleShowPolicyDialog = () => {
			setShowPolicyDialog(true);
		};

		window.addEventListener('showPolicyDialog', handleShowPolicyDialog);

		return () => {
			window.removeEventListener('showPolicyDialog', handleShowPolicyDialog);
		};
	}, []);

	// Handle policy acceptance
	const handlePolicyAccept = () => {
		localStorage.setItem('mind-graph-policies-accepted', 'true');
		setShowPolicyDialog(false);
	};

	// Handle generate mind map - now triggers the actual upload and processing
	const handleGenerateMindMap = () => {
		// Now this triggers the actual upload and processing
		fileUpload.uploadAndProcessFile();
	};

	// Handle start over
	const handleStartOver = () => {
		fileUpload.resetUpload();
	};

	// Handle share modal
	const handleOpenShareModal = () => {
		setIsShareOpen(true);
	};

	const handleCloseShareModal = () => {
		setIsShareOpen(false);
	};

	return (
		<div className="relative min-h-screen">
			{/* Animated Background Pattern */}
			<AnimatedGridPattern />

			{/* Main Content */}
			<div className="relative z-10 min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<Header />{' '}
						<div className="space-y-8">
							{/* File Upload Section */}
							{fileUpload.processingStatus !== 'completed' && (
								<FileUploadCard
									isDragOver={fileUpload.isDragOver}
									uploadedFile={fileUpload.uploadedFile}
									selectedFile={fileUpload.selectedFile}
									isProcessing={fileUpload.isProcessing}
									processingStatus={fileUpload.processingStatus}
									uploadProgress={fileUpload.uploadProgress}
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
									fileInputRef={fileUpload.fileInputRef}
								/>
							)}

							{/* Mind Map Preview Section */}
							{fileUpload.processingStatus === 'completed' &&
								fileUpload.mindMapData && (
									<MindMapPreview
										fileId={fileUpload.fileId}
										mindMapData={fileUpload.mindMapData}
										fileName={fileUpload.uploadedFile?.name}
										onStartOver={handleStartOver}
										onShare={handleOpenShareModal}
									/>
								)}
						</div>
					</div>
				</div>
			</div>

			{/* Share Modal */}
			{fileUpload.processingStatus === 'completed' &&
				fileUpload.mindMapData && (
					<ShareModal
						isOpen={isShareOpen}
						fileId={fileUpload.fileId}
						mindMapData={fileUpload.mindMapData}
						onClose={handleCloseShareModal}
					/>
				)}

			{/* Policy Dialog - Appears only once on first visit after loading */}
			<PolicyDialog isOpen={showPolicyDialog} onAccept={handlePolicyAccept} />
		</div>
	);
};

export default Home;
