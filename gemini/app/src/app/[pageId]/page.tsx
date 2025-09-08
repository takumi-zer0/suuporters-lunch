"use client";

import { Editor } from "@/components/Editor";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export default function Page({ params }: { params: { pageId: string } }) {
  const { dispatch } = useStore();

  useEffect(() => {
    dispatch({ type: "SET_RECENT", pageId: params.pageId });
  }, [dispatch, params.pageId]);

  return <Editor pageId={params.pageId} />;
}
