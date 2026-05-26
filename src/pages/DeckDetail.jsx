import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ChevronDown, ChevronUp, Star, Loader2, Bell, Check, Lock } from 'lucide-react';
import { decks, colorMeta } from '../data/decks';
import ElementalOverlay from '../components/ElementalOverlay';
import DifficultyMeter from '../components/DifficultyMeter';
import SEO from '../components/SEO';

const TABS = ['Strategy', 'Decklist', 'How to Pilot', 'Upgrade Path', 'Tokens'];

const TRUST_BADGES = [
  { icon: '🛡️', label: 'Professionally Built' },
  { icon: '🎯', label: 'Beginner Friendly' },
  { icon: '🚀', label: 'Ready to Play' },
  { icon: '✅', label: 'Synergy Checked' },
  { icon: '📖', label: 'Pilot Guide Included' },
];

function ColorDot({ color }) {
  const meta = colorMeta[color];
  return <span className="inline-block w-4 h-4 rounded-full border border-white/20" style={{ background: meta?.hex ?? '#fff' }} title={meta?.label} />;
}

function Tab({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
        active ? 'text-white' : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="tabIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
          style={{ background: 'currentColor' }}
        />
      )}
    </button>
  );
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 rounded-xl border border-white/8 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <span className="font-display font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DeckDetail({ animationsEnabled }) {
  const { slug } = useParams();
  // Match by slug first, fall back to numeric id for any old links
  const deck = decks.find(d => d.slug === slug) ?? decks.find(d => d.id === Number(slug));
  const [activeTab, setActiveTab] = useState('Strategy');
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);

  // Notify Me state
  const [notifyEmail, setNotifyEmail]   = useState('');
  const [notifyState, setNotifyState]   = useState('idle'); // idle | loading | done | error
  const [notifyError, setNotifyError]   = useState('');

  const soldOut  = deck?.quantity === 0 || deck?.inStock === false;
  const lowStock = !soldOut && deck?.quantity > 0 && deck?.quantity <= 5;

  if (!deck) return <Navigate to="/shop" replace />;

  const handleBuyNow = async () => {
    if (!deck.stripePrice || deck.stripePrice.startsWith('price_MEREN') ||
        deck.stripePrice.startsWith('price_ELSHA') || deck.stripePrice.startsWith('price_KRENKO') ||
        deck.stripePrice.startsWith('price_RHYS') || deck.stripePrice.startsWith('price_ATRAXA') ||
        deck.stripePrice.startsWith('price_LIESA') || deck.stripePrice.startsWith('price_TEYSA') ||
        deck.stripePrice.startsWith('price_ULALEK')) {
      setBuyError('Checkout not yet configured. Please contact us to order.');
      return;
    }
    setBuying(true);
    setBuyError(null);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: deck.stripePrice, deckName: deck.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setBuyError(err.message);
      setBuying(false);
    }
  };

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyState('loading'); setNotifyError('');
    try {
      const res = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail, deckId: String(deck.id), deckName: deck.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setNotifyState('done');
    } catch (err) {
      setNotifyError(err.message);
      setNotifyState('error');
    }
  };

  const deckImage = deck.image ? `https://lotusprodecks.com${deck.image.replace(/^.*\/images/, '/images')}` : null;
  const seoDesc = `${deck.name} — a ready-to-play ${deck.colorLabel} Commander deck built around ${deck.commander}. ${deck.description} Better than a precon: comes with a pilot guide, upgrade path, and full synergy breakdown. $${deck.price}.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deck.name,
    description: deck.description,
    image: deckImage,
    brand: { '@type': 'Brand', name: 'Lotus Pro Decks' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: String(deck.price),
      availability: soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `https://lotusprodecks.com/deck/${deck.slug ?? deck.id}`,
      seller: { '@type': 'Organization', name: 'Lotus Pro Decks' },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Commander', value: deck.commander },
      { '@type': 'PropertyValue', name: 'Bracket', value: String(deck.bracket) },
      { '@type': 'PropertyValue', name: 'Color Identity', value: deck.colorLabel },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16">
      <SEO
        title={`${deck.name} — ${deck.colorLabel} Commander Deck | Buy Ready-to-Play`}
        description={seoDesc}
        image={deckImage}
        path={`/deck/${deck.slug ?? deck.id}`}
        type="product"
        jsonLd={jsonLd}
      />
      {/* Hero banner */}
      <div
        className="relative h-72 sm:h-96 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${deck.gradientFrom}, ${deck.gradientTo})` }}
      >
        {/* Real artwork — fills the banner */}
        {deck.image && (
          <img
            src={deck.image}
            alt={deck.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}

        {/* Gradient overlay: dark at top/bottom for readability, lighter in middle to show art */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: deck.image
              ? `linear-gradient(to bottom, rgba(2,8,23,0.55) 0%, rgba(2,8,23,0.1) 40%, rgba(2,8,23,0.7) 100%)`
              : `linear-gradient(135deg, ${deck.gradientFrom}, ${deck.gradientTo})`,
          }}
        />

        {animationsEnabled && <ElementalOverlay colors={deck.colors} enabled />}

        {/* Glow center — only shown when no image */}
        {!deck.image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-48 h-48 rounded-full opacity-25"
              style={{ background: deck.accentColor, filter: 'blur(50px)' }}
            />
            <div className="absolute text-[120px] opacity-10 select-none">⚔</div>
          </div>
        )}

        {/* Back button */}
        <Link
          to="/shop"
          className="absolute top-6 left-4 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg
            bg-black/50 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        {/* Bracket + featured */}
        <div className="absolute top-6 right-4 sm:right-6 flex items-center gap-2">
          {deck.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-medium">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white text-xs font-bold">
            Bracket {deck.bracket}
          </span>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Deck title block */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {deck.colors.map(c => <ColorDot key={c} color={c} />)}
                <span className="text-sm text-gray-400">{deck.colorLabel}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{deck.name}</h1>
              <p className="text-gray-400 mb-3">Commander: <span className="text-gray-200 font-medium">{deck.commander}</span></p>

              {/* Difficulty meter */}
              <div className="mb-4 max-w-xs">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Difficulty</p>
                <DifficultyMeter value={deck.difficulty} variant="full" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {deck.playstyles.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full"
                    style={{ background: `${deck.accentColor}18`, color: deck.accentColor, border: `1px solid ${deck.accentColor}33` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 mb-6 border-b border-white/8 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <Tab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'Strategy' && (
                  <div className="space-y-1">
                    <Section title="Deck Strategy">
                      <p className="pt-3">{deck.strategy}</p>
                    </Section>
                    <Section title="How This Deck Wins">
                      <p className="pt-3">{deck.wins}</p>
                    </Section>
                    <Section title="Opening Hand Tips">
                      <p className="pt-3">{deck.openingHand}</p>
                    </Section>
                    <Section title="What's Included">
                      <ul className="pt-3 space-y-1.5">
                        {deck.included.map(item => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="text-green-400 text-xs">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  </div>
                )}

                {activeTab === 'Decklist' && (
                  <div className="space-y-4">
                    {deck.fullDecklist.map(section => (
                      <div key={section.section} className="glass rounded-xl p-4 border border-white/8">
                        <h3 className="font-display font-semibold text-white mb-3 text-sm">{section.section}</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {section.cards.map((card, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors py-0.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: deck.accentColor }} />
                              {card}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'How to Pilot' && (
                  <Section title="Beginner Pilot Guide">
                    <p className="pt-3 mb-4">{deck.pilotGuide}</p>
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      {[
                        { turn: 'Turns 1–2', tip: 'Play lands and mana rocks. Set up your mana base.' },
                        { turn: 'Turns 3–4', tip: 'Cast your commander. Begin building your engine.' },
                        { turn: 'Turns 5–6', tip: 'Execute your strategy. Generate value each turn.' },
                        { turn: 'Late Game', tip: 'Close the game with your win conditions.' },
                      ].map(t => (
                        <div key={t.turn} className="rounded-xl p-3 mt-3" style={{ background: `${deck.accentColor}0d`, border: `1px solid ${deck.accentColor}22` }}>
                          <div className="text-xs font-bold mb-1" style={{ color: deck.accentColor }}>{t.turn}</div>
                          <div className="text-xs text-gray-400">{t.tip}</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {activeTab === 'Upgrade Path' && (
                  <Section title="Upgrade Path">
                    <p className="pt-3">{deck.upgradePath}</p>
                    <div className="mt-4 p-3 rounded-xl" style={{ background: `${deck.accentColor}0d`, border: `1px solid ${deck.accentColor}22` }}>
                      <div className="text-xs font-bold mb-2" style={{ color: deck.accentColor }}>Pro Tip</div>
                      <div className="text-xs text-gray-400">Always upgrade the mana base first — consistent lands make every deck stronger before any single card does.</div>
                    </div>
                  </Section>
                )}

                {activeTab === 'Tokens' && (
                  <Section title="Tokens Needed">
                    <p className="pt-3">{deck.tokensNeeded}</p>
                    <p className="text-xs text-gray-500 mt-3">Tokens are not included in the deck — they can be found at most local game stores or printed from online resources.</p>
                  </Section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar — purchase */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 glass rounded-2xl border p-5"
              style={{ borderColor: soldOut ? 'rgba(255,255,255,0.1)' : `${deck.accentColor}33` }}
            >
              {/* Exclusivity badge */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-purple-500/8 border border-purple-500/20">
                <Lock size={11} className="text-purple-400 shrink-0" />
                <span className="text-xs text-purple-300 font-medium">Handcrafted · Never mass-produced · Limited runs</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-4xl font-display font-bold ${soldOut ? 'text-gray-500' : 'text-white'}`}>${deck.price}</span>
                <span className="text-sm text-gray-500">USD</span>
                {soldOut && <span className="ml-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">SOLD OUT</span>}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {TRUST_BADGES.map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-gray-400">
                    <span>{b.icon}</span> {b.label}
                  </div>
                ))}
              </div>

              {/* Scarcity warning */}
              {lowStock && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/25">
                  <span className="text-orange-400 text-sm">⚡</span>
                  <span className="text-xs text-orange-300 font-semibold">Only {deck.quantity} left in stock — order soon</span>
                </div>
              )}

              {/* ── CTA: Buy Now OR Notify Me ── */}
              {soldOut ? (
                <div className="mb-5">
                  {notifyState === 'done' ? (
                    <div className="flex flex-col items-center gap-2 py-4 rounded-xl bg-green-500/8 border border-green-500/20 text-center">
                      <Check size={20} className="text-green-400" />
                      <p className="text-green-400 font-semibold text-sm">You're on the list!</p>
                      <p className="text-gray-500 text-xs">We'll email you the moment it restocks.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifyMe} className="space-y-3">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        This deck is currently sold out. Enter your email and we'll notify you the moment it's back — waitlist subscribers get first access.
                      </p>
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={e => { setNotifyEmail(e.target.value); setNotifyState('idle'); }}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                          placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {notifyError && <p className="text-xs text-red-400">{notifyError}</p>}
                      <button
                        type="submit"
                        disabled={notifyState === 'loading' || !notifyEmail}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base
                          text-white bg-purple-600 hover:bg-purple-500 transition-all duration-200
                          disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {notifyState === 'loading'
                          ? <><Loader2 size={18} className="animate-spin" /> Adding you to waitlist…</>
                          : <><Bell size={18} /> Notify Me When Restocked</>
                        }
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    disabled={buying}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base
                      text-white transition-all duration-200 mb-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${deck.accentColor}, ${deck.accentColor}99)`,
                      boxShadow: `0 8px 24px ${deck.accentColor}33`,
                    }}
                  >
                    {buying
                      ? <><Loader2 size={18} className="animate-spin" /> Redirecting to checkout…</>
                      : <><ShoppingCart size={18} /> Buy Now — ${deck.price}</>
                    }
                  </button>
                  {buyError && <p className="text-xs text-center text-red-400 mb-3">{buyError}</p>}
                  <p className="text-xs text-center text-gray-600 mb-5">Secure checkout powered by Stripe</p>
                </>
              )}

              {/* Deck snapshot */}
              <div className="border-t border-white/8 pt-4 space-y-2.5">
                {[
                  { label: 'Format', value: 'Commander' },
                  { label: 'Bracket', value: `Bracket ${deck.bracket}` },
                  { label: 'Difficulty', value: deck.difficulty },
                  { label: 'Colors', value: deck.colorLabel },
                  { label: 'Playstyles', value: deck.playstyles.join(', ') },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="text-gray-200 font-medium text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Help link */}
              <div className="mt-4 pt-4 border-t border-white/8 text-center">
                <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Not sure if this deck is right for you? <span className="underline">Get help choosing →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#020817] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-700">
          Lotus Pro Decks — Expert-Built. Beginner-Ready. Not affiliated with Wizards of the Coast.
        </div>
      </footer>
    </div>
  );
}
