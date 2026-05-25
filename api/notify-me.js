/**
 * POST /api/notify-me
 * Body: { email, deckId, deckName }
 *
 * Stores the subscriber in a Resend Audience called "lotus-waitlist".
 * firstName is used to record the deckId for filtering on restock.
 * No separate database needed — Resend is both storage and mailer.
 */

import { Resend } from 'resend';

const AUDIENCE_NAME = 'lotus-waitlist';

async function getOrCreateAudienceId(resend) {
  const result = await resend.audiences.list();
  const existing = result.data?.data?.find(a => a.name === AUDIENCE_NAME);
  if (existing) return existing.id;
  const created = await resend.audiences.create({ name: AUDIENCE_NAME });
  return created.data?.id;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Notification service not yet configured.' });
  }

  const { email, deckId, deckName } = req.body ?? {};
  if (!email || !deckId) return res.status(400).json({ error: 'Missing email or deckId.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = await getOrCreateAudienceId(resend);

    // firstName stores deckId so we can filter on restock.
    // lastName stores deckName for context.
    // Resend upserts by email — re-signing up for a deck just updates.
    await resend.contacts.create({
      audienceId,
      email,
      firstName: String(deckId),
      lastName: deckName ?? '',
      unsubscribed: false,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[notify-me]', err.message);
    return res.status(500).json({ error: 'Could not save. Please try again.' });
  }
}
