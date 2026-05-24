import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: '🏆',
    title: 'Built by Experienced Players',
    desc: 'Every deck is designed by competitive and veteran players who know what makes Commander fun and functional.',
    color: '#f59e0b',
  },
  {
    icon: '🎯',
    title: 'Designed for Beginners',
    desc: 'No confusing jargon. Every deck comes with a clear game plan you can understand on your first game.',
    color: '#22c55e',
  },
  {
    icon: '📖',
    title: 'Clear Game Plan Included',
    desc: 'A written Pilot Guide explains exactly how to play your deck, what to do each turn, and when to go for the win.',
    color: '#3b82f6',
  },
  {
    icon: '⚖️',
    title: 'Balanced for Casual Tables',
    desc: 'Our decks are tuned to Bracket 2 and 3 — strong enough to win, fair enough for friendly games.',
    color: '#7c3aed',
  },
  {
    icon: '📈',
    title: 'Upgrade Paths Included',
    desc: 'We tell you exactly which cards to add as your budget grows, so your deck grows with you.',
    color: '#ec4899',
  },
  {
    icon: '🔗',
    title: 'Every Deck Has Synergy',
    desc: 'No random pile of cards. Every slot was chosen because it works with your commander and your strategy.',
    color: '#06b6d4',
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass rounded-2xl p-6 border border-white/8 hover:border-white/15
        transition-all duration-300 hover:-translate-y-1"
      style={{
        '--accent': feature.color,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}33` }}
      >
        {feature.icon}
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-blue-300 transition-colors">
        {feature.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
      <div
        className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: feature.color }}
      />
    </motion.div>
  );
}

export default function WhyProPilot() {
  return (
    <section className="py-24 bg-[#0a0e1a] relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4
              bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-bold text-white mb-4"
          >
            Why <span className="gradient-text">Lotus Pro Decks?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            We exist so newer players can skip the overwhelming deck-building phase
            and get straight to the part that matters — having fun at the table.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
