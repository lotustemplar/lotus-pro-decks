import { motion } from 'framer-motion';

const SEGMENTS = 10;

function getColor(value) {
  if (value <= 3)   return '#22c55e';   // green
  if (value <= 5)   return '#84cc16';   // lime
  if (value <= 6.5) return '#f59e0b';   // amber
  if (value <= 8)   return '#f97316';   // orange
  return '#ef4444';                      // red
}

function getLabel(value) {
  if (value <= 2)   return 'Casual';
  if (value <= 4)   return 'Beginner';
  if (value <= 6)   return 'Focused';
  if (value <= 7.5) return 'Advanced';
  return 'Expert';
}

/**
 * compact   — thin bar + number, used inside DeckCard
 * full      — segmented bar with label + scale, used in DeckDetail
 */
export default function DifficultyMeter({ value, variant = 'full' }) {
  const color = getColor(value);
  const label = getLabel(value);
  const pct   = (value / 10) * 100;

  /* ── Compact variant ─────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
          style={{ color, borderColor: `${color}55`, background: `${color}15` }}
        >
          {label}
        </span>
        <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ background: `linear-gradient(to right, #22c55e, ${color})` }}
          />
        </div>
        <span className="shrink-0 text-[10px] font-bold tabular-nums" style={{ color }}>
          {value}/10
        </span>
      </div>
    );
  }

  /* ── Full / segmented variant ─────────────────────────── */
  return (
    <div className="space-y-2">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value} / 10</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const segStart = i;
          const segEnd   = i + 1;
          const filled   = value >= segEnd;
          const partial  = !filled && value > segStart;
          const fraction = partial ? (value - segStart) : (filled ? 1 : 0);
          const segColor = getColor(Math.min(segEnd, 10));

          return (
            <div key={i} className="relative flex-1 h-2.5 rounded-sm bg-white/8 overflow-hidden">
              {fraction > 0 && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${fraction * 100}%` }}
                  transition={{ duration: 0.35, delay: i * 0.035, ease: 'easeOut' }}
                  style={{ backgroundColor: segColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-gray-600 select-none">
        <span>Casual</span>
        <span>Focused</span>
        <span>Expert</span>
      </div>
    </div>
  );
}
