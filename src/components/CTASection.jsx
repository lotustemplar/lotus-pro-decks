import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

export default function CTASection({ animationsEnabled }) {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0a0e1a] to-[#020817]">
      <ParticleBackground count={25} enabled={animationsEnabled} />

      {/* Glow orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6, #7c3aed, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
            bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
        >
          Ready to Start Playing?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 leading-tight"
        >
          Find Your First{' '}
          <span className="gradient-text">Great Deck.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Skip the overwhelming deck-building process. A pro already built it,
          explained it, and it's ready to play tonight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            to="/shop"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              hover:from-blue-500 hover:to-purple-500
              shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/50
              transition-all duration-200"
          >
            Browse Commander Decks
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base
              border border-white/15 text-gray-200 hover:text-white hover:bg-white/5 hover:border-white/25
              transition-all duration-200"
          >
            <HelpCircle size={18} />
            Help Me Choose
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {[
            { icon: '🛡️', text: 'Professionally Built' },
            { icon: '📖', text: 'Pilot Guide Included' },
            { icon: '✅', text: 'Synergy Checked' },
            { icon: '🎯', text: 'Beginner Friendly' },
            { icon: '🚀', text: 'Ready to Play' },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-gray-400">
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
