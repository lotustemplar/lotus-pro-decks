import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#020817] to-[#0a0e1a] py-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            About <span className="gradient-text">ProPilot Decks</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        {[
          {
            title: 'Why We Started',
            body: "We love Commander. But we also remember what it was like to sit down at a table for the first time with a deck we barely understood, and lose badly, feeling confused the whole time. We built ProPilot Decks because that experience shouldn't be the norm. Every new player deserves a deck that actually works, with a guide that actually explains it.",
          },
          {
            title: 'Who Builds the Decks',
            body: "Every ProPilot deck is designed by players with years of competitive and casual Commander experience. We don't just throw cards together — every card is chosen because it works with your commander, your strategy, and your budget. Then we play-test. Then we write the guide. Then we ship.",
          },
          {
            title: 'Our Philosophy',
            body: "We believe Commander is the best card game experience when everyone at the table feels empowered. That means decks that are fun to play, fair to face, and easy to understand. We make Bracket 2 and Bracket 3 decks — strong enough to compete, friendly enough for any casual table.",
          },
          {
            title: 'The Pilot Guide Promise',
            body: "Every deck ships with a Pilot Guide that covers your game plan, your win conditions, how to read your opening hand, what threats to watch for, and an upgrade path for later. We want you to feel like you've been playing this deck for months — on your very first game.",
          },
        ].map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            <h2 className="font-display font-bold text-xl text-white mb-3">{section.title}</h2>
            <p className="text-gray-400 leading-relaxed">{section.body}</p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-6"
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold
              bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
          >
            Shop Our Decks <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <footer className="bg-[#020817] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-700">
          ProPilot Decks — Expert-Built. Beginner-Ready. Not affiliated with Wizards of the Coast.
        </div>
      </footer>
    </div>
  );
}
