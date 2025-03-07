import { notFound } from "next/navigation"
import { getImageContent } from "@/lib/content-service"
import { ImageViewer } from "@/components/image-viewer"

interface ImagePageProps {
  params: {
    shortId: string
  }
}

export default async function ImagePage({ params }: ImagePageProps) {
  const { shortId } = params

  if (shortId.length !== 4) {
    notFound()
  }

  try {
    const imageData = await getImageContent(shortId)

    if (!imageData) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Image: {shortId}</h1>
          <ImageViewer imageUrl={imageData.filePath as string} shortId={shortId} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching image:", error)
    notFound()
  }
}

