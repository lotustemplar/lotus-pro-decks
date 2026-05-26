import Stripe from 'stripe';

export default async function handler(req, res) {
  // CORS headers so the browser can call this from the frontend
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { priceId, deckName, deckPrice } = req.body;

  if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

  // Shipping rates — set these after creating them in your Stripe Dashboard
  const FREE_SHIPPING_RATE    = process.env.STRIPE_SHIPPING_FREE;    // shr_... free
  const STANDARD_SHIPPING_RATE = process.env.STRIPE_SHIPPING_STANDARD; // shr_... $6.99

  // Pick shipping option based on deck price
  const price = Number(deckPrice) || 0;
  const shippingOptions = [];
  if (FREE_SHIPPING_RATE && STANDARD_SHIPPING_RATE) {
    if (price >= 150) {
      // Order qualifies for free shipping — only show free option
      shippingOptions.push({ shipping_rate: FREE_SHIPPING_RATE });
    } else {
      // Under $150 — show $6.99 flat rate only
      shippingOptions.push({ shipping_rate: STANDARD_SHIPPING_RATE });
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/success`,
      cancel_url:  `${process.env.SITE_URL}/shop`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK'],
      },
      ...(shippingOptions.length > 0 && { shipping_options: shippingOptions }),
      metadata: { deckName: deckName ?? 'Unknown' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
