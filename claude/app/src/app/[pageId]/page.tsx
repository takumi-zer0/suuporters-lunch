import { Editor } from "@/components/Editor";

export default function Page({ params }: { params: { pageId: string } }) {
  return <Editor pageId={params.pageId} />;
}