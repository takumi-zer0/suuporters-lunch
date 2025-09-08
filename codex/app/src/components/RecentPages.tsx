"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function RecentPages() {
  const { state } = useStore();
  const recents = state.ws.recentPageIds;
  return (
    <ul className="space-y-2">
      {recents.map((id) => {
        const p = state.ws.pages[id];
        if (!p) return null;
        return (
          <li key={id}>
            <Link className="text-blue-600 hover:underline" href={`/${id}`}>
              {p.title || "Untitled"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

