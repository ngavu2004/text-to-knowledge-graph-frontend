'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { animations } from '@/constants';

export const Header: React.FC = () => {
	return (
		<motion.div {...animations.container} className="text-center mb-12">
			<div className="flex items-center justify-center mb-6">
				<div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
					<Brain className="w-8 h-8 text-white" />
				</div>
			</div>
			<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
				Mind Map Generator
			</h1>
			<p className="text-xl text-gray-600 max-w-2xl mx-auto">
				Transform documents into beautiful, interactive mind maps powered by AI
			</p>
		</motion.div>
	);
};
