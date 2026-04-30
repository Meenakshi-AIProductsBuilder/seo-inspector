# SEO Inspector

  An interactive SEO meta tag analyzer that fetches any URL and provides visual previews and detailed feedback based on SEO best practices.

  ## Features

  - Visual Google SERP preview
  - Open Graph (Facebook/LinkedIn) card preview  
  - Twitter/X card preview
  - Per-tag pass/warn/fail scoring (title, description, canonical, robots, OG tags, Twitter tags, technical checks)
  - Raw tags table

  ## Stack

  - **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
  - **Backend**: Express 5 + TypeScript
  - **API**: OpenAPI spec → Orval codegen (Zod schemas + React Query hooks)
  - **Monorepo**: pnpm workspaces
  