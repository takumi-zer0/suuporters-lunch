"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TPage } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export default function Home() {
  const { state, dispatch } = useStore();
  const router = useRouter();

  const recentPages = state.ws.recentPageIds
    .map(id => state.ws.pages[id])
    .filter(Boolean) as TPage[];

  const createNewPage = () => {
    const newPage: TPage = {
      id: nanoid(),
      title: "Untitled",
      icon: null,
      cover: null,
      rootBlockIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: "UPSERT_PAGE", page: newPage });
    router.push(`/${newPage.id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Pages</h2>
        <button
          onClick={createNewPage}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          New Page
        </button>
      </div>
      {recentPages.length > 0 ? (
        <ul>
          {recentPages.map(page => (
            <li key={page.id}>
              <Link href={`/${page.id}`} className="text-blue-500 hover:underline">
                {page.title || "Untitled"}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground">
          No recent pages. Create one!
        </div>
      )}
    </div>
  );
}
