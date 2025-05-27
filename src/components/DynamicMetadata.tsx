"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

// Function to extract API URL from a blink URL parameter
function extractApiUrl(url: string): string | null {
    try {
        if (url.includes('apiUrl=')) {
            const urlObj = new URL(url);
            const apiUrl = urlObj.searchParams.get('apiUrl');
            if (apiUrl) {
                return decodeURIComponent(apiUrl);
            }
        }
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

export default function DynamicMetadata() {
    const searchParams = useSearchParams();
    const urlParam = searchParams.get("url") || '';
    const [metadata, setMetadata] = useState<{ title: string; description: string; image: string; siteName: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlinkMetadata() {
            if (!urlParam) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Extract the actual API URL if it's wrapped
                const apiUrl = extractApiUrl(urlParam);
                if (!apiUrl) {
                    setLoading(false);
                    return;
                }

                // Make the API call to fetch the blink metadata
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch blink metadata: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched blink data:", data);

                // Flexibly extract metadata from the response
                const extractedMetadata = extractMetadata(data);
                setMetadata(extractedMetadata);
            } catch (err) {
                console.error("Error fetching blink metadata:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchBlinkMetadata();
    }, [urlParam]);

    // For Next.js App Router, we can't use <Head> component
    // Instead, we'll use a client-side script to inject meta tags
    return (
        <>
            {!loading && metadata && (
                <Script id="dynamic-metadata" strategy="afterInteractive">
                    {`
                    // Update metadata dynamically
                    document.title = ${JSON.stringify(metadata.title)};
                    
                    // Update meta tags function
                    function updateMetaTag(property, content) {
                      let meta = document.querySelector(\`meta[\${property.includes(':') ? 'property' : 'name'}="\${property}"]\`);
                      if (!meta) {
                        meta = document.createElement('meta');
                        if (property.includes(':')) {
                          meta.setAttribute('property', property);
                        } else {
                          meta.setAttribute('name', property);
                        }
                        document.head.appendChild(meta);
                      }
                      meta.setAttribute('content', content);
                    }
                    
                    // Primary Meta Tags
                    updateMetaTag('description', ${JSON.stringify(metadata.description)});
                    
                    // Open Graph
                    updateMetaTag('og:type', 'website');
                    updateMetaTag('og:title', ${JSON.stringify(metadata.title)});
                    updateMetaTag('og:description', ${JSON.stringify(metadata.description)});
                    updateMetaTag('og:image', ${JSON.stringify(metadata.image)});
                    updateMetaTag('og:site_name', ${JSON.stringify(metadata.siteName)});
                    
                    // Twitter
                    updateMetaTag('twitter:card', 'summary_large_image');
                    updateMetaTag('twitter:title', ${JSON.stringify(metadata.title)});
                    updateMetaTag('twitter:description', ${JSON.stringify(metadata.description)});
                    updateMetaTag('twitter:image', ${JSON.stringify(metadata.image)});
                    `}
                </Script>
            )}
        </>
    );
} 