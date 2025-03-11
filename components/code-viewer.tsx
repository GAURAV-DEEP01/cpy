"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  Code,
  Expand,
  Minimize,
  X,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeContentProps {
  code: string;
  language: string;
  fontSize: number;
  codeHeight: number;
  isFullscreen: boolean;
}

const CodeContent = memo(({
  code,
  language,
  fontSize,
  codeHeight,
  isFullscreen,
}: CodeContentProps) => {
  const customStyle = {
    margin: 0,
    borderRadius: 0,
    fontSize: `${fontSize}px`,
    backgroundColor: "#0f1118",
    height: isFullscreen ? "calc(100vh - 60px)" : `${codeHeight}px`,
    maxHeight: "none",
    transition: "height 0.3s ease",
  };

  const lineCount = code.split("\n").length;
  const chars = lineCount.toString().length;
  const lineNumberStyle = {
    minWidth: `${chars * 10 + 30}px`,
    paddingRight: "8px",
    textAlign: "right" as const,
  };

  return (
    <div className="custom-scrollbar">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines={true}
        customStyle={customStyle}
        lineNumberStyle={lineNumberStyle}
        codeTagProps={{
          style: {
            fontFamily:
              "JetBrains Mono, Menlo, Monaco, Consolas, 'Courier New', monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
      <style jsx>{`
        .custom-scrollbar {
          overflow: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #000;
          border-radius: 10px;
          border: 2px solid #000;
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #000 #000;
        }
      `}</style>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.code === nextProps.code &&
    prevProps.language === nextProps.language &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.isFullscreen === nextProps.isFullscreen &&
    prevProps.codeHeight === nextProps.codeHeight
  );
});

CodeContent.displayName = 'CodeContent';

interface CodeViewerProps {
  code: string;
  language: string;
  shortId: string;
  initialHeight?: number;
}

export function CodeViewer({
  code,
  language,
  shortId,
  initialHeight = 400,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const codeHeight = initialHeight;
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy:", error);
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        // just for legecy dont worry 
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy method failed:", err);
      }
      document.body.removeChild(textArea);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const extensionMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      csharp: "cs",
      cpp: "cpp",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
      html: "html",
      css: "css",
      sql: "sql",
      jsx: "jsx",
      tsx: "tsx",
      markdown: "md",
      yaml: "yml",
      json: "json",
      xml: "xml",
      bash: "sh",
      powershell: "ps1",
      dockerfile: "dockerfile",
    };

    const extension = extensionMap[language.toLowerCase()] || "txt";
    element.download = `${shortId}.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [code, language, shortId]);

  // Font size handlers
  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(prev + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(prev - 2, 10));
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Memoize line count calculation
  const lineCount = useMemo(() => code.split("\n").length, [code]);

  // Mobile toolbar - memoized
  const MobileToolbar = useMemo(() => (
    <div className="flex items-center justify-between bg-gray-800 px-3 py-2">
      <div className="flex items-center space-x-2">
        <Code className="h-4 w-4 text-purple-400" />
        <span className="font-medium text-sm text-gray-100">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Download className="h-3.5 w-3.5" />
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
            <Expand className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  ), [language, handleCopy, handleDownload, toggleFullscreen, copied, isFullscreen]);

  // Desktop toolbar - memoized
  const DesktopToolbar = useMemo(() => (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
      <div className="flex items-center space-x-3">
        <Code className="h-5 w-5 text-purple-400" />
        <span className="font-medium text-gray-100">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <span className="text-sm text-gray-400">
          {lineCount} lines
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <span className="text-lg font-bold">A-</span>
          </Button>
          <span className="mx-1 text-gray-400 text-xs">{fontSize}px</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <span className="text-lg font-bold">A+</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          <span className="ml-2">Download</span>
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
            <Expand className="h-4 w-4" />
          )}
          <span className="ml-2">
            {isFullscreen ? "Exit" : "Expand"}
          </span>
        </Button>
      </div>
    </div>
  ), [language, lineCount, fontSize, decreaseFontSize, increaseFontSize, handleCopy, handleDownload, toggleFullscreen, copied, isFullscreen]);

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col">
        <div className="sticky top-0 z-10">
          {isMobile ? MobileToolbar : DesktopToolbar}
        </div>
        <div className="flex-1 overflow-auto">
          <CodeContent
            code={code}
            language={language}
            fontSize={fontSize}
            codeHeight={codeHeight}
            isFullscreen={isFullscreen}
          />
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
    <Card className="overflow-hidden border border-gray-700" ref={containerRef}>
      {isMobile ? MobileToolbar : DesktopToolbar}
      <div className="overflow-hidden">
        <CodeContent
          code={code}
          language={language}
          fontSize={fontSize}
          codeHeight={codeHeight}
          isFullscreen={isFullscreen}
        />
      </div>
    </Card>
  );
}
