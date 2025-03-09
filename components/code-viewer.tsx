"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Code, Expand, Minimize, X } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeViewerProps {
  code: string
  language: string
  shortId: string
}

export function CodeViewer({ code, language, shortId }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  // Handle copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle file download with appropriate extension
  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)

    // Map language to file extension
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
    }

    const extension = extensionMap[language.toLowerCase()] || "txt"
    element.download = `${shortId}.${extension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Prevent scrolling on body when fullscreen is active
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2)
    }
  }

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 10) {
      setFontSize(fontSize - 2)
    }
  }

  // Render the code content (used in both normal and fullscreen mode)
  const renderCodeContent = () => (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      showLineNumbers
      wrapLines={true}
      customStyle={{
        margin: 0,
        borderRadius: 0,
        fontSize: `${fontSize}px`,
        backgroundColor: "#0f1118",
        height: isFullscreen ? "calc(100vh - 70px)" : "auto",
        maxHeight: isFullscreen ? "none" : "600px",
      }}
      codeTagProps={{
        style: {
          fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, 'Courier New', monospace",
        }
      }}
    >
      {code}
    </SyntaxHighlighter>
  )

  // Render toolbar with buttons
  const renderToolbar = () => (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
      <div className="flex items-center space-x-3">
        <Code className="h-5 w-5 text-purple-400" />
        <span className="font-medium text-gray-100">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <span className="text-sm text-gray-400">
          {code.split('\n').length} lines
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`${isFullscreen ? "" : "hidden sm:flex"} items-center mr-2`}>
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
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          <span className={`ml-2 ${isFullscreen ? "" : "hidden sm:inline"}`}>
            {copied ? "Copied!" : "Copy"}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          <span className={`ml-2 ${isFullscreen ? "" : "hidden sm:inline"}`}>Download</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          <span className={`ml-2 ${isFullscreen ? "" : "hidden sm:inline"}`}>
            {isFullscreen ? "Exit" : "Expand"}
          </span>
        </Button>
      </div>
    </div>
  )

  // Modal for fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/95">
        <div className="h-full flex flex-col">
          {renderToolbar()}
          <div className="flex-1 overflow-auto">
            {renderCodeContent()}
          </div>
        </div>
      </div>
    )
  }

  // Normal view
  return (
    <Card className="overflow-hidden border border-gray-700">
      {renderToolbar()}
      <div className="overflow-auto">
        {renderCodeContent()}
      </div>
    </Card>
  )
}
