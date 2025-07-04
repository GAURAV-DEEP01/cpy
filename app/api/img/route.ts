import { type NextRequest, NextResponse } from "next/server"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"
import { supabase } from "@/lib/supabase"
import { LRUCache } from "lru-cache"

const rateLimit = new LRUCache<string, { count: number; lastRequest: number }>({
  max: 500,
  ttl: 60 * 1000,
})

const RATE_LIMIT = 5;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const now = Date.now()
    const requestData = rateLimit.get(ip) || { count: 0, lastRequest: now }
    if (requestData.count >= RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
    requestData.count += 1
    requestData.lastRequest = now
    rateLimit.set(ip, requestData)
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files are supported." },
        { status: 400 },
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const shortId = await generateShortId()

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${shortId}.${fileExt}`

    const { data: _uploadData, error: uploadError } = await supabase.storage
      .from("image")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("image")
      .createSignedUrl(fileName, 86400)

    if (signedUrlError) {
      console.error("Error generating signed URL:", signedUrlError)
      return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 })
    }

    await createContent({
      shortId,
      type: "img",
      filePath: signedUrlData.signedUrl,
    })

    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`,
      imageUrl: signedUrlData.signedUrl
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

