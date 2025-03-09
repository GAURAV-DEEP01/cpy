import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"

// Validation schema for code submission
const codeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const result = codeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { code, language } = result.data

    // Generate a unique short ID
    const shortId = await generateShortId()

    // Create the content in the database
    await createContent({
      shortId,
      type: "code",
      content: code,
      language: language || "plaintext",
    })

    // Return the short URL
    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://to.deeeep.fun"}/${shortId}`,
    })
  } catch (error) {
    console.error("Error creating code snippet:", error)
    return NextResponse.json({ error: "Failed to create code snippet" }, { status: 500 })
  }
}

