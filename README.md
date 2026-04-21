# Photobooth

A web-based photobooth app that lets users take 4 photos, generate a photo strip, apply an AI-generated border, and email the result.

---

## Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Frontend  | React 19, React Router v6, TypeScript, Vite         |
| Backend   | Node.js, Express 4, TypeScript (`tsx`)              |
| Database  | SQLite (Node built-in `node:sqlite`)                |
| Email     | Nodemailer + Gmail OAuth2 (`googleapis`)            |
| AI border | Pollinations.ai (Flux model)                        |
| UI style  | Rough.js, Caveat font (sketch/Excalidraw aesthetic) |

---

## Project Structure

```
photobooth/
├── client/          # Vite + React frontend
│   └── src/
│       ├── pages/       # MenuPage, CameraPage, StripPage
│       ├── components/  # SketchButton, EmailModal, BorderModal
│       └── utils/       # compositeStrip, api.ts
├── server/          # Express backend
│   ├── routes/      # photos.ts, email.ts, border.ts
│   ├── scripts/     # generate-codes.ts (CLI)
│   ├── template/    # email.html
│   └── data/        # SQLite DB (gitignored)
└── docs/            # Phase and feature docs
```

---

## Features

- **Camera flow** — 3-second countdown, 4 auto-captured photos with flash effect
- **Photo strip** — composited canvas strip (4 photos stacked with padding and dark background)
- **AI border** — generates a 600×1800 decorative background via Pollinations.ai using a prompt built from occasion, vibe, and color inputs; requires a single-use redemption code
- **Border gallery** — saved borders shown as a thumbnail tray on the strip page; click any to re-apply
- **Email** — sends the photo strip as an inline CID attachment via Gmail OAuth2
- **Download** — saves the strip as a PNG

---

## Environment Variables

Create a `server/.env` file:

```env
# Gmail OAuth2 (required for email feature)
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
REFRESH_TOKEN=
SENDER_EMAIL=

# Pollinations.ai (optional — increases rate limits)
POLLINATIONS_KEY=
```

### Getting Gmail OAuth2 credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → Create a project
2. Enable the **Gmail API**
3. Create OAuth2 credentials (Desktop app) → copy `CLIENT_ID` and `CLIENT_SECRET`
4. Set `REDIRECT_URI` to `https://developers.google.com/oauthplayground`
5. Go to [OAuth Playground](https://developers.google.com/oauthplayground) → settings → use your own credentials
6. Authorize `https://mail.google.com/` → exchange for tokens → copy `REFRESH_TOKEN`
7. Set `SENDER_EMAIL` to your Gmail address

---

## Getting Started

```bash
# Install all dependencies
npm install

# Start both client and server in dev mode
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

---

## Generating AI Border Codes

Codes are required to use the AI border feature. Generate them with:

```bash
npm run generate-codes --workspace=server -- --count=5 --expires=2026-12-31
```

This prints codes in the format `PHOTO-XXXX-XXXX`. Each code is single-use and expires at the given date.

---

## Server Scripts

| Script                | Command                                                    |
| --------------------- | ---------------------------------------------------------- |
| Start dev server      | `npm run dev` (from `server/`)                             |
| Generate border codes | `npm run generate-codes -- --count=N --expires=YYYY-MM-DD` |

---

## Database

SQLite file is stored at `server/data/photobooth.db` (created automatically on first run).

Tables:

- `sessions` — each strip session (strip path, email sent, email recipient)
- `codes` — single-use AI border redemption codes (with expiry)
