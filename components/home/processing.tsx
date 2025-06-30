'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Upload, Cog, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessingContentProps {
	processingStatus?:
		| 'idle'
		| 'uploading'
		| 'processing'
		| 'completed'
		| 'error';
	uploadProgress?: number;
	onCancel?: () => void;
	estimatedTimeRemaining?: string;
}

export const ProcessingContent: React.FC<ProcessingContentProps> = ({
	processingStatus = 'processing',
	uploadProgress = 0,
	onCancel,
	estimatedTimeRemaining,
}) => {
	const getStatusInfo = () => {
		switch (processingStatus) {
			case 'uploading':
				return {
					icon: Upload,
					title: 'Uploading your file...',
					description: 'Securely uploading to cloud storage',
					showProgress: true,
					canCancel: false,
				};
			case 'processing':
				return {
					icon: Brain,
					title: 'AI is analyzing your document...',
					description:
						'This may take up to 15 minutes for complex documents. Please keep this tab open.',
					showProgress: true,
					canCancel: true,
				};
			default:
				return {
					icon: Cog,
					title: 'Processing your file...',
					description: 'Analyzing your document',
					showProgress: false,
					canCancel: false,
				};
		}
	};

	const statusInfo = getStatusInfo();
	const Icon = statusInfo.icon;

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
					className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center"
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
				>
					<Icon className="w-10 h-10 text-white" />
				</motion.div>
			</div>

			<div>
				<h3 className="text-2xl font-semibold text-gray-900 mb-3">
					{statusInfo.title}
				</h3>
				<p className="text-gray-500 mb-4">{statusInfo.description}</p>

				{statusInfo.showProgress && (
					<div className="w-full max-w-md mx-auto">
						<div className="flex justify-between text-sm text-gray-600 mb-2">
							<span>
								{processingStatus === 'uploading'
									? 'Upload Progress'
									: 'Processing Progress'}
							</span>
							<span>{Math.round(uploadProgress)}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<motion.div
								className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
								initial={{ width: 0 }}
								animate={{ width: `${uploadProgress}%` }}
								transition={{ duration: 0.5 }}
							/>
						</div>
						{processingStatus === 'processing' && (
							<div className="space-y-3 mt-4">
								<p className="text-xs text-gray-500 text-center">
									Processing large documents can take several minutes. Thank you
									for your patience!
								</p>
								{estimatedTimeRemaining && (
									<p className="text-xs text-blue-600 text-center font-medium">
										Estimated time remaining: {estimatedTimeRemaining}
									</p>
								)}
								{statusInfo.canCancel && onCancel && (
									<div className="flex justify-center mt-4">
										<Button
											variant="outline"
											size="sm"
											onClick={onCancel}
											className="text-gray-600 hover:text-gray-800 border-gray-300"
										>
											<X className="w-4 h-4 mr-2" />
											Cancel Processing
										</Button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};
