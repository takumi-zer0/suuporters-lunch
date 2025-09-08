## 概要（簡潔なまとめ）

* **目的**：ブラウザのみで動作するNotion風エディタ。ページ一覧、ブロック編集、スラッシュコマンド、ローカル永続化、検索を提供。
* **制約**：**サーバDB不使用**。初期はLocalStorage、必要に応じてIndexedDBへ差し替え可能なアダプタ構造。
* **中核コンセプト**：**ローカルファースト＋ブロックモデル＋バリデーション内蔵**。拡張でドラッグ&ドロップ、履歴、テンプレート、将来的に同期。
* **80/20最小機能**：ページCRUD、段落/見出し/トグル/ToDoの基本ブロック、スラッシュメニュー、簡易検索、Undo/Redo（履歴はメモリ）。
* **拡張**：IndexedDB、ドラッグ&ドロップ、バックリンク、テンプレート、エクスポート/インポート、共同編集（後日CRDT/Yjs）。

---

# 詳細設計

## 目的と制約

　**目的**は、インストール不要で即利用できるノート/ドキュメント環境をNext.js上で完結させることです。**制約**はサーバ側の永続化を使わず、**すべてクライアント**で処理します。サイズ・パフォーマンス・データ消失リスクを意識し、**アダプタ交換可能**なストレージ層で将来の同期やDB導入を容易にします。

## アーキテクチャ（論理構成）

* **UI層**：Next.js App Router＋shadcn/ui。
* **状態管理**：React Context＋useReducer（0→1）。必要に応じてZustandへ移行可能。
* **データモデル**：**Page**と**Block**の2層。Blockは木構造、PageはrootBlockIdsを持つ。
* **永続化**：StorageAdapter（LocalStorageAdapter→将来IndexedDBAdapter）。
* **バリデーション**：zodで入出力・保存時に検証。
* **時間処理**：date-fnsで表示やソートを標準化。
* **コマンドUI**：shadcnのCommandでスラッシュメニュー、コマンドパレットを実装。

## ページ構成（Next.js App Router）

* `app/layout.tsx`：共通レイアウト（サイドバー＋トップバー）。
* `app/page.tsx`：ホーム（最近のページ、検索）。
* `app/[pageId]/page.tsx`：エディタ画面。
* `app/providers.tsx`：StoreとThemeのProvider。
* `components/`：UI（Sidebar、Topbar、Editor、BlockRenderer、SlashMenu、PageList、SearchBox）。
* `lib/`：schema、storage、store、utils。

## 依存ライブラリ（最小）

* **必須**：`next`, `react`, `tailwindcss`, `shadcn/ui`, `zod`, `date-fns`
* **任意（拡張）**：`idb-keyval` または `dexie`（IndexedDB）、`@dnd-kit/core`（ドラッグ&ドロップ）

**判断基準**：初期は**依存を最小**にし、**LocalStorageで5MB前後**まで運用。文書量増・画像挿入需要が見えたらIndexedDBへ移行します。

## データモデル

* **BlockType**：`paragraph | h1 | h2 | todo | toggle | quote | bulleted | numbered | code | divider | image`
* **RichText**：プレーンテキスト＋マーク（bold/italic/underline/code/link）
* **Page**：メタ情報（タイトル、アイコン、cover、作成/更新日時）＋`rootBlockIds`
* **Workspace**：`pages`と`blocks`の辞書、および`meta`（version等）

**方針**：**正規化**（辞書化）して更新粒度を小さく保ち、Undo/Redoを軽量化します。

## ストレージ設計

* **StorageAdapter**：`load | save | export | import` を定義。
* **LocalStorageAdapter**：JSONを圧縮せず保存（まずは分かりやすさ優先）。
* **マイグレーション**：`workspace.meta.version`で軽量移行。
* **耐障害**：保存前zod検証、バックアップスロット（世代管理3つ）。
* **サイズ見積**：テキスト主体で**数千ブロック**は許容。画像はURL埋め込み推奨（Base64は非推奨）。

## バリデーション（zod）

