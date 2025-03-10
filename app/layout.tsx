import './globals.css'

export const metadata = {
  title: "cpy",
  description: "Share code snippets, links, and images with short url.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
