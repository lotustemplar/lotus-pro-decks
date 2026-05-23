import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { decks, colorMeta } from '../data/decks';

const featuredDecks = decks.filter(d => d.featured).slice(0, 3);

const floatVariants = [
  { animate: { y: [0, -18, 0], rotate: [-2, 2, -2] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } },
  { animate: { y: [-8, 10, -8], rotate: [3, -1, 3] }, transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 } },
  { animate: { y: [5, -12, 5], rotate: [-1, 3, -1] }, transition: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 } },
];

export default function Hero({ animationsEnabled }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#020817]">
      <ParticleBackground count={50} enabled={animationsEnabled} />

      {/* Radial hero glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-[#020817] to-[#020817]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(ellipse, #1d4ed8 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
              bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Expert-Built. Beginner-Ready.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl xl:text-6xl font-display font-bold leading-tight mb-6"
          >
            Commander Decks{' '}
            <span className="gradient-text">Built by Pros.</span>
            <br />
            Ready for{' '}
            <span className="text-white">You to Pilot.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed mb-8 max-w-xl"
          >
            Beginner-friendly, professionally built decks with clear strategies, upgrade paths,
            and everything you need to sit down and play — tonight.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              to="/shop"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base
                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                hover:from-blue-500 hover:to-purple-500
                shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40
                transition-all duration-200"
            >
              Shop Decks
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base
                border border-white/15 text-gray-200
                hover:bg-white/5 hover:border-white/25
                transition-all duration-200"
            >
              How It Works
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-3"
          >
            {['Synergy Checked', 'Pilot Guide Included', 'Ready to Play', 'Beginner Friendly'].map(b => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="text-green-400">✓</span> {b}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — floating 1:1 deck cards */}
        <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center">
          {featuredDecks.map((deck, i) => {
            const isCenter = i === 1;
            const offsetX = (i - 1) * 52;
            const rotation = (i - 1) * 7;

            return (
              <motion.div
                key={deck.id}
                className={`absolute ${isCenter ? 'z-20' : 'z-10'}`}
                style={{ x: offsetX, rotate: rotation }}
                {...(animationsEnabled ? floatVariants[i] : {})}
              >
                <Link to={`/deck/${deck.id}`}>
                  {/* 1:1 square card */}
                  <div
                    className={`relative overflow-hidden rounded-2xl cursor-pointer deck-card-hover
                      ${isCenter ? 'w-52 h-52 sm:w-64 sm:h-64' : 'w-44 h-44 sm:w-56 sm:h-56'}`}
                    style={{
                      border: `1px solid ${deck.accentColor}55`,
                      boxShadow: `0 20px 60px ${deck.accentColor}33, 0 0 0 1px ${deck.accentColor}22`,
                      background: `linear-gradient(135deg, ${deck.gradientFrom}, ${deck.gradientTo})`,
                    }}
                  >
                    {/* Full image — object-contain so the whole image is visible */}
                    {deck.image ? (
                      <img
                        src={deck.image}
                        alt={deck.name}
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ padding: '0px' }}
                      />
                    ) : (
                      /* Gradient placeholder */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-24 h-24 rounded-full opacity-25"
                          style={{ background: deck.accentColor, filter: 'blur(24px)' }}
                        />
                        <div className="absolute text-6xl opacity-20 select-none">⚔</div>
                      </div>
                    )}

                    {/* Subtle animated glow pulse on the image */}
                    {animationsEnabled && (
                      <div
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        style={{
                          background: `radial-gradient(ellipse at 50% 100%, ${deck.accentColor}22 0%, transparent 60%)`,
                          animation: 'bgPulse 3s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Top-right bracket badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-gray-300 font-medium">
                      B{deck.bracket}
                    </div>

                    {/* Bottom info bar — glass overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                      style={{
                        background: 'linear-gradient(to top, rgba(2,8,23,0.92) 0%, rgba(2,8,23,0.6) 70%, transparent 100%)',
                      }}
                    >
                      <div className="font-display font-bold text-white text-xs leading-tight truncate mb-1">
                        {deck.name}
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Color dots */}
                        <div className="flex gap-1">
                          {deck.colors.map(c => (
                            <span
                              key={c}
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ background: colorMeta[c]?.hex }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold" style={{ color: deck.accentColor }}>
                          ${deck.price}
                        </span>
                      </div>
                    </div>

                    {/* Glowing border edge */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ boxShadow: `inset 0 0 20px ${deck.accentColor}18` }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 text-xs"
        animate={animationsEnabled ? { y: [0, 6, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>Scroll to explore</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
