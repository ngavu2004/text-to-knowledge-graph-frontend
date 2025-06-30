'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Type, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TextInputCardProps {
	text: string;
	isProcessing: boolean;
	processingStatus: 'idle' | 'processing' | 'completed' | 'error';
	error: string | null;
	onTextChange: (text: string) => void;
	onGenerateMindMap: () => void;
	onClear: () => void;
}

export const TextInputCard: React.FC<TextInputCardProps> = ({
	text,
	isProcessing,
	processingStatus,
	error,
	onTextChange,
	onGenerateMindMap,
	onClear,
}) => {
	const isValidText = text.trim().length > 10; // Minimum text length for processing
	const maxCharacters = 2500;
	const isOverLimit = text.length > maxCharacters;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="shadow-xl border-0 overflow-hidden">
				<CardContent className="p-0">
					{/* Header */}
					<div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
								<Type className="w-6 h-6" />
							</div>
							<div>
								<h2 className="text-xl font-bold">Generate from Text</h2>
								<p className="text-emerald-100 text-sm">
									Enter text to create an AI-powered mind map
								</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 space-y-6">
						{/* Error Display */}
						{error && (
							<Alert className="border-red-200 bg-red-50">
								<AlertCircle className="h-4 w-4 text-red-600" />
								<AlertDescription className="text-red-800">
									{error}
								</AlertDescription>
							</Alert>
						)}

						{/* Character Limit Warning */}
						{isOverLimit && (
							<Alert className="border-orange-200 bg-orange-50">
								<AlertCircle className="h-4 w-4 text-orange-600" />
								<AlertDescription className="text-orange-800">
									<span className="font-medium">Text too long!</span>{' '}
									You&apos;ve exceeded the {maxCharacters.toLocaleString()}{' '}
									character limit ({text.length.toLocaleString()} characters).
									For longer content, please use the file upload option instead.
								</AlertDescription>
							</Alert>
						)}

						{/* Text Input Area */}
						<div className="space-y-3">
							<label className="text-sm font-medium text-gray-700">
								Enter your text content
							</label>
							<textarea
								value={text}
								onChange={e => onTextChange(e.target.value)}
								placeholder="Paste or type any text here... (articles, notes, research, etc.)"
								disabled={isProcessing}
								rows={8}
								className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
							/>
							<div className="flex justify-between items-center text-xs text-gray-500">
								<span className={isOverLimit ? 'text-red-600 font-medium' : ''}>
									{text.length.toLocaleString()} /{' '}
									{maxCharacters.toLocaleString()} characters
								</span>
								<span
									className={
										isOverLimit
											? 'text-red-600 font-medium'
											: isValidText
												? 'text-green-600'
												: 'text-orange-500'
									}
								>
									{isOverLimit
										? 'Over character limit'
										: isValidText
											? 'Ready to process'
											: 'Need at least 10 characters'}
								</span>
							</div>
						</div>

						{/* Processing Status */}
						{processingStatus === 'processing' && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex items-center justify-center space-x-3 py-4 bg-emerald-50 rounded-lg"
							>
								<Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
								<span className="text-emerald-700 font-medium">
									Analyzing text and generating mind map...
								</span>
							</motion.div>
						)}

						{/* Action Buttons */}
						<div className="flex space-x-3">
							<Button
								onClick={onGenerateMindMap}
								disabled={!isValidText || isProcessing || isOverLimit}
								className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isProcessing ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Sparkles className="w-4 h-4 mr-2" />
										Generate Mind Map
									</>
								)}
							</Button>

							{text && (
								<Button
									onClick={onClear}
									disabled={isProcessing}
									variant="outline"
									className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Clear
								</Button>
							)}
						</div>

						{/* Helper Text */}
						<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
							<p className="font-medium mb-1">Tips for better results:</p>
							<ul className="space-y-1">
								<li>• Use clear, structured text with proper grammar</li>
								<li>
									• Include specific entities, relationships, and concepts
								</li>
								<li>
									• Keep text under {maxCharacters.toLocaleString()} characters
									(use file upload for longer content)
								</li>
								<li>• Longer text generally produces richer mind maps</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
