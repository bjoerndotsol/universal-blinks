"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WalletButtons from "./WalletButtons";

// Function to detect if user is on mobile
function isMobileDevice() {
    if (typeof window === 'undefined') return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

// Function to clean URL - remove any "A" prefix if present
function cleanUrl(url: string): string {
    if (url.startsWith('A')) {
        return url.substring(1);
    }
    return url;
}

export default function MobileRedirectHandler() {
    const searchParams = useSearchParams();
    // Get the raw URL parameter
    const rawUrl = searchParams.get("url") || '';

    // Clean the URL by removing any "A" prefix
    const cleanedUrl = cleanUrl(rawUrl);

    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Construct the direct URL with the cleaned URL
    const dialToUrl = `https://dial.to/?action=${cleanedUrl}`;

    // Initialize mobile detection and handle redirection
    useEffect(() => {
        // Check if mobile
        const mobileCheck = isMobileDevice();
        setIsMobile(mobileCheck);
        setIsLoading(false);

        // Redirect desktop users
        if (cleanedUrl && !mobileCheck) {
            console.log("Desktop user detected, redirecting to dial.to...");
            console.log("Original URL:", rawUrl);
            console.log("Cleaned URL:", cleanedUrl);
            console.log("Redirect URL:", dialToUrl);
            window.location.href = dialToUrl;
        }
    }, [cleanedUrl, dialToUrl, rawUrl]);

    // Show loading state while detecting device
    if (isLoading) {
        return (
            <div className="text-center">Loading...</div>
        );
    }

    // If no URL parameter, show error message for all users
    if (!cleanedUrl) {
        return (
            <div className="max-w-md w-full mx-auto">
                <p className="text-red-500 text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100">
                    No URL parameter provided. Add ?url=yourEncodedUrl to the address.
                </p>
            </div>
        );
    }

    // For desktop users, show a message while redirecting
    if (!isMobile) {
        return (
            <div className="max-w-md w-full mx-auto">
                <p className="text-blue-500 text-center px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                    Redirecting to dial.to...
                </p>
            </div>
        );
    }

    // Only show wallet buttons on mobile
    return (
        <main className="flex flex-col items-center gap-8 max-w-md w-full">
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">Open with...</h1>
            <WalletButtons url={cleanedUrl} />
        </main>
    );
} 