'use client';

import { useState, useRef, useMemo, memo, useCallback } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Copy, QrCode, Check, Download } from "lucide-react";

interface QrCodeButtonProps {
  shortId: string;
}

export default function QrCodeButton({ shortId }: QrCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const url = useMemo(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${baseUrl}/${shortId}`;
  }, [shortId]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }, [url]);

  const downloadQrCode = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(blobUrl);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qr-code.png";
      link.click();
    };

    img.src = blobUrl;
  }, []);

  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 bg hover:bg-gray-800"
          aria-label="Open QR Code dialog"
        >
          <QrCode className="w-5 h-5 text-gray-300 hover:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-[90vw] sm:max-w-md mx-auto flex flex-col items-center gap-4 p-6 bg-gray-900 border border-gray-700 shadow-xl rounded-lg"
        aria-modal="true"
      >
        <DialogTitle className="text-white">Scan QR Code</DialogTitle>
        {isOpen && (
          <div
            ref={qrRef}
            className="bg-white p-2 rounded-lg shadow-lg"
            role="img"
            aria-label={`QR Code linking to ${url}`}
          >
            <MemoizedQRCode value={url} />
          </div>
        )}
        <div className="flex flex-col w-full gap-2">
          <div className="px-6 mt-5 mb-2 flex items-center gap-2 p-2 bg-gray-950 rounded-lg justify-between">
            <span className="text-sm text-gray-300 break-all">{url}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-gray-700 flex items-center justify-center w-8 h-8"
              aria-label="Copy URL to clipboard"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
              )}
            </Button>
          </div>
          <Button
            onClick={downloadQrCode}
            variant="secondary"
            className="w-full flex items-center gap-2"
            aria-label="Download QR Code"
          >
            <Download className="w-4 h-4" /> Download QR Code
          </Button>
        </div>
        <span className="sr-only" role="status">
          {isCopied ? "URL copied to clipboard" : ""}
        </span>
      </DialogContent>
    </Dialog>
  );
}

const MemoizedQRCode = memo(({ value }: { value: string }) => (
  <QRCode value={value} size={180} />
));
