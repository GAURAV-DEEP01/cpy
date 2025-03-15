'use client'

import React from "react";
import { Icons } from "@/components/ui/icons";
import { RecentLinksArr } from "@/app/page";

interface RecentLinksProps {
  recent: RecentLinksArr;
}

const formatTime = (timestamp: string): string => {
  const timeDiff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  if (timeDiff < 60) {
    return "just now";
  }

  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const iconMapping: Record<"code" | "img" | "link", React.FC<{ className?: string }>> = {
  code: Icons.Code,
  img: Icons.Image,
  link: Icons.Link,
};


export const RecentLinks: React.FC<RecentLinksProps> = ({ recent }) => {
  return (
    <section className="mx-auto mt-16 mb-8 w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Recent Shares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm border border-gray-700/50">
        {recent.map((item) => {
          const IconComponent =
            iconMapping[item.type as keyof typeof iconMapping] || Icons.Link;
          return (
            <a
              key={item.shortId}
              href={`/${item.shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 rounded-lg bg-gray-700/70 hover:bg-gray-600 transition-all duration-300 group border border-gray-600/30 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-900/10"
            >
              <div className="rounded-lg bg-indigo-900/50 w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 group-hover:bg-indigo-800/50 transition-colors">
                <IconComponent className="text-indigo-400 group-hover:text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0 text-center">
                <p className="truncate text-indigo-300 font-mono font-extrabold text-xl md:text-2xl block w-full">
                  {item.shortId}
                </p>
                <p className="text-xs text-gray-400">{formatTime(item.timestamp as string)}</p>
              </div>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-indigo-900/70 px-3 py-1 rounded-full text-xs font-medium text-indigo-200 hover:bg-indigo-800">
                  Visit
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
