import { notFound, redirect } from "next/navigation";
import { getContent } from "@/lib/content-service";
import { CodeViewer } from "@/components/code/viewer";
import { ImageViewer } from "@/components/image/viewer";
import { Background } from "@/components/ui/background";
import { Footer } from "@/components/ui/footer";
import { isValidURL } from "@/lib/utils";
import QrCodeButton from "@/components/qr-code";

interface ContentPageProp {
  params: {
    shortId: string;
  };
}

export default async function cpyPiece({ params }: ContentPageProp) {
  let { shortId }: { shortId: string } = /* @ts-ignore */ await params;
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

  return (
    <div className="min-h-screen text-gray-100 relative">
      <Background />

      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-900/30 via-indigo-900/20 to-transparent" />

      <div className="container relative mx-auto px-4 py-5">
        <div className="flex flex-col items-center justify-center space-y-2 text-center mb-5">
          <h1 className="text-3xl font-bold tracking-tight">
            cpy.
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              deeeep
            </span>
            .fun
          </h1>
        </div>

        <div className="mx-auto max-w-4xl">
          {sharePiece.type === "code" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold ">
                  <div className="flex justify-between">
                    <div >
                      <span className="text-gray-400">Code Snippet: </span>
                      <span className="ml-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{shortId}</span>
                    </div>
                    <QrCodeButton shortId={shortId} />
                  </div>
                </h2>
              </div>
              <CodeViewer
                code={sharePiece.content as string}
                language={sharePiece.language || "txt"}
                shortId={shortId}
              />
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  <div className="flex justify-between">
                    <div >
                      <span className="text-gray-400">Image: </span>
                      <span className="ml-2 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{shortId}</span>
                      <QrCodeButton shortId={shortId} />
                    </div >
                  </div>
                </h2>
              </div>
              <ImageViewer
                imageUrl={sharePiece.filePath as string}
                shortId={shortId}
              />
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}


