import { supabase } from './supabase'

export async function generateShortId(length = 3): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let isUnique = false
  let shortId: string

  while (!isUnique) {
    shortId = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

    const { data } = await supabase
      .from('content')
      .select('shortId')
      .eq('shortId', shortId)
      .maybeSingle()

    if (!data) isUnique = true
  }

  return shortId!
}
