'use client'
import Background from "@/components/background";

export default function NotFound() {
  return (
    <>
      <div className="min-h-screen text-gray-100 relative">
        <div className="flex flex-col items-center justify-center h-screen">
          <Background />
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
        </div>
      </div>
    </>
  );
}
