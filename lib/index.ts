import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
	headers: {
		'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY,
		'Content-Type': 'application/json',
	},
});

// // Add request interceptor to handle different content types
// api.interceptors.request.use((config) => {
// 	// If the request has FormData, don't set Content-Type (let browser set it with boundary)
// 	if (config.data instanceof FormData) {
// 		delete config.headers['Content-Type'];
// 	} else {
// 		// For JSON requests
// 		config.headers['Content-Type'] = 'application/json';
// 	}
// 	return config;
// });

// // Add response interceptor for error handling
// api.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		console.error('API Error:', error.response?.data || error.message);
// 		return Promise.reject(error);
// 	}
// );
