'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import Link from 'next/link';

const CTASection = () => {
	return (
		<motion.div
			className="text-center"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 1.3 }}
		>
			<Card className="inline-block p-6 bg-gradient-to-r from-emerald-600 to-green-700 text-white border-0 shadow-2xl">
				<CardContent className="p-0">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
							<Link href="/">
								<Play className="w-6 h-6" />
							</Link>
						</div>
						<div className="text-left">
							<h3 className="font-semibold text-lg">
								Ready to Transform Your Learning?
							</h3>
							<p className="text-emerald-100">
								Join thousands of learners already using Mind Paper
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default CTASection;
