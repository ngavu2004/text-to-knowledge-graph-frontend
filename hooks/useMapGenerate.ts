'use client';
import { useState, useCallback } from 'react';
import { GeneratedMindMap } from '../types/mindmap';

export const useMindMapGeneration = () => {
	const [generatedMindMap, setGeneratedMindMap] =
		useState<GeneratedMindMap | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerateMindMap = useCallback(async (uploadedFile: File) => {
		if (!uploadedFile) return;

		setIsGenerating(true);
		// placeholder for actual mind map generation logic
		await new Promise(resolve => setTimeout(resolve, 3000));

		const mockMindMap: GeneratedMindMap = {
			id: Math.random().toString(36).substring(2, 9),
			title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
			shareUrl: `https://mindpaper.ai/share/${Math.random().toString(36).substring(2, 16)}`,
			previewImage:
				'https://via.placeholder.com/400x300/6366f1/ffffff?text=Mind+Map+Preview',
			createdAt: new Date(),
		};

		setGeneratedMindMap(mockMindMap);
		setIsGenerating(false);
	}, []);

	const resetMindMap = useCallback(() => {
		setGeneratedMindMap(null);
		setIsGenerating(false);
	}, []);

	return {
		generatedMindMap,
		isGenerating,
		handleGenerateMindMap,
		resetMindMap,
	};
};
