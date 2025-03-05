"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

interface ImageViewerProps {
  imageUrl: string
  shortId: string
}

export function ImageViewer({ imageUrl, shortId }: ImageViewerProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Set a filename for the download (modify the extension if needed)
      link.download = `${shortId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const handleShare = async () => {
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shared Image: ${shortId}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to copying the URL
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2">
        <span className="text-sm font-medium">Shared Image</span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="ml-2">Share</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="ml-2">Download</span>
          </Button>
        </div>
      </div>
      <div className="relative flex items-center justify-center bg-black/5 p-4">
        <div className="relative max-h-[600px] max-w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`Shared image ${shortId}`}
            width={800}
            height={600}
            className="max-h-[600px] object-contain"
          />
        </div>
      </div>
    </Card>
  )
}

