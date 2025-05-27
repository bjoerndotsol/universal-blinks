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

// Function to extract API URL from a blink URL
function extractApiUrl(url: string): string | null {
    // Handle URLs with apiUrl parameter
    try {
        if (url.includes('apiUrl=')) {
            // Extract the apiUrl parameter
            const urlObj = new URL(url);
            const apiUrl = urlObj.searchParams.get('apiUrl');
            if (apiUrl) {
                return decodeURIComponent(apiUrl);
            }
        }
        // Return the original URL if no apiUrl parameter
        return url;
    } catch (e) {
        console.error('Error extracting API URL:', e);
        return null;
    }
}

// Function to flexibly extract metadata from any response structure
function extractMetadata(data: any) {
    // Initialize with default values
    const metadata = {
        title: "Dial.to Blink",
        description: "Open this link with a Solana wallet",
        image: "https://dial.to/dial-icon.png",
        siteName: "Dial.to"
    };

    // Try to extract title from various possible locations
    if (typeof data.title === 'string') {
        metadata.title = data.title;
    } else if (data.preview?.title) {
        metadata.title = data.preview.title;
    } else if (data.label) {
        metadata.title = data.label;
    }

    // Try to extract description
    if (typeof data.description === 'string') {
        metadata.description = data.description;
    } else if (data.preview?.description) {
        metadata.description = data.preview.description;
    }

    // Try to extract image
    if (typeof data.icon === 'string') {
        metadata.image = data.icon;
    } else if (data.preview?.image) {
        metadata.image = data.preview.image;
    } else if (data.context?.provider?.icon) {
        metadata.image = data.context.provider.icon;
    }

    // Try to extract site name
    if (data.context?.provider?.name) {
        metadata.siteName = data.context.provider.name;
    }

    return metadata;
}

export default function MobileRedirectHandler() {
    const searchParams = useSearchParams();
    // Get the raw URL parameter
    const rawUrl = searchParams.get("url") || '';

    // Clean the URL by removing any "A" prefix
    const cleanedUrl = cleanUrl(rawUrl);

    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState<{
        title: string;
        description: string;
        image: string;
        siteName: string;
    } | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(true);

    // Construct the direct URL with the cleaned URL
    const dialToUrl = `https://dial.to/?action=${cleanedUrl}`;

    // Fetch metadata if available
    useEffect(() => {
        async function fetchMetadata() {
            if (!cleanedUrl) {
                setMetadataLoading(false);
                return;
            }

            try {
                // Try to extract the API URL if it's a blink URL
                const apiUrl = extractApiUrl(cleanedUrl);
                if (!apiUrl) {
                    setMetadataLoading(false);
                    return;
                }

                // Fetch the metadata
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched blink data:", data);

                // Flexibly extract metadata
                const extractedMetadata = extractMetadata(data);
                setMetadata(extractedMetadata);
            } catch (error) {
                console.error("Error fetching metadata:", error);
            } finally {
                setMetadataLoading(false);
            }
        }

        fetchMetadata();
    }, [cleanedUrl]);

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
            {!metadataLoading && metadata && (
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                        {metadata.title}
                    </h1>
                    {metadata.description && (
                        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
                            {metadata.description}
                        </p>
                    )}
                    {metadata.image && (
                        <div className="flex justify-center mt-4">
                            <img
                                src={metadata.image}
                                alt="Blink icon"
                                className="w-16 h-16 rounded-lg"
                            />
                        </div>
                    )}
                </div>
            )}

            <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">Open with...</h1>
            <WalletButtons url={cleanedUrl} />
        </main>
    );
} 