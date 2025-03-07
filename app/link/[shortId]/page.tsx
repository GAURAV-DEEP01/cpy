import { redirect } from "next/navigation"
import { getLinkContent } from "@/lib/content-service"

interface LinkPageProps {
  params: {
    shortId: string
  }
}

export default async function LinkPage({ params }: LinkPageProps) {
  const { shortId } = await params
  let linkData;
  try {
    linkData = await getLinkContent(shortId)
  } catch (error) {
    console.error("Error fetching link:", error)
    redirect("/404")
  }
  console.log(linkData)

  if (!linkData || !linkData.content || !isValidURL(linkData.content)) {
    redirect("/404")
  }

  redirect(linkData.content)
}

function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
