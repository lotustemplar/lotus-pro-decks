/**
 * Lotus Pro Decks — Stripe Product Sync
 * ----------------------------------------
 * Run once (or any time you add/update decks):
 *
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/setup-stripe.js
 *
 * What it does:
 *   1. Reads every deck from src/data/decks.js
 *   2. Creates (or finds existing) Stripe Product + Price for each one
 *   3. Writes the real price_xxx IDs back into src/data/decks.js automatically
 *
 * Safe to re-run — it checks for existing products before creating new ones.
 */

import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load secret key ──────────────────────────────────────────────────────────
const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!SECRET_KEY) {
  console.error('\n❌  Missing STRIPE_SECRET_KEY\n');
  console.error('Run as:  STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe.js\n');
  process.exit(1);
}

const stripe = new Stripe(SECRET_KEY);
const isLive = SECRET_KEY.startsWith('sk_live');
console.log(`\n🔑  Mode: ${isLive ? '🟢 LIVE' : '🟡 TEST'}`);

// ── Read decks ────────────────────────────────────────────────────────────────
// We parse the file as text and extract the array — avoids ESM/import issues
const decksFilePath = path.resolve(__dirname, '../src/data/decks.js');
const decksFileContent = fs.readFileSync(decksFilePath, 'utf-8');

// Dynamic import the decks (works because the project is ESM)
const { decks } = await import('../src/data/decks.js');

console.log(`\n📦  Found ${decks.length} decks to sync\n`);

// ── Sync each deck ────────────────────────────────────────────────────────────
const results = [];

for (const deck of decks) {
  process.stdout.write(`  • ${deck.name} ($${deck.price}) … `);

  try {
    // Check for an existing product with this deck's ID in metadata
    const existing = await stripe.products.search({
      query: `metadata['deckId']:'${deck.id}'`,
    });

    let product;
    if (existing.data.length > 0) {
      product = existing.data[0];
      process.stdout.write('product exists, ');
    } else {
      // Create the product
      product = await stripe.products.create({
        name: deck.name,
        description: `${deck.commander} — ${deck.description}`,
        metadata: {
          deckId: String(deck.id),
          commander: deck.commander,
          bracket: String(deck.bracket),
          colors: deck.colors.join(', '),
        },
      });
      process.stdout.write('created product, ');
    }

    // Find an active price for this product at the correct amount
    const priceAmountCents = deck.price * 100;
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    let price = existingPrices.data.find(
      p => p.unit_amount === priceAmountCents && p.currency === 'usd'
    );

    if (price) {
      process.stdout.write('price exists ');
    } else {
      // Archive any old prices at wrong amounts to keep things clean
      for (const oldPrice of existingPrices.data) {
        await stripe.prices.update(oldPrice.id, { active: false });
      }
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: priceAmountCents,
        currency: 'usd',
      });
      process.stdout.write('created price ');
    }

    results.push({ id: deck.id, priceId: price.id });
    console.log(`→ ${price.id}`);

  } catch (err) {
    console.error(`\n  ❌  Error on "${deck.name}": ${err.message}`);
    process.exit(1);
  }
}

// ── Write Price IDs back into decks.js ───────────────────────────────────────
console.log('\n✍️   Writing Price IDs back to src/data/decks.js …');

let updatedContent = decksFileContent;

for (const { id, priceId } of results) {
  // Replace the placeholder or existing stripePrice value for this deck
  // Matches:  stripePrice: 'price_ANYTHING',  (with optional comment)
  const regex = new RegExp(
    `(id:\\s*${id},[\\s\\S]*?stripePrice:\\s*)'[^']*'`,
    ''
  );
  if (regex.test(updatedContent)) {
    updatedContent = updatedContent.replace(regex, `$1'${priceId}'`);
  } else {
    console.warn(`  ⚠️  Could not find stripePrice for deck id ${id} — skipping`);
  }
}

fs.writeFileSync(decksFilePath, updatedContent, 'utf-8');

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n✅  All done!\n');
console.log('   Price IDs written to src/data/decks.js');
console.log('   Commit the file and redeploy:\n');
console.log('     git add src/data/decks.js');
console.log('     git commit -m "Add Stripe price IDs"');
console.log('     git push\n');

if (!isLive) {
  console.log('⚠️   You used a TEST key — re-run with your sk_live_... key before going live.\n');
}
