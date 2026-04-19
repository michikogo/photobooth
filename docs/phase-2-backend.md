# Phase 2 — Backend

## Description

Implements the Express server: SQLite database setup, photo session saving, and a stubbed email route. The server is fully functional and testable via HTTP after this phase.

---

## Changes

| File | Description |
|------|-------------|
| `server/db.js` | Opens (or creates) `server/data/photobooth.db` using Node's built-in `node:sqlite`. Runs `CREATE TABLE IF NOT EXISTS sessions` on startup |
| `server/index.js` | Express entry point — CORS locked to `localhost:5173`, JSON body parser (20mb limit for base64 strips), static `/uploads` serving, mounts all routes |
| `server/routes/photos.js` | `POST /api/photos` — receives a base64 strip data URL, writes it as a PNG to `server/uploads/`, inserts a session row into SQLite, returns `{ sessionId, stripUrl }` |
| `server/routes/email.js` | `POST /api/email` — stubbed, returns `{ success: true }`. Nodemailer wired in a future phase |

---

## Tradeoffs

### File storage vs database BLOBs
Strip images are saved as PNG files in `server/uploads/` rather than stored as BLOBs in SQLite. File storage keeps the database lightweight and fast; BLOBs would make backups heavier and queries slower. Downside: files and DB rows can go out of sync if one is deleted independently. For production, move to object storage (S3/R2) with the URL stored in the DB row.

### 20mb JSON body limit
Base64 encoding inflates binary size by ~33%. A 1MB strip PNG becomes ~1.3MB of base64. The 20mb limit gives ample headroom for the strip composite. A future improvement would be multipart file upload (binary) to cut payload size.

### CORS origin
Locked to `http://localhost:5173` in dev via `CLIENT_ORIGIN` env var. In production, set `CLIENT_ORIGIN` to the deployed frontend URL — never use a wildcard in production.

### Stubbed email route
`POST /api/email` returns `{ success: true }` immediately. This keeps the frontend flow testable end-to-end without needing SMTP credentials configured. Nodemailer will be wired in when email is promoted from stub to real feature.

### Scalability
Each `POST /api/photos` does a synchronous file write + SQLite insert. SQLite's write lock means concurrent saves queue up — acceptable for a single-session photobooth. Under high concurrency, a job queue (BullMQ) + async storage upload would be the fix.

### Reliability
`server/data/` and `server/uploads/` are local to the server process. A server restart or wipe loses all data. For durability: periodic SQLite backups + object storage for uploads.

---

## How to Run

```bash
npm run dev --workspace=server
# or from root:
npm run dev
```

Server starts on `http://localhost:3001`.

---

## Test Plan

### 1. Health check
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok"}
```

### 2. Save a photo session
```bash
curl -X POST http://localhost:3001/api/photos \
  -H "Content-Type: application/json" \
  -d '{"stripDataUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'
# Expected: {"sessionId":1,"stripUrl":"/uploads/<uuid>.png"}
```

### 3. Verify PNG was written
```bash
ls server/uploads/
# Expected: <uuid>.png file present
```

### 4. Stub email route
```bash
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Expected: {"success":true}
```

### 5. SQLite session row
```bash
node --experimental-sqlite -e "
  import { DatabaseSync } from 'node:sqlite';
  const db = new DatabaseSync('server/data/photobooth.db');
  console.log(db.prepare('SELECT * FROM sessions').all());
"
# Expected: array with one session row
```
