import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FilterBar from '../components/FilterBar';
import DeckGrid from '../components/DeckGrid';
import SurpriseBanner from '../components/SurpriseBanner';
import { decks } from '../data/decks';
import { Link } from 'react-router-dom';

const DEFAULT_FILTERS = {
  sort: 'featured',
  colors: [],
  difficulties: [],
  brackets: [],
  playstyles: [],
  priceMin: 0,
  priceMax: 500,
};

function applyFilters(allDecks, filters) {
  let result = [...allDecks];

  if (filters.colors.length) {
    result = result.filter(d =>
      filters.colors.some(c =>
        c === 'multi' ? d.colors.length > 1 : d.colors.includes(c)
      )
    );
  }
  if (filters.difficulties.length) {
    const RANGES = {
      casual:   { min: 0,   max: 4   },
      focused:  { min: 4,   max: 6.5 },
      advanced: { min: 6.5, max: 10  },
    };
    result = result.filter(d =>
      filters.difficulties.some(key => {
        const r = RANGES[key];
        return r && d.difficulty >= r.min && d.difficulty <= r.max;
      })
    );
  }
  if (filters.brackets.length) {
    result = result.filter(d => filters.brackets.includes(d.bracket));
  }
  if (filters.playstyles.length) {
    result = result.filter(d => d.playstyles.some(p => filters.playstyles.includes(p)));
  }
  result = result.filter(d => d.price >= filters.priceMin && d.price <= filters.priceMax);

  switch (filters.sort) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'bracket-asc': result.sort((a, b) => a.bracket - b.bracket); break;
    case 'bracket-desc': result.sort((a, b) => b.bracket - a.bracket); break;
    default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
  }

  return result;
}

export default function Shop({ animationsEnabled }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredDecks = useMemo(() => applyFilters(decks, filters), [filters]);

  const updateFilters = (partial) => {
    setFilters(prev => ({ ...prev, ...partial }));
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-20">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#020817] to-[#0a0e1a] py-14">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4
              bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
          >
            Format: Commander
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-3"
          >
            Shop <span className="gradient-text">Commander Decks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-lg mx-auto mb-5"
          >
            Every deck is professionally built, synergy-checked, and ready to play tonight.
            These are <span className="text-white font-medium">exclusive, handcrafted builds</span> — never mass-produced and strictly limited.
          </motion.p>

          {/* Exclusivity badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-5"
          >
            {[
              { icon: '🔒', text: 'Never Mass-Produced' },
              { icon: '⚡', text: 'Limited Runs Only' },
              { icon: '🃏', text: 'Handcrafted Builds' },
              { icon: '🥇', text: 'First Come, First Served' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </motion.div>

          <div className="flex justify-center">
            <SurpriseBanner variant="header" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="lg:flex lg:gap-8 lg:items-start">
          <FilterBar filters={filters} onChange={updateFilters} resultCount={filteredDecks.length} />
          <div className="flex-1 min-w-0">
            <DeckGrid decks={filteredDecks} animationsEnabled={animationsEnabled} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#020817] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
          <div className="font-display font-bold text-white text-lg mb-2">Lotus Pro Decks</div>
          <div className="mb-4">Expert-Built. Beginner-Ready.</div>
          <div className="text-xs text-gray-700">
            Lotus Pro Decks is not affiliated with Wizards of the Coast or Hasbro.
          </div>
        </div>
      </footer>
    </div>
  );
}
