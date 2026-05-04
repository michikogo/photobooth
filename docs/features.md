# Features

A living document of every feature, its status, and the PR it shipped in.

---

## Shipped

### Core photobooth flow
**PR:** #1–#5 (scaffolding → styling)
- Menu page with timer selector (3s / 5s countdown)
- Camera page with live viewfinder, countdown overlay, flash effect
- Auto-captures 4 photos in sequence
- Navigates to strip page when done

### Photo strip compositing
**PR:** #4
- Canvas-based compositing of 4 photos stacked vertically
- Dark background (`#1a1a2e`), consistent padding and spacing
- Exported as a PNG data URL

### TypeScript migration
**PR:** #6
- Migrated client and server from JavaScript to TypeScript
- `tsx` used for server dev (replaces nodemon)

### Sketch / Excalidraw UI theme
**PR:** #5, #8
- Caveat font, rough hand-drawn aesthetic throughout
- `SketchButton` component with hover/active states
- ESLint + Prettier enforced via CI

### Shutter sound
**PR:** #7
- Plays a shutter sound on each photo capture

### Photobooth booth layout
**PR:** #9
- Menu page redesigned as a photobooth machine illustration
- Animated marquee sign with chasing dots
- Settings (timer, mode) overlaid on the machine body
- Circular start button on the machine

### AI border generation
**PRs:** #10 (server), #11 (code CLI), #12 (client utils), #13 (UI wiring)
- Generates a 600×1800 decorative background via Pollinations.ai (Flux model)
- Prompt built from three inputs: **occasion**, **vibe**, **color** (defaults: birthday, vintage, warm tones)
- Requires a single-use redemption code (`PHOTO-XXXX-XXXX` format)
- Code validated server-side: 404 not found, 409 already used, 410 expired
- Same session can re-roll (different random seed) without a new code
- AI image composited as background; photos inset on top with larger padding (PAD_X=40, PAD_Y=50)
- Codes generated via CLI: `npm run generate-codes -- --count=N --expires=YYYY-MM-DD`

### Border gallery (saved borders)
**PR:** #14
- Generated borders saved to disk (`uploads/borders/`) and tracked in `borders` DB table
- `GET /api/border/session/:sessionId` returns all borders for the session
- Frames tray on the left side of StripPage shows thumbnail previews
- Click a thumbnail to re-apply any previously generated border
- New borders added to the tray optimistically on generation

### Email strip
**PR:** #15
- Sends the photo strip to a given email address via Gmail OAuth2 (nodemailer + googleapis)
- Strip embedded as inline CID attachment — no external URL needed
- HTML email template at `server/template/email.html` (table-based layout for email client compatibility)

---

## Planned / Ideas

- Print support (send to a connected printer)
- QR code on-screen so guests can scan and download without emailing
- Admin dashboard to view sessions and manage codes
- Multiple strip layouts (2-photo, 6-photo, horizontal)
- Filters / overlays on photos before compositing
