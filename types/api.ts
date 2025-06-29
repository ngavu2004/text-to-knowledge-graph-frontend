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
