import { Router } from 'express';

const router = Router();

// POST /api/email — stubbed, Nodemailer wired in a future phase
router.post('/', (_req, res) => {
  res.json({ success: true });
});

export default router;
