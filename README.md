# Cpy - Code, Link, and Image Sharing Platform

Cpy (`cpy.deeeep.fun`) is a tool to share Code snippets, Links, and Images using short URLs. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Content Types

* **Code**: Syntax-highlighted, 50KB max
* **Links**: Auto-shortened, 2048 char max
* **Images**: JPEG, PNG, GIF, WebP; 5MB max

### Functionality

* 3-character short IDs
* Direct link redirection
* QR code and clipboard support
* Real-time previews
* History of recent links
* Mobile-friendly, dark mode

### API Rate Limits

* `/api/link`: 15 req/min
* `/api/code`: 10 req/min
* `/api/img`: 5 req/min

## Tech Stack

* Next.js, TypeScript, Tailwind CSS, Supabase, GitHub Actions

## Security

* IP-based rate limiting
* File type and size validation
* URL validation and cleanup

---

