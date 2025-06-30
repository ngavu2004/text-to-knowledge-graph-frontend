'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MindMap } from '@/components/home/mindmap/mindmap';
import {
	Share2,
	Download,
	Edit,
	Brain,
	Loader,
	AlertCircle,
	Eye,
	Users,
	Clock,
	Home,
	AlertTriangle,
	CheckCircle,
	ArrowLeft,
} from 'lucide-react';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { useSharedGraph } from '@/hooks/useSharedGraph';
import Link from 'next/link';
import { toast } from 'sonner';

export default function GraphPage() {
	const params = useParams();
	const router = useRouter();
	const graphId = params.graphid as string;

	// Use the shared graph hook first, which will handle both share IDs and file IDs
	const { graphData, isLoading, error, fileName, createdAt, viewCount } =
		useSharedGraph(graphId);

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	// Show success alert when graph loads
	useEffect(() => {
		if (graphData) {
			setShowSuccessAlert(true);
		}
	}, [graphData]);

	useEffect(() => {
		if (showSuccessAlert) {
			const timer = setTimeout(() => {
				setShowSuccessAlert(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showSuccessAlert]);

	const handleShare = () => {
		if (!graphData) return;

		// Create shareable URL with the shareId
		const shareUrl = `${window.location.origin}/graph/${graphId}`;

		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				toast.success('Shareable link copied to clipboard!');
			})
			.catch(() => {
				toast.error('Failed to copy link');
			});
	};

	const handleDownload = () => {
		if (!graphData) return;

		const dataStr = JSON.stringify(graphData, null, 2);
		const dataUri =
			'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		// Use the actual file name or fallback to a generic name
		const baseFileName = fileName?.replace(/\.[^/.]+$/, '') || 'mindmap'; // Remove file extension if present
		const exportFileDefaultName = `${baseFileName}_${graphId}.json`;

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	};

	const handleEdit = () => {
		// TODO: Implement edit functionality
		alert('Edit functionality coming soon!');
	};

	const handleGoBack = () => {
		router.push('/');
	};
	if (isLoading) {
		return (
			<div className="relative min-h-screen">
				{/* Animated Background Pattern */}
				<AnimatedGridPattern />

				{/* Loading Content */}
				<div className="relative z-10 min-h-screen bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-100/80 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center"
					>
						<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
							<Loader className="w-8 h-8 text-white animate-spin" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Loading Mind Map
						</h2>
						<p className="text-gray-600">
							Please wait while we fetch your graph...
						</p>
					</motion.div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="relative min-h-screen">
				{/* Animated Background Pattern */}
				<AnimatedGridPattern />

				{/* Error Content */}
				<div className="relative z-10 min-h-screen bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-100/80">
					<div className="container mx-auto px-4 py-6">
						{/* Breadcrumb Navigation */}
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-6"
						>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink asChild>
											<Link href="/" className="flex items-center">
												<Home className="w-4 h-4 mr-1" />
												Home
											</Link>
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage className="flex items-center">
											<AlertTriangle className="w-4 h-4 mr-1" />
											Error
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</motion.div>

						{/* Error Alert */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="max-w-2xl mx-auto"
						>
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Unable to Load Mind Map</AlertTitle>
								<AlertDescription>
									{error}. This could happen if the graph has expired, been
									deleted, or the link is invalid.
								</AlertDescription>
							</Alert>

							<div className="text-center">
								<Button
									onClick={handleGoBack}
									className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 cursor-pointer"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									Go Back Home
								</Button>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		);
	}

	if (!graphData) {
		return null;
	}

	return (
		<div className="relative min-h-screen">
			{/* Animated Background Pattern */}
			<AnimatedGridPattern />

			{/* Main Content */}
			<div className="relative z-10 min-h-screen bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-100/80">
				<div className="container mx-auto px-4 py-4 lg:py-6">
					{/* Breadcrumb Navigation */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6"
					>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href="/" className="flex items-center">
											<Home className="w-4 h-4 mr-1" />
											Home
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage className="flex items-center">
										<Brain className="w-4 h-4 mr-1" />
										{fileName || 'Mind Map'}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</motion.div>
					{/* Success Alert for Loaded Graph */}
					{showSuccessAlert && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="mb-6"
						>
							<Alert className="border-emerald-200 bg-emerald-50">
								<CheckCircle className="h-4 w-4 text-emerald-600" />
								<AlertTitle className="text-emerald-800">
									Mind Map Loaded Successfully
								</AlertTitle>
								<AlertDescription className="text-emerald-700">
									Your mind map is ready to explore. Use the controls below to
									interact with the visualization.
								</AlertDescription>
							</Alert>
						</motion.div>
					)}
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6"
					>
						<Card className="shadow-lg">
							<CardContent className="p-6">
								<div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between">
									<div className="flex-1">
										<h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
											{fileName || 'Mind Map'}
										</h1>
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mt-1">
											<div className="flex items-center">
												<Clock className="w-4 h-4 mr-1" />
												Created{' '}
												{createdAt
													? new Date(createdAt).toLocaleDateString()
													: 'Unknown date'}
											</div>
											<div className="flex items-center">
												<Eye className="w-4 h-4 mr-1" />
												{viewCount} {viewCount === 1 ? 'view' : 'views'}
											</div>
											<div className="flex items-center">
												<Users className="w-4 h-4 mr-1" />
												Public
											</div>
										</div>
									</div>

									<div className="flex flex-wrap items-center gap-2 lg:gap-3">
										<Button
											variant="outline"
											onClick={handleShare}
											className="cursor-pointer flex-1 sm:flex-none"
											size="sm"
										>
											<Share2 className="w-4 h-4 mr-2" />
											Share
										</Button>
										<Button
											variant="outline"
											onClick={handleDownload}
											className="cursor-pointer flex-1 sm:flex-none"
											size="sm"
										>
											<Download className="w-4 h-4 mr-2" />
											Download
										</Button>
										<Button
											variant="outline"
											onClick={handleEdit}
											className="cursor-pointer flex-1 sm:flex-none"
											size="sm"
										>
											<Edit className="w-4 h-4 mr-2" />
											Edit
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
					{/* Mind Map */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="shadow-2xl border-0 overflow-hidden">
							<CardContent className="p-0">
								<div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-4 lg:p-6 text-white relative">
									{/* Background pattern */}
									<div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-teal-600/90"></div>
									<div className="absolute inset-0 opacity-30">
										<div
											className="w-full h-full"
											style={{
												backgroundImage:
													'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
												backgroundSize: '30px 30px',
											}}
										></div>
									</div>

									<div className="relative z-10 flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
										<div>
											<h2 className="text-xl lg:text-2xl font-bold mb-2">
												{fileName || 'Mind Map'}
											</h2>
											<p className="text-emerald-100 text-sm">
												Explore the interconnected knowledge graph
											</p>
										</div>
										<div className="text-left lg:text-right">
											<div className="text-base lg:text-lg font-semibold">
												{graphData.nodes.length} nodes
											</div>
											<div className="text-sm opacity-90">
												{graphData.relationships.length} connections
											</div>
										</div>
									</div>
								</div>

								<div className="p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white min-h-[400px] lg:min-h-[700px] xl:min-h-[800px] flex items-center justify-center">
									<div className="w-full flex justify-center">
										<MindMap
											data={graphData}
											width={
												typeof window !== 'undefined'
													? (() => {
															const screenWidth = window.innerWidth;
															if (screenWidth < 768) {
																// Mobile: smaller padding
																return Math.min(screenWidth - 32, 600);
															} else if (screenWidth < 1024) {
																// Tablet: medium size
																return Math.min(screenWidth - 100, 900);
															} else if (screenWidth < 1536) {
																// Desktop: larger size
																return Math.min(screenWidth - 120, 1200);
															} else {
																// Large desktop: much larger
																return Math.min(screenWidth - 150, 1600);
															}
														})()
													: 1000
											}
											height={
												typeof window !== 'undefined'
													? (() => {
															const screenWidth = window.innerWidth;
															const screenHeight = window.innerHeight;
															if (screenWidth < 768) {
																// Mobile: compact height
																return Math.max(400, screenHeight - 400);
															} else if (screenWidth < 1024) {
																// Tablet: medium height
																return Math.max(600, screenHeight - 300);
															} else if (screenWidth < 1536) {
																// Desktop: larger height
																return Math.max(700, screenHeight - 250);
															} else {
																// Large desktop: much larger height
																return Math.max(800, screenHeight - 200);
															}
														})()
													: 700
											}
											className="border-2 border-gray-200 rounded-xl shadow-lg bg-white"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
					{/* Graph Statistics */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-8"
					>
						<Card className="shadow-xl border-0 overflow-hidden">
							<CardContent className="p-0">
								<div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 lg:p-6 text-white">
									<h3 className="text-lg lg:text-xl font-bold text-white mb-2">
										Graph Analytics
									</h3>
									<p className="text-gray-300 text-sm">
										Detailed insights into your knowledge graph structure
									</p>
								</div>
								<div className="p-4 lg:p-6 bg-gradient-to-br from-white to-gray-50">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
										<motion.div
											className="text-center p-4 lg:p-6 bg-white rounded-xl shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300"
											whileHover={{ scale: 1.05 }}
										>
											<div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
												<svg
													className="w-6 h-6 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<circle
														cx="10"
														cy="10"
														r="8"
														fill="currentColor"
														opacity="0.8"
													/>
												</svg>
											</div>
											<div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">
												{graphData.nodes.length}
											</div>
											<div className="text-sm font-medium text-gray-600">
												Total Nodes
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Knowledge entities
											</div>
										</motion.div>

										<motion.div
											className="text-center p-4 lg:p-6 bg-white rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300"
											whileHover={{ scale: 1.05 }}
										>
											<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
												<svg
													className="w-6 h-6 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														d="M2 10l8-8 8 8-8 8-8-8z"
														fill="currentColor"
													/>
												</svg>
											</div>
											<div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
												{graphData.relationships.length}
											</div>
											<div className="text-sm font-medium text-gray-600">
												Relationships
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Connections made
											</div>
										</motion.div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>{' '}
				</div>
			</div>
		</div>
	);
}
