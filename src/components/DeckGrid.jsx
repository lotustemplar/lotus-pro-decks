import { AnimatePresence, motion } from 'framer-motion';
import DeckCard from './DeckCard';

export default function DeckGrid({ decks, animationsEnabled }) {
  if (decks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-6xl mb-4 opacity-30">⚔</div>
        <h3 className="text-xl font-display font-bold text-gray-400 mb-2">No Decks Found</h3>
        <p className="text-gray-600 text-sm max-w-xs">Try adjusting your filters to see more Commander decks.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <AnimatePresence mode="popLayout">
        {decks.map(deck => (
          <DeckCard key={deck.id} deck={deck} animationsEnabled={animationsEnabled} />
        ))}
      </AnimatePresence>
    </div>
  );
}
