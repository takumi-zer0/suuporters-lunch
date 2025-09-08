"use client";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { TBlock, TPage, BlockType } from "@/lib/schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { SlashMenu } from "./SlashMenu";
import { 
  updateBlockText, 
  changeBlockType, 
  splitBlock, 
  deleteBlock, 
  createNewBlock
} from "@/lib/operations";

export const Editor: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { state, dispatch } = useStore();
  const page = state.ws.pages[pageId] as TPage | undefined;
  const blocks = page?.rootBlockIds?.map(id => state.ws.blocks[id]).filter(Boolean) as TBlock[] || [];

  useEffect(() => {
    if (page) {
      dispatch({ type: "SET_RECENT", pageId });
    }
  }, [pageId, page, dispatch]);

  const handleTitleChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!page) return;
    const newTitle = e.currentTarget.textContent || "";
    dispatch({ 
      type: "UPSERT_PAGE", 
      page: { ...page, title: newTitle, updatedAt: Date.now() } 
    });
  }, [page, dispatch]);

  if (!page) {
    return <div className="p-6 text-muted-foreground">Page not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 
        contentEditable 
        suppressContentEditableWarning 
        className="text-3xl font-semibold mb-6 outline-none"
        onBlur={handleTitleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >
        {page.title || "Untitled"}
      </h1>
      <div className="space-y-1">
        {blocks.length === 0 && (
          <EmptyBlock pageId={pageId} />
        )}
        {blocks.map(b => (
          <BlockRenderer 
            key={b.id} 
            block={b} 
            pageId={pageId}
          />
        ))}
      </div>
    </div>
  );
};

const EmptyBlock: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { state, dispatch } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createFirstBlock = () => {
      const newBlock = createNewBlock("paragraph");
      const page = state.ws.pages[pageId] as TPage;
      if (!page) return;
      dispatch({ type: "UPSERT_BLOCKS", blocks: [newBlock] });
      dispatch({ 
        type: "UPSERT_PAGE", 
        page: { ...page, rootBlockIds: [newBlock.id], updatedAt: Date.now() }
      });
    };
    
    if (ref.current) {
      createFirstBlock();
    }
  }, [pageId, state.ws.pages, dispatch]);

  return (
    <div 
      ref={ref}
      className="outline-none focus:ring-0 px-1 rounded py-1 text-muted-foreground"
    >
      空のページです...
    </div>
  );
};

