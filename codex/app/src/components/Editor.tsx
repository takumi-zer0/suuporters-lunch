"use client";
import React, { useMemo, useRef, useState } from "react";
import { useStore, genId, makeBlock } from "@/lib/store";
import type { TBlock } from "@/lib/schema";
import { SlashMenu } from "@/components/SlashMenu";

const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

export const Editor: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { state, dispatch } = useStore();
  const page = state.ws.pages[pageId];
  const blocks = useMemo(
    () => page?.rootBlockIds.map((id) => state.ws.blocks[id]).filter(Boolean) as TBlock[],
    [page, state.ws.blocks]
  );

  React.useEffect(() => {
    if (page) dispatch({ type: "SET_RECENT", pageId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  if (!page) return <div className="p-6 text-muted-foreground">Page not found</div>;

  const updateTitle = (title: string) => {
    dispatch({ type: "UPSERT_PAGE", page: { ...page, title, updatedAt: Date.now() } });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1
        role="textbox"
        aria-label="Page title"
        contentEditable
        suppressContentEditableWarning
        className="text-3xl font-semibold mb-6 outline-none focus:ring-0"
        onInput={(e) => updateTitle((e.target as HTMLElement).innerText)}
      >
        {page.title || "Untitled"}
      </h1>
      <div className="space-y-1">
        {blocks.map((b, i) => (
          <BlockRenderer key={b.id} block={b} pageId={pageId} index={i} />
        ))}
      </div>
    </div>
  );
};

const getText = (b: TBlock) => b.text?.map((t) => t.text).join("") || "";

const setText = (b: TBlock, text: string): TBlock => ({
  ...b,
  text: [{ text, marks: [] }],
  updatedAt: Date.now(),
});

const useSlash = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  return { open, setOpen, anchorRef } as const;
};

const BlockRenderer: React.FC<{ block: TBlock; pageId: string; index: number }> = ({ block, pageId, index }) => {
  const { state, dispatch } = useStore();
  const page = state.ws.pages[pageId];
  const ref = useRef<HTMLDivElement | null>(null);
  const { open, setOpen, anchorRef } = useSlash();

  const updateBlock = (nb: TBlock) => dispatch({ type: "UPSERT_BLOCKS", blocks: [nb] });

  const handleInput: React.FormEventHandler<HTMLDivElement> = (e) => {
    const text = (e.currentTarget as HTMLDivElement).innerText;
    if (text === getText(block)) return;
    updateBlock(setText(block, text));
  };

  const insertBlockAfter = (newBlock: TBlock) => {
    const ids = [...page.rootBlockIds];
    ids.splice(index + 1, 0, newBlock.id);
    dispatch({ type: "UPSERT_PAGE", page: { ...page, rootBlockIds: ids, updatedAt: Date.now() } });
    dispatch({ type: "UPSERT_BLOCKS", blocks: [newBlock] });
  };

  const focusNext = () => {
    // best-effort: try focusing next block element
    requestAnimationFrame(() => {
      const next = ref.current?.nextElementSibling as HTMLDivElement | null;
      next?.focus();
    });
  };

  const focusPrev = () => {
    requestAnimationFrame(() => {
      const prev = ref.current?.previousElementSibling as HTMLDivElement | null;
      prev?.focus();
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "/") {
      const isEmpty = getText(block).length === 0;
      if (isEmpty) {
        setOpen(true);
        anchorRef.current = ref.current;
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // simple split at end: create a new paragraph block
      const newId = genId();
      const next = makeBlock(newId, "paragraph");
      insertBlockAfter(next);
      focusNext();
      return;
    }
    if (e.key === "Backspace") {
      const txt = getText(block);
      if (txt.length === 0) {
        e.preventDefault();
        // remove this block if not the only one
        if (page.rootBlockIds.length > 1) {
          const ids = page.rootBlockIds.filter((id) => id !== block.id);
          dispatch({ type: "UPSERT_PAGE", page: { ...page, rootBlockIds: ids, updatedAt: Date.now() } });
          dispatch({ type: "DELETE_BLOCKS", ids: [block.id] });
          focusPrev();
        }
      }
    }
  };

  const onSelectType = (type: string) => {
    setOpen(false);
    updateBlock({ ...block, type: type as TBlock["type"], updatedAt: Date.now() });
  };

  const cls = cn("outline-none focus:ring-0 px-1 rounded", "py-1");

  if (block.type === "divider") {
    return <hr className="my-3 border-muted" />;
  }
  if (block.type === "todo") {
    return (
      <div className="flex items-start gap-2 py-0.5">
        <input type="checkbox" className="mt-1" defaultChecked={!!(block as any).props?.checked} />
        <div className="relative flex-1">
          <div
            role="textbox"
            aria-label="todo block"
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            className={cn(cls)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          >
            {getText(block)}
          </div>
          <SlashMenu open={open} onSelect={onSelectType} anchorRef={anchorRef} />
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <div
        role="textbox"
        aria-label={`${block.type} block`}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={
          block.type === "h1"
            ? cn(cls, "text-2xl font-semibold")
            : block.type === "h2"
            ? cn(cls, "text-xl font-semibold")
            : block.type === "quote"
            ? cn(cls, "border-l-2 pl-3 text-muted-foreground italic")
            : cls
        }
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      >
        {getText(block)}
      </div>
      <SlashMenu open={open} onSelect={onSelectType} anchorRef={anchorRef} />
    </div>
  );
};
