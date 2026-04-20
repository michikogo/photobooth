import React from "react";

const W = 280;
const H = 68;
const GAP = 16;
const R = 4.5;
const PAD = R + 5;
const CYCLE = 1.8;

const buildDots = () => {
  const dots: { x: number; y: number }[] = [];
  for (let x = PAD; x <= W - PAD; x += GAP) dots.push({ x, y: PAD });
  for (let y = PAD + GAP; y <= H - PAD; y += GAP) dots.push({ x: W - PAD, y });
  for (let x = W - PAD - GAP; x >= PAD; x -= GAP) dots.push({ x, y: H - PAD });
  for (let y = H - PAD - GAP; y >= PAD + GAP; y -= GAP) dots.push({ x: PAD, y });
  return dots;
};

const dots = buildDots();

const BoothSign = () => {
  return (
    <div className="booth-sign-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="booth-sign-svg" preserveAspectRatio="none">
        <rect width={W} height={H} rx={3} fill="#FFFFFF" />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={R}
            className="sign-dot"
            style={{ animationDelay: `${-(i / dots.length) * CYCLE}s` }}
          />
        ))}
      </svg>
      <div className="sign-text-wrap">
        <div className="sign-title">PHOTOBOOTH</div>
      </div>
    </div>
  );
};

export default BoothSign;
