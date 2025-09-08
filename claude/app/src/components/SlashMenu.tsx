"use client";
import * as React from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";

const BLOCKS = [
  { id: "paragraph", label: "Paragraph" },
  { id: "h1", label: "Heading 1" },
  { id: "h2", label: "Heading 2" },
  { id: "todo", label: "To-do" },
  { id: "quote", label: "Quote" },
  { id: "divider", label: "Divider" },
];

export const SlashMenu: React.FC<{ open: boolean; onSelect: (type: string) => void }> = ({ open, onSelect }) => {
  if (!open) return null;
  return (
    <div className="absolute z-50 w-72 rounded-xl border bg-popover text-popover-foreground shadow-md">
      <Command>
        <CommandInput placeholder="Insert block…" />
        <CommandList>
          <CommandGroup heading="Blocks">
            {BLOCKS.map(b => (
              <CommandItem key={b.id} onSelect={() => onSelect(b.id)}>{b.label}</CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};