"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const layerSlow = useRef<HTMLDivElement>(null);
  const layerMed = useRef<HTMLDivElement>(null);
  const layerFast = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const applyParallax = () => {
      const y = window.scrollY || 0;
      if (layerSlow.current)
        layerSlow.current.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
      if (layerMed.current)
        layerMed.current.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
      if (layerFast.current)
        layerFast.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        applyParallax();
        raf = 0;
      });
    };
    // Set initial positions in case page loads scrolled.
    applyParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Parallax layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          ref={layerSlow}
          aria-hidden
          className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-300/60 to-indigo-200/40 blur-3xl transform-gpu [will-change:transform] motion-reduce:transform-none"
        />
        <div
          ref={layerMed}
          aria-hidden
          className="absolute top-20 right-[10%] h-64 w-64 rounded-full bg-gradient-to-br from-cyan-300/50 to-sky-200/40 blur-3xl transform-gpu [will-change:transform] motion-reduce:transform-none"
        />
        <div
          ref={layerFast}
          aria-hidden
          className="absolute -bottom-24 left-[8%] h-80 w-80 rounded-full bg-gradient-to-br from-rose-300/50 to-orange-200/40 blur-3xl transform-gpu [will-change:transform] motion-reduce:transform-none"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
            AIコーディングツール
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Claude Code × Codex × Gemini CLI
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-neutral-600">
            最新のAIコーディングアシスタント3種を、
            ワークフロー・強み・適したユースケースの観点で簡潔に比較します。
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="#overview" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-neutral-800">
              概要
            </a>
            <a href="#compare" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
              比較
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
