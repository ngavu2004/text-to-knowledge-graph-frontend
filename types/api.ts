import { MindMapData } from './mindmap';

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: ApiError;
}

export interface PresignedUrlResponse {
	upload_url?: string;
	presigned_url?: string;
	file_name: string;
	file_id: string;
}

export interface GraphDataResponse {
	status: 'processing' | 'completed' | 'error';
	message?: string;
	graph_data?: MindMapData;
	file_id?: string;
	processed_at?: string;
	error?: string;
}

export interface ShareLinkRequest {
	file_id: string;
	graph_data: MindMapData;
}

export interface ShareLinkResponse {
	share_id: string;
	share_url: string;
	expires_at: number;
}

export interface SharedGraphResponse {
	graph_data: MindMapData;
	file_id: string;
	created_at: string;
	view_count: number;
}
