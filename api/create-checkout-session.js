import Stripe from 'stripe';

export default async function handler(req, res) {
  // CORS headers so the browser can call this from the frontend
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { priceId, deckName, deckPrice, sleeveOption, sleeveColor, sleevePrice } = req.body;

  if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

  // Shipping rates
  const FREE_SHIPPING_RATE     = process.env.STRIPE_SHIPPING_FREE;
  const STANDARD_SHIPPING_RATE = process.env.STRIPE_SHIPPING_STANDARD;

  // Pick shipping option based on deck price (+ sleeve if applicable)
  const deckTotal = Number(deckPrice) || 0;
  const shippingOptions = [];
  if (FREE_SHIPPING_RATE && STANDARD_SHIPPING_RATE) {
    shippingOptions.push({
      shipping_rate: deckTotal >= 150 ? FREE_SHIPPING_RATE : STANDARD_SHIPPING_RATE,
    });
  }

  // Build line items — deck + optional sleeve add-on
  const lineItems = [{ price: priceId, quantity: 1 }];

  if (sleeveOption && sleeveOption !== 'none' && Number(sleevePrice) > 0) {
    const isSingle = sleeveOption === 'single';
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: isSingle
            ? 'Single Sleeve — Perfect Fit Inner Protective Sleeves'
            : `Double Sleeve — Perfect Fit Inner + ${sleeveColor ?? ''} Premium Outer Sleeves`,
          description: isSingle
            ? '100-card deck pre-sleeved with Perfect Fit clear inner protective sleeves.'
            : `100-card deck double-sleeved: snug Perfect Fit inner sleeve inside a ${sleeveColor ?? ''} premium outer sleeve.`,
          images: [],
        },
        unit_amount: Math.round(Number(sleevePrice) * 100), // cents
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      // Omitting payment_method_types lets Stripe automatically show every method
      // enabled in your Dashboard: cards, Google Pay, Apple Pay, PayPal, etc.
      line_items: lineItems,
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
