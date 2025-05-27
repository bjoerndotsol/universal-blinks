"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

interface BlinkMetadata {
    type?: string;
    icon?: string;
    label?: string;
    title?: string;
    description?: string;
    preview?: {
        title?: string;
        description?: string;
        image?: string;
    };
    context?: {
        provider?: {
            name?: string;
            icon?: string;
        };
        category?: string;
        websiteUrl?: string;
    };
}

interface BlinkMetadataProps {
    url?: string;
}

export default function BlinkMetadata({ url }: BlinkMetadataProps) {
    const [metadata, setMetadata] = useState<BlinkMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlinkMetadata() {
            if (!url) {
                setLoading(false);
                setError("No URL provided");
                return;
            }

            try {
                setLoading(true);

                // Make the API call to fetch the blink metadata
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch blink metadata: ${response.status}`);
                }

                const data = await response.json();
                setMetadata(data);

                console.log("Fetched blink metadata:", data);
            } catch (err) {
                console.error("Error fetching blink metadata:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch blink metadata");
            } finally {
                setLoading(false);
            }
        }

        fetchBlinkMetadata();
    }, [url]);

    // Extract the relevant OG data
    const title = metadata?.title || metadata?.preview?.title || "Dial.to Blink";
    const description = metadata?.description || metadata?.preview?.description || "Open this link with a Solana wallet";
    const image = metadata?.icon || metadata?.preview?.image || "https://dial.to/dial-icon.png"; // Fallback to dial.to icon
    const siteName = metadata?.context?.provider?.name || "Dial.to";

    // If we're still loading or hit an error, don't render meta tags yet
    if (loading) return null;

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:site_name" content={siteName} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
                <meta property="twitter:image" content={image} />
            </Head>
            {/* No visible content - this component only adds meta tags */}
        </>
    );
} 