import { z } from "zod";

export const RichMark = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  code: z.boolean().optional(),
  href: z.string().url().optional(),
});

export const RichText = z.object({
  text: z.string(),
  marks: RichMark.array().optional().default([]),
});

export type TRichText = z.infer<typeof RichText>;

export const BlockType = z.enum([
  "paragraph",
  "h1",
  "h2",
  "todo",
  "toggle",
  "quote",
  "bulleted",
  "numbered",
  "code",
  "divider",
  "image",
]);

export const Block = z.object({
  id: z.string(),
  type: BlockType,
  parentId: z.string().nullable(),
  children: z.string().array().default([]),
  text: RichText.array().default([]),
  props: z.record(z.string(), z.any()).default({}),
  collapsed: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TBlock = z.infer<typeof Block>;

export const Page = z.object({
  id: z.string(),
  title: z.string().default("Untitled"),
  icon: z.string().nullable().default(null),
  cover: z.string().nullable().default(null),
  rootBlockIds: z.string().array().default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TPage = z.infer<typeof Page>;

export const Workspace = z.object({
  meta: z.object({
    version: z.literal(1),
    updatedAt: z.number(),
  }),
  pages: z.record(z.string(), Page),
  blocks: z.record(z.string(), Block),
  recentPageIds: z.string().array().default([]),
});

export type TWorkspace = z.infer<typeof Workspace>;

export const emptyWorkspace = (): TWorkspace => ({
  meta: { version: 1, updatedAt: Date.now() },
  pages: {},
  blocks: {},
  recentPageIds: [],
});
