import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const SLEEVE_COLORS = [
  { name: 'Kuro Eclipse', hex: '#0e0e0e' },
  { name: 'Gin Mist',     hex: '#b8bec7' },
  { name: 'Shiro Bloom',  hex: '#f2f0eb' },
  { name: 'Mori Jade',    hex: '#2d7a4f' },
  { name: 'Sora Wave',    hex: '#5aaddc' },
  { name: 'Aka Ember',    hex: '#cc2b2b' },
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
   3-quarter perspective: colored BACK panel offset behind the clear FRONT panel
   so the full solid color is unmistakably visible as the back of the sleeve.

   Draw order (back → front):
   1. Colored back panel — fully filled, offset down-left
   2. Connecting side + bottom edges (make it look like one sleeve)
   3. Clear front panel with inner sleeve + card visible through it
*/
function DoubleSleeveSVG({ color = '#1a1a2e' }) {
  // Offset amount for the 3D perspective shift
  const dx = 14, dy = 14;
  // Back panel coords
  const bx = 6, by = 6, bw = 126, bh = 188;
  // Front panel coords (shifted dx right, dy up)
  const fx = bx + dx, fy = by - dy, fw = bw, fh = bh;

  return (
    <svg viewBox="0 0 170 222" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">

      {/* ── 1. BACK panel — fully solid color ── */}
      <rect x={bx} y={by} width={bw} height={bh} rx="9" fill={color} />
      {/* Subtle gloss on back panel */}
      <rect x={bx} y={by} width={bw * 0.35} height={bh} rx="9"
        fill="rgba(255,255,255,0.07)" />
      {/* Back panel border */}
      <rect x={bx} y={by} width={bw} height={bh} rx="9"
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* ── 2. Connecting edges (side faces of the sleeve) ── */}
      {/* Top face */}
      <polygon
        points={`${bx},${by} ${bx+bw},${by} ${fx+fw},${fy} ${fx},${fy}`}
        fill={color} opacity="0.55"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"
      />
      {/* Right face */}
      <polygon
        points={`${bx+bw},${by} ${bx+bw},${by+bh} ${fx+fw},${fy+fh} ${fx+fw},${fy}`}
        fill={color} opacity="0.4"
        stroke="rgba(255,255,255,0.10)" strokeWidth="0.8"
      />
      {/* Bottom face */}
      <polygon
        points={`${bx},${by+bh} ${bx+bw},${by+bh} ${fx+fw},${fy+fh} ${fx},${fy+fh}`}
        fill={color} opacity="0.3"
        stroke="rgba(255,255,255,0.10)" strokeWidth="0.8"
      />

      {/* ── 3. FRONT panel — clear outer sleeve ── */}
      <rect x={fx} y={fy} width={fw} height={fh} rx="9"
        fill="rgba(180,220,255,0.07)" stroke="rgba(180,220,255,0.45)" strokeWidth="1.5" />
      {/* Front gloss strip */}
      <rect x={fx} y={fy} width={fw * 0.30} height={fh} rx="9"
        fill="rgba(255,255,255,0.04)" />
      {/* Open top edge */}
      <line x1={fx} y1={fy} x2={fx+fw} y2={fy}
        stroke="rgba(200,240,255,0.55)" strokeWidth="1" />

      {/* ── Inner clear sleeve (inside front panel) ── */}
      <rect x={fx+4} y={fy+3} width={fw-8} height={fh-6} rx="7"
        fill="rgba(180,220,255,0.04)" stroke="rgba(180,220,255,0.28)" strokeWidth="1" />

      {/* ── Card back ── */}
      <rect x={fx+7} y={fy+5} width={fw-14} height={fh-10} rx="6" fill="#14213d" />
      <rect x={fx+11} y={fy+9} width={fw-22} height={fh-18} rx="4"
        fill="none" stroke="#1e3a6e" strokeWidth="1.1" />
      <rect x={fx+16} y={fy+14} width={fw-32} height={fh-28} rx="3"
        fill="none" stroke="#1a3060" strokeWidth="0.7" />
      {/* Diamond */}
      <path d={`M${fx+fw/2} ${fy+28} L${fx+fw-20} ${fy+fh/2} L${fx+fw/2} ${fy+fh-28} L${fx+20} ${fy+fh/2} Z`}
        fill="none" stroke="#1e3a6e" strokeWidth="1.1" />
      {/* Center circle */}
      <circle cx={fx+fw/2} cy={fy+fh/2} r="18"
        fill="none" stroke="#1e3a6e" strokeWidth="1.1" />
      {/* Corner pips */}
      {[
        [fx+13, fy+13],
        [fx+fw-13, fy+13],
        [fx+13, fy+fh-13],
        [fx+fw-13, fy+fh-13],
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="none" stroke="#1e3a6e" strokeWidth="0.8" />
      ))}

      {/* ── Labels ── */}
      <text x="85" y="213" textAnchor="middle"
        fill="rgba(200,220,255,0.5)" fontSize="8" fontFamily="system-ui,sans-serif" letterSpacing="0.3">
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
