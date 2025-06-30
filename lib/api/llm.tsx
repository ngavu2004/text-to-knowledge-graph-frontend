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
			console.log('Testing backend connection...');
			console.log('API base URL:', api.defaults.baseURL);
			console.log(
				'Environment NEXT_PUBLIC_API_BASE_URL:',
				process.env.NEXT_PUBLIC_API_BASE_URL
			);

			const response = await api.get('/health_check', {
				timeout: 10000,
				headers: { Accept: 'application/json' },
			});
			console.log('Backend health check response:', response);
			return { status: 'ok', message: 'Backend is accessible' };
		} catch (error: unknown) {
			console.error('Backend connectivity test failed:', error);

			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: { status?: number; data?: unknown };
				};
				console.error(
					'Health check failed with status:',
					axiosError.response?.status
				);
				console.error('Health check response data:', axiosError.response?.data);
			} else if (error && typeof error === 'object' && 'code' in error) {
				const networkError = error as { code?: string; message?: string };
				console.error('Network error code:', networkError.code);
				console.error('Network error message:', networkError.message);
			}

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

	getPresignedUrl: async (
		fileName: string,
		contentType: string
	): Promise<PresignedUrlResponse> => {
		try {
			console.log('Requesting presigned URL for:', { fileName, contentType });

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
			console.error('Get presigned URL error:', error);

			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: { status?: number; data?: unknown; headers?: unknown };
				};
				console.error('Error response status:', axiosError.response?.status);
				console.error('Error response data:', axiosError.response?.data);
				console.error('Error response headers:', axiosError.response?.headers);
			} else if (error && typeof error === 'object' && 'request' in error) {
				const axiosError = error as { request?: unknown };
				console.error('No response received:', axiosError.request);
			} else if (error && typeof error === 'object' && 'message' in error) {
				const errorWithMessage = error as { message: string };
				console.error('Error setting up request:', errorWithMessage.message);
			}

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
			console.log(uploadUrl);
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': contentType },
			});

			if (!response.ok) {
				throw new Error(`Upload failed with status: ${response.status}`);
			}
		} catch (error) {
			console.error('S3 upload error:', error);
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
			console.error('Get saved graph error:', error);

			// Handle 404 responses which indicate processing is still ongoing
			if (error && typeof error === 'object' && 'response' in error) {
				const axiosError = error as {
					response?: {
						status?: number;
						data?: { status?: string; message?: string };
						headers?: unknown;
					};
				};
				console.error('Error response status:', axiosError.response?.status);
				console.error('Error response data:', axiosError.response?.data);
				console.error('Error response headers:', axiosError.response?.headers);

				// If it's a 404 and the response data indicates processing, return that status
				if (axiosError.response?.status === 404 && axiosError.response?.data) {
					const responseData = axiosError.response.data;
					if (
						responseData.status === 'Processing' ||
						responseData.message?.includes('being processed')
					) {
						console.log(
							'📊 File is still being processed, returning processing status...'
						);
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
			const response = await api.post<ShareLinkResponse>(
				'/generate-share-link',
				{
					file_id: fileId,
					graph_data: graphData,
				}
			);
			return response.data;
		} catch (error) {
			console.error('Generate share link error:', error);
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
			console.error('Get shared graph error:', error);
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
		console.log(`🔍 Checking processing status for file: ${fileId}`);
		return await mindmapApi.getSavedGraph(fileId);
	},
};
