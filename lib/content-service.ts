import { supabase } from './supabase'

export interface ContentItem {
  shortId: string
  type: "code" | "link" | "img"
  content?: string
  language?: string
  filePath?: string
  createdAt: string
  views: number
}

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

  return content as ContentItem
}

export async function getContent(shortId: string): Promise<ContentItem | null> {
  const { data, error } = await supabase.rpc('increment_views', { short_id: shortId })

  if (error || !data?.length) {
    return null
  }

  return data[0] as ContentItem
}

export async function getRecentContent(limit = 10): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(limit)

  return (data || []) as ContentItem[]
}
