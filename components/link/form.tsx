"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Loader2, Link as LinkIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { HandleLinkGenerated } from "@/app/page"

interface LinkFormProp {
  onLinkGenerated: HandleLinkGenerated;
}

export const LinkForm: React.FC<LinkFormProp> = ({ onLinkGenerated }: LinkFormProp) => {
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ shortId: string; url: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic URL validation
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    // Add http:// if missing
    let formattedUrl = url
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = `https://${url}`
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create link")
      }

      const data: { shortId: string; url: string } = await response.json()
      setResult(data)

      // Call the onLinkGenerated callback with the newly generated URL
      if (data.shortId && onLinkGenerated) {
        onLinkGenerated({ shortId: data.shortId, type: "link" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = () => {
    if (result?.url) {
      navigator.clipboard.writeText(result.url)
    }
  }

  const handleTryLink = () => {
    if (result?.url) {
      window.open(result.url, "_blank")
    }
  }

  const handleReset = () => {
    setResult(null);
    setUrl("");
  }

  return (
    <Card className="border-gray-700 bg-gray-800/70 backdrop-blur">
      <CardHeader className="sm:pb-0">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-cyan-900/50 p-3">
            <LinkIcon className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-gray-100">Share Link</CardTitle>
            <CardDescription className="text-gray-400">
              <span className="inline sm:hidden">Enter a URL</span>
              <span className="hidden sm:inline">Enter a URL to get a short, shareable link</span>
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
                  Shareable link generated! URL:{" "}
                  <span className="font-mono bg-gray-900/50 rounded px-2 py-1 break-all">
                    {result.url}
                  </span>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">URL</Label>
              <Input
                id="url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border-gray-700 bg-gray-900/50 placeholder:text-gray-500 text-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          {result ? (
            <>
              <Button type="button" variant="outline" className="border-gray-700 bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={handleCopyLink}>
                Copy Link
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  onClick={handleReset}
                >
                  Create New
                </Button>
                <Button type="button" className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleTryLink}>
                  Try Link
                </Button>
              </div>
            </>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="ml-auto bg-cyan-600/70 hover:bg-cyan-700 text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Share Link
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

