import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/navbar';
import { LoadingProvider } from '@/contexts/loading-context';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Mind Graph',
	description: 'Transform text into interactive knowledge graphs and mind maps',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100`}
			>
				<LoadingProvider>
					<Navbar />
					{children}
				</LoadingProvider>
			</body>
		</html>
	);
}
