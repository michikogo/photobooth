import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import db from '../db.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.none(), (req: Request, res: Response) => {
  const { stripDataUrl } = req.body as { stripDataUrl?: string }

  if (!stripDataUrl) {
    res.status(400).json({ error: 'stripDataUrl is required' })
    return
  }

  const base64 = stripDataUrl.replace(/^data:image\/png;base64,/, '')
  const filename = `${randomUUID()}.png`
  const stripPath = join(__dirname, '..', 'uploads', filename)

  writeFileSync(stripPath, Buffer.from(base64, 'base64'))

  const stmt = db.prepare('INSERT INTO sessions (strip_path) VALUES (?)')
  const result = stmt.run(`/uploads/${filename}`)

  res.status(201).json({
    sessionId: result.lastInsertRowid,
    stripUrl: `/uploads/${filename}`,
  })
})

export default router
