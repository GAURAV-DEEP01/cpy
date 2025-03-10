import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"
import { LRUCache } from "lru-cache"

const MAX_URL_LENGTH = 2048
const RATE_LIMIT = 15 // Max 15 requests per minute

// Validation schema for link submission
const linkSchema = z.object({
  url: z.string().url("Invalid URL format").max(MAX_URL_LENGTH, `URL exceeds the maximum length of ${MAX_URL_LENGTH} characters`),
})

const rateLimit = new LRUCache<string, { count: number; lastRequest: number }>({
  max: 1000, // Max 1000 different IPs tracked
  ttl: 60 * 1000, // 1 minute TTL
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"

    // Check rate limit
    const now = Date.now()
    const requestData = rateLimit.get(ip) || { count: 0, lastRequest: now }

    if (requestData.count >= RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 })
    }

    requestData.count += 1
    requestData.lastRequest = now
    rateLimit.set(ip, requestData)

    // Parse and validate the request body
    const body = await req.json()
    const result = linkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { url } = result.data

    // Generate a unique short ID
    const shortId = await generateShortId()

    await createContent({
      shortId,
      type: "link",
      content: url,
    })

    // Return the short URL
    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${shortId}`,
    })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}

