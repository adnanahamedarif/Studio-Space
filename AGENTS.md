<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace

Single-route Next.js 16 App Router app (route in `src/app/page.tsx`) with a shadcn `base-nova` UI kit. No test runner or CI is configured yet.

## Commands

- Install with `npm install`; the repo uses npm (`package-lock.json`). Don't switch package managers or regenerate the lockfile unnecessarily.
- `npm run dev` — Turbopack dev server on http://localhost:3000.
- `npm run lint` — ESLint 9 flat config. It currently fails on two pre-existing `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`; only treat them as regressions if you touched those files.
- `npx tsc --noEmit` — standalone typecheck (there is no `typecheck` script). `npm run build` also runs TypeScript.
- `npm run build` — production build.

## UI stack (differs from typical shadcn)

- Components are shadcn v4 `base-nova` (`components.json`) built on **Base UI** (`@base-ui/react`), not Radix.
- Use Base UI's `render={<Button … />}` prop instead of `asChild`; style open/closed state with `data-open` / `data-closed`, not `data-[state=open]`. See `src/components/ui/dialog.tsx`.
- Import `cn` from the `cn` package (`import { cn } from "cn"`), matching every generated component. It replaces `clsx` + `tailwind-merge`; don't add those.
- `src/lib/utils.ts` only re-exports `cn` for the shadcn alias. Put real helpers elsewhere.
- Add primitives with `npx shadcn add <name>`; keep generated files in `src/components/ui` and preserve their `data-slot` / variant patterns.
- `message-scroller` and `questionnaire` wrap `@shadcn/react`; extra utilities such as `scroll-fade-*` come from `shadcn/tailwind.css`, imported by `src/app/globals.css`.
- Tailwind is CSS-first v4: theme variables live in `src/app/globals.css`; there is no `tailwind.config.*`. The `@tailwindcss/turbopack` loader is wired in `next.config.ts`.

## Next.js setup

- `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback` are enabled in `next.config.ts`; read the matching docs under `node_modules/next/dist/docs/` before changing caching, data fetching, or prefetch behavior.
- Use the generated global helpers `LayoutProps<'/route'>`, `PageProps<'/route'>`, and `RouteContext<'/route'>` instead of hand-writing layout/page/route prop types.
- `next dev` may rewrite the marked blocks in this file (Next rules and agent feedback). Don't edit or revert them; commit `AGENTS.md` with your work.

## Code rendering

- `src/lib/highlighter.tsx` lazily loads Shiki languages/themes. Register new languages and aliases in its `languages` / `aliases` maps; unsupported languages fall back to plain text.
- `src/hooks/use-highlighted-code.ts` intentionally updates state during render to tokenize only new streaming lines. Moving that logic into an effect breaks incremental highlighting.

## Layout

- `@/*` maps to `src/*`.
- Routes: `src/app`; shared UI: `src/components/ui`; hooks: `src/hooks`; utilities: `src/lib`.
