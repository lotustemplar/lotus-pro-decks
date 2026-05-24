/**
 * POST /api/create-stripe-product
 *
 * Called by the Admin panel whenever a deck is saved.
 * Idempotent — finds the existing Stripe product (by metadata.deckId)
 * and re-uses it, only creating a new Price when the amount changes.
 *
 * Body: { deckId, name, description, priceInCents, commander, bracket, colors }
 * Returns: { priceId: "price_xxx" }
 */

import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const { deckId, name, description, priceInCents, commander, bracket, colors } = req.body ?? {};

  if (!deckId || !name || priceInCents == null) {
    return res.status(400).json({ error: 'Missing required fields: deckId, name, priceInCents' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured on server' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const meta = {
    deckId:    String(deckId),
    commander: commander ?? '',
    bracket:   String(bracket ?? ''),
    colors:    Array.isArray(colors) ? colors.join(', ') : (colors ?? ''),
  };

  try {
    // ── Find or create product ───────────────────────────────────────────────
    const found = await stripe.products.search({
      query: `metadata['deckId']:'${String(deckId)}'`,
    });

    let product;
    if (found.data.length > 0) {
      // Update name / description / metadata in case they changed
      product = await stripe.products.update(found.data[0].id, {
        name,
        description: description || undefined,
        metadata: meta,
      });
    } else {
      product = await stripe.products.create({
        name,
        description: description || undefined,
        metadata: meta,
      });
    }

    // ── Find or create price at correct amount ───────────────────────────────
    const existingPrices = await stripe.prices.list({ product: product.id, active: true });

    let price = existingPrices.data.find(
      p => p.unit_amount === priceInCents && p.currency === 'usd'
    );

    if (!price) {
      // Archive any stale prices first so the product stays tidy
      await Promise.all(
        existingPrices.data.map(p => stripe.prices.update(p.id, { active: false }))
      );
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: priceInCents,
        currency: 'usd',
      });
    }

    return res.status(200).json({ priceId: price.id });

  } catch (err) {
    console.error('[create-stripe-product] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
