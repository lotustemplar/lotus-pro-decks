import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const SLEEVE_COLORS = [
  { name: 'Black',      hex: '#111111' },
  { name: 'White',      hex: '#f0f0ef' },
  { name: 'Red',        hex: '#dc2626' },
  { name: 'Blue',       hex: '#1d4ed8' },
  { name: 'Sky Blue',   hex: '#38bdf8' },
  { name: 'Orange',     hex: '#ea580c' },
  { name: 'Pink',       hex: '#ec4899' },
  { name: 'Yellow',     hex: '#d97706' },
  { name: 'Lime Green', hex: '#65a30d' },
  { name: 'Purple',     hex: '#7c3aed' },
];

/* ── Single-sleeve SVG illustration ─────────────────────────────────────────
   Shows a card inside one clear Perfect Fit sleeve.
   The sleeve is barely larger than the card — snug clear film over the back.
*/
function SingleSleeveSVG() {
  return (
    <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
      {/* Outer clear sleeve — slightly larger than card */}
      <rect x="14" y="10" width="132" height="200" rx="9"
        fill="rgba(180,220,255,0.07)" stroke="rgba(180,220,255,0.45)" strokeWidth="1.5" />
      {/* Sleeve gloss left strip */}
      <rect x="14" y="10" width="38" height="200" rx="9"
        fill="rgba(255,255,255,0.04)" />
      {/* Sleeve top open edge hint */}
      <line x1="14" y1="10" x2="146" y2="10" stroke="rgba(200,240,255,0.6)" strokeWidth="1" />

      {/* Card back inside the sleeve */}
      <rect x="18" y="13" width="124" height="194" rx="7" fill="#14213d" />
      {/* Card border frame */}
      <rect x="22" y="17" width="116" height="186" rx="5"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      {/* Inner card frame */}
      <rect x="28" y="23" width="104" height="174" rx="4"
        fill="none" stroke="#1a3060" strokeWidth="0.8" />
      {/* Card back decorative diamond */}
      <path d="M80 44 L122 108 L80 172 L38 108 Z"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      {/* Center circle */}
      <circle cx="80" cy="108" r="24"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      {/* Oval logo area */}
      <ellipse cx="80" cy="108" rx="12" ry="8"
        fill="none" stroke="#253f7a" strokeWidth="0.8" />
      {/* Corner pips */}
      {[[32,27],[120,27],[32,187],[120,187]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="none" stroke="#1e3a6e" strokeWidth="0.8" />
      ))}

      {/* Sleeve label */}
      <text x="80" y="217" textAnchor="middle"
        fill="rgba(150,200,255,0.55)" fontSize="8.5" fontFamily="system-ui,sans-serif" letterSpacing="0.3">
        Perfect Fit Clear Sleeve
      </text>
    </svg>
  );
}

/* ── Double-sleeve SVG illustration ─────────────────────────────────────────
   Layer 1 (innermost): card back
   Layer 2: clear Perfect Fit inner sleeve — snug around the card
   Layer 3: outer sleeve with colored opaque back, open at the top
   The colored back is visible at the sides and bottom.
*/
function DoubleSleeveSVG({ color = '#1a1a2e' }) {
  // Derive a slightly lighter shade for the spine edge
  return (
    <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
      {/* ── Outer sleeve (colored) ── */}
      {/* Colored back visible at sides and bottom */}
      <rect x="8" y="6" width="144" height="208" rx="11" fill={color} />
      {/* Outer sleeve border */}
      <rect x="8" y="6" width="144" height="208" rx="11"
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Gloss sheen on outer sleeve */}
      <rect x="8" y="6" width="44" height="208" rx="11"
        fill="rgba(255,255,255,0.07)" />
      {/* Outer sleeve top open lip */}
      <path d="M8 6 Q80 2 152 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />

      {/* ── Inner clear sleeve ── */}
      <rect x="15" y="11" width="130" height="198" rx="8"
        fill="rgba(180,220,255,0.06)" stroke="rgba(180,220,255,0.35)" strokeWidth="1" />
      {/* Inner sleeve gloss */}
      <rect x="15" y="11" width="36" height="198" rx="8"
        fill="rgba(255,255,255,0.03)" />

      {/* ── Card back ── */}
      <rect x="19" y="14" width="122" height="192" rx="7" fill="#14213d" />
      <rect x="23" y="18" width="114" height="184" rx="5"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      <rect x="29" y="24" width="102" height="172" rx="4"
        fill="none" stroke="#1a3060" strokeWidth="0.8" />
      <path d="M80 43 L118 107 L80 171 L42 107 Z"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      <circle cx="80" cy="107" r="22"
        fill="none" stroke="#1e3a6e" strokeWidth="1.2" />
      <ellipse cx="80" cy="107" rx="11" ry="7"
        fill="none" stroke="#253f7a" strokeWidth="0.8" />
      {[[33,28],[119,28],[33,185],[119,185]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="none" stroke="#1e3a6e" strokeWidth="0.8" />
      ))}

      {/* Layer call-out lines on the right */}
      <line x1="152" y1="55"  x2="162" y2="55"  stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      <line x1="145" y1="75"  x2="162" y2="75"  stroke="rgba(180,220,255,0.35)" strokeWidth="0.8" />
      <line x1="141" y1="95"  x2="162" y2="95"  stroke="rgba(100,160,255,0.3)"  strokeWidth="0.8" />

      {/* Sleeve label */}
      <text x="80" y="217" textAnchor="middle"
        fill="rgba(200,220,255,0.5)" fontSize="8.5" fontFamily="system-ui,sans-serif" letterSpacing="0.3">
        Perfect Fit Inner · Premium Outer
      </text>
    </svg>
  );
}

