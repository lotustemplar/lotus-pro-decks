import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const STEPS = [
  {
    num: '01',
    title: 'Browse & Choose Your Deck',
    desc: "Filter by color identity, playstyle, bracket, and budget. Each deck has a full description, strategy breakdown, and difficulty rating so you can find your perfect match.",
    color: '#3b82f6',
    icon: '🔍',
  },
  {
    num: '02',
    title: 'Receive Your Ready-to-Play Deck',
    desc: "Your 99-card Commander deck arrives fully sleeved with your pilot guide, synergy cheat sheet, and upgrade path — everything you need in one box.",
    color: '#7c3aed',
    icon: '📦',
  },
  {
    num: '03',
    title: 'Read the Pilot Guide',
    desc: "Your personalized Pilot Guide explains exactly how to play your deck — what your win conditions are, what to look for in your opening hand, and how to navigate common situations.",
    color: '#22c55e',
    icon: '📖',
  },
  {
    num: '04',
    title: 'Sit Down and Play',
    desc: "Shuffle up, follow the guide, and play your first game. You'll be surprised how quickly you understand the deck — because it was designed with you in mind.",
    color: '#f59e0b',
    icon: '🎮',
  },
  {
    num: '05',
    title: "Upgrade When You're Ready",
    desc: "When you've mastered the basics, your upgrade path guide shows exactly which cards to add next — and why. Your deck grows with you.",
    color: '#ef4444',
    icon: '📈',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16">
      <SEO
        title="How It Works"
        description="From browsing to your first game — here's how Lotus Pro Decks works. Choose a deck, we ship it ready to play with a pilot guide, strategy card, and synergy cheat sheet."
        path="/how-it-works"
      />
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#020817] to-[#0a0e1a] py-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            How <span className="gradient-text">It Works</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            From discovery to your first win — here's the Lotus Pro Decks experience.
          </motion.p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent" />

          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16 sm:pl-20"
              >
                {/* Step circle */}
                <div
                  className="absolute left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl border border-white/10 z-10"
                  style={{ background: `${step.color}18` }}
                >
                  {step.icon}
                </div>

                <div className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300"
                  style={{ borderColor: `${step.color}22` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold tracking-widest" style={{ color: step.color }}>STEP {step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 glass rounded-2xl p-8 border border-white/8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-3">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">Browse our full collection of professionally built Commander decks.</p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              hover:from-blue-500 hover:to-purple-500 transition-all duration-200
              shadow-lg shadow-blue-500/25"
          >
            Shop Commander Decks <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <footer className="bg-[#020817] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-700">
          Lotus Pro Decks — Expert-Built. Beginner-Ready. Not affiliated with Wizards of the Coast.
        </div>
      </footer>
    </div>
  );
}
