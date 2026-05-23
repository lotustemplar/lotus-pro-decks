import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { colorMeta, playstyleMeta } from '../data/decks';

const DIFFICULTY_RANGES = [
  { value: 'casual',   label: 'Casual (0–4)',    min: 0,   max: 4   },
  { value: 'focused',  label: 'Focused (4–6.5)', min: 4,   max: 6.5 },
  { value: 'advanced', label: 'Advanced (6.5+)', min: 6.5, max: 10  },
];
const BRACKETS = [2, 3, 4];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'bracket-asc', label: 'Bracket: Low → High' },
  { value: 'bracket-desc', label: 'Bracket: High → Low' },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/8 last:border-0 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-300 mb-3 hover:text-white"
        onClick={() => setOpen(v => !v)}
      >
        {title}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && children}
    </div>
  );
}

function MultiToggle({ options, selected, onChange, renderOption }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const isActive = selected.includes(val);
        return (
          <button
            key={val}
            onClick={() => onChange(isActive ? selected.filter(s => s !== val) : [...selected, val])}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 ${
              isActive
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {renderOption ? renderOption(opt) : label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterBar({ filters, onChange, resultCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = [
    filters.colors.length,
    filters.difficulties.length,
    filters.brackets.length,
    filters.playstyles.length,
    filters.priceMin > 0 || filters.priceMax < 500 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const panel = (
    <div className="space-y-0">
      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ sort: opt.value })}
              className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                filters.sort === opt.value
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color Identity */}
      <FilterSection title="Color Identity">
        <MultiToggle
          options={Object.keys(colorMeta)}
          selected={filters.colors}
          onChange={colors => onChange({ colors })}
          renderOption={key => (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: colorMeta[key].hex }} />
              {colorMeta[key].label}
            </span>
          )}
        />
      </FilterSection>

      {/* Bracket */}
      <FilterSection title="Bracket">
        <MultiToggle
          options={BRACKETS.map(b => ({ value: b, label: `Bracket ${b}` }))}
          selected={filters.brackets}
          onChange={brackets => onChange({ brackets })}
        />
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Difficulty">
        <MultiToggle
          options={DIFFICULTY_RANGES.map(r => ({ value: r.value, label: r.label }))}
          selected={filters.difficulties}
          onChange={difficulties => onChange({ difficulties })}
        />
      </FilterSection>

      {/* Playstyle */}
      <FilterSection title="Playstyle" defaultOpen={false}>
        <MultiToggle
          options={playstyleMeta}
          selected={filters.playstyles}
          onChange={playstyles => onChange({ playstyles })}
        />
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Budget Range" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>${filters.priceMin}</span>
            <span>${filters.priceMax === 500 ? '500+' : filters.priceMax}</span>
          </div>
          <input
            type="range" min={0} max={500} step={10}
            value={filters.priceMax}
            onChange={e => onChange({ priceMax: Number(e.target.value) })}
            className="w-full accent-blue-500"
            style={{ accentColor: '#3b82f6' }}
          />
          <div className="text-xs text-gray-500">Max: ${filters.priceMax === 500 ? '500+' : filters.priceMax}</div>
        </div>
      </FilterSection>

      {/* Format label */}
      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Format: Commander
        </span>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange({ colors: [], difficulties: [], brackets: [], playstyles: [], priceMin: 0, priceMax: 500, sort: 'featured' })}
          className="w-full mt-3 py-2 rounded-xl text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Clear All Filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">{activeCount}</span>
          )}
        </button>
        <span className="text-sm text-gray-500">{resultCount} deck{resultCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 shrink-0 glass rounded-2xl p-4 sticky top-20 self-start border border-white/8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <SlidersHorizontal size={14} />
            Filters
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">{activeCount}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
        </div>
        {panel}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0e1a] border-r border-white/10 overflow-y-auto"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal size={15} /> Filters
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">{panel}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
