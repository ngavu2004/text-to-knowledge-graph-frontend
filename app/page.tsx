'use client';
import React, { useState, useEffect } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useMindMapGeneration } from '@/hooks/useMapGenerate';
import { useShare } from '@/hooks/useShare';
import { Header } from '@/components/home/header';
import { FileUploadCard } from '@/components/home/file-upload';
import { MindMapPreview } from '@/components/home/map-preview';
import { ShareModal } from '@/components/home/share';
import { PolicyDialog } from '@/components/policy-dialog';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';

const Home: React.FC = () => {
	// Custom hooks for state management
	const fileUpload = useFileUpload();
	const mindMapGeneration = useMindMapGeneration();
	const share = useShare();

	// Policy dialog state
	const [showPolicyDialog, setShowPolicyDialog] = useState(false);

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

	// Handle generate mind map - now just creates the metadata since data is already loaded
	const handleGenerateMindMap = () => {
		if (fileUpload.uploadedFile && fileUpload.mindMapData) {
			mindMapGeneration.createMindMapFromData(
				fileUpload.uploadedFile,
				fileUpload.mindMapData
			);
		}
	};

	// Handle start over
	const handleStartOver = () => {
		fileUpload.resetUpload();
		mindMapGeneration.resetMindMap();
	};

	// Handle share actions
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
							{!mindMapGeneration.generatedMindMap && (
								<FileUploadCard
									isDragOver={fileUpload.isDragOver}
									uploadedFile={fileUpload.uploadedFile}
									isProcessing={fileUpload.isProcessing}
									isGenerating={false} // No separate generation step anymore
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
							{mindMapGeneration.generatedMindMap && (
								<MindMapPreview
									generatedMindMap={mindMapGeneration.generatedMindMap}
									mindMapData={fileUpload.mindMapData}
									onStartOver={handleStartOver}
									onShare={share.openShareModal}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Share Modal */}
			{mindMapGeneration.generatedMindMap && (
				<ShareModal
					isOpen={share.isShareOpen}
					generatedMindMap={mindMapGeneration.generatedMindMap}
					mindMapData={fileUpload.mindMapData}
					shortUrl={share.shortUrl}
					isCopied={share.isCopied}
					onClose={share.closeShareModal}
					onCopyLink={handleCopyLink}
					onSocialShare={handleSocialShare}
				/>
			)}

			{/* Policy Dialog - Appears only once on first visit after loading */}
			<PolicyDialog isOpen={showPolicyDialog} onAccept={handlePolicyAccept} />
		</div>
	);
};

export default Home;
