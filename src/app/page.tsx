import { Suspense } from "react";
import { Metadata } from "next";
import MobileRedirectHandler from "@/components/MobileRedirectHandler";

// Function to clean URL - remove any "A" prefix if present
function cleanUrl(url: string): string {
  if (url.startsWith('A')) {
    return url.substring(1);
  }
  return url;
}

// Function to fetch metadata from a Solana Action URL
async function fetchActionMetadata(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching action metadata:', error);
    return null;
  }
}

// Generate dynamic metadata based on URL parameter
export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ url?: string }>
}): Promise<Metadata> {
  const params = await searchParams;
  const rawUrl = params.url || '';
  const cleanedUrl = cleanUrl(rawUrl);

  // Default metadata
  let metadata: Metadata = {
    title: "Dial Redirects - Solana Action Handler",
    description: "Handle Solana Actions on mobile devices",
    openGraph: {
      title: "Dial Redirects - Solana Action Handler",
      description: "Handle Solana Actions on mobile devices",
      type: "website",
    },
  };

  if (cleanedUrl) {
    try {
      // Fetch metadata from the Solana Action URL
      const actionData = await fetchActionMetadata(cleanedUrl);

      if (actionData) {
        const title = actionData.title || actionData.label || "Solana Action";
        const description = actionData.description || "Execute this Solana Action";
        const icon = actionData.icon;

        metadata = {
          title: title,
          description: description,
          openGraph: {
            title: title,
            description: description,
            type: "website",
            ...(icon && { images: [{ url: icon, width: 400, height: 400, alt: title }] }),
          },
          twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            ...(icon && { images: [icon] }),
          },
        };
      }
    } catch (error) {
      console.error('Error generating metadata:', error);
      // Fall back to default metadata
    }
  }

  return metadata;
}

// Server component that doesn't directly use useSearchParams
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={
        <div className="text-center">
          <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      }>
        <MobileRedirectHandler />
      </Suspense>
    </div>
  );
}


