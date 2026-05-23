import { useMemo } from 'react';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ParticleBackground({ count = 40, enabled = true }) {
  const particles = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${randomBetween(0, 100)}%`,
      delay: `${randomBetween(0, 10)}s`,
      duration: `${randomBetween(6, 14)}s`,
      size: randomBetween(1, 3),
      opacity: randomBetween(0.1, 0.5),
      color: ['#3b82f6', '#7c3aed', '#06b6d4', '#8b5cf6', '#60a5fa'][Math.floor(Math.random() * 5)],
    }))
  ), [count]);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 animate-bg-pulse"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 animate-bg-pulse"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(40px)', animationDelay: '2s' }}
      />
      <div
        className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full opacity-8 animate-bg-pulse"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(40px)', animationDelay: '4s' }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            animation: `particleDrift ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
