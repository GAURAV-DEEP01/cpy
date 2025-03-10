"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Maximize,
  Minimize,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw
} from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
  shortId: string;
  initialHeight?: number;
}

export function ImageViewer({
  imageUrl,
  shortId,
  initialHeight = 600
}: ImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle ESC key to exit fullscreen and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = isFullscreen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleDownload = useCallback(async () => {
    try {
      const sourceUrl = imageUrl;
      const response = await fetch(sourceUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const extension = sourceUrl.split('.').pop() || 'jpg';
      link.download = `${shortId}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  }, [imageUrl, shortId]);

  const handleShare = useCallback(async () => {
    const urlToShare = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shared Image: ${shortId}`,
          url: urlToShare,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(urlToShare);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 1000);
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    }
  }, [shortId]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const rotateImage = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Mobile toolbar
  const MobileToolbar = (
    <div className="flex items-center justify-between bg-gray-800 px-3 py-2">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-sm text-gray-100">Image</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isShared ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isDownloaded ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isFullscreen ? (
            <Minimize className="h-3.5 w-3.5" />
          ) : (
            <Maximize className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );

  // Desktop toolbar
  const DesktopToolbar = (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400">{shortId}</span>
      </div>
      <div className="flex items-center space-x-2">
        {!isFullscreen && (
          <div className="flex items-center mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="mx-1 text-gray-400 text-xs">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rotateImage}
              className="h-8 w-8 p-0 ml-2 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isShared ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span className="ml-2">{isShared ? "Copied!" : "Copy Link"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isDownloaded ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="ml-2">{isDownloaded ? "Downloaded!" : "Download"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
          <span className="ml-2">
            {isFullscreen ? "Exit" : "Expand"}
          </span>
        </Button>
      </div>
    </div>
  );

  // Render image view with adjusted zoom handling
  const renderImageView = () => (
    <div
      className={`bg-gray-900 flex items-center justify-center ${isFullscreen ? 'p-8' : 'p-4'} overflow-hidden`}
      style={{ minHeight: isFullscreen ? 'calc(100vh - 60px)' : `${initialHeight}px` }}
    >
      <div className={`relative ${isFullscreen ? 'max-h-screen' : 'max-h-[600px]'}`}>
        <img
          src={imageUrl}
          alt={`Image ${shortId}`}
          className="max-w-full max-h-full object-contain"
          style={{
            maxHeight: isFullscreen ? 'calc(100vh - 120px)' : '560px',
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-in-out'
          }}
        />
      </div>
    </div>
  );

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col">
        <div className="sticky top-0 z-10">
          {isMobile ? MobileToolbar : DesktopToolbar}
        </div>
        <div className="flex-1 overflow-auto">
          {renderImageView()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Normal view
  return (
    <Card className="overflow-hidden border border-gray-700">
      {isMobile ? MobileToolbar : DesktopToolbar}
      {renderImageView()}
    </Card>
  );
}

