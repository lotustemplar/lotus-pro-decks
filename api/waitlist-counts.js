/**
 * GET /api/waitlist-counts
 *
 * Returns { [deckId]: count } by reading the Resend "lotus-waitlist" audience
 * and grouping contacts by firstName (which stores the deckId).
 */

import { Resend } from 'resend';

const AUDIENCE_NAME = 'lotus-waitlist';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.RESEND_API_KEY) return res.status(200).json({});

  try {
    const resend   = new Resend(process.env.RESEND_API_KEY);
    const list     = await resend.audiences.list();
    const audience = list.data?.data?.find(a => a.name === AUDIENCE_NAME);
    if (!audience) return res.status(200).json({});

    const contacts = await resend.contacts.list({ audienceId: audience.id });
    const counts   = {};
    for (const c of (contacts.data?.data ?? [])) {
      if (c.first_name) counts[c.first_name] = (counts[c.first_name] || 0) + 1;
    }
    return res.status(200).json(counts);
  } catch (err) {
    console.error('[waitlist-counts]', err.message);
    return res.status(200).json({});   // non-fatal
  }
}
