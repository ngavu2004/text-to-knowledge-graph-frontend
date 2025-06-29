'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import Link from 'next/link';

const CTASection = () => {
	return (
		<motion.div
			className="text-center px-4"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 1.3 }}
		>
			<Card className="inline-block max-w-full w-full sm:w-auto p-4 sm:p-6 bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-2xl">
				<CardContent className="p-0">
					<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
							<Link href="/">
								<Play className="w-6 h-6" />
							</Link>
						</div>
						<div className="text-center sm:text-left">
							<h3 className="font-semibold text-lg sm:text-xl">
								Ready to Transform Your Learning?
							</h3>
							<p className="text-emerald-100 text-sm sm:text-base">
								Join thousands of learners already using Mind Graph
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default CTASection;
