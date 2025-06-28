import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000', // Adjust base URL as needed
	// timeout: 30000, // 30 seconds timeout for file processing
	headers: {
		'Content-Type': 'multipart/form-data',
	},
});
