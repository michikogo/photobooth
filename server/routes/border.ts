import { Router, type Request, type Response } from "express";
import db from "../db.ts";
import type { Code } from "../db.ts";

const router = Router();

const DEFAULT_PROMPT =
  "photo booth border frame, birthday, vintage, warm tones, decorative, no people";

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

  const row = db
    .prepare("SELECT * FROM codes WHERE code = ?")
    .get(code) as Code | undefined;

  if (!row) {
    res.status(404).json({ error: "Code not found" });
    return;
  }

  if (row.used_at !== null) {
    res.status(409).json({ error: "Code has already been used" });
    return;
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
  const key = process.env.POLLINATIONS_KEY;
  const keyParam = key ? `&key=${key}` : "";
  const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=600&height=1800&seed=0&enhance=false${keyParam}`;

  const imageRes = await fetch(url);
  if (!imageRes.ok) {
    res.status(502).json({ error: "Failed to generate border image" });
    return;
  }

  const buffer = await imageRes.arrayBuffer();
  const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
  const base64 = Buffer.from(buffer).toString("base64");
  const borderDataUrl = `data:${contentType};base64,${base64}`;

  db.prepare(
    "UPDATE codes SET used_at = datetime('now'), used_by_session_id = ? WHERE code = ?",
  ).run(sessionId ?? null, code);

  res.json({ borderDataUrl });
});

export default router;
