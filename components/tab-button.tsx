'use client'

import { TabsTrigger } from "@/components/ui/tabs";

export function TabButton({ value, icon, label, activeColorClass = "text-purple-400" }: { value: string, icon: any, label: string, activeColorClass: string }) {
  return (
    <TabsTrigger
      value={value}
      className={`data-[state=active]:bg-gray-900 data-[state=active]:${activeColorClass}`}
    >
      {icon}
      {label}
    </TabsTrigger>
  );
}
