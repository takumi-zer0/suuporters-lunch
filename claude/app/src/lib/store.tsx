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