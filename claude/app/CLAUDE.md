# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` 
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS v4. The project showcases a comparison between AI coding tools (Claude Code, Codex, and Gemini CLI) with a modern, responsive landing page.

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with inline theming
- **Fonts**: Geist Sans and Geist Mono via next/font/google
- **Build**: Turbopack enabled for development and production

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration and metadata
  - `page.tsx` - Main landing page with parallax animations and comparison content
  - `globals.css` - Global styles with Tailwind CSS imports and CSS variables

### Code Patterns
- Uses `'use client'` directive for client-side interactivity (scroll effects)
- Implements CSS-in-JS style transforms for parallax animations
- Follows modern React patterns with hooks (useState, useEffect)
- Uses Tailwind utility classes with backdrop-blur and gradient effects
- Responsive design with mobile-first approach using Tailwind breakpoints

### Path Aliases
- `@/*` maps to `./src/*` for clean imports

### Styling Architecture
- CSS variables defined in globals.css for theme colors
- Dark mode support via `prefers-color-scheme`
- Tailwind v4 inline theming with `@theme` directive
- Modern glass-morphism effects with backdrop-blur utilities

The application focuses on visual presentation with smooth scrolling effects and animated elements to showcase the AI coding tools comparison in an engaging way.