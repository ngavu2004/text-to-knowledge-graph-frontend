import axios from 'axios';

export const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		'https://rj66xwfu1d.execute-api.us-east-1.amazonaws.com/Prod',
});
