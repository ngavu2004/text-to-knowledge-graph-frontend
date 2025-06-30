'use client';
import { useState, useCallback } from 'react';
import { MindMapData, ShareState } from '../types/mindmap';
import { mindmapApi } from '../lib/api/llm';

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
				const shareResponse = await mindmapApi.generateShareLink(
					fileId,
					graphData
				);

				setShareState(prev => ({
					...prev,
					isGenerating: false,
					shareId: shareResponse.share_id,
					shareUrl: shareResponse.share_url,
					shortUrl: shareResponse.share_url,
					expiresAt: shareResponse.expires_at,
				}));

				return shareResponse.share_url;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Failed to generate share link';
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
