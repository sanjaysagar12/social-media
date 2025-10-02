'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('access_token', token);
            router.push('/explore');
        } else {
            router.push('/auth/login');
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl px-10 py-10 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h2>
                    <p className="text-gray-600 mb-4">Please wait while we authenticate your account.</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        Secure authentication in progress
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl px-10 py-10 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
                    <p className="text-gray-600">Preparing your authentication session.</p>
                </div>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}