'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadContentProps {
	isDragOver: boolean;
	supportedTypesDisplay: string;
	maxSizeInMB: number;
	onBrowseClick: () => void;
}

export const UploadContent: React.FC<UploadContentProps> = ({
	isDragOver,
	supportedTypesDisplay,
	maxSizeInMB,
	onBrowseClick,
}) => {
	return (
		<motion.div
			key="upload"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="space-y-6"
		>
			<motion.div
				animate={{
					y: isDragOver ? -10 : 0,
					scale: isDragOver ? 1.1 : 1,
				}}
				transition={{ type: 'spring', stiffness: 300 }}
			>
				<div
					className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
						isDragOver
							? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
							: 'bg-gray-100'
					}`}
				>
					<Upload
						className={`w-10 h-10 transition-colors duration-300 ${
							isDragOver ? 'text-white' : 'text-gray-400'
						}`}
					/>
				</div>
			</motion.div>

			<div>
				<h3 className="text-2xl font-semibold text-gray-900 mb-3">
					{isDragOver ? 'Drop your file here' : 'Upload Your Document'}
				</h3>
				<p className="text-gray-500 mb-6">
					Supports: {supportedTypesDisplay} • Max {maxSizeInMB}MB
				</p>

				<Button
					onClick={onBrowseClick}
					size="lg"
					className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
				>
					Browse Files
				</Button>
			</div>
		</motion.div>
	);
};
