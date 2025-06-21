'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
	error: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
	return (
		<AnimatePresence>
			{error && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 max-w-md mx-auto"
				>
					<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
					<span className="text-red-700 text-sm">{error}</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
