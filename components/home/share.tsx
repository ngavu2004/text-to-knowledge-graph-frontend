'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Share2, X, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { MindMapData } from '../../types/mindmap';
import { useRouter } from 'next/navigation';
import { useShare } from '@/hooks/useShare';

interface ShareModalProps {
	isOpen: boolean;
	fileId: string | null;
	mindMapData: MindMapData | null;
	onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
	isOpen,
	fileId,
	mindMapData,
	onClose,
}) => {
	const router = useRouter();
	const {
		shareUrl,
		isGenerating,
		error,
		isCopied,
		generateShareLink,
		handleCopyLink,
		resetShareState,
	} = useShare();

	// Generate share link when modal opens
	useEffect(() => {
		if (isOpen && fileId && mindMapData && !shareUrl) {
			generateShareLink(fileId, mindMapData);
		}
	}, [isOpen, fileId, mindMapData, shareUrl, generateShareLink]);

	// Reset state when modal closes
	useEffect(() => {
		if (!isOpen) {
			resetShareState();
		}
	}, [isOpen, resetShareState]);

	const handleOpenGraph = () => {
		// Navigate to the graph page with file ID
		if (fileId) {
			router.push(`/graph/${fileId}`);
		}
	};

	const handleRetryGenerate = () => {
		if (fileId && mindMapData) {
			generateShareLink(fileId, mindMapData);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8, y: 50 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, y: 50 }}
							onClick={e => e.stopPropagation()}
							className="w-full max-w-md"
						>
							<Card className="shadow-2xl border-0 overflow-hidden">
								<CardContent className="p-0">
									{/* Header */}
									<div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
													<Share2 className="w-5 h-5" />
												</div>
												<div>
													<h2 className="text-xl font-bold">
														Share Your Mind Map
													</h2>
													<p className="text-emerald-100 text-sm">
														{isGenerating
															? 'Generating share link...'
															: 'Copy this link to share your mind map with others.'}
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={onClose}
												className="text-white hover:bg-white/20 rounded-lg cursor-pointer"
											>
												<X className="w-5 h-5" />
											</Button>
										</div>
									</div>

									{/* Content */}
									<div className="p-6 space-y-6">
										{/* Error Display */}
										{error && (
											<Alert className="border-red-200 bg-red-50">
												<div className="flex items-center justify-between">
													<span className="text-red-800 text-sm">{error}</span>
													<Button
														variant="outline"
														size="sm"
														onClick={handleRetryGenerate}
														className="text-red-600 border-red-300 hover:bg-red-100"
													>
														Retry
													</Button>
												</div>
											</Alert>
										)}

										{/* URL Input and Copy */}
										<div className="space-y-3">
											<label className="text-sm font-medium text-gray-700">
												Share Link
											</label>
											<div className="flex space-x-2">
												<input
													type="text"
													value={shareUrl || 'Generating link...'}
													readOnly
													disabled={isGenerating || !shareUrl}
													className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
													onClick={e => shareUrl && e.currentTarget.select()}
												/>
												<Button
													onClick={() => shareUrl && handleCopyLink(shareUrl)}
													disabled={isGenerating || !shareUrl}
													className={`px-4 py-3 transition-all duration-200 ${
														isCopied
															? 'bg-green-600 hover:bg-green-700'
															: 'bg-emerald-600 hover:bg-emerald-700'
													} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
												>
													<motion.div
														key={
															isGenerating
																? 'loading'
																: isCopied
																	? 'check'
																	: 'copy'
														}
														initial={{ scale: 0.8, opacity: 0 }}
														animate={{ scale: 1, opacity: 1 }}
														transition={{ duration: 0.2 }}
													>
														{isGenerating ? (
															<Loader2 className="w-4 h-4 animate-spin" />
														) : isCopied ? (
															<Check className="w-4 h-4" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</motion.div>
												</Button>
											</div>
										</div>

										{/* Success Message */}
										<AnimatePresence>
											{isCopied && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-3 rounded-lg"
												>
													<Check className="w-4 h-4" />
													<span className="text-sm font-medium">
														Link copied to clipboard!
													</span>
												</motion.div>
											)}
										</AnimatePresence>

										{/* Quick Actions */}
										<div className="flex space-x-3 pt-2">
											<Button
												variant="outline"
												onClick={onClose}
												className="flex-1 cursor-pointer"
											>
												Done
											</Button>
											<Button
												onClick={handleOpenGraph}
												disabled={!fileId}
												className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<ExternalLink className="w-4 h-4 mr-2" />
												Open
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
