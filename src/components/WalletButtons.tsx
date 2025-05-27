"use client";

import { useSearchParams } from "next/navigation";

// Helper function to ensure URL is properly encoded
function ensureEncoded(url: string): string {
    if (!url) return url;

    // Try to determine if the URL is already encoded
    // If the URL contains % followed by two hex digits, it's likely encoded
    const hasEncodedChars = /%[0-9A-F]{2}/i.test(url);

    if (!hasEncodedChars) {
        // URL doesn't appear to be encoded, so encode it
        return encodeURIComponent(url);
    }

    try {
        // For URLs that appear encoded but might be partially encoded
        // Decode and re-encode to ensure complete encoding
        const decoded = decodeURIComponent(url);
        const reEncoded = encodeURIComponent(decoded);

        // If re-encoding changes the URL, it wasn't fully encoded
        if (reEncoded !== url) {
            return reEncoded;
        }
    } catch (e) {
        // If decoding fails, the URL might have unencoded % characters
        // Just encode the whole thing to be safe
        return encodeURIComponent(url);
    }

    // URL was already properly encoded
    return url;
}

// Function to clean URL - remove any "A" prefix if present
function cleanUrl(url: string): string {
    if (url.startsWith('A')) {
        return url.substring(1);
    }
    return url;
}

interface WalletButtonsProps {
    url?: string;
}

export default function WalletButtons({ url: propUrl }: WalletButtonsProps) {
    // Use the URL from props if provided, otherwise get it from search params
    const searchParams = useSearchParams();
    const rawUrl = propUrl || searchParams.get("url") || '';

    // Clean the URL by removing any "A" prefix
    const cleanedUrl = cleanUrl(rawUrl);

    // For mobile wallet apps, we need to construct URLs very carefully

    // The ref parameter should be encoded
    const ref = encodeURIComponent('https://dial.to');

    // Create the dial.to interstitial prefix
    const interstitialPrefix = 'https://dial.to/?action=solana-action:';

    // Construct the full URL with interstitial for mobile wallets
    const fullUrl = interstitialPrefix + cleanedUrl;

    // Encode the full URL for use in wallet deep links
    const encodedFullUrl = encodeURIComponent(fullUrl);

    // Construct the final URLs for wallet deep links
    const phantomUrl = `https://phantom.app/ul/browse/${encodedFullUrl}?ref=${ref}`;
    const solflareUrl = `https://solflare.com/ul/browse/${encodedFullUrl}?ref=${ref}`;

    console.log("Raw URL:", rawUrl);
    console.log("Cleaned URL:", cleanedUrl);
    console.log("Full URL with interstitial:", fullUrl);
    console.log("Encoded full URL:", encodedFullUrl);
    console.log("Phantom URL:", phantomUrl);
    console.log("Solflare URL:", solflareUrl);

    // Function to handle opening with different wallets
    const openWithWallet = (walletType: string) => {
        if (!cleanedUrl) {
            console.error("No URL provided");
            return;
        }

        // Open the appropriate wallet URL
        if (walletType === "phantom") {
            window.location.href = phantomUrl;
        } else if (walletType === "solflare") {
            window.location.href = solflareUrl;
        }
    };

    if (!cleanedUrl) {
        return (
            <p className="text-red-500 text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100">
                No URL parameter provided. Add ?url=yourEncodedUrl to the address.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <button
                onClick={() => openWithWallet("phantom")}
                className="flex items-center justify-center gap-3 rounded-lg bg-white text-black border border-gray-200 font-medium px-6 py-4 w-full hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
                <img
                    src="https://cdn.brandfetch.io/id_HKIytUb/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                    alt="Phantom logo"
                    width={24}
                    height={24}
                />
                <span>Phantom</span>
            </button>

            <button
                onClick={() => openWithWallet("solflare")}
                className="flex items-center justify-center gap-3 rounded-lg bg-white text-black border border-gray-200 font-medium px-6 py-4 w-full hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
                <img
                    src="https://cdn.brandfetch.io/idtkbbbh-o/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                    alt="Solflare logo"
                    width={24}
                    height={24}
                />
                <span>Solflare</span>
            </button>
        </div>
    );
} 