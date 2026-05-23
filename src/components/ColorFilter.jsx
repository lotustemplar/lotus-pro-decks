import { motion } from 'framer-motion';
import { colorMeta } from '../data/decks';

const COLOR_KEYS = ['red', 'blue', 'black', 'white', 'green', 'multi', 'colorless'];

const COLOR_ICONS = {
  red: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2C12 2 6 8 6 14a6 6 0 0012 0C18 8 12 2 12 2z" fill="currentColor" opacity="0.9"/>
      <path d="M12 8C12 8 9 12 9 15a3 3 0 006 0C15 12 12 8 12 8z" fill="white" opacity="0.3"/>
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.8"/>
      <path d="M8 12 Q12 6 16 12 Q12 18 8 12z" fill="white" opacity="0.4"/>
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.5"/>
    </svg>
  ),
  black: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm0 4c1.5 0 2.5 1 2.5 2.5S13.5 12 12 12s-2.5-1-2.5-2.5S10.5 7 12 7zm0 11c-2.5 0-4.5-1-4.5-2.5 0-1.4 2-2.5 4.5-2.5s4.5 1.1 4.5 2.5C16.5 17 14.5 18 12 18z" fill="currentColor"/>
    </svg>
  ),
  white: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i} x1="12" y1="12"
          x2={12 + 8 * Math.cos(deg * Math.PI / 180)}
          y2={12 + 8 * Math.sin(deg * Math.PI / 180)}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      ))}
    </svg>
  ),
  green: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 21C12 21 4 15 4 9a8 8 0 0116 0c0 6-8 12-8 12z" fill="currentColor" opacity="0.9"/>
      <path d="M12 21V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M8 13c2-2 4-4 4-4" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <path d="M16 13c-2-2-4-4-4-4" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  multi: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <defs>
        <linearGradient id="multiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="25%" stopColor="#3b82f6"/>
          <stop offset="50%" stopColor="#7c3aed"/>
          <stop offset="75%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#22c55e"/>
        </linearGradient>
      </defs>
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="url(#multiGrad)"/>
    </svg>
  ),
  colorless: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      {/* Grey diamond — MTG colorless symbol */}
      <path d="M12 2L22 12L12 22L2 12Z" fill="currentColor" opacity="0.85"/>
      <path d="M12 6L18 12L12 18L6 12Z" fill="white" opacity="0.2"/>
      <path d="M12 2L22 12L12 22" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
    </svg>
  ),
};

export default function ColorFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <motion.button
        onClick={() => onChange(null)}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
          selected === null
            ? 'bg-white/10 border-white/30 text-white'
            : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
        }`}
      >
        All Decks
      </motion.button>

      {COLOR_KEYS.map(key => {
        const meta = colorMeta[key];
        const isActive = selected === key;
        return (
          <motion.button
            key={key}
            onClick={() => onChange(isActive ? null : key)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 overflow-hidden ${
              isActive
                ? 'text-white'
                : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
            style={isActive ? {
              backgroundColor: `${meta.hex}22`,
              borderColor: `${meta.hex}66`,
              color: meta.hex,
              boxShadow: `0 0 16px ${meta.hex}33`,
            } : {}}
          >
            {/* Icon */}
            <span style={{ color: isActive ? meta.hex : 'currentColor' }}>
              {COLOR_ICONS[key]}
            </span>
            {meta.label}
            {/* Active glow line */}
            {isActive && (
              <motion.div
                layoutId="colorFilterUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: meta.hex }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