/* ── Main modal ──────────────────────────────────────────────────────────── */
export default function SleeveUpsellModal({ onConfirm, onSkip }) {
  const [selected, setSelected]   = useState(null); // null | 'single' | 'double'
  const [color, setColor]         = useState(SLEEVE_COLORS[0]);

  function confirm() {
    if (!selected) { onSkip(); return; }
    onConfirm({
      sleeveOption: selected,
      sleeveColor:  selected === 'double' ? color.name : null,
      sleevePrice:  selected === 'single' ? 10 : 20,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onSkip}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.93, y: 28 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{   scale: 0.93, y: 28  }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10
          bg-[#0d1220] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/8">
          <div>
            <div className="font-display font-bold text-white text-lg leading-tight">
              🛡️ Protect Your New Deck
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Have your deck arrive pre-sleeved and ready to shuffle.
            </div>
          </div>
          <button
            onClick={onSkip}
            className="mt-0.5 p-1.5 rounded-lg hover:bg-white/8 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Option cards ── */}
        <div className="px-6 py-5 grid sm:grid-cols-2 gap-4">

          {/* Single Sleeve */}
          <button
            onClick={() => setSelected(s => s === 'single' ? null : 'single')}
            className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
              selected === 'single'
                ? 'border-blue-500/60 bg-blue-500/8 shadow-lg shadow-blue-500/10'
                : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {selected === 'single' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500
                flex items-center justify-center text-white text-[10px] font-bold">✓</span>
            )}
            <div className="w-full h-36 mb-3 flex items-center justify-center">
              <div className="w-24 h-full">
                <SingleSleeveSVG />
              </div>
            </div>
            <div className="font-display font-semibold text-white mb-1 text-sm">Sleeve Deck</div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Your 100-card deck comes pre-sleeved with{' '}
              <span className="text-gray-200">Perfect Fit inner protective sleeves</span>{' '}
              — a single snug clear layer that fits right over the card.
            </p>
            <div className="text-blue-400 font-bold text-sm">+ $10.00</div>
          </button>

          {/* Double Sleeve */}
          <button
            onClick={() => setSelected(s => s === 'double' ? null : 'double')}
            className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
              selected === 'double'
                ? 'border-purple-500/60 bg-purple-500/8 shadow-lg shadow-purple-500/10'
                : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {selected === 'double' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500
                flex items-center justify-center text-white text-[10px] font-bold">✓</span>
            )}
            {/* "Best" badge */}
            <span className="absolute top-3 left-4 text-[10px] px-1.5 py-0.5 rounded-full
              bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-semibold">
              ⭐ Best
            </span>

            <div className="w-full h-36 mb-3 flex items-center justify-center mt-4">
              <div className="w-24 h-full">
                <DoubleSleeveSVG color={selected === 'double' ? color.hex : '#2a2a4a'} />
              </div>
            </div>
            <div className="font-display font-semibold text-white mb-1 text-sm">Double Sleeve Deck</div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              <span className="text-gray-200">Perfect Fit inner sleeve</span> tucked inside a{' '}
              <span className="text-gray-200">Premium outer sleeve</span> with an opaque colored back.
              Maximum protection — your choice of color.
            </p>
            <div className="text-purple-400 font-bold text-sm">+ $20.00</div>
          </button>
        </div>

        {/* ── Color picker (double sleeve only) ── */}
        <AnimatePresence>
          {selected === 'double' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{   opacity: 0, height: 0  }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  Outer Sleeve Color
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SLEEVE_COLORS.map(c => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all duration-150 ${
                        color.name === c.name
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1220] scale-110'
                          : 'hover:ring-1 hover:ring-white/40 hover:ring-offset-1 hover:ring-offset-[#0d1220]'
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {color.name} outer sleeve selected
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer actions ── */}
        <div className="px-6 pb-5 flex gap-3 border-t border-white/6 pt-4">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium
              border border-white/10 text-gray-400 hover:text-white hover:border-white/20
              transition-all duration-200"
          >
            No thanks
          </button>
          <button
            onClick={confirm}
            disabled={!selected}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
              transition-all duration-200 ${
              selected === 'single'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20'
                : selected === 'double'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-white/8 cursor-not-allowed opacity-40'
            }`}
          >
            {selected
              ? `Add to Order (+$${selected === 'single' ? 10 : 20})`
              : 'Select an option above'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
