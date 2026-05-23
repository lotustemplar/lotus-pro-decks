import { motion } from 'framer-motion';

const BRACKETS = [
  {
    num: 2,
    title: 'Bracket 2',
    subtitle: 'Casual & Friendly',
    color: '#22c55e',
    desc: 'Casual, affordable, beginner-friendly decks designed for fun and learning. These decks are powered enough to compete but fair enough that everyone at the table has a good time.',
    traits: ['Budget-conscious builds', 'Slower win conditions', 'Great for learning', 'Low power level', 'Any playgroup welcomes these'],
    icon: '🌱',
    example: 'Krenko Goblin Blitz, Rhys Token Swarm, Liesa Lifegain Control',
  },
  {
    num: 3,
    title: 'Bracket 3',
    subtitle: 'Focused & Synergistic',
    color: '#f59e0b',
    desc: 'Stronger, more focused decks with better synergy and more powerful interactions. These decks have clear win conditions and can handle competitive casual tables.',
    traits: ['Premium card choices', 'Tight synergy packages', 'Clear win conditions', 'Competitive casual ready', 'More explosive turns'],
    icon: '⚡',
    example: 'Meren Graveyard Engine, Elsha Storm Cannon, Atraxa Proliferate',
  },
];

export default function BracketSection() {
  return (
    <section className="py-24 bg-[#020817] relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4
              bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium"
          >
            Power Level Guide
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-bold text-white mb-4"
          >
            Understanding <span className="gradient-text">Deck Brackets</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-lg mx-auto"
          >
            Brackets help you match your deck's power to your playgroup.
            Don't worry — we keep it simple.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {BRACKETS.map((bracket, i) => (
            <motion.div
              key={bracket.num}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass rounded-2xl p-6 border border-white/8 group hover:-translate-y-1 transition-all duration-300"
              style={{ borderColor: `${bracket.color}33` }}
            >
              {/* Accent line top */}
              <div
                className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${bracket.color}, transparent)` }}
              />

              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: `${bracket.color}18`, border: `1px solid ${bracket.color}33` }}
                >
                  {bracket.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-2xl font-display font-bold"
                      style={{ color: bracket.color }}
                    >
                      {bracket.title}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-400">{bracket.subtitle}</div>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5">{bracket.desc}</p>

              <ul className="space-y-2 mb-5">
                {bracket.traits.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs" style={{ background: `${bracket.color}22`, color: bracket.color }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="rounded-xl p-3" style={{ background: `${bracket.color}0d`, border: `1px solid ${bracket.color}22` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: bracket.color }}>Example Decks:</div>
                <div className="text-xs text-gray-400">{bracket.example}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple explanation note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto text-center glass rounded-2xl p-6 border border-white/8"
        >
          <div className="text-sm text-gray-400 leading-relaxed">
            <span className="text-white font-semibold">Not sure which bracket is right for you?</span>
            {' '}Ask your playgroup! Bracket 2 is perfect if you've never played before, or if your group plays casual kitchen-table Commander. Bracket 3 is ideal once you're comfortable with the basics and want a more focused, synergistic experience.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