　入出力時に**zod**で検証し、壊れたデータを弾きます。保存時はスキーマ準拠を強制し、読み込み時は`safeParse`で復旧可能な範囲は自動補正。

## UI設計（画面）

1. **ワークスペースレイアウト**
   　左：**Sidebar**（ページツリー、検索、テンプレート）。上：**Topbar**（パンくず、更新時刻、Command）。中央：**Editor**。

2. **Editor**
   　**BlockRenderer**で各ブロックを描画。`contenteditable`＋キーハンドラ（Enterで分割、Backspaceで結合、`/`でスラッシュメニュー表示）。**インラインマーク**は選択範囲に対してトグル。

3. **SlashMenu**
   　`/`入力で開く。ブロック挿入コマンド、変換（paragraph→h2等）。`Command`コンポーネント利用。

4. **検索/ナビ**
   　サイドバー検索（タイトル・本文全文の簡易検索）。将来`Fuse.js`へ差し替え可能。

## 状態管理と同期

* **Store**：`useReducer`で`pages`/`blocks`の辞書を管理。
* **履歴**：`past/present/future`の簡易タイムトラベル。
* **永続化**：`debounce(500ms)`で`save()`。
* **将来**：Zustand＋IndexedDBへ切替、CRDT（Yjs）でリアルタイム共同編集。

## ルーティングとナビ

* URL：`/[pageId]`。新規ページは即時作成→ルーティング。
* パンくず：親ブロックがページを跨ぐ場合はPage単位で簡易表示。

## コンポーネント一覧（抜粋）

* `Sidebar`：ページツリー、検索、テンプレート
* `Topbar`：パンくず、更新時刻、コマンドパレット
* `Editor`：キャンバス
* `BlockRenderer`：型別の表示・編集
* `SlashMenu`：コマンド
* `PageList`：最近のページ
* `SearchBox`：全文検索入力

## キーボードショートカット

* **Cmd/Ctrl+N**：新規ページ
* **Cmd/Ctrl+K**：コマンドパレット
* **Cmd/Ctrl+B/I/U**：ボールド/イタリック/アンダーライン
* **Enter/Shift+Enter**：ブロック分割/改行
* **Tab/Shift+Tab**：インデント/アウトデント
* **Cmd/Ctrl+Z/Shift+Z**：Undo/Redo

## アクセシビリティ

* contenteditableに**role**と**aria-label**を付与
* フォーカスリング、ショートカットのツールチップ
* コントラスト比とキーボード操作の成立を担保

## ロギング/計測

* まずは**無**（ローカルのみ）。将来：匿名の操作イベント→自己分析（要同意UI）。

## リスクと対策

* **データ消失**：LocalStorageはクリアされ得る→**自動バックアップスロット**と**JSONエクスポート**を提供。
* **容量制限**：LocalStorageは**約5MB**目安→大規模化時に**IndexedDB**へ切替。
* **XSS/DOM破損**：contenteditableのHTML直注入は禁止→**内部はテキスト＋マーク**のみを保持。
* **パフォーマンス**：巨大ページで再レンダリング増→**辞書構造＋部分レンダリング**、後日仮想化。

## 将来拡張

* **ドラッグ&ドロップ**：`@dnd-kit/core`で階層移動。
* **バックリンク/プロパティ**：`[[page]]`や`key:value`プロパティを解析。
* **テンプレート**：会議メモ・仕様書テンプレ。
* **クラウド同期**：Firebase/Firestore、Supabase、App RouterのRSCを活用する同期層、または**Yjs**でP2P。

---

# 実装スケルトン（最低限動く土台）

> 最初の一歩として**コピー&ペースト**で雛形を作れる分量に絞っています。必要に応じてここから肉付けしてください。

### 1) 型・スキーマ（`lib/schema.ts`）

