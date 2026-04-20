import React, { useEffect, useRef } from "react";
import rough from "roughjs";

const PhotoboothIllustration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 500;
    const H = 680;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const rc = rough.canvas(canvas);
    const opt = { stroke: "#1a1a2e", strokeWidth: 2.5, roughness: 1.8 };
    const filled = { ...opt, fill: "#ffffff", fillStyle: "solid" };

    // Sign posts
    rc.line(175, 20, 175, 92, opt);
    rc.line(325, 20, 325, 92, opt);

    // Sign/marquee outline only — HTML provides the dark interior
    rc.rectangle(55, 5, 390, 82, opt);

    // Main booth body
    rc.rectangle(15, 90, 470, 572, filled);

    // Left/right panel divider
    rc.line(328, 90, 328, 662, opt);

    // Poster frame (upper-left panel — controls live here)
    rc.rectangle(26, 100, 292, 220, opt);

    // Dark entrance (right panel — solid hatch)
    rc.rectangle(334, 98, 146, 558, {
      ...opt,
      fill: "#1a1a2e",
      fillStyle: "hachure",
      hachureGap: 6,
      fillWeight: 1.5,
      hachureAngle: -45,
    });

    // Shelf inside entrance
    rc.line(338, 590, 476, 590, opt);

    // Photo dispenser slot (lower left body)
    rc.rectangle(60, 536, 150, 30, opt);
  }, []);

  return <canvas ref={canvasRef} className="booth-canvas" />;
};

export default PhotoboothIllustration;
