import { notFound } from "next/navigation"
import { getCodeContent } from "@/lib/content-service"
import { CodeViewer } from "@/components/code-viewer"

interface CodePageProps {
  params: {
    shortId: string
  }
}

export default async function CodePage({ params }: CodePageProps) {
  const { shortId } = await params

  if (shortId.length !== 4) {
    notFound()
  }

  try {
    const codeData = await getCodeContent(shortId)

    if (!codeData) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Code Snippet: {shortId}</h1>
          <CodeViewer code={codeData.content as string} language={codeData.language as string} shortId={shortId} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching code:", error)
    notFound()
  }
}

