import {
	Brain,
	Lightbulb,
	Network,
	Twitter,
	Facebook,
	Linkedin,
	Mail,
	MessageCircle,
} from 'lucide-react';
import { MindMapData } from '@/types/mindmap';

// Color Palette - Consistent green theme across all pages
export const colors = {
	primary: {
		50: '#D8F3DC', // Lightest green
		100: '#B7E4C7', // Very light green
		200: '#95D5B2', // Light green
		300: '#74C69D', // Medium light green
		400: '#52B788', // Medium green
		500: '#40916C', // Main green
		600: '#2D6A4F', // Dark green
		700: '#1B4332', // Very dark green
		800: '#081C15', // Darkest green
	},
	gradients: {
		primary: 'from-emerald-400 to-green-600',
		secondary: 'from-green-500 to-emerald-700',
		light: 'from-emerald-50 to-green-100',
		background: 'from-emerald-50 via-green-50 to-teal-100',
	},
	semantic: {
		success: '#52B788',
		warning: '#74C69D',
		error: '#dc2626',
		info: '#40916C',
	},
};

export const floatingElements = [
	{ id: 1, x: '10%', y: '15%', delay: 0, icon: '🧠' },
	{ id: 2, x: '85%', y: '25%', delay: 0.5, icon: '💡' },
	{ id: 3, x: '20%', y: '60%', delay: 1, icon: '🎯' },
	{ id: 4, x: '75%', y: '70%', delay: 1.5, icon: '⚡' },
	{ id: 5, x: '5%', y: '45%', delay: 2, icon: '🎨' },
	{ id: 6, x: '90%', y: '55%', delay: 2.5, icon: '🚀' },
	{ id: 7, x: '45%', y: '10%', delay: 3, icon: '📚' },
	{ id: 8, x: '60%', y: '85%', delay: 3.5, icon: '🔗' },
	{ id: 9, x: '15%', y: '80%', delay: 4, icon: '✨' },
	{ id: 10, x: '80%', y: '15%', delay: 4.5, icon: '🎪' },
];

export const features = [
	{
		icon: Brain,
		title: 'Smart Mind Map Generator',
		description: 'Curated any document into a mind map',
	},
	{
		icon: Network,
		title: 'Knowledge Graph',
		description: 'Visualize connections between concepts',
	},
	{
		icon: Lightbulb,
		title: 'AI-Powered Learning',
		description: 'Transform boring documents into productive learning',
	},
];

export const animations = {
	container: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	},
	stagger: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.4, delay: 0.2 },
	},
} as const;

export const socialButtons = [
	{
		icon: Twitter,
		label: 'Twitter',
		platform: 'twitter',
		color: 'bg-emerald-400 hover:bg-emerald-500',
	},
	{
		icon: Facebook,
		label: 'Facebook',
		platform: 'facebook',
		color: 'bg-emerald-600 hover:bg-emerald-700',
	},
	{
		icon: Linkedin,
		label: 'LinkedIn',
		platform: 'linkedin',
		color: 'bg-green-700 hover:bg-green-800',
	},
	{
		icon: Mail,
		label: 'Email',
		platform: 'email',
		color: 'bg-gray-600 hover:bg-gray-700',
	},
	{
		icon: MessageCircle,
		label: 'WhatsApp',
		platform: 'whatsapp',
		color: 'bg-green-500 hover:bg-green-600',
	},
];

export const sampleData: MindMapData = {
	nodes: [
		{ id: 'FTP', type: 'Protocol', properties: {} },
		{ id: 'Control Channel', type: 'Channel', properties: {} },
		{ id: 'Data Channel', type: 'Channel', properties: {} },
		{ id: 'Port 21', type: 'Port', properties: {} },
		{ id: 'Port Range 20-21', type: 'Port', properties: {} },
		{ id: 'Authentication', type: 'Service', properties: {} },
		{ id: 'File Transfer', type: 'Service', properties: {} },
	],
	relationships: [
		{ source: 'FTP', target: 'Control Channel', type: 'USES', properties: {} },
		{ source: 'FTP', target: 'Data Channel', type: 'USES', properties: {} },
		{
			source: 'Control Channel',
			target: 'Port 21',
			type: 'OPERATES_ON',
			properties: {},
		},
		{
			source: 'Data Channel',
			target: 'Port Range 20-21',
			type: 'OPERATES_ON',
			properties: {},
		},
		{
			source: 'FTP',
			target: 'Authentication',
			type: 'DEPENDS_ON',
			properties: {},
		},
		{ source: 'FTP', target: 'File Transfer', type: 'USES', properties: {} },
	],
	chunks_processed: 237,
};

// Color mapping for different node types using green palette
export const NODE_COLORS: Record<string, string> = {
	Protocol: '#52B788', // Medium green
	Channel: '#40916C', // Main green
	Port: '#74C69D', // Medium light green
	Service: '#2D6A4F', // Dark green
	Database: '#1B4332', // Very dark green
	API: '#95D5B2', // Light green
	default: '#52B788', // Medium green
};

// Relationship type colors using green palette
export const RELATIONSHIP_COLORS: Record<string, string> = {
	USES: '#40916C', // Main green
	OPERATES_ON: '#74C69D', // Medium light green
	CONNECTS_TO: '#52B788', // Medium green
	DEPENDS_ON: '#2D6A4F', // Dark green
	default: '#52B788', // Medium green
};
