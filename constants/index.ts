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
		color: 'bg-blue-400 hover:bg-blue-500',
	},
	{
		icon: Facebook,
		label: 'Facebook',
		platform: 'facebook',
		color: 'bg-blue-600 hover:bg-blue-700',
	},
	{
		icon: Linkedin,
		label: 'LinkedIn',
		platform: 'linkedin',
		color: 'bg-blue-700 hover:bg-blue-800',
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
