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