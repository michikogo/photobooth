const STRIP_W = 600;
const STRIP_H = 1800;
const PAD_X = 20;
const PAD_Y = 20;
const GAP = 10;
const LABEL_H = 60;

const PHOTO_W = STRIP_W - PAD_X * 2;
const PHOTO_H = Math.round((STRIP_H - PAD_Y * 2 - GAP * 3 - LABEL_H) / 4);

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });

const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
};

export const compositeStrip = async (photos: string[]): Promise<string> => {
  const images = await Promise.all(photos.map(loadImage));

  const canvas = document.createElement("canvas");
  canvas.width = STRIP_W;
  canvas.height = STRIP_H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  await document.fonts.load("700 16px Caveat");

  images.forEach((img, i) => {
    const x = PAD_X;
    const y = PAD_Y + i * (PHOTO_H + GAP);
    drawCover(ctx, img, x, y, PHOTO_W, PHOTO_H);
  });

  const labelY = STRIP_H - LABEL_H + 18;
  ctx.fillStyle = "#faf7f0";
  ctx.font = "700 28px Caveat";
  ctx.textAlign = "center";
  ctx.fillText("📷 photobooth", STRIP_W / 2, labelY);

  ctx.font = "400 20px Caveat";
  ctx.fillStyle = "rgba(250,247,240,0.6)";
  ctx.fillText(new Date().toLocaleDateString(), STRIP_W / 2, labelY + 22);

  return canvas.toDataURL("image/png");
};
