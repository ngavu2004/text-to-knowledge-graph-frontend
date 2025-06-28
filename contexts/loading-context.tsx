'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoadingTerminal } from '@/components/loading-terminal';

/**
 * Loading Context Provider
 *
 * This context provides a global loading terminal that can be used across all pages.
 *
 * Features:
 * - Automatically shows loading terminal on first visit
 * - Can be triggered programmatically from any page
 * - Handles policy dialog integration
 *
 * Usage in any page:
 * ```tsx
 * import { useLoading } from '@/contexts/loading-context';
 *
 * const MyPage = () => {
 *   const { showLoading, hideLoading, isLoading } = useLoading();
 *
 *   const handleSomeAction = () => {
 *     showLoading(3000); // Show for 3 seconds
 *     // or showLoading(); // Show until hideLoading() is called
 *   };
 *
 *   return <div>...</div>;
 * };
 * ```
 */

interface LoadingContextType {
	showLoading: (duration?: number) => void;
	hideLoading: () => void;
	isLoading: boolean;
	onFirstVisitComplete?: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};

interface LoadingProviderProps {
	children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showFirstVisitLoading, setShowFirstVisitLoading] = useState(false);

	// Check for first visit on mount
	useEffect(() => {
		const hasVisitedBefore = localStorage.getItem('mind-graph-visited');
		if (!hasVisitedBefore) {
			setShowFirstVisitLoading(true);
			localStorage.setItem('mind-graph-visited', 'true');
		}
	}, []);

	const showLoading = (duration?: number) => {
		setIsLoading(true);
		if (duration) {
			setTimeout(() => {
				setIsLoading(false);
			}, duration);
		}
	};

	const hideLoading = () => {
		setIsLoading(false);
	};

	const handleFirstVisitComplete = () => {
		setShowFirstVisitLoading(false);

		// Trigger policy dialog check after loading completes
		setTimeout(() => {
			const hasAcceptedPolicies = localStorage.getItem(
				'mind-graph-policies-accepted'
			);
			if (!hasAcceptedPolicies) {
				// Dispatch a custom event that the home page can listen to
				window.dispatchEvent(new CustomEvent('showPolicyDialog'));
			}
		}, 100);
	};

	const contextValue: LoadingContextType = {
		showLoading,
		hideLoading,
		isLoading: isLoading || showFirstVisitLoading,
	};

	return (
		<LoadingContext.Provider value={contextValue}>
			{children}

			{/* First visit loading terminal */}
			{showFirstVisitLoading && (
				<LoadingTerminal onComplete={handleFirstVisitComplete} />
			)}

			{/* General loading terminal for other use cases */}
			{isLoading && !showFirstVisitLoading && (
				<LoadingTerminal onComplete={hideLoading} />
			)}
		</LoadingContext.Provider>
	);
};
