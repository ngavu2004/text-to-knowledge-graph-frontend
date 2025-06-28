'use client';

import React from 'react';
import FloatingElements from '@/app/about/components/floating-ele';
import HeroSection from '@/app/about/components/hero';
import FeatureCards from '@/app/about/components/stack-deck';
import KnowledgeGraph from '@/app/about/components/knowledge-graph';
import CTASection from '@/app/about/components/cta';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';

const AboutPage = () => {
	return (
		<>
			<div className="relative">
				<AnimatedGridPattern />

				<FloatingElements />

				<main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
					<HeroSection />

					<FeatureCards />

					<KnowledgeGraph />

					<CTASection />

					<FloatingElements />
				</main>

				<div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />
				<div className="absolute top-1/4 right-0 w-48 h-48 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full blur-3xl" />
			</div>
		</>
	);
};

export default AboutPage;
