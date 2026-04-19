# Phase 4 — Strip & Actions

## Description

Completes the photobooth flow. After 4 photos are captured, the app composites them into a single vertical strip using the Canvas API, saves it to the backend, and gives the user options to download or email it. The email send is still stubbed server-side but fully wired on the frontend.

---

## Changes

| File | Description |
|------|-------------|
| `client/src/utils/compositeStrip.js` | Canvas compositor — draws 4 photos onto a dark background with padding, renders "photobooth" label and date at the bottom using Caveat font |
| `client/src/utils/api.js` | Fetch helpers for `POST /api/photos` (save strip) and `POST /api/email` (send email) |
| `client/src/pages/StripPage.jsx` | Full implementation — composites strip on mount, saves to backend, shows composite image, Download and Email buttons, loading state |
| `client/src/components/EmailModal.jsx` | Modal with email input, Send button, success/error states. Calls `POST /api/email` |
| `client/src/index.css` | Added strip wrap, loading placeholder, action buttons row, modal backdrop, sketch input, modal states |

---

## Tradeoffs

### Canvas compositor client-side vs server-side
Strip compositing runs entirely in the browser using the Canvas API. No server CPU used, works offline after page load, and no file I/O latency. The downside is that large canvases on low-end devices can be slow. Server-side compositing (e.g. with `sharp` or `canvas` npm package) would offload the work but adds complexity and a round-trip. Client-side is the right call here.

### Saving strip to backend on load vs on demand
`StripPage` auto-saves the strip to the backend as soon as it's composited, before the user clicks Download or Email. This means every session is persisted, even if the user just closes the tab. Tradeoff: generates orphaned records if the user never downloads. For a photobooth this is acceptable — sessions are cheap to store.

### Download via anchor click vs Blob URL
The download uses a temporary `<a>` element with `href=dataUrl` and `download` attribute. Simple and reliable across browsers. An alternative is `URL.createObjectURL(blob)` which avoids large data URLs in the DOM, but the added complexity isn't worth it at this file size.

### Email stub
`POST /api/email` returns `{ success: true }` without sending anything. The frontend modal shows a success state either way. This lets the full UI flow be tested without SMTP credentials. Nodemailer will be wired in as a future enhancement.

### Scalability
The base64 strip is sent to the backend as a JSON string (~1–2MB). For higher throughput, switching to multipart binary upload would cut payload size by ~33%. Not a concern at photobooth scale.

### Reliability
If `saveStrip` fails (network error, server down), the error is silently swallowed — the user can still download locally. This is intentional: a failed save shouldn't block the user from getting their photo.

---

## How to Run

```bash
npm run dev
```

Full flow:
1. `http://localhost:5173` → pick timer → Start
2. Camera captures 4 photos with countdown
3. Strip page composites and shows the strip
4. Click **Download** to save `photobooth-strip.png`
5. Click **Email** → enter address → Send (stubbed, shows success)
6. Click **Back** to return to menu

---

## Test Plan

- [ ] After 4 photos, `/strip` shows a loading message then the composited strip
- [ ] Strip shows 4 photos stacked vertically on a dark background with label and date
- [ ] **Download** saves a PNG file locally
- [ ] **Email** opens the modal with an email input
- [ ] Submitting the modal shows "Sent! Check your inbox." (stub)
- [ ] Closing the modal returns to the strip page
- [ ] `GET http://localhost:3001/uploads/<uuid>.png` serves the saved strip
- [ ] SQLite `sessions` table has a new row with `strip_path` populated
- [ ] Navigating to `/strip` without photos (direct URL) redirects to `/`
