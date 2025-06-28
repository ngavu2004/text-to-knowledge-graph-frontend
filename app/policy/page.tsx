'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	Shield,
	Eye,
	Lock,
	FileText,
	Users,
	Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';

const PolicyPage = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

	const handleGoBack = () => {
		router.push('/');
	};

	return (
		<div className="relative min-h-screen">
			{/* Animated Background Pattern */}
			<AnimatedGridPattern />

			{/* Main Content */}
			<div className="relative z-10 min-h-screen">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
					>
						<Card className="shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Button
											variant="ghost"
											onClick={handleGoBack}
											className="p-2 cursor-pointer"
										>
											<ArrowLeft className="w-5 h-5" />
										</Button>
										<div>
											<h1 className="text-3xl font-bold text-gray-900 flex items-center">
												<Shield className="w-8 h-8 mr-3 text-emerald-600" />
												Legal & Privacy
											</h1>
											<p className="text-gray-600 mt-1">
												Your privacy and trust matter to us
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Tab Navigation */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="mb-8"
					>
						<div className="flex space-x-4">
							<Button
								onClick={() => setActiveTab('privacy')}
								className={`px-6 py-3 cursor-pointer ${
									activeTab === 'privacy'
										? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white'
										: 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								<Eye className="w-4 h-4 mr-2" />
								Privacy Policy
							</Button>
							<Button
								onClick={() => setActiveTab('terms')}
								className={`px-6 py-3 cursor-pointer ${
									activeTab === 'terms'
										? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white'
										: 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								<FileText className="w-4 h-4 mr-2" />
								Terms of Service
							</Button>
						</div>
					</motion.div>

					{/* Content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="shadow-xl">
							<CardContent className="p-0">
								{activeTab === 'privacy' ? (
									<PrivacyPolicyContent />
								) : (
									<TermsOfServiceContent />
								)}
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

const PrivacyPolicyContent = () => (
	<div className="p-8">
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Privacy Policy
				</h2>
				<p className="text-gray-600">
					Last updated: {new Date().toLocaleDateString()}
				</p>
			</div>

			<div className="space-y-8">
				<section>
					<div className="flex items-center mb-4">
						<Lock className="w-5 h-5 text-emerald-600 mr-2" />
						<h3 className="text-xl font-semibold text-gray-900">
							Data Collection
						</h3>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">
							We collect information you provide directly to us, such as when
							you:
						</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>Upload documents for mind map generation</li>
							<li>Create and share mind maps</li>
							<li>Use our interactive features</li>
							<li>Contact us for support</li>
						</ul>
					</div>
				</section>

				<section>
					<div className="flex items-center mb-4">
						<Globe className="w-5 h-5 text-emerald-600 mr-2" />
						<h3 className="text-xl font-semibold text-gray-900">
							How We Use Your Information
						</h3>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">
							We use the information we collect to:
						</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>Generate and display mind maps from your documents</li>
							<li>Enable sharing and collaboration features</li>
							<li>Improve our service and user experience</li>
							<li>Provide customer support</li>
							<li>Ensure security and prevent fraud</li>
						</ul>
					</div>
				</section>

				<section>
					<div className="flex items-center mb-4">
						<Users className="w-5 h-5 text-emerald-600 mr-2" />
						<h3 className="text-xl font-semibold text-gray-900">
							Information Sharing
						</h3>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">
							We do not sell, trade, or otherwise transfer your personal
							information to third parties except:
						</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>When you explicitly choose to share mind maps</li>
							<li>To comply with legal obligations</li>
							<li>To protect our rights and safety</li>
							<li>With your explicit consent</li>
						</ul>
					</div>
				</section>

				<section>
					<div className="flex items-center mb-4">
						<Shield className="w-5 h-5 text-emerald-600 mr-2" />
						<h3 className="text-xl font-semibold text-gray-900">
							Data Security
						</h3>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700">
							We implement appropriate security measures to protect your
							personal information against unauthorized access, alteration,
							disclosure, or destruction. Your documents and mind maps are
							processed securely and stored with encryption.
						</p>
					</div>
				</section>

				<section>
					<div className="flex items-center mb-4">
						<Eye className="w-5 h-5 text-emerald-600 mr-2" />
						<h3 className="text-xl font-semibold text-gray-900">Your Rights</h3>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">You have the right to:</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>Access your personal data</li>
							<li>Correct inaccurate data</li>
							<li>Delete your data</li>
							<li>Export your mind maps</li>
							<li>Opt out of communications</li>
						</ul>
					</div>
				</section>
			</div>
		</div>
	</div>
);

const TermsOfServiceContent = () => (
	<div className="p-8">
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Terms of Service
				</h2>
				<p className="text-gray-600">
					Last updated: {new Date().toLocaleDateString()}
				</p>
			</div>

			<div className="space-y-8">
				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						Acceptance of Terms
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700">
							By accessing and using our mind mapping service, you accept and
							agree to be bound by the terms and provision of this agreement.
							These terms apply to all visitors, users, and others who access or
							use the service.
						</p>
					</div>
				</section>

				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						Service Description
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">Our service provides:</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>AI-powered mind map generation from documents</li>
							<li>Interactive visualization tools</li>
							<li>Sharing and collaboration features</li>
							<li>Document processing and analysis</li>
						</ul>
					</div>
				</section>

				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						User Responsibilities
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700 mb-4">You agree to:</p>
						<ul className="list-disc list-inside text-gray-700 space-y-2">
							<li>Use the service for lawful purposes only</li>
							<li>Not upload harmful, offensive, or copyrighted content</li>
							<li>Respect the intellectual property rights of others</li>
							<li>Not attempt to disrupt or damage the service</li>
							<li>Keep your account information secure</li>
						</ul>
					</div>
				</section>

				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						Intellectual Property
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700">
							You retain ownership of your original content. By using our
							service, you grant us a license to process your documents and
							generate mind maps. The generated mind maps remain your property,
							and you can download or delete them at any time.
						</p>
					</div>
				</section>

				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						Limitation of Liability
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700">
							Our service is provided &ldquo;as is&rdquo; without warranties. We
							are not liable for any indirect, incidental, special, or
							consequential damages resulting from your use of the service. Our
							total liability shall not exceed the amount paid by you for the
							service.
						</p>
					</div>
				</section>

				<section>
					<h3 className="text-xl font-semibold text-gray-900 mb-4">
						Changes to Terms
					</h3>
					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-gray-700">
							We reserve the right to modify these terms at any time. We will
							notify users of significant changes via email or through the
							service. Continued use of the service after changes constitutes
							acceptance of the new terms.
						</p>
					</div>
				</section>
			</div>
		</div>
	</div>
);

export default PolicyPage;
