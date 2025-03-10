'use client';
import Link from "next/link";
import Background from "@/components/background";

export default function NotFound() {
  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center px-6 py-8">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Oops, we couldn&apos;t find the page or content you are looking for.
          </p>
          <Link
            href="/"
            className="rounded-lg bg-gradient-to-r from-purple-300/70 to-cyan-500 px-6 py-4 text-lg font-medium text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}

