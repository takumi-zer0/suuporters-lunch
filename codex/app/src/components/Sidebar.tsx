"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, genId, makeBlock } from "@/lib/store";

export default function Sidebar() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [q, setQ] = React.useState("");

  const pages = state.ws.pages;

  const list = React.useMemo(() => {
    const items = Object.values(pages);
    if (!q) return items.sort((a, b) => b.updatedAt - a.updatedAt);
    const lower = q.toLowerCase();
    return items
      .filter((p) => {
        const titleHit = p.title.toLowerCase().includes(lower);
        if (titleHit) return true;
        // simple content search on root blocks
        return p.rootBlockIds.some((id) => (state.ws.blocks[id]?.text ?? []).some((t) => t.text.toLowerCase().includes(lower)));
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [pages, q, state.ws.blocks]);

  const createPage = () => {
    const now = Date.now();
    const pageId = genId();
    const blockId = genId();
    dispatch({
      type: "UPSERT_PAGE",
      page: {
        id: pageId,
        title: "Untitled",
        icon: null,
        cover: null,
        rootBlockIds: [blockId],
        createdAt: now,
        updatedAt: now,
      },
    });
    dispatch({ type: "UPSERT_BLOCKS", blocks: [makeBlock(blockId, "paragraph")] });
    dispatch({ type: "SET_RECENT", pageId });
    router.push(`/${pageId}`);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        createPage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside className="w-72 border-r h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-3 border-b flex items-center gap-2">
        <button className="px-2 py-1 rounded border" onClick={createPage} type="button" aria-label="New page">
          + New
        </button>
        <input
          className="flex-1 px-2 py-1 rounded border outline-none"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search"
        />
      </div>
      <nav className="flex-1 overflow-auto">
        <div className="px-3 py-2 text-xs uppercase text-gray-500">Pages</div>
        <ul>
          {list.map((p) => (
            <li key={p.id} className="px-3 py-1">
              <Link className="block rounded px-2 py-1 hover:bg-gray-100" href={`/${p.id}`}>
                {p.title || "Untitled"}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
