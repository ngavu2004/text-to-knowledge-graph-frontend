'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const ProcessingContent: React.FC = () => {
	return (
		<motion.div
			key="processing"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			className="space-y-6"
		>
			<div className="w-24 h-24 mx-auto">
				<motion.div
					className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
				>
					<Brain className="w-10 h-10 text-white" />
				</motion.div>
			</div>
			<div>
				<h3 className="text-2xl font-semibold text-gray-900 mb-3">
					Processing your file...
				</h3>
				<p className="text-gray-500">Analyzing your document structure</p>
			</div>
		</motion.div>
	);
};
