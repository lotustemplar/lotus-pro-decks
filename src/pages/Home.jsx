import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ColorFilter from '../components/ColorFilter';
import DeckCarousel from '../components/DeckCarousel';
import WhyProPilot from '../components/WhyProPilot';
import BracketSection from '../components/BracketSection';
import CTASection from '../components/CTASection';
import SEO from '../components/SEO';
import SurpriseBanner from '../components/SurpriseBanner';
import { decks, colorMeta } from '../data/decks';

const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo.png`;

export default function Home({ animationsEnabled }) {
  const [selectedColor, setSelectedColor] = useState(null);

  const filtered = selectedColor
    ? decks.filter(d =>
        selectedColor === 'multi'
          ? d.colors.length > 1
          : d.colors.includes(selectedColor)
      )
    : decks;

  return (
    <div>
      <SEO
        title="Expert-Built Commander Decks — The Precon Upgrade You've Been Looking For"
        description="Handcrafted Commander decks that are ready to play out of the box — a serious upgrade over commander precons. Every deck includes a pilot guide, upgrade path, and full synergy breakdown. Limited runs, never mass-produced."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Lotus Pro Decks',
          url: 'https://lotusprodecks.com',
          description: 'Expert-built Commander decks — a serious upgrade over precons. Ready to play, handcrafted, limited runs.',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://lotusprodecks.com/shop',
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      {/* Full-page logo wallpaper — fixed so it persists as you scroll */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 2 }}
      >
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          className="w-[900px] max-w-[80vw]"
          style={{ opacity: 0.07, mixBlendMode: 'screen' }}
        />
      </div>

      <Hero animationsEnabled={animationsEnabled} />

      {/* Color Filter + Deck Carousel */}
      <section className="py-20 bg-[#0a0e1a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4
                bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium"
            >
              Browse by Color Identity
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-display font-bold text-white mb-3"
            >
              Find Your <span className="gradient-text">Playstyle</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-lg mx-auto mb-8"
            >
              Every deck has its own personality. Use the color filter to find what suits you.
            </motion.p>

            <ColorFilter selected={selectedColor} onChange={setSelectedColor} />

            <AnimatePresence>
              {selectedColor && (
                <motion.div
                  key={selectedColor}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 text-sm text-gray-400"
                >
                  Showing <span className="font-semibold" style={{ color: colorMeta[selectedColor]?.hex }}>
                    {colorMeta[selectedColor]?.label}
                  </span> decks — {colorMeta[selectedColor]?.desc}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carousel */}
          <div className="px-6 sm:px-8">
            {filtered.length > 0 ? (
              <DeckCarousel
                decks={filtered}
                animationsEnabled={animationsEnabled}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-500"
              >
                No decks found for this color combination yet.
              </motion.div>
            )}
          </div>

          {/* See all link */}
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/25
                transition-all duration-200"
            >
              Browse Full Shop with Filters
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <SurpriseBanner variant="section" />

      {/* SEO keyword section — precon comparison */}
      <section className="py-16 bg-[#020817]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-display font-bold text-white mb-4"
          >
            The Commander Deck Upgrade You've Been Looking For
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 leading-relaxed mb-6 max-w-2xl mx-auto"
          >
            Tired of commander precons that feel unfocused or fall apart mid-game?
            Lotus Pro Decks are fully tuned, ready-to-play Commander decks built around
            a single powerful strategy — not a hodgepodge of reprint cards.
            Each deck comes with a <span className="text-white font-medium">pilot guide</span>,{' '}
            <span className="text-white font-medium">upgrade path</span>, and{' '}
            <span className="text-white font-medium">synergy breakdown</span>{' '}
            so you understand exactly how to win from turn one.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            {[
              { label: 'Commander Deck Precon Alternative', icon: '⚔️' },
              { label: 'Commander Deck Upgrade', icon: '📈' },
              { label: 'Ready-to-Play Build', icon: '🚀' },
              { label: 'Budget Commander Decks', icon: '💰' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/5 border border-white/10 text-gray-300 font-medium">
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <WhyProPilot />
      <BracketSection />
      <CTASection animationsEnabled={animationsEnabled} />

      {/* Footer */}
      <footer className="bg-[#020817] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
          <div className="font-display font-bold text-white text-lg mb-2">Lotus Pro Decks</div>
          <div className="mb-4">Expert-Built. Beginner-Ready.</div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 mb-4">
            {['Home', 'Shop Decks', 'How It Works', 'Brackets', 'About', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-xs text-gray-700">
            Lotus Pro Decks is not affiliated with Wizards of the Coast or Hasbro.
            All original card names are property of their respective owners.
          </div>
        </div>
      </footer>
    </div>
  );
}
