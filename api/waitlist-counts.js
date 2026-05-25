/**
 * GET /api/waitlist-counts
 *
 * Returns a map of { [deckId]: count } so the Admin panel can show
 * how many people are waiting on each sold-out deck.
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.KV_REST_API_URL) {
    return res.status(200).json({});   // KV not set up yet — return empty
  }

  try {
    // Find all waitlist keys
    const keys = await kv.keys('waitlist:*');
    if (!keys.length) return res.status(200).json({});

    const counts = {};
    await Promise.all(
      keys.map(async key => {
        const deckId = key.replace('waitlist:', '');
        counts[deckId] = await kv.scard(key);
      })
    );

    return res.status(200).json(counts);
  } catch (err) {
    console.error('[waitlist-counts]', err.message);
    return res.status(200).json({});   // non-fatal — admin still works
  }
}
