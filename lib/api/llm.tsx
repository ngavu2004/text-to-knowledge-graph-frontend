import { MindMapData } from '@/types/mindmap';
import axios from 'axios';
import { api } from '..';

export const mindmapApi = {
	/**
	 * Upload file and get mind map data directly
	 * @param file - The file to upload
	 * @returns Promise with mind map data
	 */
	uploadAndProcessFile: async (file: File): Promise<MindMapData> => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await api.post<MindMapData>('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: progressEvent => {
					// You can use this for upload progress if needed
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / (progressEvent.total || 1)
					);
					console.log(`Upload Progress: ${percentCompleted}%`);
				},
			});

			// Since the API directly returns the mind map data structure, return it directly
			return response.data;
		} catch (error) {
			console.error('Upload and process error:', error);
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.message ||
						error.message ||
						'Failed to upload and process file'
				);
			}
			throw new Error('An unexpected error occurred during file processing');
		}
	},

	/**
	 * Extract knowledge graph from uploaded file
	 * @param fileId - ID of the uploaded file
	 * @param filename - Filename (alternative identifier)
	 * @returns Promise with mind map data
	 */
	extractKnowledgeGraph: async (
		fileId?: string,
		filename?: string
	): Promise<MindMapData> => {
		try {
			const payload = fileId ? { fileId } : { filename };

			const response = await api.post<MindMapData>('/extract-kg', payload, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return response.data;
		} catch (error) {
			console.error('Extract KG error:', error);
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.message ||
						error.message ||
						'Failed to extract knowledge graph'
				);
			}
			throw new Error(
				'An unexpected error occurred during knowledge graph extraction'
			);
		}
	},
};
