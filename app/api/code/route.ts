import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createContent } from "@/lib/content-service"
import { generateShortId } from "@/lib/generate-short-id"
import { LRUCache } from "lru-cache"

const MAX_CODE_SIZE = 50 * 1024 // 50 KB limit
const RATE_LIMIT = 10 // 10 requests per minute

const codeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().optional(),
})

const rateLimit = new LRUCache<string, { count: number; lastRequest: number }>({
  max: 500, // Max 500 different IPs tracked
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
    const result = codeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { code, language } = result.data

    // Check code size limit
    if (Buffer.byteLength(code, "utf-8") > MAX_CODE_SIZE) {
      return NextResponse.json({ error: `Code size exceeds the maximum limit of ${MAX_CODE_SIZE / 1024} KB` }, { status: 413 })
    }

    // Generate a unique short ID
    const shortId = await generateShortId()

    await createContent({
      shortId,
      type: "code",
      content: code,
      language: language || "plaintext",
    })

    // Return the short URL
    return NextResponse.json({
      shortId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cpy.deeeep.fun"}/${shortId}`,
    })
  } catch (error) {
    console.error("Error creating code snippet:", error)
    return NextResponse.json({ error: "Failed to create code snippet" }, { status: 500 })
  }
}

