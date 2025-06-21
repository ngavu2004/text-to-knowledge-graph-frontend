'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const AnimatedHamburger = ({ isOpen }: { isOpen: boolean }) => (
		<div className="relative w-6 h-6 flex flex-col justify-center items-center cursor-pointer">
			<motion.span
				className="absolute w-6 h-0.5 bg-gray-900 rounded-full"
				animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
			/>
			<motion.span
				className="absolute w-6 h-0.5 bg-gray-900 rounded-full"
				animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
				transition={{ duration: 0.2 }}
			/>
			<motion.span
				className="absolute w-6 h-0.5 bg-gray-900 rounded-full"
				animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
			/>
		</div>
	);

	const menuVariants = {
		closed: {
			x: '100%',
			transition: {
				type: 'spring' as const,
				stiffness: 400,
				damping: 40,
			},
		},
		open: {
			x: '0%',
			transition: {
				type: 'spring' as const,
				stiffness: 400,
				damping: 40,
			},
		},
	};

	const overlayVariants = {
		closed: {
			opacity: 0,
			transition: {
				duration: 0.3,
			},
		},
		open: {
			opacity: 1,
			transition: {
				duration: 0.3,
			},
		},
	};

	const menuItemVariants = {
		closed: {
			x: 50,
			opacity: 0,
		},
		open: (i: number) => ({
			x: 0,
			opacity: 1,
			transition: {
				delay: 0.1 + i * 0.1,
				duration: 0.4,
				ease: 'easeOut' as const,
			},
		}),
	};

	return (
		<>
			<motion.header
				className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				{/* Logo Section */}
				<motion.div
					className="flex items-center space-x-3"
					whileHover={{ scale: 1.02 }}
					transition={{ type: 'spring', stiffness: 400 }}
				>
					<motion.div
						className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md"
						whileHover={{
							rotate: 5,
							boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
						}}
						transition={{ type: 'spring', stiffness: 400 }}
					>
						<Brain className="w-6 h-6 text-white" />
					</motion.div>
					<div>
						<h1 className="text-xl font-bold text-gray-900">
							<Link href="/">Mind Paper</Link>
						</h1>
						<p className="text-sm text-gray-600">Mind Graph</p>
					</div>
				</motion.div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-8">
					<Link href="/about">
						<motion.button
							className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative cursor-pointer"
							whileHover={{ y: -2 }}
							transition={{ type: 'spring', stiffness: 400 }}
						>
							About
							<motion.div
								className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
								whileHover={{ width: '100%' }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>
					</Link>
					<Link href="/policy">
						<motion.button
							className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative cursor-pointer"
							whileHover={{ y: -2 }}
							transition={{ type: 'spring', stiffness: 400 }}
						>
							Policy
							<motion.div
								className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600"
								whileHover={{ width: '100%' }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>
					</Link>
					<Link href="/">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
								Get Started
								<motion.div
									animate={{ x: [0, 4, 0] }}
									transition={{
										repeat: Infinity,
										duration: 2,
										ease: 'easeInOut',
									}}
								>
									<ArrowRight className="w-4 h-4 ml-2" />
								</motion.div>
							</Button>
						</motion.div>
					</Link>
				</nav>

				{/* Mobile Hamburger Button */}
				<motion.button
					className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<AnimatedHamburger isOpen={isMenuOpen} />
				</motion.button>
			</motion.header>

			{/* Mobile Menu Overlay & Sidebar */}
			<AnimatePresence>
				{isMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
							variants={overlayVariants}
							initial="closed"
							animate="open"
							exit="closed"
							onClick={() => setIsMenuOpen(false)}
						/>

						{/* Sidebar Menu */}
						<motion.div
							className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
							variants={menuVariants}
							initial="closed"
							animate="open"
							exit="closed"
						>
							<div className="p-6 h-full flex flex-col">
								{/* Close Button */}
								<div className="flex justify-end mb-8">
									<motion.button
										onClick={() => setIsMenuOpen(false)}
										className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
										whileHover={{ scale: 1.1, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
									>
										<AnimatedHamburger isOpen={true} />
									</motion.button>
								</div>

								{/* Logo in mobile menu */}
								<motion.div
									className="flex items-center space-x-3 mb-12"
									custom={0}
									variants={menuItemVariants}
									initial="closed"
									animate="open"
								>
									<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
										<Brain className="w-7 h-7 text-white" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-gray-900">
											Mind Paper
										</h2>
										<p className="text-sm text-gray-600">Mind Graph</p>
									</div>
								</motion.div>

								{/* Navigation Links */}
								<nav className="space-y-6 flex-1">
									{[
										{ label: 'About', href: '/about' },
										{ label: 'Policy', href: '/policy' },
									].map((item, index) => (
										<motion.a
											key={item.label}
											href={item.href}
											className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
											custom={index + 1}
											variants={menuItemVariants}
											initial="closed"
											animate="open"
											whileHover={{ x: 10, color: '#2563eb' }}
											onClick={() => setIsMenuOpen(false)}
										>
											{item.label}
										</motion.a>
									))}
								</nav>

								{/* CTA Button */}
								<Link href="/">
									<motion.div
										className="mt-8"
										custom={4}
										variants={menuItemVariants}
										initial="closed"
										animate="open"
									>
										<motion.div
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Button
												className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-blue-700 shadow-lg text-lg py-6 rounded-xl"
												onClick={() => setIsMenuOpen(false)}
											>
												Get Started
												<ArrowRight className="w-5 h-5 ml-2" />
											</Button>
										</motion.div>
									</motion.div>
								</Link>

								{/* Footer */}
								{/* <motion.div
                                    className="mt-8 pt-6 border-t border-gray-100 text-center"
                                    custom={6}
                                    variants={menuItemVariants}
                                    initial="closed"
                                    animate="open"
                                >
                                    <p className="text-sm text-gray-500">
                                        © 2025 Mind Paper. All rights reserved.
                                    </p>
                                </motion.div> */}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
