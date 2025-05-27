import { Suspense } from "react";
import WalletButtons from "../components/WalletButtons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">Open with...</h1>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <WalletButtons />
        </Suspense>
      </main>
    </div>
  );
}
