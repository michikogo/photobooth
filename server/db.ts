import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface Session {
  id: number;
  created_at: string;
  strip_path: string | null;
  email_sent: 0 | 1;
  email_to: string | null;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");

mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(join(dataDir, "photobooth.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    strip_path TEXT,
    email_sent INTEGER NOT NULL DEFAULT 0,
    email_to   TEXT
  )
`);

export default db;
