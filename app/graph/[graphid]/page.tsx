'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { MindMapData } from '@/types/mindmap';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import Link from 'next/link';

interface GraphMetadata {
	id: string;
	title: string;
	createdAt: string;
	views: number;
	isPublic: boolean;
}

export default function GraphPage() {
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const graphId = params.graphid as string;

	const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
	const [metadata, setMetadata] = useState<GraphMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	// Fetch mind map data from localStorage or URL params
	useEffect(() => {
		const loadGraphData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// First try to get data from URL search params (when sharing)
				const dataParam = searchParams.get('data');
				const titleParam = searchParams.get('title');

				if (dataParam) {
					try {
						const decodedData = JSON.parse(decodeURIComponent(dataParam));
						setMindMapData(decodedData);
						setMetadata({
							id: graphId,
							title: titleParam || 'Shared Mind Map',
							createdAt: new Date().toISOString(),
							views: 1,
							isPublic: true,
						});

						// Show success alert
						setShowSuccessAlert(true);
						return;
					} catch (parseError) {
						console.error('Error parsing URL data:', parseError);
					}
				}

				// Then try localStorage (for recently generated graphs)
				const storageKey = `mindmap_${graphId}`;
				const storedData = localStorage.getItem(storageKey);

				if (storedData) {
					try {
						const parsedData = JSON.parse(storedData);
						setMindMapData(parsedData.mindMapData);
						setMetadata({
							id: graphId,
							title: parsedData.title || 'Mind Map',
							createdAt: parsedData.createdAt || new Date().toISOString(),
							views: (parsedData.views || 0) + 1,
							isPublic: parsedData.isPublic || false,
						});

						// Update view count in localStorage
						localStorage.setItem(
							storageKey,
							JSON.stringify({
								...parsedData,
								views: (parsedData.views || 0) + 1,
							})
						);

						// Show success alert
						setShowSuccessAlert(true);
						return;
					} catch (parseError) {
						console.error('Error parsing stored data:', parseError);
					}
				}

				// If no data found, show error
				setError('Graph not found or has expired');
			} catch (err) {
				console.error('Error loading graph:', err);
				setError('Failed to load graph');
			} finally {
				setIsLoading(false);
			}
		};

		if (graphId) {
			loadGraphData();
		}
	}, [graphId, searchParams]);

	// Auto-hide success alert after 3 seconds
	useEffect(() => {
		if (showSuccessAlert) {
			const timer = setTimeout(() => {
				setShowSuccessAlert(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showSuccessAlert]);

	const handleShare = () => {
		if (!mindMapData || !metadata) return;

		// Create shareable URL with data
		const dataParam = encodeURIComponent(JSON.stringify(mindMapData));
		const titleParam = encodeURIComponent(metadata.title);
		const shareUrl = `${window.location.origin}/graph/${graphId}?data=${dataParam}&title=${titleParam}`;

		navigator.clipboard
			.writeText(shareUrl)
			.then(() => {
				alert('Shareable link copied to clipboard!');
			})
			.catch(() => {
				alert('Failed to copy link');
			});
	};

	const handleDownload = () => {
		if (!mindMapData || !metadata) return;

		const dataStr = JSON.stringify(mindMapData, null, 2);
		const dataUri =
			'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = `${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_mindmap.json`;

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

	if (!mindMapData || !metadata) {
		return null;
	}

	return (
		<div className="relative min-h-screen">
			{/* Animated Background Pattern */}
			<AnimatedGridPattern />

			{/* Main Content */}
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
										<Brain className="w-4 h-4 mr-1" />
										{metadata?.title || 'Mind Map'}
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
								<div className="flex items-center justify-between">
									<div>
										<h1 className="text-2xl font-bold text-gray-900 flex items-center">
											{metadata.title}
										</h1>
										<div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
											<div className="flex items-center">
												<Clock className="w-4 h-4 mr-1" />
												Created{' '}
												{new Date(metadata.createdAt).toLocaleDateString()}
											</div>
											<div className="flex items-center">
												<Eye className="w-4 h-4 mr-1" />
												{metadata.views} views
											</div>
											{metadata.isPublic && (
												<div className="flex items-center">
													<Users className="w-4 h-4 mr-1" />
													Public
												</div>
											)}
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<Button
											variant="outline"
											onClick={handleShare}
											className="cursor-pointer"
										>
											<Share2 className="w-4 h-4 mr-2" />
											Share
										</Button>
										<Button
											variant="outline"
											onClick={handleDownload}
											className="cursor-pointer"
										>
											<Download className="w-4 h-4 mr-2" />
											Download
										</Button>
										<Button
											variant="outline"
											onClick={handleEdit}
											className="cursor-pointer"
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
								<div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 text-white relative">
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

									<div className="relative z-10 flex items-center justify-between">
										<div>
											<h2 className="text-2xl font-bold mb-2">
												{metadata.title} Mind Map
											</h2>
											<p className="text-emerald-100 text-sm">
												Explore the interconnected knowledge graph
											</p>
										</div>
										<div className="text-right">
											<div className="text-lg font-semibold">
												{mindMapData.nodes.length} nodes
											</div>
											<div className="text-sm opacity-90">
												{mindMapData.relationships.length} connections
											</div>
										</div>
									</div>
								</div>

								<div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-[600px] flex items-center justify-center">
									<div className="w-full flex justify-center">
										<MindMap
											data={mindMapData}
											width={
												typeof window !== 'undefined'
													? Math.min(window.innerWidth - 180, 1400)
													: 1000
											}
											height={
												typeof window !== 'undefined'
													? Math.max(700, window.innerHeight - 250)
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
								<div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
									<h3 className="text-xl font-bold text-white mb-2">
										Graph Analytics
									</h3>
									<p className="text-gray-300 text-sm">
										Detailed insights into your knowledge graph structure
									</p>
								</div>
								<div className="p-6 bg-gradient-to-br from-white to-gray-50">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<motion.div
											className="text-center p-6 bg-white rounded-xl shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300"
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
											<div className="text-3xl font-bold text-emerald-600 mb-1">
												{mindMapData.nodes.length}
											</div>
											<div className="text-sm font-medium text-gray-600">
												Total Nodes
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Knowledge entities
											</div>
										</motion.div>

										<motion.div
											className="text-center p-6 bg-white rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300"
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
											<div className="text-3xl font-bold text-green-600 mb-1">
												{mindMapData.relationships.length}
											</div>
											<div className="text-sm font-medium text-gray-600">
												Relationships
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Connections made
											</div>
										</motion.div>

										<motion.div
											className="text-center p-6 bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300"
											whileHover={{ scale: 1.05 }}
										>
											<div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3">
												<svg
													className="w-6 h-6 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<rect
														x="3"
														y="3"
														width="14"
														height="14"
														rx="2"
														fill="currentColor"
														opacity="0.8"
													/>
												</svg>
											</div>
											<div className="text-3xl font-bold text-teal-600 mb-1">
												{mindMapData.chunks_processed || 0}
											</div>
											<div className="text-sm font-medium text-gray-600">
												Chunks Processed
											</div>
											<div className="text-xs text-gray-500 mt-1">
												Text segments analyzed
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
