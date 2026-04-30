# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### SEO Inspector (`artifacts/seo-inspector`)
- **Preview path**: `/`
- **Description**: Interactive SEO meta tag analyzer. Fetches any URL server-side and provides Google/Open Graph/Twitter previews plus tag-by-tag scoring against best practices.
- **Key features**:
  - Visual Google SERP preview, Open Graph card preview, Twitter/X card preview
  - Score breakdown (General, OG, Twitter, Technical — 0-100)
  - Per-tag pass/warn/fail checks with recommendations
  - Raw tags table

### API Server (`artifacts/api-server`)
- **Preview path**: `/api`
- **Routes**:
  - `GET /api/healthz` — health check
  - `POST /api/seo/analyze` — fetch and analyze SEO tags for a given URL
- **Key lib**: `artifacts/api-server/src/lib/seo-analyzer.ts` — SEO parsing and scoring logic

## Notes
- `lib/api-zod/src/index.ts` only exports from `./generated/api` (not `./generated/types`) to avoid export name conflicts
- The orval config in `lib/api-spec/orval.config.ts` was modified to remove the `schemas` path for the zod output
