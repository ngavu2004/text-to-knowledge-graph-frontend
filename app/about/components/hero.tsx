'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
	return (
		<div className="text-center mb-16">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="mb-6"
			>
				<div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8">
					<Lightbulb className="w-4 h-4 mr-2" />
					Say Goodbye to Doom Scrolling
				</div>
			</motion.div>

			<motion.h1
				className="text-6xl md:text-8xl font-bold mb-6"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					MIND PAPER
				</span>
				<br />
				<span className="text-gray-900">MIND GRAPH</span>
			</motion.h1>

			<motion.p
				className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-semibold"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.5 }}
			>
				Transform documents into productive learning with our{' '}
				<span className="text-blue-600 font-bold">
					AI-powered mind-map platform.
				</span>
			</motion.p>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.7 }}
			>
				<Link href="/">
					{' '}
					<Button
						size="lg"
						className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
					>
						Access Mind Paper
						<ArrowRight className="w-5 h-5 ml-2" />
					</Button>
				</Link>
			</motion.div>
		</div>
	);
};

export default HeroSection;
