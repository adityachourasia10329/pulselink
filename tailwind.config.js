/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sand Palette (from user photo swatch: #DFBFA0)
        sand: {
          50: '#FDFBF7',
          100: '#F5ECE3',
          200: '#EADCCF',
          300: '#DFBFA0', // Exact swatch from photo
          400: '#C9A583',
          500: '#B08A66',
        },
        // Terracotta Palette (from user photo swatch: #7A3E20)
        terracotta: {
          DEFAULT: '#7A3E20', // Exact swatch from photo
          50: '#FAF2EE',
          100: '#F2DFD6',
          200: '#E0BCAE',
          300: '#C58C75',
          400: '#9E5B3D',
          500: '#7A3E20',
          600: '#643017',
          700: '#4F230F',
          800: '#3D1A0B',
          900: '#2C1207',
          950: '#1A0904',
        },
        // Cobalt Palette (from user photo swatch: #0C45B0)
        cobalt: {
          DEFAULT: '#0C45B0', // Exact swatch from photo
          glow: 'rgba(12, 69, 176, 0.4)',
          dark: '#083282',
          light: '#2E69DB',
        },
        // Mapped dynamic surfaces (supports Sand Editorial by default + Terracotta Dark)
        bottle: {
          950: 'var(--color-well)',
          900: 'var(--color-surface)',
          800: 'var(--color-bg)',
          700: 'var(--color-border)',
          600: 'var(--color-border-elevated)',
          500: 'var(--color-terracotta)',
        },
        // Mapped typography
        bone: {
          50: 'var(--color-surface)',
          100: 'var(--color-text-primary)',
          200: 'var(--color-text-secondary)',
          300: 'var(--color-text-muted)',
          400: 'var(--color-text-faint)',
        },
        // Primary Action / CTA mapped to Cobalt
        vermilion: {
          DEFAULT: '#0C45B0',
          glow: 'rgba(12, 69, 176, 0.4)',
          dark: '#083282',
          light: '#2E69DB',
        },
        sage: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          glow: 'rgba(46, 125, 50, 0.25)',
        },
        amber: {
          DEFAULT: '#B45309',
          glow: 'rgba(180, 83, 9, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-vermilion': 'pulseCobalt 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-cobalt': 'pulseCobalt 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.65 },
        },
        pulseCobalt: {
          '0%, 100%': { 
            borderColor: '#0C45B0',
            boxShadow: '0 0 15px rgba(12, 69, 176, 0.6), inset 0 0 10px rgba(12, 69, 176, 0.2)'
          },
          '50%': { 
            borderColor: '#083282',
            boxShadow: '0 0 5px rgba(12, 69, 176, 0.2)'
          },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
