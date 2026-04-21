import db from "../db.ts";

const args = process.argv.slice(2);

const getArg = (name: string) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split("=")[1] : undefined;
};

const count = parseInt(getArg("count") ?? "1", 10);
const expires = getArg("expires");

if (!expires) {
  console.error("Usage: tsx scripts/generate-codes.ts --count=5 --expires=2026-06-01");
  process.exit(1);
}

if (isNaN(count) || count < 1) {
  console.error("--count must be a positive integer");
  process.exit(1);
}

// Unambiguous alphanumeric chars (no 0, O, I, 1)
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const randomSegment = (len: number) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

const generateCode = () => `PHOTO-${randomSegment(4)}-${randomSegment(4)}`;

const insert = db.prepare(
  "INSERT INTO codes (code, expires_at) VALUES (?, ?)",
);

for (let i = 0; i < count; i++) {
  let code: string;
  let attempts = 0;

  // Retry on the rare collision
  while (true) {
    code = generateCode();
    try {
      insert.run(code, expires);
      break;
    } catch {
      if (++attempts > 10) {
        console.error("Too many collisions generating code, aborting");
        process.exit(1);
      }
    }
  }

  console.log(code);
}
