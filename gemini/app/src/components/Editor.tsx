"use client";
import React, { useCallback } from "react";
import { useStore } from "@/lib/store";
import { TBlock } from "@/lib/schema";
import { cn } from "@/lib/utils"; // tailwind helper

export const Editor: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { state } = useStore();
  const page = state.ws.pages[pageId];
  const blocks = page?.rootBlockIds.map(id => state.ws.blocks[id]).filter(Boolean) as TBlock[];

  if (!page) return <div className="p-6 text-muted-foreground">Page not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 contentEditable suppressContentEditableWarning className="text-3xl font-semibold mb-6 outline-none">
        {page.title || "Untitled"}
      </h1>
      <div className="space-y-1">
        {blocks.map(b => <BlockRenderer key={b.id} block={b} />)}
      </div>
    </div>
  );
};

const BlockRenderer: React.FC<{ block: TBlock }> = ({ block }) => {
  const cls = cn("outline-none focus:ring-0 px-1 rounded");
  switch (block.type) {
    case "h1":   return <div contentEditable suppressContentEditableWarning className={cn(cls, "text-2xl font-semibold py-1")}>{text(block)}</div>;
    case "h2":   return <div contentEditable suppressContentEditableWarning className={cn(cls, "text-xl font-semibold py-1")}>{text(block)}</div>;
    case "todo": return (
      <div className="flex items-start gap-2 py-0.5">
        <input type="checkbox" className="mt-1" defaultChecked={!!block.props?.checked}/>
        <div contentEditable suppressContentEditableWarning className={cn(cls, "flex-1")}>{text(block)}</div>
      </div>
    );
    case "quote": return <div contentEditable suppressContentEditableWarning className={cn(cls, "border-l-2 pl-3 text-muted-foreground italic py-1")}>{text(block)}</div>;
    case "divider": return <hr className="my-3 border-muted" />;
    default: return <div contentEditable suppressContentEditableWarning className={cn(cls, "py-1")}>{text(block)}</div>;
  }
};

const text = (b: TBlock) => (b.text?.map((t) => t.text).join("") || "");
