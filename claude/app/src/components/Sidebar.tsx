"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Upload } from "lucide-react";
import { createNewPage, createNewBlock, addBlockToPage } from "@/lib/operations";
import { TPage } from "@/lib/schema";

export const Sidebar: React.FC = () => {
  const { state, dispatch, storage } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const pages = Object.values(state.ws.pages);
  const recentPages = state.ws.recentPageIds
    .map(id => state.ws.pages[id])
    .filter((page): page is TPage => Boolean(page))
    .slice(0, 10);
    
  const filteredPages = pages.filter((page): page is TPage => {
    if (!page) return false;
    const typedPage = page as TPage;
    return typedPage.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateNewPage = () => {
    const newPage = createNewPage();
    const firstBlock = createNewBlock("paragraph");
    
    dispatch({ type: "UPSERT_PAGE", page: newPage });
    dispatch({ type: "UPSERT_BLOCKS", blocks: [firstBlock] });
    
    const updatedWorkspace = addBlockToPage(state.ws, newPage.id, firstBlock);
    dispatch({ type: "INIT", payload: updatedWorkspace });
    dispatch({ type: "SET_RECENT", pageId: newPage.id });
    
    router.push(`/${newPage.id}`);
  };

  const handleExport = async () => {
    try {
      const exportData = await storage.export();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notion-clone-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const workspace = await storage.import(text);
        dispatch({ type: "INIT", payload: workspace });
      } catch (error) {
        console.error('Import failed:', error);
        alert('Import failed. Please check the file format.');
      }
    };
    input.click();
  };

  return (
    <div className="w-64 bg-muted/20 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Notion Clone</h2>
      </div>
      
      <div className="p-4 space-y-4">
        <Button className="w-full justify-start" variant="outline" onClick={handleCreateNewPage}>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex-1">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={handleImport} className="flex-1">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search pages..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Search Results</h3>
            <div className="space-y-1">
              {filteredPages.map(page => (
                <Link 
                  key={page.id} 
                  href={`/${page.id}`}
                  className="block px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground"
                >
                  {page.title || "Untitled"}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Recent Pages</h3>
            <div className="space-y-1">
              {recentPages.map(page => (
                <Link 
                  key={page.id} 
                  href={`/${page.id}`}
                  className="block px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground"
                >
                  {page.title || "Untitled"}
                </Link>
              ))}
            </div>
            
            {pages.length > recentPages.length && (
              <>
                <h3 className="text-sm font-medium mb-2 mt-6">All Pages</h3>
                <div className="space-y-1">
                  {pages.filter((page): page is TPage => Boolean(page) && !recentPages.includes(page as TPage)).map(page => (
                    <Link 
                      key={page.id} 
                      href={`/${page.id}`}
                      className="block px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground"
                    >
                      {page.title || "Untitled"}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};