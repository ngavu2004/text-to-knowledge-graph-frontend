'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, X, Copy, Check, ExternalLink } from 'lucide-react';
import { GeneratedMindMap } from '../../types/mindmap';
// import { socialButtons } from '@/constants';

interface ShareModalProps {
	isOpen: boolean;
	generatedMindMap: GeneratedMindMap;
	shortUrl: string | null;
	isCopied: boolean;
	onClose: () => void;
	onCopyLink: () => void;
	onSocialShare: (platform: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
	isOpen,
	generatedMindMap,
	shortUrl,
	isCopied,
	onClose,
	onCopyLink,
	// onSocialShare,
}) => {
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
									<div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
													<Share2 className="w-5 h-5" />
												</div>
												<div>
													<h2 className="text-xl font-bold">
														Share Your Mind Map
													</h2>
													<p className="text-purple-100 text-sm">
														Copy this link to share your mind map with others.
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
										{/* URL Input and Copy */}
										<div className="space-y-3">
											<label className="text-sm font-medium text-gray-700">
												Share Link
											</label>
											<div className="flex space-x-2">
												<input
													type="text"
													value={shortUrl || generatedMindMap.shareUrl}
													readOnly
													className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
													onClick={e => e.currentTarget.select()}
												/>
												<Button
													onClick={onCopyLink}
													className={`px-4 py-3 transition-all duration-200 ${
														isCopied
															? 'bg-green-600 hover:bg-green-700'
															: 'bg-purple-600 hover:bg-purple-700'
													} cursor-pointer`}
												>
													<motion.div
														key={isCopied ? 'check' : 'copy'}
														initial={{ scale: 0.8, opacity: 0 }}
														animate={{ scale: 1, opacity: 1 }}
														transition={{ duration: 0.2 }}
													>
														{isCopied ? (
															<Check className="w-4 h-4" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</motion.div>
												</Button>
											</div>
										</div>

										{/* Social Share Buttons */}
										{/* <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-700">
                                                Share on Social Media
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {socialButtons.map(({ icon: Icon, label, platform, color }, index) => (
                                                    <motion.button
                                                        key={platform}
                                                        onClick={() => onSocialShare(platform)}
                                                        className={`${color} text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center space-y-1`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-xs font-medium">{label}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div> */}

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
												onClick={() =>
													window.open(generatedMindMap.shareUrl, '_blank')
												}
												className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
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
