'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const KnowledgeGraph = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Don't render animations on server side
	if (!isClient) {
		return (
			<div className="mb-16">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						Knowledge Graph
					</h2>
					<p className="text-gray-600">
						Visualize connections between concepts
					</p>
				</div>

				<div className="flex justify-center">
					<div className="w-full max-w-5xl">
						<div className="bg-white rounded-lg shadow-2xl overflow-hidden">
							<div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
								<div className="flex items-center space-x-2">
									<div className="flex space-x-2">
										<div className="w-3 h-3 bg-red-500 rounded-full"></div>
										<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									</div>
								</div>
								<div className="flex-1 max-w-md mx-4">
									<div className="bg-white rounded-md px-3 py-1 text-sm text-gray-600 border">
										🔒 mindpaper.ai/graph
									</div>
								</div>
								<div className="flex items-center space-x-2 text-gray-500">
									<button className="p-1 hover:bg-gray-200 rounded">
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 5v14m7-7H5"
											/>
										</svg>
									</button>
								</div>
							</div>
							<div className="relative h-96 bg-gradient-to-br from-blue-50 via-white to-purple-50">
								<div className="flex items-center justify-center h-full text-gray-500">
									Loading Knowledge Graph...
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<motion.div
			className="mb-16"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, delay: 1.1 }}
		>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					Knowledge Graph
				</h2>
				<p className="text-gray-600">Visualize connections between concepts</p>
			</div>

			{/* Safari Browser Mockup */}
			<div className="flex justify-center">
				<div className="w-full max-w-5xl">
					<div className="bg-white rounded-lg shadow-2xl overflow-hidden">
						{/* Browser Header */}
						<div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
							<div className="flex items-center space-x-2">
								<div className="flex space-x-2">
									<div className="w-3 h-3 bg-red-500 rounded-full"></div>
									<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								</div>
							</div>
							<div className="flex-1 max-w-md mx-4">
								<div className="bg-white rounded-md px-3 py-1 text-sm text-gray-600 border">
									🔒 mindpaper.ai/graph
								</div>
							</div>
							<div className="flex items-center space-x-2 text-gray-500">
								<button className="p-1 hover:bg-gray-200 rounded">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 5v14m7-7H5"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Knowledge Graph Content */}
						<div className="relative h-96 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
							<svg className="w-full h-full" viewBox="0 0 800 400">
								{/* Background grid pattern */}
								<defs>
									<pattern
										id="grid"
										width="20"
										height="20"
										patternUnits="userSpaceOnUse"
									>
										<path
											d="M 20 0 L 0 0 0 20"
											fill="none"
											stroke="#f3f4f6"
											strokeWidth="0.5"
										/>
									</pattern>
									<filter id="glow">
										<feGaussianBlur stdDeviation="3" result="coloredBlur" />
										<feMerge>
											<feMergeNode in="coloredBlur" />
											<feMergeNode in="SourceGraphic" />
										</feMerge>
									</filter>
								</defs>
								<rect width="100%" height="100%" fill="url(#grid)" />

								{/* Main connections */}
								<motion.path
									d="M150,200 Q300,120 450,200 Q600,280 750,200"
									stroke="#3b82f6"
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 2, delay: 1.5 }}
								/>

								<motion.path
									d="M300,200 L400,100 L500,200 L400,300 Z"
									stroke="#8b5cf6"
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 2, delay: 1.7 }}
								/>

								{/* Secondary connections */}
								<motion.path
									d="M150,200 L400,100"
									stroke="#10b981"
									strokeWidth="2"
									fill="none"
									strokeLinecap="round"
									opacity="0.7"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 1.5, delay: 2 }}
								/>

								<motion.path
									d="M750,200 L400,300"
									stroke="#f59e0b"
									strokeWidth="2"
									fill="none"
									strokeLinecap="round"
									opacity="0.7"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 1.5, delay: 2.2 }}
								/>

								<motion.path
									d="M300,200 L600,200"
									stroke="#ec4899"
									strokeWidth="2"
									fill="none"
									strokeLinecap="round"
									opacity="0.6"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 1.5, delay: 2.4 }}
								/>

								{/* Main nodes with enhanced styling */}
								{[
									{
										x: 150,
										y: 200,
										color: '#ef4444',
										label: 'Documents',
										size: 20,
									},
									{
										x: 300,
										y: 200,
										color: '#3b82f6',
										label: 'AI Engine',
										size: 24,
									},
									{
										x: 450,
										y: 200,
										color: '#10b981',
										label: 'Knowledge',
										size: 22,
									},
									{
										x: 600,
										y: 200,
										color: '#f59e0b',
										label: 'Insights',
										size: 20,
									},
									{
										x: 750,
										y: 200,
										color: '#8b5cf6',
										label: 'Mind Map',
										size: 22,
									},
									{
										x: 400,
										y: 100,
										color: '#06b6d4',
										label: 'Neural Net',
										size: 18,
									},
									{
										x: 400,
										y: 300,
										color: '#ec4899',
										label: 'Learning',
										size: 18,
									},
								].map((node, index) => (
									<g key={index}>
										{/* Node glow effect */}
										<motion.circle
											cx={node.x}
											cy={node.y}
											r={node.size + 8}
											fill={node.color}
											opacity="0.2"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 1.5 + index * 0.1,
												type: 'spring',
												stiffness: 200,
											}}
										/>

										{/* Main node */}
										<motion.circle
											cx={node.x}
											cy={node.y}
											r={node.size}
											fill={node.color}
											stroke="white"
											strokeWidth="3"
											filter="url(#glow)"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{
												delay: 1.5 + index * 0.1,
												type: 'spring',
												stiffness: 200,
											}}
											className="drop-shadow-lg cursor-pointer"
											whileHover={{ scale: 1.1 }}
										/>

										{/* Node labels */}
										<motion.text
											x={node.x}
											y={node.y + node.size + 20}
											textAnchor="middle"
											className="text-sm font-semibold fill-gray-700"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 2 + index * 0.1 }}
										>
											{node.label}
										</motion.text>
									</g>
								))}

								{/* Animated data flow particles */}
								{Array.from({ length: 12 }).map((_, i) => {
									const initialX = 150 + Math.random() * 600;
									const initialY = 100 + Math.random() * 200;
									const targetX1 = 150 + Math.random() * 600;
									const targetY1 = 100 + Math.random() * 200;
									const targetX2 = 150 + Math.random() * 600;
									const targetY2 = 100 + Math.random() * 200;

									return (
										<motion.circle
											key={`particle-${i}`}
											r="3"
											fill="#6366f1"
											opacity="0.6"
											initial={{
												x: initialX,
												y: initialY,
												opacity: 0,
											}}
											animate={{
												x: [initialX, targetX1, targetX2],
												y: [initialY, targetY1, targetY2],
												opacity: [0, 0.8, 0],
											}}
											transition={{
												duration: 4 + i * 0.5,
												repeat: Infinity,
												delay: i * 0.3,
												ease: 'easeInOut',
											}}
										/>
									);
								})}

								{/* Pulse effects on major nodes */}
								{[300, 450, 600].map((x, i) => (
									<motion.circle
										key={`pulse-${i}`}
										cx={x}
										cy={200}
										r="30"
										fill="none"
										stroke="#3b82f6"
										strokeWidth="2"
										opacity="0.4"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{
											scale: [0.5, 1.5, 0.5],
											opacity: [0, 0.6, 0],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											delay: i * 0.8,
										}}
									/>
								))}
							</svg>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default KnowledgeGraph;
