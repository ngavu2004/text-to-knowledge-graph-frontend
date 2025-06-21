'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	ArrowLeft,
	Share2,
	Download,
	Edit,
	ExternalLink,
	Brain,
} from 'lucide-react';
import { GeneratedMindMap } from '../../types/mindmap';

interface MindMapPreviewProps {
	generatedMindMap: GeneratedMindMap;
	onStartOver: () => void;
	onShare: () => void;
}

export const MindMapPreview: React.FC<MindMapPreviewProps> = ({
	generatedMindMap,
	onStartOver,
	onShare,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="space-y-8"
		>
			<Card className="shadow-2xl overflow-hidden">
				<CardContent className="p-0">
					<div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold mb-2">
									Your Mind Map is Ready!
								</h2>
								<p className="text-purple-100">
									{generatedMindMap.title} • Created{' '}
									{generatedMindMap.createdAt.toLocaleTimeString()}
								</p>
							</div>
							<Button
								variant="ghost"
								onClick={onStartOver}
								className="text-white hover:bg-white/20 cursor-pointer"
							>
								<ArrowLeft className="w-5 h-5 mr-2" />
								Start Over
							</Button>
						</div>
					</div>

					<div className="p-8">
						{/* Mock Preview */}
						<div className="bg-gray-100 rounded-lg p-8 mb-8 text-center">
							<div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
								<div className="text-gray-500">
									<Brain className="w-16 h-16 mx-auto mb-4" />
									<p className="text-lg font-medium">
										Interactive Mind Map Preview
									</p>
									<p className="text-sm">Your mind map will appear here</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<Button
								onClick={onShare}
								className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
							<Button
								variant="outline"
								onClick={() => alert('Download functionality coming soon!')}
								className="cursor-pointer"
							>
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
							<Button
								variant="outline"
								onClick={() => alert('Edit functionality coming soon!')}
								className="cursor-pointer"
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
							<Button
								variant="outline"
								onClick={() => window.open(generatedMindMap.shareUrl, '_blank')}
								className="cursor-pointer"
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Open
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
