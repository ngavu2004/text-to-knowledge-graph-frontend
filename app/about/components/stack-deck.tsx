'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { features } from '@/constants';

const FeatureCards = () => {
	const [currentFeature, setCurrentFeature] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeature(prev => (prev + 1) % features.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className="flex justify-center mb-16"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 0.9 }}
		>
			<div className="relative w-80 h-64">
				{features.map((feature, index) => {
					const IconComponent = feature.icon;
					const isActive = currentFeature === index;
					const isNext =
						currentFeature === (index - 1 + features.length) % features.length;
					const isPrev = currentFeature === (index + 1) % features.length;

					let zIndex = 1;
					let scale = 0.9;
					let yOffset = 20;
					let xOffset = 0;
					let opacity = 0.6;

					if (isActive) {
						zIndex = 30;
						scale = 1;
						yOffset = 0;
						xOffset = 0;
						opacity = 1;
					} else if (isNext) {
						zIndex = 20;
						scale = 0.95;
						yOffset = 10;
						xOffset = -10;
						opacity = 0.8;
					} else if (isPrev) {
						zIndex = 10;
						scale = 0.9;
						yOffset = 20;
						xOffset = 10;
						opacity = 0.7;
					}

					return (
						<motion.div
							key={index}
							className="absolute inset-0"
							style={{ zIndex }}
							animate={{
								scale,
								y: yOffset,
								x: xOffset,
								opacity,
							}}
							transition={{
								duration: 0.5,
								ease: 'easeInOut',
							}}
						>
							<Card
								className={`w-full h-full p-6 border-0 shadow-lg transition-all duration-500 cursor-pointer ${
									isActive
										? 'ring-2 ring-emerald-400 bg-emerald-50 shadow-2xl'
										: 'bg-white hover:shadow-xl'
								}`}
								onClick={() => setCurrentFeature(index)}
							>
								<CardContent className="p-0 h-full flex flex-col justify-center">
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
											isActive
												? 'bg-emerald-600 text-white'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										<IconComponent className="w-6 h-6" />
									</div>
									<h3 className="text-lg font-semibold mb-2 text-gray-900 text-center">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-center text-sm">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}

				<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
					{features.map((_, index) => (
						<button
							key={index}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${
								currentFeature === index
									? 'bg-emerald-600 w-6'
									: 'bg-gray-300 hover:bg-gray-400'
							}`}
							onClick={() => setCurrentFeature(index)}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
};

export default FeatureCards;
