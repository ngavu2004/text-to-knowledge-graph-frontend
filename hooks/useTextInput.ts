'use client';

import { useState, useCallback } from 'react';
import { MindMapData } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';

interface TextInputState {
	text: string;
	isProcessing: boolean;
	error: string | null;
	mindMapData: MindMapData | null;
	fileId: string | null;
	processingStatus: 'idle' | 'processing' | 'completed' | 'error';
}

export const useTextInput = () => {
	const [state, setState] = useState<TextInputState>({
		text: '',
		isProcessing: false,
		error: null,
		mindMapData: null,
		fileId: null,
		processingStatus: 'idle',
	});

	const updateText = useCallback((text: string) => {
		setState(prev => ({
			...prev,
			text,
			error: null,
		}));
	}, []);

	const generateMindMapFromText = useCallback(async () => {
		if (!state.text.trim()) {
			setState(prev => ({
				...prev,
				error: 'Please enter some text to generate a mind map.',
				processingStatus: 'error',
			}));
			return;
		}

		setState(prev => ({
			...prev,
			error: null,
			isProcessing: true,
			processingStatus: 'processing',
			mindMapData: null,
			fileId: null,
		}));

		try {
			const mindMapData = await mindmapApi.generateFromText(state.text);

			// Generate a unique ID for this text-based mind map
			const textId = `text-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

			// Store the mind map data in localStorage for sharing
			const localGraphData = {
				graph_data: mindMapData,
				file_id: textId,
				file_name: `Text Mind Map - ${new Date().toLocaleDateString()}`,
				created_at: new Date().toISOString(),
				view_count: 0,
				source_text: state.text,
			};

			localStorage.setItem(`graph_${textId}`, JSON.stringify(localGraphData));

			setState(prev => ({
				...prev,
				isProcessing: false,
				processingStatus: 'completed',
				mindMapData,
				fileId: textId,
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to generate mind map';
			console.error('❌ Text processing failed:', error);

			setState(prev => ({
				...prev,
				error: errorMessage,
				isProcessing: false,
				processingStatus: 'error',
			}));
		}
	}, [state.text]);

	const resetTextInput = useCallback(() => {
		setState({
			text: '',
			isProcessing: false,
			error: null,
			mindMapData: null,
			fileId: null,
			processingStatus: 'idle',
		});
	}, []);

	return {
		...state,
		updateText,
		generateMindMapFromText,
		resetTextInput,
	};
};
