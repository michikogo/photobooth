# Phase 1 — Scaffolding

## Description

Sets up the monorepo structure for the Photobooth app. Both the React frontend (client) and Express backend (server) live in the same GitHub repository, managed as npm workspaces from the root.

The root `package.json` wires both together so a single `npm run dev` starts both processes concurrently with color-coded terminal output.

---

## Changes

### Root
| File | Description |
|------|-------------|
| `package.json` | Workspace root — defines `client` and `server` as workspaces, adds `concurrently` dev script |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `.env`, `server/uploads/`, `server/data/`, `*.db` |

### `client/`
| File | Description |
|------|-------------|
| `client/` | Scaffolded with `npm create vite@latest -- --template react` |
| `client/package.json` | Added `react-router-dom` and `roughjs` to dependencies |
| `client/vite.config.js` | Added `/api` proxy → `http://localhost:3001` so frontend can call backend without CORS issues in dev |
| `client/index.html` | Updated title to "Photobooth", added Google Fonts preconnect + Caveat font (400 & 700 weights) |

### `server/`
| File | Description |
|------|-------------|
| `server/package.json` | Express, cors, multer v2, dotenv. Uses `"type": "module"` (ESM). Nodemon for dev restarts |
| `server/routes/` | Empty folder — routes added in Phase 2 |
| `server/uploads/` | Empty folder — stores generated strip PNGs (gitignored) |

### Notable decision
`better-sqlite3` was originally planned but **fails to compile on Node 25** (requires C++20, macOS toolchain didn't support it). Switched to Node's **built-in `node:sqlite`** module (available since Node 22, no native compilation needed).

---

## Tradeoffs

### Monorepo + npm Workspaces
One repo, one `npm install`, one `npm run dev`. Simple for a single-developer project. If the app grows into multiple independent services, splitting into separate repos would scale better — not a concern here.

### Scalability
SQLite is single-file with no connection pooling — fine for a photobooth used one session at a time. If this ever became multi-user, the swap would be SQLite → PostgreSQL; the Express route structure supports that without a rewrite.

### Reliability & Availability
No process supervision in dev (nodemon restarts on file changes only). A server crash means manual restart. Strip images in `server/uploads/` are lost if the disk is wiped. For production: add PM2, move uploads to object storage (S3/R2).

### Security
- CORS will be locked to the frontend origin in production, not a wildcard.
- `.env` is gitignored; secrets never touch the repo.
- Upgraded multer v1 → v2 at scaffolding time to avoid known vulnerabilities.

### node:sqlite vs better-sqlite3
`better-sqlite3` failed to compile on Node 25 (C++ toolchain issue). Switched to Node's built-in `node:sqlite` (available since Node 22) — identical synchronous API, zero install step.

---

## How to Run

From the repo root:

```bash
npm install       # installs all workspace deps (client + server + root)
npm run dev       # starts both server (port 3001) and client (port 5173)
```

The `dev` script uses `concurrently` with labels:
- `[server]` — nodemon watching `server/`
- `[client]` — Vite HMR on port 5173

Visit `http://localhost:5173` for the frontend (shows Vite's default React page for now).

---

## Test Plan

### 1. Dependency install
```bash
npm install
# Expected: "added N packages, found 0 vulnerabilities"
```

### 2. Both processes start
```bash
npm run dev
# Expected:
# [server] nodemon starts (will error — index.js doesn't exist yet, that's ok)
# [client] VITE vX.X.X ready in Xms → Local: http://localhost:5173/
```

> The server will crash on start since `server/index.js` doesn't exist yet — that's intentional and will be fixed in Phase 2.

### 3. Vite dev server is reachable
Open `http://localhost:5173` → should show the default Vite + React page.

### 4. Proxy config is in place
`vite.config.js` should contain:
```js
server: { proxy: { '/api': 'http://localhost:3001' } }
```

### 5. Font loads
Open `client/index.html` → confirm `<link>` tags for `fonts.googleapis.com` and `fonts.gstatic.com` are present with the Caveat font.