const BlockRenderer: React.FC<{ 
  block: TBlock; 
  pageId: string;
}> = ({ block, pageId }) => {
  const { state, dispatch } = useStore();
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  
  const handleTextChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    const updatedWorkspace = updateBlockText(state.ws, block.id, newText);
    dispatch({ type: "INIT", payload: updatedWorkspace });
  }, [block.id, state.ws, dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const currentText = e.currentTarget.textContent || "";
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentText.trim() === "") {
        // Empty block - create new paragraph
        const newBlock = createNewBlock("paragraph");
        const page = state.ws.pages[pageId] as TPage;
        if (!page) return;
        const blockIndex = page.rootBlockIds.indexOf(block.id);
        const newRootBlockIds = [
          ...page.rootBlockIds.slice(0, blockIndex + 1),
          newBlock.id,
          ...page.rootBlockIds.slice(blockIndex + 1),
        ];
        
        dispatch({ type: "UPSERT_BLOCKS", blocks: [newBlock] });
        dispatch({ 
          type: "UPSERT_PAGE", 
          page: { ...page, rootBlockIds: newRootBlockIds, updatedAt: Date.now() } 
        });
        
        setTimeout(() => {
          const nextElement = document.querySelector(`[data-block-id="${newBlock.id}"]`) as HTMLElement;
          nextElement?.focus();
        }, 0);
      } else {
        // Split current block
        const cursorPosition = range?.startOffset || currentText.length;
        const updatedWorkspace = splitBlock(state.ws, block.id, cursorPosition);
        dispatch({ type: "INIT", payload: updatedWorkspace });
        
        setTimeout(() => {
          const page = updatedWorkspace.pages[pageId] as TPage;
          if (!page) return;
          const blockIndex = page.rootBlockIds.indexOf(block.id);
          const nextBlockId = page.rootBlockIds[blockIndex + 1];
          if (nextBlockId) {
            const nextElement = document.querySelector(`[data-block-id="${nextBlockId}"]`) as HTMLElement;
            nextElement?.focus();
          }
        }, 0);
      }
    } else if (e.key === 'Backspace') {
      if (currentText === "" && selection?.anchorOffset === 0) {
        e.preventDefault();
        const page = state.ws.pages[pageId] as TPage;
        if (!page) return;
        const blockIndex = page.rootBlockIds.indexOf(block.id);
        
        if (blockIndex > 0) {
          // Focus previous block and delete current block
          const prevBlockId = page.rootBlockIds[blockIndex - 1];
          const prevElement = document.querySelector(`[data-block-id="${prevBlockId}"]`) as HTMLElement;
          const prevBlock = state.ws.blocks[prevBlockId] as TBlock;
          const prevText = prevBlock?.text?.[0]?.text || "";
          
          const updatedWorkspace = deleteBlock(state.ws, block.id);
          dispatch({ type: "INIT", payload: updatedWorkspace });
          
          setTimeout(() => {
            prevElement?.focus();
            // Set cursor to end of previous block
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(prevElement);
            range.setStart(prevElement.firstChild || prevElement, prevText.length);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }, 0);
        }
      }
    } else if (e.key === '/') {
      if (currentText === "" || (range?.startOffset === 0 && currentText.startsWith('/'))) {
        setTimeout(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setSlashMenuPosition({ 
              x: rect.left, 
              y: rect.bottom + window.scrollY 
            });
            setShowSlashMenu(true);
          }
        }, 0);
      }
    } else if (showSlashMenu && (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      setShowSlashMenu(false);
    }
  }, [block.id, pageId, state.ws, dispatch, showSlashMenu]);

  const handleSlashMenuSelect = useCallback((blockType: string) => {
    const updatedWorkspace = changeBlockType(state.ws, block.id, blockType as z.infer<typeof BlockType>);
    dispatch({ type: "INIT", payload: updatedWorkspace });
    setShowSlashMenu(false);
    
    // Remove the "/" character and focus back
    if (ref.current) {
      const currentText = ref.current.textContent || "";
      if (currentText.startsWith('/')) {
        ref.current.textContent = currentText.slice(1);
        setTimeout(() => ref.current?.focus(), 0);
      }
    }
  }, [block.id, state.ws, dispatch]);

  const cls = cn("outline-none focus:ring-0 px-1 rounded transition-colors hover:bg-accent/50", {
    "min-h-[1.5rem]": true,
  });

  let content;
  const blockText = block.text?.map((t) => t.text).join("") || "";

  switch (block.type) {
    case "h1":
      content = (
        <div 
          ref={ref}
          data-block-id={block.id}
          contentEditable 
          suppressContentEditableWarning 
          className={cn(cls, "text-2xl font-semibold py-1")}
          onBlur={handleTextChange}
          onKeyDown={handleKeyDown}
        >
          {blockText}
        </div>
      );
      break;
    case "h2":
      content = (
        <div 
          ref={ref}
          data-block-id={block.id}
          contentEditable 
          suppressContentEditableWarning 
          className={cn(cls, "text-xl font-semibold py-1")}
          onBlur={handleTextChange}
          onKeyDown={handleKeyDown}
        >
          {blockText}
        </div>
      );
      break;
    case "todo":
      content = (
        <div className="flex items-start gap-2 py-0.5">
          <input 
            type="checkbox" 
            className="mt-1" 
            defaultChecked={!!block.props?.checked}
            onChange={(e) => {
              const updatedBlock = {
                ...block,
                props: { ...block.props, checked: e.target.checked },
                updatedAt: Date.now(),
              };
              dispatch({ type: "UPSERT_BLOCKS", blocks: [updatedBlock] });
            }}
          />
          <div 
            ref={ref}
            data-block-id={block.id}
            contentEditable 
            suppressContentEditableWarning 
            className={cn(cls, "flex-1")}
            onBlur={handleTextChange}
            onKeyDown={handleKeyDown}
          >
            {blockText}
          </div>
        </div>
      );
      break;
    case "quote":
      content = (
        <div 
          ref={ref}
          data-block-id={block.id}
          contentEditable 
          suppressContentEditableWarning 
          className={cn(cls, "border-l-4 border-border pl-3 text-muted-foreground italic py-1")}
          onBlur={handleTextChange}
          onKeyDown={handleKeyDown}
        >
          {blockText}
        </div>
      );
      break;
    case "divider":
      content = <hr className="my-3 border-border" />;
      break;
    default:
      content = (
        <div 
          ref={ref}
          data-block-id={block.id}
          contentEditable 
          suppressContentEditableWarning 
          className={cn(cls, "py-1")}
          onBlur={handleTextChange}
          onKeyDown={handleKeyDown}
        >
          {blockText}
        </div>
      );
  }

  return (
    <div className="relative">
      {content}
      {showSlashMenu && (
        <div 
          className="fixed z-50"
          style={{ 
            left: slashMenuPosition.x, 
            top: slashMenuPosition.y 
          }}
        >
          <SlashMenu 
            open={showSlashMenu} 
            onSelect={handleSlashMenuSelect}
          />
        </div>
      )}
    </div>
  );
};