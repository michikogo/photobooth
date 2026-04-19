# Phase 5 — Styling Polish

## Description

Extracts reusable `SketchButton` and `SketchCard` components and applies them consistently across all pages. `SketchCard` uses `roughjs` to render a genuine hand-drawn wobbly SVG border — the core of the Excalidraw aesthetic. All pages now use these components instead of raw `className` strings.

---

## Changes

| File | Description |
|------|-------------|
| `client/src/components/SketchButton.jsx` | Reusable button component wrapping the `sketch-btn` class. Supports `variant="primary"`, `disabled`, and `fullWidth` props |
| `client/src/components/SketchCard.jsx` | Card wrapper using `roughjs` to draw a wobbly SVG rectangle absolutely positioned over the content. Redraws on resize via `ResizeObserver` |
| `client/src/pages/MenuPage.jsx` | Replaced raw `div.sketch-card` with `<SketchCard>`, raw buttons with `<SketchButton>` |
| `client/src/pages/CameraPage.jsx` | Back button replaced with `<SketchButton>` |
| `client/src/pages/StripPage.jsx` | All action buttons replaced with `<SketchButton>` |
| `client/src/components/EmailModal.jsx` | All buttons replaced with `<SketchButton>` |
| `client/src/index.css` | Added `SketchCard` roughjs styles, disabled button state, full-width button variant |

---

## Tradeoffs

### roughjs SVG border vs pure CSS
`roughjs` generates a genuinely hand-drawn wobbly SVG path — this is what gives the Excalidraw look. Pure CSS (`box-shadow`, `border`) looks clean but geometric. The cost is ~28KB added to the bundle (roughjs) and a `useLayoutEffect` + `ResizeObserver` per card instance. For a small number of cards this is fine; for a list of hundreds it would be worth memoizing.

### ResizeObserver for redraws
The rough SVG border redraws whenever the card resizes so the border always fits the content. The alternative is drawing once on mount and accepting a stale border if the card grows. `ResizeObserver` is the right call — it handles font loading delays, dynamic content, and window resize cleanly.

### Component vs className
`SketchButton` and `SketchCard` are thin wrappers over CSS classes rather than fully styled-in-JS components. This keeps the styling in CSS (easier to inspect in devtools, no runtime overhead) while giving a consistent API and preventing typos in class names across pages.

### Scalability
Both components are stateless (except `SketchCard`'s resize effect) and have no external dependencies beyond roughjs. They can be reused in any future page or modal without modification.

---

## How to Run

```bash
npm run dev
# Open http://localhost:5173
```

The menu page now shows a roughjs hand-drawn border around the card. All buttons have the sketch style with hover/active states.

---

## Test Plan

- [ ] Menu card has a wobbly roughjs SVG border (not a straight CSS border)
- [ ] Resizing the browser window redraws the card border correctly
- [ ] All buttons have the sketch style (box-shadow, slight rotation on hover)
- [ ] Disabled buttons (Download/Email before strip loads) appear faded and non-clickable
- [ ] Start Photobooth button is full-width and red (primary variant)
- [ ] Email modal Cancel and Send buttons use SketchButton
- [ ] No console errors on any page
