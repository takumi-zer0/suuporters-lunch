"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { TPage } from "@/lib/schema";

export default function Home() {
  const { state } = useStore();
  
  const recentPages = state.ws.recentPageIds
    .map(id => state.ws.pages[id])
    .filter((page): page is TPage => Boolean(page))
    .slice(0, 5);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">最近のページ</h2>
      {recentPages.length > 0 ? (
        <div className="space-y-2">
          {recentPages.map(page => (
            <Link
              key={page.id}
              href={`/${page.id}`}
              className="block p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="font-medium">{page.title || "Untitled"}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(page.updatedAt).toLocaleDateString('ja-JP')}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">
          <p>まだページがありません。サイドバーから新しいページを作成してみましょう。</p>
        </div>
      )}
    </div>
  );
}
