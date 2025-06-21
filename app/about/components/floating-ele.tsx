'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { floatingElements } from '@/constants';

const FloatingElements = () => {
	return (
		<>
			{floatingElements.map(element => (
				<motion.div
					key={element.id}
					className="absolute text-2xl opacity-20 pointer-events-none"
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 0.3,
						y: 0,
						x: [0, 20, 0],
						rotate: [0, 10, 0],
					}}
					transition={{
						duration: 4,
						delay: element.delay,
						repeat: Infinity,
						repeatType: 'reverse',
					}}
					style={{ left: element.x, top: element.y }}
				>
					{element.icon}
				</motion.div>
			))}
		</>
	);
};

export default FloatingElements;
