'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, X, Brain } from 'lucide-react';

interface SuccessContentProps {
	uploadedFile: File;
	formatFileSize: (bytes: number) => string;
	onRemoveFile: () => void;
	onGenerateMindMap: () => void;
}

export const SuccessContent: React.FC<SuccessContentProps> = ({
	uploadedFile,
	formatFileSize,
	onRemoveFile,
	onGenerateMindMap,
}) => {
	return (
		<motion.div
			key="success"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="space-y-6"
		>
			<div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
				<CheckCircle className="w-10 h-10 text-green-600" />
			</div>

			<div>
				<h3 className="text-2xl font-semibold text-gray-900 mb-4">
					File uploaded successfully!
				</h3>

				<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
							<div className="min-w-0">
								<p className="font-medium text-green-900 truncate">
									{uploadedFile.name}
								</p>
								<p className="text-sm text-green-600">
									{formatFileSize(uploadedFile.size)}
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onRemoveFile}
							className="text-green-600 hover:text-green-800 hover:bg-green-100 flex-shrink-0"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</div>

				<Button
					onClick={onGenerateMindMap}
					size="lg"
					className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
				>
					<Brain className="w-6 h-6 mr-3" />
					Generate Mind Map
				</Button>
			</div>
		</motion.div>
	);
};
