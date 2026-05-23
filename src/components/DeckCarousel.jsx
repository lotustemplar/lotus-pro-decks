import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DeckCard from './DeckCard';

const GAP = 20; // px — matches gap-5 in Tailwind

function usePerView() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const update = () => {
      if      (window.innerWidth >= 1024) setN(3);
      else if (window.innerWidth >= 640)  setN(2);
      else                                setN(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return n;
}

export default function DeckCarousel({ decks, animationsEnabled }) {
  const [current, setCurrent]   = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef(null);
  const perView      = usePerView();
  const maxIndex     = Math.max(0, decks.length - perView);

  /* Recompute card width whenever container resizes or perView changes */
  const recalc = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      setCardWidth((w - (perView - 1) * GAP) / perView);
    }
  }, [perView]);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [recalc]);

  /* Clamp current when deck list or perView changes */
  useEffect(() => {
    setCurrent(c => Math.min(c, Math.max(0, decks.length - perView)));
  }, [decks.length, perView]);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxIndex, c + 1));

  const translateX = current * (cardWidth + GAP);

  return (
    <div className="relative">
      {/* ── Left arrow ── */}
      <button
        onClick={prev}
        disabled={current === 0}
        aria-label="Previous decks"
        className="absolute -left-5 top-1/2 -translate-y-8 z-10 w-10 h-10 rounded-full
          flex items-center justify-center
          bg-[#0a0e1a] border border-white/15 text-white
          hover:bg-white/10 hover:border-white/30
          disabled:opacity-20 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Track ── */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: `${GAP}px` }}
          animate={{ x: -translateX }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        >
          {decks.map(deck => (
            <div
              key={deck.id}
              style={{
                width: cardWidth
                  ? `${cardWidth}px`
                  : `calc((100% - ${(perView - 1) * GAP}px) / ${perView})`,
                flexShrink: 0,
              }}
            >
              <DeckCard deck={deck} animationsEnabled={animationsEnabled} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right arrow ── */}
      <button
        onClick={next}
        disabled={current >= maxIndex}
        aria-label="Next decks"
        className="absolute -right-5 top-1/2 -translate-y-8 z-10 w-10 h-10 rounded-full
          flex items-center justify-center
          bg-[#0a0e1a] border border-white/15 text-white
          hover:bg-white/10 hover:border-white/30
          disabled:opacity-20 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Dot indicators ── */}
      {maxIndex > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to deck ${i + 1}`}
              className="rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width:      current === i ? 24 : 8,
                height:     8,
                background: current === i
                  ? 'linear-gradient(to right, #6366f1, #a78bfa)'
                  : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
