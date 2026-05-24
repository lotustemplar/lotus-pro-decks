import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-display font-bold text-white mb-3"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg mb-8 leading-relaxed"
        >
          Your deck is on its way. Check your email for a receipt and shipping confirmation.
        </motion.p>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-white/8 p-6 mb-8 text-left"
        >
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Package size={18} className="text-purple-400" /> What happens next
          </h2>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { step: '1', text: 'You\'ll receive an order confirmation email from Stripe.' },
              { step: '2', text: 'Your deck is packed and shipped within 1–2 business days.' },
              { step: '3', text: 'Tracking info will be emailed once your order ships.' },
              { step: '4', text: 'Sit down and pilot your deck on arrival. You\'re ready.' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="px-6 py-3 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
              shadow-lg shadow-blue-500/25 transition-all"
          >
            Browse More Decks
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
