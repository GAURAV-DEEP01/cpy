"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, ImageIcon, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ImageForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ shortId: string; url: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)

    if (selectedFile) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validImageTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.")
        setFile(null)
        e.target.value = ""
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (selectedFile.size > maxSize) {
        setError("File too large. Maximum size is 5MB.")
        setFile(null)
        e.target.value = ""
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select an image to upload")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/img", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
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

  const handleViewImage = () => {
    if (result?.shortId) {
      router.push(`/${result.shortId}`)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="border-gray-700 bg-gray-800/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-emerald-900/50 p-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-gray-100">Share Image</CardTitle>
            <CardDescription className="text-gray-400">Upload an image to get a shareable link</CardDescription>
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
                  Your image has been shared! URL:
                  <span className="font-mono bg-gray-900/50 rounded px-2 py-1 break-all">
                    {result.url}
                  </span>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {preview ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-700">
                    <Image src={preview || "/placeholder.svg"} alt="Image preview" fill className="object-contain" />
                  </div>
                ) : (
                  <div
                    className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800 transition-colors"
                    onClick={handleBrowseClick}
                  >
                    <div className="rounded-full bg-gray-800 p-4">
                      <ImageIcon className="h-8 w-8 text-emerald-400" />
                    </div>
                    <p className="mt-4 text-sm text-gray-300">Click to select an image</p>
                    <p className="mt-1 text-xs text-gray-500">JPEG, PNG, GIF, WebP (Max 5MB)</p>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={handleBrowseClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                {file ? "Change Image" : "Browse"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          {result ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-gray-700 text-gray-600 hover:bg-gray-700 hover:text-white"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleViewImage}
              >
                View Image
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !file}
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Image
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
