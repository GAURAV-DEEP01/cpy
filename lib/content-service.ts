import { supabase } from './supabase'
import { LRUCache } from 'lru-cache'

export interface ContentItem {
  shortId: string
  type: "code" | "link" | "img"
  content?: string
  language?: string
  filePath?: string
  createdAt: string
  views: number
}

const contentCache = new LRUCache<string, ContentItem>({
  max: 500,
  ttl: 1000 * 60 * 5,
})

export async function createContent(data: {
  shortId: string
  type: "code" | "link" | "img"
  content?: string
  language?: string
  filePath?: string
}): Promise<ContentItem> {
  const { data: content, error } = await supabase
    .from('content')
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create content: ${error.message}`)
  }

  // Invalidate the cache for this shortId if it exists, so that future reads fetch the latest data.
  contentCache.delete(data.shortId)

  return content as ContentItem
}

export async function getContent(shortId: string): Promise<ContentItem | null> {
  const cachedContent = contentCache.get(shortId)

  if (cachedContent) {
    return cachedContent
  }
  const { data, error } = await supabase.rpc('increment_views', { short_id: shortId })

  if (error || !data?.length) {
    return null
  }

  const contentItem = data[0] as ContentItem

  // Cache the result for subsequent calls
  contentCache.set(shortId, contentItem)

  return contentItem
}


