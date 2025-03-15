'use client'

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

export function TabSection({ defaultTab, children, tabButtons }: any) {
  return (
    <div className="mx-auto mt-12 w-full max-w-4xl rounded-xl bg-gray-800/50 p-4 sm:p-4 lg:p-4 backdrop-blur-sm">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-800">
          {tabButtons}
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
