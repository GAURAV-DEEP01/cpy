// components/redirect-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const RedirectForm = () => {
  const [shortId, setShortId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedShortId = shortId.trim().toLowerCase()

    if (trimmedShortId.length !== 3) {
      setError('Short ID must be exactly 3 characters')
      return
    }

    setError('')
    router.push(`/${trimmedShortId}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            placeholder="Enter 3-character code"
            className="flex-1 rounded-lg bg-gray-800/80 px-6 py-4 text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={3}
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-purple-300/70 to-cyan-500 px-6 py-4 text-lg font-medium text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Redirect
          </button>
        </div>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
