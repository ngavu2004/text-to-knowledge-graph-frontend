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
