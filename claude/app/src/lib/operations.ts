import { TPage, TBlock, TWorkspace, BlockType } from "./schema";
import { z } from "zod";

export const generateId = () => Math.random().toString(36).substring(2, 15);

export const createNewPage = (title = "Untitled"): TPage => {
  const now = Date.now();
  return {
    id: generateId(),
    title,
    icon: null,
    cover: null,
    rootBlockIds: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const createNewBlock = (
  type: z.infer<typeof BlockType> = "paragraph",
  parentId: string | null = null,
  text = ""
): TBlock => {
  const now = Date.now();
  return {
    id: generateId(),
    type,
    parentId,
    children: [],
    text: text ? [{ text, marks: [] }] : [],
    props: {},
    collapsed: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const addBlockToPage = (
  workspace: TWorkspace,
  pageId: string,
  block: TBlock
): TWorkspace => {
  const page = workspace.pages[pageId] as TPage | undefined;
  if (!page) return workspace;

  return {
    ...workspace,
    pages: {
      ...workspace.pages,
      [pageId]: {
        ...page,
        rootBlockIds: [...page.rootBlockIds, block.id],
        updatedAt: Date.now(),
      },
    },
    blocks: {
      ...workspace.blocks,
      [block.id]: block,
    },
    meta: {
      ...workspace.meta,
      updatedAt: Date.now(),
    },
  };
};

export const updateBlockText = (
  workspace: TWorkspace,
  blockId: string,
  text: string
): TWorkspace => {
  const block = workspace.blocks[blockId] as TBlock | undefined;
  if (!block) return workspace;

  return {
    ...workspace,
    blocks: {
      ...workspace.blocks,
      [blockId]: {
        ...block,
        text: text ? [{ text, marks: [] }] : [],
        updatedAt: Date.now(),
      },
    },
    meta: {
      ...workspace.meta,
      updatedAt: Date.now(),
    },
  };
};

export const changeBlockType = (
  workspace: TWorkspace,
  blockId: string,
  newType: z.infer<typeof BlockType>
): TWorkspace => {
  const block = workspace.blocks[blockId] as TBlock | undefined;
  if (!block) return workspace;

  return {
    ...workspace,
    blocks: {
      ...workspace.blocks,
      [blockId]: {
        ...block,
        type: newType,
        updatedAt: Date.now(),
      },
    },
    meta: {
      ...workspace.meta,
      updatedAt: Date.now(),
    },
  };
};

export const splitBlock = (
  workspace: TWorkspace,
  blockId: string,
  atPosition: number
): TWorkspace => {
  const block = workspace.blocks[blockId] as TBlock | undefined;
  if (!block) return workspace;

  const currentText = block.text?.[0]?.text || "";
  const beforeText = currentText.slice(0, atPosition);
  const afterText = currentText.slice(atPosition);

  const newBlock = createNewBlock(block.type, block.parentId, afterText);

  // Find the page that contains this block
  const pageWithBlock = Object.values(workspace.pages).find((page): page is TPage =>
    Boolean(page) && (page as TPage).rootBlockIds.includes(blockId)
  ) as TPage | undefined;

  if (!pageWithBlock) return workspace;

  const blockIndex = pageWithBlock.rootBlockIds.indexOf(blockId);
  const newRootBlockIds = [
    ...pageWithBlock.rootBlockIds.slice(0, blockIndex + 1),
    newBlock.id,
    ...pageWithBlock.rootBlockIds.slice(blockIndex + 1),
  ];

  return {
    ...workspace,
    pages: {
      ...workspace.pages,
      [pageWithBlock.id]: {
        ...pageWithBlock,
        rootBlockIds: newRootBlockIds,
        updatedAt: Date.now(),
      },
    },
    blocks: {
      ...workspace.blocks,
      [blockId]: {
        ...block,
        text: beforeText ? [{ text: beforeText, marks: [] }] : [],
        updatedAt: Date.now(),
      },
      [newBlock.id]: newBlock,
    },
    meta: {
      ...workspace.meta,
      updatedAt: Date.now(),
    },
  };
};

export const deleteBlock = (workspace: TWorkspace, blockId: string): TWorkspace => {
  const block = workspace.blocks[blockId] as TBlock | undefined;
  if (!block) return workspace;

  // Find the page that contains this block
  const pageWithBlock = Object.values(workspace.pages).find((page): page is TPage =>
    Boolean(page) && (page as TPage).rootBlockIds.includes(blockId)
  ) as TPage | undefined;

  if (!pageWithBlock) return workspace;

  const newRootBlockIds = pageWithBlock.rootBlockIds.filter(id => id !== blockId);
  const { [blockId]: _, ...remainingBlocks } = workspace.blocks;

  return {
    ...workspace,
    pages: {
      ...workspace.pages,
      [pageWithBlock.id]: {
        ...pageWithBlock,
        rootBlockIds: newRootBlockIds,
        updatedAt: Date.now(),
      },
    },
    blocks: remainingBlocks,
    meta: {
      ...workspace.meta,
      updatedAt: Date.now(),
    },
  };
};