'use client'
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/ui/footer";
import { CodeForm } from '@/components/code/form'
import { LinkForm } from "@/components/link/form";
import { ImageForm } from "@/components/image/form";
import { Background } from "@/components/ui/background";
import { RedirectForm } from "@/components/redirect-form";
import { RecentLinks } from "@/components/recent-links";
import { FeatureCards } from "@/components/feature-cards";

export interface RecentLinkData {
  shortId: string;
  type: string;
  timestamp?: string;
}

export type RecentLinksArr = Array<RecentLinkData>;
export type HandleLinkGenerated = ({ shortId, type }: RecentLinkData) => void;

export default function Home() {
  const [_generatedLink, setGeneratedLink] = useState("");
  const [recentLinks, setRecentLinks]: [RecentLinksArr, any] = useState([]);

  useEffect(() => {
    const storedLinks = localStorage.getItem('recentLinks');
    if (storedLinks) {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      const filteredLinks = JSON.parse(storedLinks).filter((link: any) => {
        const linkTime = new Date(link.timestamp).getTime();
        return now - linkTime < oneDay;
      });

      setRecentLinks(filteredLinks);
      localStorage.setItem('recentLinks', JSON.stringify(filteredLinks));
    }
  }, []);

  const handleLinkGenerated: HandleLinkGenerated = ({ shortId, type }: { shortId: string, type: string }) => {
    setGeneratedLink(shortId);

    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const validLinks = recentLinks.filter(link => {
      return (now - new Date(link.timestamp as string).getTime()) < twentyFourHours;
    });

    const updatedLinks: RecentLinksArr = [
      { shortId, type, timestamp: new Date().toISOString() },
      ...validLinks.filter(link => link.shortId !== shortId)
    ].slice(0, 4);

    setRecentLinks(updatedLinks);
    localStorage.setItem('recentLinks', JSON.stringify(updatedLinks));
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100 relative">
      <Background />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-900/30 via-indigo-900/20 to-transparent" />

      <div className="container relative mx-auto px-4 py-16">
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

        <div className="mx-auto mt-12 w-full max-w-4xl rounded-xl bg-gray-800/50 p-1 sm:p-4 backdrop-blur-sm">
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
              <CodeForm onLinkGenerated={handleLinkGenerated} />
            </TabsContent>
            <TabsContent value="link" className="mt-6">
              <LinkForm onLinkGenerated={handleLinkGenerated} />
            </TabsContent>
            <TabsContent value="image" className="mt-6">
              <ImageForm onLinkGenerated={handleLinkGenerated} />
            </TabsContent>
          </Tabs>
        </div>

        <RecentLinks recent={recentLinks} />

        <FeatureCards />
        <Footer />
      </div>
    </div>
  );
}
