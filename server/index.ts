import express from "express";
import cors from "cors";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import photosRouter from "./routes/photos.ts";
import emailRouter from "./routes/email.ts";
import borderRouter from "./routes/border.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "20mb" }));
app.use("/uploads", express.static(join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/photos", photosRouter);
app.use("/api/email", emailRouter);
app.use("/api/border", borderRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
