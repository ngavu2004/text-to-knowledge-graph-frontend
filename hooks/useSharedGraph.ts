'use client';
import { useState, useCallback, useEffect } from 'react';
import { MindMapData } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';
import { transformGraphData, BackendGraphData } from '../lib/graph-transform';

interface SharedGraphState {
	isLoading: boolean;
	error: string | null;
	graphData: MindMapData | null;
	fileId: string | null;
	fileName: string | null;
	createdAt: string | null;
	viewCount: number;
}

export const useSharedGraph = (shareId?: string) => {
	const [state, setState] = useState<SharedGraphState>({
		isLoading: false,
		error: null,
		graphData: null,
		fileId: null,
		fileName: null,
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
			// First, check if we have this graph stored locally (sessionStorage or localStorage)
			let localGraphData = sessionStorage.getItem(`graph_${id}`);
			if (!localGraphData) {
				localGraphData = localStorage.getItem(`graph_${id}`);
			}

			if (localGraphData) {
				try {
					const parsedData = JSON.parse(localGraphData);
					setState(prev => ({
						...prev,
						isLoading: false,
						graphData: parsedData.graph_data,
						fileId: parsedData.file_id,
						fileName: parsedData.file_name,
						createdAt: parsedData.created_at,
						viewCount: parsedData.view_count || 0,
					}));
					return;
				} catch (parseError) {
					console.warn('Failed to parse local graph data:', parseError);
					// Continue to try backend
				}
			}

			// Smart detection: UUID format suggests it's likely a file ID, not a share ID
			const isLikelyFileId =
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
					id
				) || /^\d{13}-/.test(id); // Also match timestamp-based IDs

			if (isLikelyFileId) {
				// Try direct file access first for UUID-formatted IDs
				try {
					const fileResponse = await mindmapApi.getSavedGraph(id);

					if (fileResponse.status === 'completed' && fileResponse.graph_data) {
						// Transform backend data format to frontend format
						const backendData = fileResponse.graph_data as BackendGraphData;
						const transformedData = transformGraphData(backendData);

						setState({
							isLoading: false,
							error: null,
							graphData: transformedData,
							fileId: id, // The ID is the file ID in this case
							fileName: fileResponse.file_name || 'Unknown File',
							createdAt: fileResponse.processed_at || new Date().toISOString(),
							viewCount: 0, // No view count for direct file access
						});
						return;
					} else {
						// Fall back to shared graph if direct access fails
					}
				} catch {
					// Fall back to shared graph
				}
			}

			// Try shared graph access (either first choice for non-UUIDs, or fallback for UUIDs)
			try {
				const sharedGraph = await mindmapApi.getSharedGraph(id);

				// Transform backend data format to frontend format
				const backendData = sharedGraph.graph_data as BackendGraphData;
				const transformedData = transformGraphData(backendData);

				setState({
					isLoading: false,
					error: null,
					graphData: transformedData,
					fileId: sharedGraph.file_id,
					fileName: sharedGraph.file_name || 'Shared Mind Map',
					createdAt: sharedGraph.created_at,
					viewCount: sharedGraph.view_count,
				});
				return;
			} catch {
				// Only try direct file access as fallback if we haven't already tried it
				if (!isLikelyFileId) {
					const fileResponse = await mindmapApi.getSavedGraph(id);

					if (fileResponse.status === 'completed' && fileResponse.graph_data) {
						// Transform backend data format to frontend format
						const backendData = fileResponse.graph_data as BackendGraphData;
						const transformedData = transformGraphData(backendData);

						setState({
							isLoading: false,
							error: null,
							graphData: transformedData,
							fileId: id, // The ID is the file ID in this case
							fileName: fileResponse.file_name || 'Unknown File',
							createdAt: fileResponse.processed_at || new Date().toISOString(),
							viewCount: 0, // No view count for direct file access
						});
						return;
					} else {
						throw new Error(
							'Graph is still being processed or failed to process'
						);
					}
				} else {
					// We already tried both approaches for UUID, so give up
					throw new Error('Graph not found or is still being processed');
				}
			}
		} catch (error) {
			console.error('❌ Failed to load graph:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to load graph';
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
