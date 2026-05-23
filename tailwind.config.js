/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#020817',
          800: '#0a0e1a',
          700: '#0f1629',
          600: '#141e3c',
          500: '#1a2550',
        },
        brand: {
          red: '#ef4444',
          blue: '#3b82f6',
          black: '#7c3aed',
          white: '#f59e0b',
          green: '#22c55e',
          multi: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ember': 'ember 3s ease-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
        'leaf': 'leaf 5s ease-in-out infinite',
        'smoke': 'smoke 6s ease-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'particle': 'particle 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        ember: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-80px) scale(0)', opacity: '0' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.6' },
          '50%': { transform: 'translateY(-30px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(-60px) scale(0.9)', opacity: '0' },
        },
        leaf: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'translateY(-20px) rotate(15deg)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) rotate(30deg)', opacity: '0' },
        },
        smoke: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '100%': { transform: 'translateY(-60px) scale(2)', opacity: '0' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-20px) translateX(20px)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
