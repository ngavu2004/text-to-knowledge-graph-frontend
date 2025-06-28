'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const GeneratingContent: React.FC = () => {
	return (
		<motion.div
			key="generating"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-6"
		>
			<div className="w-24 h-24 mx-auto">
				<motion.div
					className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center"
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
				>
					<Sparkles className="w-10 h-10 text-white" />
				</motion.div>
			</div>
			<div>
				<h3 className="text-2xl font-semibold text-gray-900 mb-3">
					Creating your mind map...
				</h3>
				<p className="text-gray-500">
					AI is analyzing content and building connections
				</p>
			</div>
		</motion.div>
	);
};
