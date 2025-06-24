'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Download, Edit, ExternalLink } from 'lucide-react';
import { GeneratedMindMap, MindMapData } from '../../types/mindmap';
import { MindMap } from './mindmap/mindmap';
import { sampleData } from '@/constants';

interface MindMapPreviewProps {
	generatedMindMap: GeneratedMindMap;
	mindMapData?: MindMapData;
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
									{generatedMindMap.createdAt.toLocaleTimeString()} •{' '}
									{sampleData.chunks_processed} chunks processed
								</p>
							</div>
							<Button
								variant="ghost"
								onClick={onStartOver}
								className="text-white hover:bg-white/20"
							>
								<ArrowLeft className="w-5 h-5 mr-2" />
								Start Over
							</Button>
						</div>
					</div>

					<div className="p-8">
						<div className="mb-8">
							<MindMap
								data={sampleData}
								width={800}
								height={500}
								className="w-full"
							/>
						</div>

						{/* Action Buttons */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<Button
								onClick={onShare}
								className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
							<Button variant="outline">
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
							<Button
								variant="outline"
								onClick={() => window.open(generatedMindMap.shareUrl, '_blank')}
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
