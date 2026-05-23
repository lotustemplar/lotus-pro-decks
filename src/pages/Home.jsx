import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ColorFilter from '../components/ColorFilter';
import DeckCard from '../components/DeckCard';
import WhyProPilot from '../components/WhyProPilot';
import BracketSection from '../components/BracketSection';
import CTASection from '../components/CTASection';
import SurpriseBanner from '../components/SurpriseBanner';
import { decks, colorMeta } from '../data/decks';

export default function Home({ animationsEnabled }) {
  const [selectedColor, setSelectedColor] = useState(null);

  const filtered = selectedColor
    ? decks.filter(d =>
        selectedColor === 'multi'
          ? d.colors.length > 1
          : d.colors.includes(selectedColor)
      )
    : decks.filter(d => d.featured).slice(0, 3);

  return (
    <div>
      <Hero animationsEnabled={animationsEnabled} />

      {/* Color Filter + Featured Decks */}
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
              Every deck color has its own personality. Pick the energy that matches yours.
            </motion.p>

            <ColorFilter selected={selectedColor} onChange={setSelectedColor} />

            {selectedColor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-gray-400"
              >
                Showing <span className="font-semibold" style={{ color: colorMeta[selectedColor]?.hex }}>
                  {colorMeta[selectedColor]?.label}
                </span> decks — {colorMeta[selectedColor]?.desc}
              </motion.div>
            )}
          </div>

          {/* Deck cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length > 0 ? (
              filtered.map(deck => (
                <DeckCard key={deck.id} deck={deck} animationsEnabled={animationsEnabled} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No decks found for this color combination yet.
              </div>
            )}
          </div>

          {/* See all link */}
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/25
                transition-all duration-200"
            >
              Browse All Commander Decks
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <SurpriseBanner variant="section" />
      <WhyProPilot />
      <BracketSection />
      <CTASection animationsEnabled={animationsEnabled} />

      {/* Footer */}
      <footer className="bg-[#020817] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
          <div className="font-display font-bold text-white text-lg mb-2">ProPilot Decks</div>
          <div className="mb-4">Expert-Built. Beginner-Ready.</div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 mb-4">
            {['Home', 'Shop Decks', 'How It Works', 'Brackets', 'About', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-xs text-gray-700">
            ProPilot Decks is not affiliated with Wizards of the Coast or Hasbro.
            All original card names are property of their respective owners.
          </div>
        </div>
      </footer>
    </div>
  );
}
