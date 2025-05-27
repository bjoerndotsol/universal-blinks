"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WalletButtons from "../components/WalletButtons";

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

// Function to detect if user is on mobile
function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Function to extract the target URL from the nested URL structure
function extractTargetUrl(url: string): string {
  try {
    // Try to decode first to see if we can extract the actual URL
    const decoded = decodeURIComponent(url);

    // Check if it contains "dial.to/?action="
    const actionPrefix = "dial.to/?action=";
    const prefixIndex = decoded.indexOf(actionPrefix);

    if (prefixIndex >= 0) {
      // Extract the part after "dial.to/?action="
      const startIndex = prefixIndex + actionPrefix.length;
      return decoded.substring(startIndex);
    }

    // If no dial.to prefix found, just return the original URL
    return url;
  } catch (e) {
    // If there's an error decoding, return the original URL
    console.error("Error extracting target URL:", e);
    return url;
  }
}

export default function Home() {
  const searchParams = useSearchParams();
  // Get the raw URL parameter - don't modify it
  const rawUrl = searchParams.get("url") || '';

  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simply construct the direct URL
  const dialToUrl = `https://dial.to/?action=${rawUrl}`;

  // Initialize mobile detection and handle redirection
  useEffect(() => {
    // Check if mobile
    const mobileCheck = isMobileDevice();
    setIsMobile(mobileCheck);
    setIsLoading(false);

    // Redirect desktop users
    if (rawUrl && !mobileCheck) {
      console.log("Desktop user detected, redirecting to dial.to...");
      console.log("Redirect URL:", dialToUrl);
      window.location.href = dialToUrl;
    }
  }, [rawUrl, dialToUrl]);

  // Show loading state while detecting device
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // If no URL parameter, show error message for all users
  if (!rawUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100">
          No URL parameter provided. Add ?url=yourEncodedUrl to the address.
        </p>
      </div>
    );
  }

  // For desktop users, show a message while redirecting
  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <p className="text-blue-500 text-center px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
          Redirecting to dial.to...
        </p>
      </div>
    );
  }

  // Only show wallet buttons on mobile
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">Open with...</h1>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <WalletButtons url={rawUrl} />
        </Suspense>
      </main>
    </div>
  );
}


