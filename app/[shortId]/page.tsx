import { notFound, redirect } from "next/navigation";
import { getContent } from "@/lib/content-service";
import { CodeViewer } from "@/components/code-viewer";
import { ImageViewer } from "@/components/image-viewer";

interface CodePageProps {
  params: {
    shortId: string;
  };
}

export default async function cpyPiece({ params }: CodePageProps) {
  let { shortId }: { shortId: string } = await params;
  shortId = shortId.toLowerCase();

  if (shortId.length !== 3) {
    notFound();
  }
  let sharePiece;
  try {
    sharePiece = await getContent(shortId);
  } catch (error) {
    console.error("Error fetching code:", error);
    notFound();
  }

  if (!sharePiece) {
    notFound();
  }

  if (sharePiece.type === "link") {
    if (!sharePiece.content || !isValidURL(sharePiece.content)) {
      notFound();
    }
    redirect(sharePiece.content);
  }

  if (sharePiece.type === "code") {
    if (!sharePiece.content) {
      notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Code Snippet: {shortId}</h1>
          <CodeViewer code={sharePiece.content as string} language={sharePiece.language || "txt"} shortId={shortId} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Image: {shortId}</h1>
          <ImageViewer imageUrl={sharePiece.filePath as string} shortId={shortId} />
        </div>
      </div>
    );
  }
}

function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