```ts
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
  "paragraph","h1","h2","todo","toggle","quote",
  "bulleted","numbered","code","divider","image",
]);

export const Block = z.object({
  id: z.string(),
  type: BlockType,
  parentId: z.string().nullable(),
  children: z.string().array().default([]),
  text: RichText.array().default([]), // image等はpropsで
  props: z.record(z.any()).default({}),
  collapsed: z.boolean().default(false),
  createdAt: z.number(), // epoch ms
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
  pages: z.record(Page),
  blocks: z.record(Block),
  recentPageIds: z.string().array().default([]),
});

export type TWorkspace = z.infer<typeof Workspace>;

export const emptyWorkspace = (): TWorkspace => ({
  meta: { version: 1, updatedAt: Date.now() },
  pages: {},
  blocks: {},
  recentPageIds: [],
});
```

### 2) ストレージアダプタ（`lib/storage.ts`）

```ts
import { Workspace, TWorkspace, emptyWorkspace } from "./schema";

export interface StorageAdapter {
  load(): Promise<TWorkspace>;
  save(ws: TWorkspace): Promise<void>;
  export(): Promise<string>;
  import(json: string): Promise<TWorkspace>;
}

const KEY = "notionlike.ws.v1";
const BK1 = "notionlike.ws.v1.bk1";
const BK2 = "notionlike.ws.v1.bk2";

const safeParse = (raw: string | null): TWorkspace | null => {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    const parsed = Workspace.safeParse(obj);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export class LocalStorageAdapter implements StorageAdapter {
  async load(): Promise<TWorkspace> {
    const d = safeParse(localStorage.getItem(KEY));
    return d ?? emptyWorkspace();
  }
  async save(ws: TWorkspace): Promise<void> {
    // ローテーションバックアップ
    const prev = localStorage.getItem(KEY);
    if (prev) {
      localStorage.setItem(BK2, localStorage.getItem(BK1) ?? "");
      localStorage.setItem(BK1, prev);
    }
    localStorage.setItem(KEY, JSON.stringify(ws));
  }
  async export(): Promise<string> {
    return localStorage.getItem(KEY) ?? JSON.stringify(emptyWorkspace());
  }
  async import(json: string): Promise<TWorkspace> {
    const parsed = Workspace.parse(JSON.parse(json));
    await this.save(parsed);
    return parsed;
  }
}
```

※ IndexedDB化は`StorageAdapter`を実装するだけで差し替え可能にしてあります。

### 3) ストア（`lib/store.tsx`）

```tsx
"use client";
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { TWorkspace, emptyWorkspace, TPage, TBlock } from "./schema";
import { LocalStorageAdapter, StorageAdapter } from "./storage";
import { formatISO } from "date-fns";

type Action =
  | { type: "INIT"; payload: TWorkspace }
  | { type: "UPSERT_PAGE"; page: TPage }
  | { type: "UPSERT_BLOCKS"; blocks: TBlock[] }
  | { type: "DELETE_BLOCKS"; ids: string[] }
  | { type: "TOUCH" }
  | { type: "SET_RECENT"; pageId: string };

type State = {
  ws: TWorkspace;
  dirty: boolean;
};

const reducer = (s: State, a: Action): State => {
  switch (a.type) {
    case "INIT":
      return { ws: a.payload, dirty: false };
    case "UPSERT_PAGE": {
      const ws = { ...s.ws, pages: { ...s.ws.pages, [a.page.id]: a.page } };
      ws.meta.updatedAt = Date.now();
      return { ws, dirty: true };
    }
    case "UPSERT_BLOCKS": {
      const blocks = { ...s.ws.blocks };
      for (const b of a.blocks) blocks[b.id] = b;
      const ws = { ...s.ws, blocks };
      ws.meta.updatedAt = Date.now();
      return { ws, dirty: true };
    }
    case "DELETE_BLOCKS": {
      const blocks = { ...s.ws.blocks };
      for (const id of a.ids) delete blocks[id];
      const ws = { ...s.ws, blocks };
      ws.meta.updatedAt = Date.now();
      return { ws, dirty: true };
    }
    case "SET_RECENT": {
      const ids = [a.pageId, ...s.ws.recentPageIds.filter(id => id !== a.pageId)].slice(0, 20);
      const ws = { ...s.ws, recentPageIds: ids };
      ws.meta.updatedAt = Date.now();
      return { ws, dirty: true };
    }
    case "TOUCH":
      return { ws: { ...s.ws, meta: { ...s.ws.meta, updatedAt: Date.now() } }, dirty: true };
    default:
      return s;
  }
};

const StoreCtx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  storage: StorageAdapter;
} | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const storage = useMemo(() => new LocalStorageAdapter(), []);
  const [state, dispatch] = useReducer(reducer, { ws: emptyWorkspace(), dirty: false });

  useEffect(() => {
    (async () => {
      const data = await storage.load();
      dispatch({ type: "INIT", payload: data });
    })();
  }, [storage]);

  useEffect(() => {
    if (!state.dirty) return;
    const t = setTimeout(() => storage.save(state.ws), 500);
    return () => clearTimeout(t);
  }, [state, storage]);

  return (
    <StoreCtx.Provider value={{ state, dispatch, storage }}>
      {children}
    </StoreCtx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};

export const isoUpdatedAt = (ms: number) => formatISO(ms);
```

