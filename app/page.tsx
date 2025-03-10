
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeForm } from "@/components/code-form";
import { LinkForm } from "@/components/link-form";
import { ImageForm } from "@/components/image-form";
import Background from "../components/background"; // Adjust the import path as needed
import { RedirectForm } from "@/components/redirect-form";

export default function Home() {
  return (
    <div className="min-h-screen text-gray-100 relative">
      <Background />
      {/* Gradient header background */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-900/30 via-indigo-900/20 to-transparent" />

      {/* Content */}
      <div className="container relative mx-auto px-4 py-16">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            cpy.
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              deeeep
            </span>
            .fun
          </h1>
          <p className="max-w-[600px] text-gray-400">
            Share code snippets, links, and images with short url.
          </p>
        </div>

        <div className="container relative mx-auto pt-12">
          <RedirectForm />
        </div>
        {/* Tabs section */}
        <div className="mx-auto mt-12 w-full max-w-4xl rounded-xl bg-gray-800/50 p-4 sm:p-4 lg:p-4 backdrop-blur-sm">
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-800">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-purple-400"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </TabsTrigger>
              <TabsTrigger
                value="link"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-cyan-400"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                </svg>
                Link
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-400"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="mt-6">
              <CodeForm />
            </TabsContent>
            <TabsContent value="link" className="mt-6">
              <LinkForm />
            </TabsContent>
            <TabsContent value="image" className="mt-6">
              <ImageForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature highlights in grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-gray-800/90 p-6 transition-all hover:bg-gray-800">
            <div className="mb-4 rounded-full bg-violet-900/30 p-3 w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Lightning Fast</h3>
            <p className="mt-2 text-gray-400">Generate and share content in seconds with our optimized platform.</p>
          </div>

          <div className="rounded-lg bg-gray-800/80 p-6 transition-all hover:bg-gray-800">
            <div className="mb-4 rounded-full bg-cyan-900/30 p-3 w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Content available up to 24 hrs</h3>
            <p className="mt-2 text-gray-400">Your content is available for 24 hours and will be discarded.</p>
          </div>

          <div className="rounded-lg bg-gray-800/80 p-6 transition-all hover:bg-gray-800 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 rounded-full bg-emerald-900/30 p-3 w-12 h-12 flex items-center justify-center">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Multiple Formats</h3>
            <p className="mt-2 text-gray-400">Share code, links, and images - all with the same simple interface.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p className="text-white">© 2025 deeeep.fun All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

