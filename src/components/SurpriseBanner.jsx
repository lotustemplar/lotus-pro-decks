import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

/**
 * variant="section"  — full-width between Home page sections
 * variant="header"   — compact banner inside the Shop page header
 */
export default function SurpriseBanner({ variant = 'section' }) {
  if (variant === 'header') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl
          bg-gradient-to-r from-yellow-500/10 via-amber-400/8 to-yellow-500/10
          border border-yellow-500/25 backdrop-blur-sm"
      >
        <motion.span
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3 }}
          className="text-xl shrink-0"
        >
          🎁
        </motion.span>
        <span className="text-sm text-yellow-200/90 font-medium">
          Every order ships with a <span className="text-yellow-400 font-bold">mystery surprise</span> inside — you'll love it.
        </span>
        <Sparkles size={14} className="text-yellow-500/60 shrink-0" />
      </motion.div>
    );
  }

  // variant === 'section' — full-width strip
  return (
    <section className="relative overflow-hidden bg-[#020817] py-14">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, #92400e44, transparent)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #d9770620, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Gift icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex mb-5"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-yellow-500/20 blur-xl scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10
              border border-yellow-500/30 flex items-center justify-center text-3xl">
              🎁
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold text-white mb-3"
        >
          Every Order Comes With a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
            Special Surprise
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 max-w-md mx-auto text-base leading-relaxed"
        >
          We hide something extra in every single package. We're not telling you what it is —
          that's the point. Consider it our thank-you for joining the ProPilot community.
        </motion.p>

        {/* Decorative dots row */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-yellow-500/60"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
