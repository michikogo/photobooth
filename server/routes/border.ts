import { Router, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import db from "../db.ts";
import type { Code, Border } from "../db.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const bordersDir = join(__dirname, "..", "uploads", "borders");
mkdirSync(bordersDir, { recursive: true });

const router = Router();

const DEFAULT_PROMPT =
  "photo booth border frame, birthday, vintage, warm tones, decorative, no people";

router.get("/session/:sessionId", (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  if (isNaN(sessionId)) {
    res.status(400).json({ error: "invalid sessionId" });
    return;
  }

  const borders = db
    .prepare("SELECT * FROM borders WHERE session_id = ? ORDER BY created_at DESC")
    .all(sessionId) as Border[];

  res.json({ borders });
});

router.post("/", async (req: Request, res: Response) => {
  const { code, prompt, sessionId } = req.body as {
    code: string;
    prompt?: string;
    sessionId?: number;
  };

  if (!code) {
    res.status(400).json({ error: "code is required" });
    return;
  }

  const row = db.prepare("SELECT * FROM codes WHERE code = ?").get(code) as Code | undefined;

  if (!row) {
    res.status(404).json({ error: "Code not found" });
    return;
  }

  // Allow the same session to re-roll (different seed) without a new code
  if (row.used_at !== null) {
    const sameSession =
      sessionId !== undefined &&
      row.used_by_session_id !== null &&
      row.used_by_session_id === sessionId;
    if (!sameSession) {
      res.status(409).json({ error: "Code has already been used" });
      return;
    }
  }

  const expired = db
    .prepare("SELECT 1 FROM codes WHERE code = ? AND expires_at <= datetime('now')")
    .get(code);

  if (expired) {
    res.status(410).json({ error: "Code has expired" });
    return;
  }

  const finalPrompt = prompt?.trim() || DEFAULT_PROMPT;
  const encodedPrompt = encodeURIComponent(finalPrompt);
  const seed = Math.floor(Math.random() * 2 ** 32);
  const key = process.env.POLLINATIONS_KEY;
  const keyParam = key ? `&key=${key}` : "";
  const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=600&height=1800&seed=${seed}&enhance=false${keyParam}`;

  const imageRes = await fetch(url);
  if (!imageRes.ok) {
    res.status(502).json({ error: "Failed to generate border image" });
    return;
  }

  const buffer = await imageRes.arrayBuffer();
  const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const borderPath = `/uploads/borders/${filename}`;

  writeFileSync(join(bordersDir, filename), Buffer.from(buffer));

  db.prepare(
    "UPDATE codes SET used_at = datetime('now'), used_by_session_id = ? WHERE code = ?",
  ).run(sessionId ?? null, code);

  const result = db
    .prepare("INSERT INTO borders (session_id, border_path, prompt) VALUES (?, ?, ?)")
    .run(sessionId ?? null, borderPath, finalPrompt);

  const base64 = Buffer.from(buffer).toString("base64");
  const borderDataUrl = `data:${contentType};base64,${base64}`;

  res.json({ borderDataUrl, borderPath, borderId: result.lastInsertRowid });
});

export default router;
