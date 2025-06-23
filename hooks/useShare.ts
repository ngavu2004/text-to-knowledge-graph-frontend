'use client';
import { useState, useCallback } from 'react';
import { GeneratedMindMap, ShareState } from '../types/mindmap';

export const useShare = () => {
	const [shareState, setShareState] = useState<ShareState>({
		isShareOpen: false,
		isCopied: false,
		shortUrl: null,
	});

	const handleCopyLink = useCallback(
		async (generatedMindMap: GeneratedMindMap) => {
			const urlToCopy = shareState.shortUrl || generatedMindMap.shareUrl;
			try {
				await navigator.clipboard.writeText(urlToCopy);
				setShareState(prev => ({ ...prev, isCopied: true }));
				setTimeout(
					() => setShareState(prev => ({ ...prev, isCopied: false })),
					2000
				);
			} catch (err) {
				console.error('Failed to copy link:', err);
			}
		},
		[shareState.shortUrl]
	);

	const handleSocialShare = useCallback(
		(platform: string, generatedMindMap: GeneratedMindMap) => {
			const url = shareState.shortUrl || generatedMindMap.shareUrl;
			const encodedUrl = encodeURIComponent(url);
			const encodedTitle = encodeURIComponent(
				`Check out my mind map: ${generatedMindMap.title}`
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
		[shareState.shortUrl]
	);

	const openShareModal = useCallback(() => {
		setShareState(prev => ({ ...prev, isShareOpen: true }));
	}, []);

	const closeShareModal = useCallback(() => {
		setShareState(prev => ({ ...prev, isShareOpen: false }));
	}, []);

	return {
		...shareState,
		handleCopyLink,
		handleSocialShare,
		openShareModal,
		closeShareModal,
	};
};
