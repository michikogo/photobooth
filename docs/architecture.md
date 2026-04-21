# Architecture

## Overview

Photobooth is a monorepo with a React SPA frontend and an Express backend. They communicate via a JSON REST API. The server handles persistence, image proxying, and email delivery.

```
Browser (React SPA)
      │
      │ REST API (JSON)
      ▼
Express Server (Node.js)
      │
      ├── SQLite (sessions, codes)
      ├── uploads/ (strip PNGs on disk)
      └── Pollinations.ai (external, AI border generation)
```

---

## Key Design Decisions

### SQLite over a hosted database
**Why:** Zero infrastructure — no database server to provision or maintain. Fits the single-machine deployment model of a photobooth kiosk.

**Trade-off:** Not horizontally scalable. If the app ever needs to run across multiple servers, SQLite would need to be replaced with a shared DB (e.g. PostgreSQL).

### Strips stored as files, not in the database
**Why:** Avoids bloating the SQLite file with large blobs. Static files are served efficiently by Express's `express.static` middleware.

**Trade-off:** File and DB record can go out of sync if files are deleted manually. No automatic cleanup of orphaned files.

### AI border via server proxy (not direct client fetch)
**Why:** Keeps the `POLLINATIONS_KEY` secret server-side. Also allows the server to validate and consume the redemption code atomically before the image is returned.

**Trade-off:** The server holds the image in memory for the duration of the Pollinations request (~2–5s). Under high concurrency this could be a bottleneck.

### Single-use redemption codes for AI border
**Why:** Prevents abuse of the Pollinations API — each code costs a generation credit. Codes are pre-generated offline and distributed manually.

**Trade-off:** Adds friction for the user (must enter a code). Same-session re-roll is allowed (different seed, same code) to mitigate this.

### Canvas compositing on the client
**Why:** Keeps image processing off the server. The browser's Canvas API is capable enough for the strip layout, and it reduces server CPU load.

**Trade-off:** The composited strip is a large base64 data URL passed over the network to the server for saving. For very high-res strips this could be slow.

### Gmail OAuth2 for email (not SMTP password)
**Why:** Google no longer allows plain SMTP password auth for Gmail. OAuth2 refresh tokens are the supported approach.

**Trade-off:** Setup is more complex (OAuth Playground, refresh token rotation). The refresh token can expire if not used for 6 months.

---

## Scalability

| Concern | Current state | Path to scale |
|---------|--------------|---------------|
| Concurrent users | Single Node.js process, SQLite serializes writes | Switch to PostgreSQL + connection pooling |
| Strip storage | Local disk (`uploads/`) | Move to object storage (S3, R2) |
| AI border generation | Synchronous proxy, blocks request thread | Queue requests (BullMQ) + background worker |
| Email delivery | Direct Gmail OAuth2 send | Move to transactional email service (Resend, SendGrid) |

---

## Reliability

- The server creates the `data/` and `uploads/` directories on startup — no manual setup needed.
- SQLite uses WAL mode implicitly via `node:sqlite` — concurrent reads don't block writes.
- If Pollinations.ai returns a non-OK response, the server returns a 502 and the code is **not** consumed, so the user can retry.
- If email sending fails, the endpoint returns `{ success: false }` — no retry logic currently.

---

## Availability

- Single-process, single-machine. No redundancy.
- Intended deployment: local kiosk or small VPS. Downtime during restarts is acceptable in this context.
- `tsx watch` is used in dev; in production the app should be run under a process manager (e.g. `pm2`) to auto-restart on crash.
