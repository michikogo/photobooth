# TypeScript Migration

## Description

Migrates the entire codebase from JavaScript to TypeScript — both the React frontend (client) and Express backend (server). No new features added; this is a pure language migration for better type safety, IDE support, and maintainability.

---

## Changes

### Client
| File | Change |
|------|--------|
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | New — strict TypeScript config with `bundler` module resolution for Vite |
| `vite.config.js` → `vite.config.ts` | Renamed |
| `eslint.config.js` | Extended to cover `**/*.{ts,tsx}` |
| `package.json` | Added `typescript` devDep |
| `src/**/*.jsx` → `*.tsx` | All React components renamed |
| `src/**/*.js` → `*.ts` | All utility files renamed |

**Key type annotations added:**
- `CameraPage`: `type Phase = 'starting' | 'countdown' | 'snap' | 'done'`, typed refs (`useRef<HTMLVideoElement>`, `useRef<HTMLCanvasElement>`, `useRef<MediaStream | null>`)
- `SketchButton`: `interface SketchButtonProps` with `variant?: 'default' | 'primary'`
- `SketchCard`: typed `useRef<SVGSVGElement>` and `useRef<HTMLDivElement>`
- `EmailModal`: `type Status = 'idle' | 'sending' | 'success' | 'error'`
- `compositeStrip`: `(photos: string[]) => Promise<string>`
- `api.ts`: `SaveStripResponse` and `EmailResponse` interfaces

### Server
| File | Change |
|------|--------|
| `tsconfig.json` | New — strict config with `NodeNext` module resolution |
| `package.json` | Added `tsx`, `typescript`, `@types/express`, `@types/cors`, `@types/multer` |
| `index.js` → `index.ts` | Renamed, typed Express app |
| `db.js` → `db.ts` | Renamed, added `Session` interface |
| `routes/photos.js` → `photos.ts` | Renamed, typed `Request`/`Response` and request body |
| `routes/email.js` → `email.ts` | Renamed |

---

## Tradeoffs

### tsx vs ts-node vs compile-then-run
`tsx` is a fast, ESM-compatible TypeScript runner. It's a drop-in replacement for `node` — no tsconfig changes needed to run, no separate compilation step. `ts-node` is older and has ESM quirks. Compiling with `tsc` then running the output adds a build step to the dev loop. `tsx` wins for dev ergonomics.

### NodeNext module resolution (server)
Server tsconfig uses `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`. This enforces explicit `.ts` extensions in imports (e.g. `import db from './db.ts'`), which is required for Node's ESM loader to resolve files correctly. This is stricter than `bundler` resolution (used on the client) but correct for a Node runtime.

### strict: true everywhere
Both client and server use `strict: true` which enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and more. This catches the most bugs at compile time. The one consequence is needing explicit null checks (e.g. `canvas.getContext('2d')!`) where we know a value can't be null at runtime.

### Non-null assertions (!)
Used sparingly in `CameraPage` and `compositeStrip` where the DOM elements are guaranteed to exist when the code runs (refs already mounted, canvas context always available for a 2D canvas). Each usage is justified by the surrounding logic.

### node:sqlite types
`node:sqlite` is a built-in Node 22+ module. Types are included in `@types/node` — no extra package needed.

---

## How to Run

```bash
npm install
npm run dev
# [client] → http://localhost:5173 (Vite + TypeScript)
# [server] → http://localhost:3001 (tsx + nodemon)
```

---

## Test Plan

- [ ] `npm run build --workspace=client` completes with 0 TypeScript errors
- [ ] `curl http://localhost:3001/api/health` returns `{"status":"ok"}`
- [ ] Full flow works: menu → camera → 4 photos → strip → download
- [ ] No `any` types in source (grep for `: any`)
- [ ] IDE shows type hints and catches errors in `.tsx`/`.ts` files
