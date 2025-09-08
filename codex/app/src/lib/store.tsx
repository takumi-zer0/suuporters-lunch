"use client";
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { TWorkspace, TPage, TBlock } from "@/lib/schema";
import { emptyWorkspace } from "@/lib/schema";
import { LocalStorageAdapter, type StorageAdapter } from "@/lib/storage";

type Action =
  | { type: "INIT"; payload: TWorkspace }
  | { type: "UPSERT_PAGE"; page: TPage }
  | { type: "UPSERT_BLOCKS"; blocks: TBlock[] }
  | { type: "DELETE_BLOCKS"; ids: string[] }
  | { type: "SET_RECENT"; pageId: string }
  | { type: "TOUCH" };

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
      const ids = [a.pageId, ...s.ws.recentPageIds.filter((id) => id !== a.pageId)].slice(0, 20);
      const ws = { ...s.ws, recentPageIds: ids };
      ws.meta.updatedAt = Date.now();
      return { ws, dirty: true };
    }
    case "TOUCH": {
      const ws = { ...s.ws, meta: { ...s.ws.meta, updatedAt: Date.now() } };
      return { ws, dirty: true };
    }
    default:
      return s;
  }
};

const StoreCtx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  storage: StorageAdapter;
} | null>(null);

const useDebounced = (fn: () => void, delay: number, deps: React.DependencyList) => {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(fn, delay);
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storage = useMemo(() => new LocalStorageAdapter(), []);
  const [state, dispatch] = useReducer(reducer, { ws: emptyWorkspace(), dirty: false });

  // load workspace
  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await storage.load();
      // bootstrap empty workspace with a starter page
      if (Object.keys(loaded.pages).length === 0) {
        const now = Date.now();
        const pageId = genId();
        const blockId = genId();
        loaded.pages[pageId] = {
          id: pageId,
          title: "Untitled",
          icon: null,
          cover: null,
          rootBlockIds: [blockId],
          createdAt: now,
          updatedAt: now,
        };
        loaded.blocks[blockId] = makeBlock(blockId, "paragraph");
        loaded.recentPageIds = [pageId];
        loaded.meta.updatedAt = now;
        await storage.save(loaded);
      }
      if (alive) dispatch({ type: "INIT", payload: loaded });
    })();
    return () => {
      alive = false;
    };
  }, [storage]);

  // auto-save when dirty
  useDebounced(
    () => {
      if (state.dirty) storage.save(state.ws);
    },
    500,
    [state.ws, state.dirty, storage]
  );

  const value = useMemo(() => ({ state, dispatch, storage }), [state, dispatch, storage]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("StoreProvider is missing");
  return ctx;
};

// helpers
export const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const makeBlock = (id: string, type: TBlock["type"], text = ""): TBlock => {
  const now = Date.now();
  return {
    id,
    type,
    parentId: null,
    children: [],
    text: [{ text, marks: [] }],
    props: {},
    collapsed: false,
    createdAt: now,
    updatedAt: now,
  };
};

