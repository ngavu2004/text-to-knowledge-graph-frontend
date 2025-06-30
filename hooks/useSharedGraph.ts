'use client';
import { useState, useCallback, useEffect } from 'react';
import { MindMapData } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';

interface SharedGraphState {
	isLoading: boolean;
	error: string | null;
	graphData: MindMapData | null;
	fileId: string | null;
	createdAt: string | null;
	viewCount: number;
}

export const useSharedGraph = (shareId?: string) => {
	const [state, setState] = useState<SharedGraphState>({
		isLoading: false,
		error: null,
		graphData: null,
		fileId: null,
		createdAt: null,
		viewCount: 0,
	});

	const loadSharedGraph = useCallback(async (id: string) => {
		setState(prev => ({
			...prev,
			isLoading: true,
			error: null,
		}));

		try {
			const sharedGraph = await mindmapApi.getSharedGraph(id);

			setState({
				isLoading: false,
				error: null,
				graphData: sharedGraph.graph_data,
				fileId: sharedGraph.file_id,
				createdAt: sharedGraph.created_at,
				viewCount: sharedGraph.view_count,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to load shared graph';
			setState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));
		}
	}, []);

	// Auto-load if shareId is provided
	useEffect(() => {
		if (shareId) {
			loadSharedGraph(shareId);
		}
	}, [shareId, loadSharedGraph]);

	const retry = useCallback(() => {
		if (shareId) {
			loadSharedGraph(shareId);
		}
	}, [shareId, loadSharedGraph]);

	return {
		...state,
		loadSharedGraph,
		retry,
	};
};
