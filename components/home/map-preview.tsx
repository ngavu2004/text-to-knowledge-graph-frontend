'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Download, Edit, ExternalLink } from 'lucide-react';
import { GeneratedMindMap, MindMapData } from '../../types/mindmap';
import { MindMap } from './mindmap/mindmap';
import { sampleData } from '@/constants';
import { useRouter } from 'next/navigation';

interface MindMapPreviewProps {
	generatedMindMap: GeneratedMindMap;
	mindMapData: MindMapData | null;
	onStartOver: () => void;
	onShare: () => void;
}

export const MindMapPreview: React.FC<MindMapPreviewProps> = ({
	generatedMindMap,
	mindMapData,
	onStartOver,
	onShare,
}) => {
	const router = useRouter();

	const handleOpenGraph = () => {
		// Save mind map data to localStorage before navigating
		if (mindMapData) {
			const storageKey = `mindmap_${generatedMindMap.id}`;
			const dataToStore = {
				mindMapData,
				title: generatedMindMap.title,
				createdAt: generatedMindMap.createdAt.toISOString(),
				views: 0,
				isPublic: false,
			};
			localStorage.setItem(storageKey, JSON.stringify(dataToStore));
		}

		router.push(`/graph/${generatedMindMap.id}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="space-y-8"
		>
			<Card className="shadow-2xl overflow-hidden">
				<CardContent className="p-0">
					<div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold mb-2">
									Your Mind Map is Ready!
								</h2>
								<p className="text-emerald-100">
									{generatedMindMap.title} • Created{' '}
									{generatedMindMap.createdAt.toLocaleTimeString()} •{' '}
									{mindMapData?.chunks_processed} chunks processed
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
								data={mindMapData || sampleData}
								width={800}
								height={500}
								className="w-full"
							/>
						</div>

						{/* Action Buttons */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<Button
								onClick={onShare}
								className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
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
							<Button variant="outline" onClick={handleOpenGraph}>
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
