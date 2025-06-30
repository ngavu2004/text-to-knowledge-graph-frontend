import { MindMapData } from '@/types/mindmap';
import {
	PresignedUrlResponse,
	GraphDataResponse,
	ShareLinkResponse,
	SharedGraphResponse,
} from '@/types/api';
import { api } from '..';

export const mindmapApi = {
	testConnection: async (): Promise<{ status: string; message: string }> => {
		try {
			await api.get('/health_check', {
				timeout: 10000,
				headers: { Accept: 'application/json' },
			});
			return { status: 'ok', message: 'Backend is accessible' };
		} catch (error: unknown) {
			console.error('❌ Backend connectivity test failed:', error);

			if (error instanceof Error) {
				return {
					status: 'error',
					message: `Backend not accessible: ${error.message}`,
				};
			}
			return {
				status: 'error',
				message: 'Backend not accessible: Unknown error',
			};
		}
	},

	// Generate mind map from text input
	generateFromText: async (text: string): Promise<MindMapData> => {
		try {
			const response = await api.post('/get_knowledge_graph', {
				text: text,
			});

			if (!response.data) {
				throw new Error('No data received from text processing endpoint');
			}

			// Transform backend response to MindMapData format
			const mindMapData: MindMapData = {
				nodes: response.data.nodes || [],
				relationships: response.data.relationships || [],
				chunks_processed: 1, // Text input counts as 1 chunk
			};

			return mindMapData;
		} catch (error: unknown) {
			console.error('❌ Failed to generate mind map from text:', error);

			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: { status?: number; data?: { detail?: string } };
				};

				if (axiosError.response?.data?.detail) {
					throw new Error(axiosError.response.data.detail);
				}
			}

			if (error instanceof Error) {
				throw new Error(
					error.message || 'Failed to generate mind map from text'
				);
			}
			throw new Error('An unexpected error occurred while processing text');
		}
	},

	getPresignedUrl: async (
		fileName: string,
		contentType: string
	): Promise<PresignedUrlResponse> => {
		try {
			const response = await api.get<PresignedUrlResponse>(
				'/get_presigned_url',
				{
					params: { file_name: fileName, content_type: contentType },
				}
			);

			if (!response.data) {
				throw new Error('No data received from presigned URL endpoint');
			}

			return response.data;
		} catch (error: unknown) {
			console.error('❌ Failed to get presigned URL:', error);

			if (error instanceof Error) {
				throw new Error(error.message || 'Failed to get presigned URL');
			}
			throw new Error(
				'An unexpected error occurred while getting presigned URL'
			);
		}
	},

	uploadFileToS3: async (
		uploadUrl: string,
		file: File,
		contentType: string
	): Promise<void> => {
		try {
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': contentType },
			});

			if (!response.ok) {
				throw new Error(`Upload failed with status: ${response.status}`);
			}
		} catch (error) {
			console.error('❌ S3 upload failed:', error);
			if (error instanceof Error) {
				throw new Error(error.message || 'Failed to upload file to S3');
			}
			throw new Error('An unexpected error occurred during file upload');
		}
	},

	getSavedGraph: async (fileId: string): Promise<GraphDataResponse> => {
		try {
			console.log('Requesting saved graph for fileId:', fileId);

			const response = await api.get<GraphDataResponse>(
				`/get_saved_graph/${fileId}`
			);
			console.log('Saved graph response:', response.data);

			if (!response.data) {
				throw new Error('No data received from saved graph endpoint');
			}

			return response.data;
		} catch (error) {
			console.error('❌ Failed to get saved graph:', error);

			// Handle 404 responses which indicate processing is still ongoing
			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: {
						status?: number;
						data?: { status?: string; message?: string };
					};
				};

				// If it's a 404 and the response data indicates processing, return that status
				if (axiosError.response?.status === 404 && axiosError.response?.data) {
					const responseData = axiosError.response.data;
					if (
						responseData.status === 'Processing' ||
						responseData.message?.includes('being processed')
					) {
						return {
							status: 'processing',
							message: responseData.message || 'File is being processed',
							graph_data: undefined,
							error: undefined,
						};
					}
				}
			}

			if (error instanceof Error) {
				throw new Error(error.message || 'Failed to get graph data');
			}
			throw new Error(
				'An unexpected error occurred while retrieving graph data'
			);
		}
	},

	generateShareLink: async (
		fileId: string,
		graphData: MindMapData
	): Promise<ShareLinkResponse> => {
		try {
			console.log('Generating share link for fileId:', fileId);
			console.log('Graph data preview:', {
				nodeCount: graphData.nodes?.length || 0,
				relationshipCount: graphData.relationships?.length || 0,
				chunksProcessed: graphData.chunks_processed || 0,
			});

			const response = await api.post<ShareLinkResponse>(
				'/generate-share-link',
				{
					file_id: fileId,
					graph_data: graphData,
				}
			);

			return response.data;
		} catch (error) {
			console.error('❌ Failed to generate share link:', error);

			if (error instanceof Error) {
				throw new Error(error.message || 'Failed to generate share link');
			}
			throw new Error(
				'An unexpected error occurred while generating share link'
			);
		}
	},

	getSharedGraph: async (shareId: string): Promise<SharedGraphResponse> => {
		try {
			const response = await api.get<SharedGraphResponse>(
				`/view-graph/${shareId}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get shared graph:', error);

			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: { status?: number };
				};

				if (axiosError.response?.status === 404) {
					throw new Error(
						'Graph not found. This could happen if the graph has expired, been deleted, or the link is invalid.'
					);
				}
			}

			if (error instanceof Error) {
				throw new Error(error.message || 'Failed to get shared graph');
			}
			throw new Error(
				'An unexpected error occurred while retrieving shared graph'
			);
		}
	},

	// Helper method for manual testing - checks processing status without polling
	checkProcessingStatus: async (fileId: string): Promise<GraphDataResponse> => {
		return await mindmapApi.getSavedGraph(fileId);
	},
};
