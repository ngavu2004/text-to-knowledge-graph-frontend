'use client';
import { useState, useCallback } from 'react';
import { MindMapData, ShareState } from '../types/mindmap';

interface ExtendedShareState extends ShareState {
	isGenerating: boolean;
	shareId: string | null;
	shareUrl: string | null;
	expiresAt: number | null;
	error: string | null;
}

export const useShare = () => {
	const [shareState, setShareState] = useState<ExtendedShareState>({
		isShareOpen: false,
		isCopied: false,
		shortUrl: null,
		isGenerating: false,
		shareId: null,
		shareUrl: null,
		expiresAt: null,
		error: null,
	});

	const generateShareLink = useCallback(
		async (fileId: string, graphData: MindMapData) => {
			setShareState(prev => ({
				...prev,
				isGenerating: true,
				error: null,
			}));

			try {
				// For now, generate a simple share URL using the current domain and fileId
				// This works with the existing graph page that accepts fileId
				const currentUrl = window.location.origin;
				const shareUrl = `${currentUrl}/graph/${fileId}`;

				// Store the graph data locally for this session
				// Use localStorage for text-based maps and sessionStorage for file uploads
				const storageKey = `graph_${fileId}`;
				const isTextBased = fileId.startsWith('text-');

				const localGraphData = {
					graph_data: graphData,
					file_id: fileId,
					file_name:
						graphData.nodes?.[0]?.properties?.name ||
						(isTextBased ? 'Text Mind Map' : 'Untitled Mind Map'),
					created_at: new Date().toISOString(),
					view_count: 0,
				};

				if (isTextBased) {
					// For text-based maps, use localStorage for persistence
					localStorage.setItem(storageKey, JSON.stringify(localGraphData));
				} else {
					// For file uploads, use sessionStorage
					sessionStorage.setItem(storageKey, JSON.stringify(localGraphData));
				}

				setShareState(prev => ({
					...prev,
					isGenerating: false,
					shareId: fileId, // Use fileId as shareId for now
					shareUrl: shareUrl,
					shortUrl: shareUrl,
					expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
				}));

				return shareUrl;
			} catch (error) {
				console.error('❌ Share link generation failed:', error);

				let errorMessage = 'Failed to generate share link';

				if (error instanceof Error) {
					errorMessage = error.message;
				}

				setShareState(prev => ({
					...prev,
					isGenerating: false,
					error: errorMessage,
				}));
				throw error;
			}
		},
		[]
	);

	const handleCopyLink = useCallback(
		async (shareUrl?: string) => {
			const urlToCopy = shareUrl || shareState.shareUrl || shareState.shortUrl;
			if (!urlToCopy) {
				return;
			}

			try {
				await navigator.clipboard.writeText(urlToCopy);
				setShareState(prev => ({ ...prev, isCopied: true }));
				setTimeout(
					() => setShareState(prev => ({ ...prev, isCopied: false })),
					2000
				);
			} catch (err) {
				console.error('❌ Failed to copy link:', err);
			}
		},
		[shareState.shareUrl, shareState.shortUrl]
	);

	const handleSocialShare = useCallback(
		(platform: string, title: string = 'My Mind Map', shareUrl?: string) => {
			const url = shareUrl || shareState.shareUrl || shareState.shortUrl;
			if (!url) {
				return;
			}

			const encodedUrl = encodeURIComponent(url);
			const encodedTitle = encodeURIComponent(
				`Check out my mind map: ${title}`
			);

			const shareUrls: Record<string, string> = {
				twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
				facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
				linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
				email: `mailto:?subject=${encodedTitle}&body=I thought you might find this mind map interesting: ${encodedUrl}`,
				whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
			};

			if (shareUrls[platform]) {
				window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
			}
		},
		[shareState.shareUrl, shareState.shortUrl]
	);

	const openShareModal = useCallback(() => {
		setShareState(prev => ({ ...prev, isShareOpen: true }));
	}, []);

	const closeShareModal = useCallback(() => {
		setShareState(prev => ({
			...prev,
			isShareOpen: false,
			error: null,
		}));
	}, []);

	const resetShareState = useCallback(() => {
		setShareState({
			isShareOpen: false,
			isCopied: false,
			shortUrl: null,
			isGenerating: false,
			shareId: null,
			shareUrl: null,
			expiresAt: null,
			error: null,
		});
	}, []);

	return {
		...shareState,
		generateShareLink,
		handleCopyLink,
		handleSocialShare,
		openShareModal,
		closeShareModal,
		resetShareState,
	};
};
