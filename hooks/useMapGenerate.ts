/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useCallback } from 'react';
import { GeneratedMindMap, MindMapData } from '../types/mindmap';

export const useMindMapGeneration = () => {
	const [generatedMindMap, setGeneratedMindMap] =
		useState<GeneratedMindMap | null>(null);

	const createMindMapFromData = useCallback(
		(uploadedFile: File, mindMapData: MindMapData) => {
			// Create the generated mind map metadata
			const newMindMap: GeneratedMindMap = {
				id: Math.random().toString(36).substr(2, 9),
				title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
				shareUrl: `https://mindpaper.ai/share/${Math.random().toString(36).substr(2, 16)}`,
				previewImage:
					'https://via.placeholder.com/400x300/6366f1/ffffff?text=Mind+Map+Preview',
				createdAt: new Date(),
			};

			setGeneratedMindMap(newMindMap);
			return newMindMap;
		},
		[]
	);

	const resetMindMap = useCallback(() => {
		setGeneratedMindMap(null);
	}, []);

	return {
		generatedMindMap,
		createMindMapFromData,
		resetMindMap,
	};
};
