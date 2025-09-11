'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div 
        className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      {/* 追加のパララックス背景レイヤー */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
          opacity: Math.max(0.3 - scrollY / 1000, 0),
        }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-80 left-1/3 w-24 h-24 bg-pink-300/20 rounded-full blur-xl"></div>
      </div>
      
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * -0.1}px)`,
          opacity: Math.max(0.4 - scrollY / 800, 0),
        }}
      >
        <div className="absolute top-60 right-10 w-28 h-28 bg-indigo-300/15 rounded-full blur-2xl"></div>
        <div className="absolute top-32 left-1/2 w-36 h-36 bg-teal-300/15 rounded-full blur-2xl"></div>
        <div className="absolute top-96 right-1/4 w-20 h-20 bg-orange-300/15 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10">
        <header className="py-20 text-center">
          <div 
            className="container mx-auto px-6"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: Math.max(1 - scrollY / 400, 0)
            }}
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
              AI Coding Tools
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Claude Code、Codex、Gemini CLI の特徴と機能を詳しく比較
            </p>
          </div>
        </header>

        <section className="py-20">
          <div 
            className="container mx-auto px-6"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Claude Code</h3>
                <p className="text-slate-600 mb-6">
                  Anthropicが開発したターミナルベースのAIコーディングアシスタント。高度なコードベース理解と統合機能を提供。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Claude Opus 4.1 モデル搭載
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    ターミナル統合
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    MCP サーバー対応
                  </div>
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Codex</h3>
                <p className="text-slate-600 mb-6">
                  OpenAIが開発したコード生成特化AI。GitHub Copilotの基盤技術として使用されており、高精度なコード補完を提供。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    GPT-4 Turbo ベース
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    API 統合
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    多言語対応
                  </div>
                </div>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Gemini CLI</h3>
                <p className="text-slate-600 mb-6">
                  Googleが開発したオープンソースのターミナルAIエージェント。豊富な内蔵ツールとMCP対応。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Gemini 2.5 Pro モデル
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    オープンソース
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    1M トークン対応
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50/50">
          <div 
            className="container mx-auto px-6"
            style={{
              transform: `translateY(${scrollY * -0.02}px)`,
            }}
          >
            <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
              詳細比較
            </h2>
            
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-slate-800 font-semibold">機能</th>
                        <th className="px-6 py-4 text-center text-slate-800 font-semibold">Claude Code</th>
                        <th className="px-6 py-4 text-center text-slate-800 font-semibold">Codex</th>
                        <th className="px-6 py-4 text-center text-slate-800 font-semibold">Gemini CLI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">主要モデル</td>
                        <td className="px-6 py-4 text-center text-slate-600">Claude Opus 4.1</td>
                        <td className="px-6 py-4 text-center text-slate-600">GPT-4 Turbo</td>
                        <td className="px-6 py-4 text-center text-slate-600">Gemini 2.5 Pro</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">環境</td>
                        <td className="px-6 py-4 text-center text-slate-600">ターミナル + IDE拡張</td>
                        <td className="px-6 py-4 text-center text-slate-600">API + プラグイン</td>
                        <td className="px-6 py-4 text-center text-slate-600">ターミナル + VS Code</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">価格</td>
                        <td className="px-6 py-4 text-center text-slate-600">有料プラン</td>
                        <td className="px-6 py-4 text-center text-slate-600">API従量課金</td>
                        <td className="px-6 py-4 text-center text-slate-600">無料枠あり</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">コンテキスト</td>
                        <td className="px-6 py-4 text-center text-slate-600">コードベース全体</td>
                        <td className="px-6 py-4 text-center text-slate-600">プロンプトベース</td>
                        <td className="px-6 py-4 text-center text-slate-600">1M トークン</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">エージェント機能</td>
                        <td className="px-6 py-4 text-center text-slate-600">高度なタスク実行</td>
                        <td className="px-6 py-4 text-center text-slate-600">コード生成特化</td>
                        <td className="px-6 py-4 text-center text-slate-600">ReAct ループ</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">外部統合</td>
                        <td className="px-6 py-4 text-center text-slate-600">Git, GitHub, MCP</td>
                        <td className="px-6 py-4 text-center text-slate-600">OpenAI API</td>
                        <td className="px-6 py-4 text-center text-slate-600">MCP サーバー</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div 
            className="container mx-auto px-6 text-center"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`,
            }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-8">
              どのツールを選ぶべきか？
            </h2>
            
            <div 
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
              style={{
                transform: `translateY(${scrollY * 0.04}px)`,
              }}
            >
              <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Claude Code</h3>
                <p className="text-purple-700 text-sm">
                  大規模なコードベースの深い理解が必要で、ターミナルでの作業を好む開発者に最適
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-4">Codex</h3>
                <p className="text-orange-700 text-sm">
                  API経由で柔軟に統合し、高精度のコード生成を求める開発者に最適
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Gemini CLI</h3>
                <p className="text-blue-700 text-sm">
                  オープンソースで無料から始めたく、豊富な統合機能を求める開発者に最適
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <p className="text-slate-400">
              © 2025 AI Coding Tools Comparison. 最新の情報については各公式サイトをご確認ください。
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
