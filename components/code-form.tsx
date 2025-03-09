"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Loader2, Code as CodeIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CodeForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("plaintext")
  const [isSubmitting, setIsSubmitting] = useState(false)
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

      const data = await response.json()
      setResult(data)
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

  const handleViewCode = () => {
    if (result?.shortId) {
      router.push(`/${result.shortId}`)
    }
  }

  return (
    <Card className="border-gray-700 bg-gray-800/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-purple-900/50 p-2">
            <CodeIcon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-gray-100">Share Code Snippet</CardTitle>
            <CardDescription className="text-gray-400">Paste your code below and get a shareable link</CardDescription>
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
                  Your code has been shared! URL: <span className="font-mono bg-gray-900/50 rounded px-2 py-1">{result.url}</span>
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
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          {result ? (
            <>
              <Button type="button" variant="outline" className="border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={handleCopyLink}>
                Copy Link
              </Button>
              <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleViewCode}>
                View Code
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="ml-auto bg-purple-600/70 hover:bg-purple-700 text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Share Code
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
