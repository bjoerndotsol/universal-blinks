"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

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

export default function Home() {
  const searchParams = useSearchParams();
  const url = ensureEncoded(searchParams.get("url") || '');
  const intersitial = ensureEncoded('https://dial.to/?action=');
  const ref = ensureEncoded('https://dial.to');

  const phantomUrl = `https://phantom.app/ul/browse/${intersitial}${url}?ref=${ref}`;

  console.log({ phantomUrl });

  // Function to handle opening with different wallets
  const openWithWallet = (walletType: string) => {
    if (!url) {
      console.error("No URL provided");
      return;
    }

    // The URL is already encoded from the query parameter, so we use it directly
    if (walletType === "phantom") {
      // Phantom specific handling
      window.location.href = `https://phantom.app/ul/browse/${intersitial}${url}?ref=${ref}`;
    } else if (walletType === "solflare") {
      // Solflare specific handling
      window.location.href = `https://solflare.com/ul/browse/${intersitial}${url}?ref=${ref}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">Open with...</h1>

        {url ? (
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
        ) : (
          <p className="text-red-500 text-center px-4 py-3 bg-red-50 rounded-lg border border-red-100">No URL parameter provided. Add ?url=yourEncodedUrl to the address.</p>
        )}
      </main>
    </div>
  );
}
