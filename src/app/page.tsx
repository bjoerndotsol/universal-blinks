import { Suspense } from "react";
import MobileRedirectHandler from "@/components/MobileRedirectHandler";
import { Metadata, ResolvingMetadata } from "next/types";

// Server-side metadata generation
export async function generateMetadata(
  { params, searchParams }: { params: {}; searchParams: { url?: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get the URL parameter
  const url = searchParams.url || '';

  // Clean URL - remove "A" prefix if present
  const cleanUrl = url.startsWith('A') ? url.substring(1) : url;

  // Default metadata
  let metadata: Metadata = {
    title: "Dial.to Blink",
    description: "Open this link with a Solana wallet",
    openGraph: {
      title: "Dial.to Blink",
      description: "Open this link with a Solana wallet",
      images: ["https://dial.to/dial-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dial.to Blink",
      description: "Open this link with a Solana wallet",
      images: ["https://dial.to/dial-icon.png"],
    }
  };

  // If we have a URL, try to extract metadata from it
  if (cleanUrl) {
    try {
      // Extract API URL if present
      let apiUrl = cleanUrl;
      if (cleanUrl.includes('apiUrl=')) {
        const urlObj = new URL(cleanUrl);
        const extractedApiUrl = urlObj.searchParams.get('apiUrl');
        if (extractedApiUrl) {
          apiUrl = decodeURIComponent(extractedApiUrl);
        }
      }

      // Fetch metadata from API
      const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
      if (response.ok) {
        const data = await response.json();

        // Extract metadata flexibly from the response
        let title = "Dial.to Blink";
        let description = "Open this link with a Solana wallet";
        let image = "https://dial.to/dial-icon.png";

        // Extract title
        if (typeof data.title === 'string') {
          title = data.title;
        } else if (data.preview?.title) {
          title = data.preview.title;
        } else if (data.label) {
          title = data.label;
        }

        // Extract description
        if (typeof data.description === 'string') {
          description = data.description;
        } else if (data.preview?.description) {
          description = data.preview.description;
        }

        // Extract image
        if (typeof data.icon === 'string') {
          image = data.icon;
        } else if (data.preview?.image) {
          image = data.preview.image;
        } else if (data.context?.provider?.icon) {
          image = data.context.provider.icon;
        }

        // Update metadata with extracted values
        metadata = {
          title,
          description,
          openGraph: {
            title,
            description,
            images: [image],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
          }
        };
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
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


