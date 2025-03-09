import { type NextRequest, NextResponse } from "next/server"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"

import { supabase } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are supported." },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const shortId = await generateShortId()
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${shortId}.${fileExt}`

    const { data: _uploadData, error: uploadError } = await supabase.storage
      .from("image")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // valid for 1 day
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("image")
      .createSignedUrl(fileName, 86400)

    if (signedUrlError) {
      console.error("Error generating signed URL:", signedUrlError)
      return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 })
    }

    // Create database record
    await createContent({
      shortId,
      type: "img",
      filePath: signedUrlData.signedUrl,
    })

    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/img/${shortId}`,
      imageUrl: signedUrlData.signedUrl
    })

  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

