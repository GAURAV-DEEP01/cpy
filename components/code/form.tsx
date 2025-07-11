"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HandleLinkGenerated } from "@/app/page"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Code as CodeIcon, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeFormProps {
  onLinkGenerated: HandleLinkGenerated;
}

export const CodeForm: React.FC<CodeFormProps> = ({ onLinkGenerated }: CodeFormProps) => {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("plaintext")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ shortId: string; url: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setError("Please enter some code")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create code snippet")
      }

      const data: { shortId: string, url: string } = await response.json()
      setResult(data)

      if (data.shortId && onLinkGenerated) {
        onLinkGenerated({ shortId: data.shortId, type: "code" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = async () => {
    if (result?.url) {
      try {
        await navigator.clipboard.writeText(result.url)
        setIsCopied(true)
        // Reset the copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }

  const handleViewCode = () => {
    if (result?.shortId) {
      setIsRedirecting(true)
      router.push(`/${result.shortId}`)
    }
  }

  const handleReset = () => {
    setResult(null);
    setCode("");
    setLanguage("plaintext");
    setIsCopied(false);
  }

  return (
    <Card className="border-gray-700 bg-gray-800/70 backdrop-blur">
      <CardHeader className="sm:pb-0">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-purple-900/50 p-3">
            <CodeIcon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-gray-100">Share Code Snippet</CardTitle>
            <CardDescription className="text-gray-400">
              <span className="inline sm:hidden">Paste your code</span>
              <span className="hidden sm:inline">Paste your code below and get a shareable link</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-900/50 bg-red-900/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result ? (
            <>
              <div className="flex justify-center items-center">
                <div className="w-1/2 px-6 py-3 bg-gray-900 rounded-md shadow-xl hover:bg-gray-700 transition-all duration-300 scale-105">
                  <span className="flex justify-center material-icons text-white text-2xl font-bold">{result.shortId}</span>
                </div>
              </div>
              <Alert className="border-green-900/50 bg-green-900/20 text-green-400">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Shareable link generated! URL:
                  <div className="sm:inline-block">
                    <span className="sm:ml-4 font-mono bg-gray-900/50 rounded px-2 py-1 break-all">
                      {result.url}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-300">Code</Label>
                <Textarea
                  id="code"
                  placeholder="Paste your code here..."
                  className="min-h-[200px] font-mono border-gray-800 bg-gray-900/50 placeholder:text-gray-500 text-gray-200 focus:border-purple-00 focus:ring-purple-500/20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-gray-300">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="border-gray-700 bg-gray-900/50 text-gray-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800 text-gray-300">
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="sh">Bash</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="yaml">YAML</SelectItem>
                    <SelectItem value="md">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          {result ? (
            <>
              <Button
                type="button"
                variant="outline"
                className={`border-gray-700 text-gray-300 hover:text-white transition-all duration-200 ${isCopied
                  ? 'bg-green-700 border-green-600 text-green-100 hover:bg-green-600'
                  : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                onClick={handleCopyLink}
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  onClick={handleReset}
                >
                  <CardDescription className="text-gray-400">
                    <span className="inline sm:hidden">New</span>
                    <span className="hidden sm:inline">Create New</span>
                  </CardDescription>
                </Button>
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                  onClick={handleViewCode}
                  disabled={isRedirecting}
                >
                  {isRedirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isRedirecting ? <span> Loading...</span> :
                    <div>
                      <span className="inline sm:hidden">View</span>
                      <span className="hidden sm:inline">View Code</span>
                    </div>}
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-gradient-to-r from-purple-500/70 to-purple-600/50 hover:from-purple-600 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Share Code
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