### 4) Editor骨格とBlockRenderer（`components/Editor.tsx`）

```tsx
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
```

※ ここではレンダリングのみ。実際の編集（Enterで分割、`/`でメニューなど）はハンドラを順次追加します。

### 5) SlashMenu（`components/SlashMenu.tsx`）最低限

```tsx
"use client";
import * as React from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
// shadcn/ui の Command を事前にセットアップしておく

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
```

### 6) レイアウト/ルーティング骨格

`app/providers.tsx`

```tsx
"use client";
import { StoreProvider } from "@/lib/store";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
```

`app/layout.tsx`

```tsx
import "./globals.css";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased flex">
        <Providers>
          <Sidebar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
```

`app/page.tsx`

```tsx
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function Home() {
  // Server Component内で直接Storeは使わない。実際はClient子コンポーネントを作る。
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">最近のページ</h2>
      {/* Clientコンポーネントへ切り出して一覧を描画 */}
      <RecentPages />
    </div>
  );
}

// 例: Client化した一覧（略）
function RecentPages() {
  return <div className="text-muted-foreground">実装スケルトン</div>;
}
```

`app/[pageId]/page.tsx`

```tsx
import { Editor } from "@/components/Editor";

export default function Page({ params }: { params: { pageId: string } }) {
  return <Editor pageId={params.pageId} />;
}
```

---

## 開発手順（0→1最短）

1. **雛形作成**：上記ファイルを配置、shadcnのCommandコンポーネントを導入。
2. **ページCRUD**：新規ページ作成、`rootBlockIds`に段落1個を生成、ルーティング。
3. **ブロック編集**：contenteditableにEnter/Backspaceのハンドラを追加し、**分割・結合**を実装。
4. **スラッシュメニュー**：空行で`/`入力時に表示し、選択でブロック型変換。
5. **保存**：`debounce`で`LocalStorageAdapter.save()`、読み込み時にzod検証。
6. **検索**：タイトルと本文を単純全文検索してサイドバーに結果表示。
7. **Undo/Redo**：`past/present/future`で簡易履歴。
8. **バックアップ/エクスポート**：JSONエクスポート/インポートUI。

---

## 拡張設計（次の一手）

* **IndexedDBAdapter**：巨大データ対応、差分保存。
* **D\&D並べ替え**：`@dnd-kit/core`でブロック移動・入れ子。
* **バックリンク**：`[[Page Title]]`検出→リンク生成＋参照一覧。
* **プロパティ**：`key:value`行をPageのメタへ昇格。
* **テンプレート**：会議メモ、仕様書、デイリーログ。
* **書式**：マークのレンダリング（bold等）を範囲選択に適用。
* **画像/ファイル**：URL貼付、将来はローカルキャッシュ（IndexedDB）。

---

## キーポイント

* **DB不使用でも、アダプタ設計で将来の同期に滑らかに移行**できます。
* **辞書化されたブロックモデル**が大規模化やUndo/Redoの土台になります。
* **zodバリデーションを保存前後に必ず通す**ことでデータ破損を防げます。
* **まずはLocalStorage、必要になったらIndexedDB**がコスパ最良です。