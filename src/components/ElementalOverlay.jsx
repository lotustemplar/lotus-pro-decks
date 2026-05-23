import { useMemo } from 'react';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---------- individual element renderers ---------- */

function FireEmbers({ count = 8 }) {
  const embers = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(10, 90)}%`,
    bottom: `${randomBetween(0, 30)}%`,
    size: randomBetween(3, 7),
    duration: `${randomBetween(1.5, 3)}s`,
    delay: `${randomBetween(0, 2)}s`,
  })), [count]);

  return (
    <>
      {/* heat wave base */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-orange-900/10 to-transparent" />
      {embers.map(e => (
        <div
          key={e.id}
          className="absolute rounded-full ember-particle"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, #fbbf24, #ef4444)`,
            boxShadow: `0 0 ${e.size * 2}px #ef4444`,
            '--duration': e.duration,
            '--delay': e.delay,
          }}
        />
      ))}
      {/* spark streaks */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
        style={{ background: 'linear-gradient(to top, #ef4444, transparent)' }} />
    </>
  );
}

function WaterCurrents({ count = 8 }) {
  const bubbles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(5, 95)}%`,
    bottom: `${randomBetween(0, 40)}%`,
    size: randomBetween(4, 10),
    duration: `${randomBetween(2.5, 5)}s`,
    delay: `${randomBetween(0, 3)}s`,
  })), [count]);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-cyan-900/20 to-transparent" />
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full bubble-particle"
          style={{
            left: b.left,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            background: `rgba(59,130,246,0.5)`,
            border: '1px solid rgba(147,197,253,0.6)',
            '--duration': b.duration,
            '--delay': b.delay,
          }}
        />
      ))}
      {/* wave sweep */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-30"
        style={{ background: 'linear-gradient(to top, #3b82f6, transparent)' }} />
    </>
  );
}

function DarkSmoke({ count = 6 }) {
  const wisps = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(10, 90)}%`,
    bottom: `${randomBetween(0, 20)}%`,
    size: randomBetween(20, 40),
    duration: `${randomBetween(4, 7)}s`,
    delay: `${randomBetween(0, 3)}s`,
  })), [count]);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/50 via-black/20 to-transparent" />
      {wisps.map(w => (
        <div
          key={w.id}
          className="absolute rounded-full smoke-particle opacity-40"
          style={{
            left: w.left,
            bottom: w.bottom,
            width: w.size,
            height: w.size,
            background: 'radial-gradient(circle, rgba(124,58,237,0.4), rgba(0,0,0,0.2))',
            filter: 'blur(8px)',
            '--duration': w.duration,
            '--delay': w.delay,
          }}
        />
      ))}
    </>
  );
}

function SunRays({ count = 6 }) {
  const rays = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360,
    duration: `${randomBetween(2, 4)}s`,
    delay: `${(i / count) * 2}s`,
  })), [count]);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/20 via-amber-900/10 to-transparent" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        {rays.map(r => (
          <div
            key={r.id}
            className="absolute origin-bottom sun-ray"
            style={{
              width: 2,
              height: 40,
              background: 'linear-gradient(to top, #fbbf24, transparent)',
              transform: `rotate(${r.angle}deg) translateX(-50%)`,
              '--duration': r.duration,
              '--delay': r.delay,
            }}
          />
        ))}
        <div className="w-8 h-8 rounded-full bg-yellow-400/60" style={{ filter: 'blur(4px)', marginLeft: -16, marginTop: -16 }} />
      </div>
      {/* shimmer particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full sun-ray"
          style={{
            left: `${randomBetween(10, 90)}%`,
            top: `${randomBetween(10, 60)}%`,
            width: randomBetween(2, 5),
            height: randomBetween(2, 5),
            background: '#fbbf24',
            opacity: 0.5,
            '--duration': `${randomBetween(2, 4)}s`,
            '--delay': `${randomBetween(0, 2)}s`,
          }}
        />
      ))}
    </>
  );
}

function NatureLeaves({ count = 8 }) {
  const leaves = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(5, 95)}%`,
    bottom: `${randomBetween(0, 30)}%`,
    size: randomBetween(8, 16),
    duration: `${randomBetween(3, 6)}s`,
    delay: `${randomBetween(0, 3)}s`,
  })), [count]);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-emerald-900/20 to-transparent" />
      {leaves.map(l => (
        <div
          key={l.id}
          className="absolute leaf-particle text-green-400"
          style={{
            left: l.left,
            bottom: l.bottom,
            fontSize: l.size,
            '--duration': l.duration,
            '--delay': l.delay,
          }}
        >
          🌿
        </div>
      ))}
      {/* vine creep at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30"
        style={{ background: 'linear-gradient(to top, #22c55e, transparent)' }} />
    </>
  );
}

function MultiOverlay() {
  return (
    <>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-red-900/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-blue-900/40 to-transparent" />
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-purple-900/30 to-transparent" />
      </div>
    </>
  );
}

/* ---------- main component ---------- */

export default function ElementalOverlay({ colors = [], enabled = true }) {
  if (!enabled || !colors.length) return null;

  const hasRed = colors.includes('red');
  const hasBlue = colors.includes('blue');
  const hasBlack = colors.includes('black');
  const hasWhite = colors.includes('white');
  const hasGreen = colors.includes('green');
  const isMulti = colors.length > 2;

  if (isMulti) return <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"><MultiOverlay /></div>;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {hasRed && <FireEmbers count={7} />}
      {hasBlue && <WaterCurrents count={7} />}
      {hasBlack && <DarkSmoke count={6} />}
      {hasWhite && <SunRays count={6} />}
      {hasGreen && <NatureLeaves count={7} />}
    </div>
  );
}
