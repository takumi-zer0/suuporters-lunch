"use client";
import React from "react";

const BLOCKS = [
  { id: "paragraph", label: "Paragraph" },
  { id: "h1", label: "Heading 1" },
  { id: "h2", label: "Heading 2" },
  { id: "todo", label: "To-do" },
  { id: "quote", label: "Quote" },
  { id: "divider", label: "Divider" },
];

export const SlashMenu: React.FC<{
  open: boolean;
  onSelect: (type: string) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
}> = ({ open, onSelect, anchorRef }) => {
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 4 + window.scrollY, left: r.left + window.scrollX });
  }, [open, anchorRef]);

  if (!open || !pos) return null;

  return (
    <div
      className="absolute z-50 w-72 rounded-xl border bg-white text-black shadow-md"
      style={{ top: pos.top, left: pos.left }}
    >
      <input
        className="w-full p-2 border-b outline-none"
        placeholder="Insert block…"
        aria-label="Slash menu filter"
      />
      <div className="max-h-64 overflow-auto">
        {BLOCKS.map((b) => (
          <button
            key={b.id}
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
            onClick={() => onSelect(b.id)}
            type="button"
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
};

