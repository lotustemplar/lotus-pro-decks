import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BracketSection from '../components/BracketSection';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function Brackets() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16">
      <SEO
        title="Commander Brackets Explained"
        description="Understand Commander brackets 1–4 and how they set table expectations before you sit down. Learn which bracket each Lotus Pro Deck targets and why."
        path="/brackets"
      />
      <div className="relative overflow-hidden bg-gradient-to-b from-[#020817] to-[#0a0e1a] py-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            Commander <span className="gradient-text">Brackets</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            A simple guide to Commander power levels — so you always know which deck belongs at your table.
          </motion.p>
        </div>
      </div>

      <BracketSection />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 border border-white/8 text-center"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-3">Find Your Bracket</h2>
          <p className="text-gray-400 mb-6">All our decks are labeled with their bracket so you'll never be the "that guy" at the table.</p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold
              bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Browse Decks by Bracket <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <footer className="bg-[#020817] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-700">
          Lotus Pro Decks — Expert-Built. Beginner-Ready.
        </div>
      </footer>
    </div>
  );
}
