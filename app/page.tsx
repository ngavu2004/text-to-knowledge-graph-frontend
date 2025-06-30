'use client';
import React, { useState, useEffect } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useTextInput } from '@/hooks/useTextInput';
import { Header } from '@/components/home/header';
import { FileUploadCard } from '@/components/home/file-upload';
import { TextInputCard } from '@/components/home/text-input';
import { MindMapPreview } from '@/components/home/map-preview';
import { ShareModal } from '@/components/home/share';
import { PolicyDialog } from '@/components/policy-dialog';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Home: React.FC = () => {
	// Custom hooks for state management
	const fileUpload = useFileUpload();
	const textInput = useTextInput();

	// Policy dialog state
	const [showPolicyDialog, setShowPolicyDialog] = useState(false);

	// Share modal state
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

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
		fileUpload.uploadAndProcessFile();
	};

	// Handle generate from text
	const handleGenerateFromText = () => {
		textInput.generateMindMapFromText();
	};

	// Handle start over for file upload
	const handleStartOver = () => {
		fileUpload.resetUpload();
		setActiveTab('file');
	};

	// Handle start over for text input
	const handleTextStartOver = () => {
		textInput.resetTextInput();
		setActiveTab('text');
	};

	// Handle share modal - works for both file and text
	const handleOpenShareModal = () => {
		setIsShareOpen(true);
	};

	const handleCloseShareModal = () => {
		setIsShareOpen(false);
	};

	// Determine which data to show based on completion status
	const completedFileUpload =
		fileUpload.processingStatus === 'completed' && fileUpload.mindMapData;
	const completedTextInput =
		textInput.processingStatus === 'completed' && textInput.mindMapData;
	const showPreview = completedFileUpload || completedTextInput;

	const currentMindMapData = completedFileUpload
		? fileUpload.mindMapData
		: textInput.mindMapData;
	const currentFileId = completedFileUpload
		? fileUpload.fileId
		: textInput.fileId;
	const currentFileName = completedFileUpload
		? fileUpload.uploadedFile?.name
		: 'Text Mind Map';

	return (
		<div className="relative min-h-screen">
			{/* Animated Background Pattern */}
			<AnimatedGridPattern />

			{/* Main Content */}
			<div className="relative z-10 min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<Header />
						<div className="space-y-8">
							{/* Input Section - Show tabs only when no mind map is completed */}
							{!showPreview && (
								<Tabs
									value={activeTab}
									onValueChange={value =>
										setActiveTab(value as 'file' | 'text')
									}
								>
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger
											value="file"
											className="flex items-center space-x-2"
										>
											<span>📁</span>
											<span>Upload File</span>
										</TabsTrigger>
										<TabsTrigger
											value="text"
											className="flex items-center space-x-2"
										>
											<span>📝</span>
											<span>Enter Text</span>
										</TabsTrigger>
									</TabsList>

									<TabsContent value="file">
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
									</TabsContent>

									<TabsContent value="text">
										<TextInputCard
											text={textInput.text}
											isProcessing={textInput.isProcessing}
											processingStatus={textInput.processingStatus}
											error={textInput.error}
											onTextChange={textInput.updateText}
											onGenerateMindMap={handleGenerateFromText}
											onClear={textInput.resetTextInput}
										/>
									</TabsContent>
								</Tabs>
							)}

							{/* Mind Map Preview Section - Show for both file and text */}
							{showPreview && currentMindMapData && (
								<MindMapPreview
									fileId={currentFileId}
									mindMapData={currentMindMapData}
									fileName={currentFileName}
									onStartOver={
										completedFileUpload ? handleStartOver : handleTextStartOver
									}
									onShare={handleOpenShareModal}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Share Modal - Works for both file and text */}
			{showPreview && currentMindMapData && (
				<ShareModal
					isOpen={isShareOpen}
					fileId={currentFileId}
					mindMapData={currentMindMapData}
					onClose={handleCloseShareModal}
				/>
			)}

			{/* Policy Dialog - Appears only once on first visit after loading */}
			<PolicyDialog isOpen={showPolicyDialog} onAccept={handlePolicyAccept} />
		</div>
	);
};

export default Home;
