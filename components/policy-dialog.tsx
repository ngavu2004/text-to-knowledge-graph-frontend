'use client';

import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface PolicyDialogProps {
	isOpen: boolean;
	onAccept: () => void;
}

export const PolicyDialog: React.FC<PolicyDialogProps> = ({
	isOpen,
	onAccept,
}) => {
	const [agreedToPolicy, setAgreedToPolicy] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	const canAccept = agreedToPolicy && agreedToTerms;

	const handleAccept = () => {
		if (canAccept) {
			onAccept();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={() => {}} modal>
			<DialogContent
				className="sm:max-w-md border-emerald-200 shadow-2xl"
				showCloseButton={false}
				onEscapeKeyDown={e => e.preventDefault()}
				onPointerDownOutside={e => e.preventDefault()}
				onInteractOutside={e => e.preventDefault()}
			>
				<DialogHeader className="space-y-4">
					<div className="flex items-center justify-center">
						<div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
							<Shield className="w-8 h-8 text-emerald-600" />
						</div>
					</div>

					<DialogTitle className="text-center text-xl font-bold text-gray-900">
						Welcome to Mind Graph!
					</DialogTitle>

					<DialogDescription className="text-center text-gray-600">
						Before you begin creating mind maps, please review and accept our
						policies.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Important Notice */}
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-amber-800">
								<p className="font-medium mb-1">Required for Access</p>
								<p>
									You must accept both policies to use Mind Graph and create
									mind maps.
								</p>
							</div>
						</div>
					</div>

					{/* Policy Information */}
					<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-emerald-800">
								<p className="font-medium mb-1">Your Privacy Matters</p>
								<p>
									We protect your data and respect your privacy. Learn exactly
									how we handle your information.
								</p>
							</div>
						</div>
					</div>

					{/* Checkboxes */}
					<div className="space-y-4">
						<div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
							<Checkbox
								id="privacy-policy"
								checked={agreedToPolicy}
								onCheckedChange={checked =>
									setAgreedToPolicy(checked as boolean)
								}
								className="mt-1"
							/>
							<div className="flex-1">
								<Label
									htmlFor="privacy-policy"
									className="text-sm font-medium text-gray-900 cursor-pointer block"
								>
									I have read and agree to the{' '}
									<Link
										href="/policy?tab=privacy"
										className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center"
										target="_blank"
									>
										Privacy Policy
										<ExternalLink className="w-3 h-3 ml-1" />
									</Link>
								</Label>
								<p className="text-xs text-gray-500 mt-1">
									Learn how we collect, use, and protect your personal
									information.
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
							<Checkbox
								id="terms-service"
								checked={agreedToTerms}
								onCheckedChange={checked =>
									setAgreedToTerms(checked as boolean)
								}
								className="mt-1"
							/>
							<div className="flex-1">
								<Label
									htmlFor="terms-service"
									className="text-sm font-medium text-gray-900 cursor-pointer block"
								>
									I have read and agree to the{' '}
									<Link
										href="/policy?tab=terms"
										className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center"
										target="_blank"
									>
										Terms of Service
										<ExternalLink className="w-3 h-3 ml-1" />
									</Link>
								</Label>
								<p className="text-xs text-gray-500 mt-1">
									Understand the rules and guidelines for using our service.
								</p>
							</div>
						</div>
					</div>

					{/* Action Button */}
					<div className="pt-4">
						<Button
							onClick={handleAccept}
							disabled={!canAccept}
							className={`w-full py-3 text-base font-semibold transition-all duration-200 ${
								canAccept
									? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
									: 'bg-gray-100 text-gray-400 cursor-not-allowed'
							}`}
							size="lg"
						>
							{canAccept ? 'Accept & Continue' : 'Please Accept Both Policies'}
						</Button>
					</div>

					{/* Footer */}
					<div className="text-center">
						<p className="text-xs text-gray-500">
							By continuing, you confirm that you are at least 13 years old and
							agree to our policies.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
