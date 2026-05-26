import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const TOPICS = [
  'Help Me Choose a Deck',
  'Order Question',
  'Deck Question',
  'Custom Deck Request',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16">
      <SEO
        title="Contact Us"
        description="Have a question about a deck, your order, or a custom build request? Reach out to the Lotus Pro Decks team — we typically respond within 24 hours."
        path="/contact"
      />
      <div className="relative overflow-hidden bg-gradient-to-b from-[#020817] to-[#0a0e1a] py-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #ec4899, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-4"
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-md mx-auto"
          >
            Not sure which deck is right for you? Need help with an order? We're here.
          </motion.p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 pb-20">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 border border-white/8 text-center"
          >
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-display font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-gray-400 mb-6">We'll get back to you within 24 hours. In the meantime, feel free to browse our decks.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 sm:p-8 border border-white/8 space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                    placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                    placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Topic</label>
              <select
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                  focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="" disabled>Select a topic...</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                  placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors resize-none"
                placeholder="Tell us what you're looking for — your experience level, what you enjoy, your budget, anything helpful..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base
                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                hover:from-blue-500 hover:to-purple-500 transition-all duration-200
                shadow-lg shadow-blue-500/25"
            >
              <Send size={16} />
              Send Message
            </button>
          </motion.form>
        )}
      </div>

      <footer className="bg-[#020817] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-700">
          Lotus Pro Decks — Expert-Built. Beginner-Ready.
        </div>
      </footer>
    </div>
  );
}
