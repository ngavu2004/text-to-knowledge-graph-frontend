'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
	AnimatedSpan,
	Terminal,
	TypingAnimation,
} from '@/components/magicui/terminal';
import { Brain } from 'lucide-react';

interface LoadingTerminalProps {
	onComplete?: () => void;
}

export const LoadingTerminal: React.FC<LoadingTerminalProps> = ({
	onComplete,
}) => {
	React.useEffect(() => {
		const timer = setTimeout(() => {
			if (onComplete) {
				onComplete();
			}
		}, 8500);

		return () => clearTimeout(timer);
	}, [onComplete]);

	return (
		<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
				className="w-full max-w-2xl mx-auto"
			>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-center mb-6 flex flex-col items-center"
				>
					<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
						<Brain className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">
						Initializing Mind Graph
					</h2>
					<p className="text-gray-300">
						Setting up your interactive mind mapping experience...
					</p>
				</motion.div>

				{/* Terminal */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex justify-center"
				>
					<Terminal className="bg-gray-900/90 border-emerald-500/30 w-full">
						<TypingAnimation delay={500}>
							&gt; yarn initialize mind-graph
						</TypingAnimation>

						<AnimatedSpan delay={1500} className="text-emerald-400">
							<span>✔ Loading AI processing engine...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={2000} className="text-emerald-400">
							<span>✔ Initializing natural language parser...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={2500} className="text-emerald-400">
							<span>✔ Setting up knowledge graph generator...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={3000} className="text-emerald-400">
							<span>✔ Configuring interactive visualization...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={3500} className="text-emerald-400">
							<span>✔ Loading user interface components...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={4000} className="text-emerald-400">
							<span>✔ Preparing file upload handlers...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={4500} className="text-emerald-400">
							<span>✔ Initializing mind map renderer...</span>
						</AnimatedSpan>

						<AnimatedSpan delay={6000} className="text-blue-400">
							<span>ℹ Mind Graph features ready:</span>
							<div className="pl-2">- Text-to-Mind Map conversion</div>
							<div className="pl-2">- Interactive node exploration</div>
							<div className="pl-2">- Real-time collaboration</div>
						</AnimatedSpan>

						<TypingAnimation delay={6800} className="text-gray-300">
							Success! Mind Graph is ready to use.
						</TypingAnimation>

						<TypingAnimation delay={7200} className="text-emerald-300">
							Welcome to your intelligent mind mapping experience!
						</TypingAnimation>
					</Terminal>
				</motion.div>

				{/* Progress indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="mt-6 text-center flex flex-col items-center"
				>
					<div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
							initial={{ width: 0 }}
							animate={{ width: '100%' }}
							transition={{ duration: 7, delay: 0.5, ease: 'easeInOut' }}
						/>
					</div>
					<p className="text-gray-400 text-sm mt-2">
						Loading components and features...
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};
