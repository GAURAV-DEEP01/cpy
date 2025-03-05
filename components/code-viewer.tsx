"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeViewerProps {
  code: string
  language: string
  shortId: string
}

export function CodeViewer({ code, language, shortId }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)

    // Determine file extension based on language
    let extension = "txt"
    switch (language) {
      case "javascript":
        extension = "js"
        break
      case "typescript":
        extension = "ts"
        break
      case "python":
        extension = "py"
        break
      case "java":
        extension = "java"
        break
      case "csharp":
        extension = "cs"
        break
      case "cpp":
        extension = "cpp"
        break
      case "go":
        extension = "go"
        break
      case "rust":
        extension = "rs"
        break
      case "php":
        extension = "php"
        break
      case "ruby":
        extension = "rb"
        break
      case "swift":
        extension = "swift"
        break
      case "kotlin":
        extension = "kt"
        break
      case "html":
        extension = "html"
        break
      case "css":
        extension = "css"
        break
      case "sql":
        extension = "sql"
        break
      default:
        extension = "txt"
    }

    element.download = `${shortId}.${extension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="ml-2">Download</span>
          </Button>
        </div>
      </div>
      <div className="max-h-[600px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "14px",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </Card>
  )
}

