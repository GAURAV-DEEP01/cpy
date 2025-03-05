import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"

// Validation schema for link submission
const linkSchema = z.object({
  url: z.string().url("Invalid URL format"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const result = linkSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { url } = result.data

    // Generate a unique short ID
    const shortId = await generateShortId()

    // Create the content in the database
    await createContent({
      shortId,
      type: "link",
      content: url,
    })

    // Return the short URL
    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://to.deeeep.fun"}/link/${shortId}`,
    })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}

