/**
 * POST /api/notify-me
 * Body: { email, deckId, deckName }
 *
 * Adds the email to a Redis set keyed by deckId so we can fan-out
 * restock notifications later.  Requires Vercel KV (free tier).
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.KV_REST_API_URL) {
    return res.status(503).json({ error: 'Waitlist storage not configured yet.' });
  }

  const { email, deckId, deckName } = req.body ?? {};

  if (!email || !deckId) {
    return res.status(400).json({ error: 'Missing email or deckId.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // sadd is idempotent — signing up twice only stores once
    await kv.sadd(`waitlist:${deckId}`, email);
    // store deck name for use in restock emails
    await kv.set(`deckname:${deckId}`, deckName ?? '');

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[notify-me]', err.message);
    return res.status(500).json({ error: 'Could not save. Please try again.' });
  }
}
