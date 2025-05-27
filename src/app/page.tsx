import { Suspense } from "react";
import MobileRedirectHandler from "@/components/MobileRedirectHandler";

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


