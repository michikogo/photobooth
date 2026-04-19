# Phase 3 — Camera Flow

## Description

Implements the full frontend camera capture flow. The user lands on a doodle-style menu, picks a timer, then the app takes 4 photos with a countdown before each one. After all 4 are captured, the user is sent to the strip preview page. The Excalidraw sketch aesthetic is applied globally in this phase.

---

## Changes

| File | Description |
|------|-------------|
| `client/src/main.jsx` | Wrapped app in `BrowserRouter` to enable client-side routing |
| `client/src/App.jsx` | Replaced Vite default with `react-router-dom` routes: `/`, `/camera`, `/strip` |
| `client/src/index.css` | Full sketch theme — CSS vars (`--bg`, `--ink`, `--accent`), Caveat font, sketch buttons, countdown animation, flash effect, camera layout |
| `client/src/App.css` | Cleared — all styles consolidated into `index.css` |
| `client/src/pages/MenuPage.jsx` | Landing page with title, timer picker (3s/5s/10s), and Start button. Passes timer to `/camera` via router state |
| `client/src/pages/CameraPage.jsx` | Webcam capture state machine (`starting → countdown → snap → done`). Counts down before each of 4 photos, captures via offscreen canvas, navigates to `/strip` with photos in router state |
| `client/src/pages/StripPage.jsx` | Placeholder strip preview — renders 4 captured thumbnails vertically. Full compositor added in Phase 4 |
| `client/src/components/Countdown.jsx` | Animated countdown number overlay rendered over the viewfinder |

---

## Tradeoffs

### Router state vs global state (Context/Zustand)
Photos and timer are passed between pages via `react-router-dom` location state (`navigate('/strip', { state: { photos } })`). This keeps the app dependency-free and straightforward — state lives with the navigation event. Downside: refreshing `/strip` loses the photos. Acceptable for a photobooth flow (linear, not bookmarkable). If sharing strips by URL were needed, photos would need to be persisted (backend or localStorage) before navigating.

### Canvas capture vs MediaRecorder
Each photo is captured by drawing the video frame to an offscreen `<canvas>` and calling `toDataURL('image/png')`. Simple and universally supported. The alternative (MediaRecorder) is better for video but overkill for still frames.

### Mirrored viewfinder
The `<video>` element is CSS-mirrored (`transform: scaleX(-1)`) so it feels like a selfie camera. The canvas capture does **not** mirror — the saved photo is the natural (non-mirrored) orientation. This matches what every phone camera app does.

### Scalability
All capture logic runs client-side in the browser. No server load during the capture phase — the server is only involved when the strip is saved (Phase 4). This makes the camera flow work even on a slow connection.

### Reliability
If the user denies camera permission, `getUserMedia` rejects and the app navigates back to `/`. No crash, no stuck state.

---

## How to Run

```bash
npm run dev
```

- Open `http://localhost:5173`
- Select a timer and click **Start Photobooth**
- Allow camera access when prompted
- Watch 4 countdowns, 4 captures
- Land on the strip preview page

---

## Test Plan

- [ ] `/` shows the menu with title, timer options (3s/5s/10s), and Start button
- [ ] Selecting a timer highlights the active option
- [ ] Clicking Start navigates to `/camera` and activates the webcam
- [ ] Countdown fires before each photo (correct timer value)
- [ ] White flash appears on each capture
- [ ] Dots below the viewfinder fill in after each photo
- [ ] After 4 photos, navigates to `/strip` and shows 4 thumbnails
- [ ] Back button on `/camera` returns to menu and stops the webcam stream
- [ ] Denying camera permission navigates back to `/` without crashing
