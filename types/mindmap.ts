/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GeneratedMindMap {
	id: string;
	title: string;
	shareUrl: string;
	previewImage?: string;
	createdAt: Date;
}

export interface FileUploadState {
	isDragOver: boolean;
	uploadedFile: File | null;
	isProcessing: boolean;
	error: string | null;
}

export interface ShareState {
	isShareOpen: boolean;
	isCopied: boolean;
	shortUrl: string | null;
}

export interface MindMapNode {
	id: string;
	type: string;
	properties: Record<string, any>;
}

export interface MindMapRelationship {
	source: string;
	target: string;
	type: string;
	properties: Record<string, any>;
}

export interface MindMapData {
	nodes: MindMapNode[];
	relationships: MindMapRelationship[];
	chunks_processed: number;
}
