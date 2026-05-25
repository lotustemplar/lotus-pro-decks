import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { colorMeta, playstyleMeta } from '../data/decks';

const DIFFICULTY_RANGES = [
  { value: 'casual',   label: 'Casual (0–4)'    },
  { value: 'focused',  label: 'Focused (4–6.5)' },
  { value: 'advanced', label: 'Advanced (6.5+)' },
];
const BRACKETS = [2, 3, 4];
const SORT_OPTIONS = [
  { value: 'featured',     label: 'Featured',            short: 'Featured'   },
  { value: 'price-asc',    label: 'Price: Low → High',   short: 'Price ↑'    },
  { value: 'price-desc',   label: 'Price: High → Low',   short: 'Price ↓'    },
  { value: 'bracket-asc',  label: 'Bracket: Low → High', short: 'Bracket ↑'  },
  { value: 'bracket-desc', label: 'Bracket: High → Low', short: 'Bracket ↓'  },
];

// ── Shared toggle chip grid ────────────────────────────────────────────────
function MultiToggle({ options, selected, onChange, renderOption }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const val   = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const active = selected.includes(val);
        return (
          <button
            key={val}
            onClick={() => onChange(active ? selected.filter(s => s !== val) : [...selected, val])}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 ${
              active
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

// ── Collapsible section (desktop sidebar only) ─────────────────────────────
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

// ── Main component ─────────────────────────────────────────────────────────
export default function FilterBar({ filters, onChange, resultCount }) {
  // Mobile: which pill section is expanded (null = all closed)
  const [openSection, setOpenSection] = useState(null);
  const toggle = (s) => setOpenSection(p => p === s ? null : s);

  const activeCount = [
    filters.colors.length,
    filters.difficulties.length,
    filters.brackets.length,
    filters.playstyles.length,
    filters.priceMin > 0 || filters.priceMax < 500 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    onChange({ colors: [], difficulties: [], brackets: [], playstyles: [], priceMin: 0, priceMax: 500, sort: 'featured' });
    setOpenSection(null);
  };

  const sortShort = SORT_OPTIONS.find(o => o.value === filters.sort)?.short ?? 'Sort';

  // Pill styling
  const pill = (section, isActive) => {
    const isOpen = openSection === section;
    return [
      'shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium',
      'transition-all whitespace-nowrap select-none',
      isActive || isOpen
        ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
        : 'bg-white/5 border-white/10 text-gray-400',
    ].join(' ');
  };

  // ── Mobile dropdown content per section ──────────────────────────────────
  const mobilePanelContent = () => {
    switch (openSection) {
      case 'sort':
        return (
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange({ sort: opt.value }); setOpenSection(null); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  filters.sort === opt.value
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-transparent border-white/10 text-gray-400'
                }`}
              >{opt.label}</button>
            ))}
          </div>
        );
      case 'colors':
        return (
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
        );
      case 'bracket':
        return (
          <MultiToggle
            options={BRACKETS.map(b => ({ value: b, label: `Bracket ${b}` }))}
            selected={filters.brackets}
            onChange={brackets => onChange({ brackets })}
          />
        );
      case 'difficulty':
        return (
          <MultiToggle
            options={DIFFICULTY_RANGES}
            selected={filters.difficulties}
            onChange={difficulties => onChange({ difficulties })}
          />
        );
      case 'playstyle':
        return (
          <MultiToggle
            options={playstyleMeta}
            selected={filters.playstyles}
            onChange={playstyles => onChange({ playstyles })}
          />
        );
      case 'price':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>${filters.priceMin}</span>
              <span>${filters.priceMax === 500 ? '500+' : filters.priceMax}</span>
            </div>
            <input
              type="range" min={0} max={500} step={10}
              value={filters.priceMax}
              onChange={e => onChange({ priceMax: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#3b82f6' }}
            />
            <div className="text-xs text-gray-500">
              Max: ${filters.priceMax === 500 ? '500+' : filters.priceMax}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const sectionTitle = {
    sort: 'Sort By', colors: 'Color Identity', bracket: 'Bracket',
    difficulty: 'Difficulty', playstyle: 'Playstyle', price: 'Budget',
  };

  // ── Desktop sidebar panel (unchanged) ────────────────────────────────────
  const desktopPanel = (
    <div className="space-y-0">
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
            >{opt.label}</button>
          ))}
        </div>
      </FilterSection>

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

      <FilterSection title="Bracket">
        <MultiToggle
          options={BRACKETS.map(b => ({ value: b, label: `Bracket ${b}` }))}
          selected={filters.brackets}
          onChange={brackets => onChange({ brackets })}
        />
      </FilterSection>

      <FilterSection title="Difficulty">
        <MultiToggle
          options={DIFFICULTY_RANGES}
          selected={filters.difficulties}
          onChange={difficulties => onChange({ difficulties })}
        />
      </FilterSection>

      <FilterSection title="Playstyle" defaultOpen={false}>
        <MultiToggle
          options={playstyleMeta}
          selected={filters.playstyles}
          onChange={playstyles => onChange({ playstyles })}
        />
      </FilterSection>

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

      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Format: Commander
        </span>
      </div>

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full mt-3 py-2 rounded-xl text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Clear All Filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — horizontal scrollable pill bar
      ══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full mb-4">

        {/* Pill row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => toggle('sort')} className={pill('sort', filters.sort !== 'featured')}>
            {sortShort}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'sort' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('colors')} className={pill('colors', filters.colors.length > 0)}>
            Colors{filters.colors.length > 0 ? ` (${filters.colors.length})` : ''}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'colors' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('bracket')} className={pill('bracket', filters.brackets.length > 0)}>
            Bracket{filters.brackets.length > 0 ? ` (${filters.brackets.length})` : ''}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'bracket' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('difficulty')} className={pill('difficulty', filters.difficulties.length > 0)}>
            Difficulty{filters.difficulties.length > 0 ? ` (${filters.difficulties.length})` : ''}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'difficulty' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('playstyle')} className={pill('playstyle', filters.playstyles.length > 0)}>
            Playstyle{filters.playstyles.length > 0 ? ` (${filters.playstyles.length})` : ''}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'playstyle' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('price')} className={pill('price', filters.priceMax < 500 || filters.priceMin > 0)}>
            Budget{filters.priceMax < 500 ? ` ≤$${filters.priceMax}` : ''}
            <ChevronDown size={11} className={`transition-transform duration-200 ${openSection === 'price' ? 'rotate-180' : ''}`} />
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl border border-red-500/30 text-xs font-medium text-red-400 bg-red-500/10 whitespace-nowrap"
            >
              <X size={11} /> Clear ({activeCount})
            </button>
          )}
        </div>

        {/* Result count row */}
        <div className="mt-1 mb-1 text-xs text-gray-500">
          {resultCount} deck{resultCount !== 1 ? 's' : ''}
        </div>

        {/* Inline dropdown panel */}
        <AnimatePresence>
          {openSection && (
            <motion.div
              key={openSection}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-2 mb-4 glass rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{sectionTitle[openSection]}</span>
                <button onClick={() => setOpenSection(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              {mobilePanelContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP — sticky left sidebar
      ══════════════════════════════════════════════════════════════════ */}
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
        {desktopPanel}
      </div>
    </>
  );
}
