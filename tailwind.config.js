/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bottle: {
          950: '#05140F',
          900: '#09241C',
          800: '#0F372B', // Primary Background / Surface
          700: '#164A3B', // Elevated panels / borders
          600: '#1F614E',
          500: '#2A7A63',
        },
        bone: {
          50: '#FAF7F2',
          100: '#EFE7DA', // Primary Text / Light Surface
          200: '#E4D8C4',
          300: '#C8BFA8', // Secondary / Muted
          400: '#9E947F',
        },
        vermilion: {
          DEFAULT: '#E63B2E',
          glow: 'rgba(230, 59, 46, 0.4)',
          dark: '#B8281E',
          light: '#FF5A4D',
        },
        sage: {
          DEFAULT: '#4ADE80',
          dark: '#16A34A',
          glow: 'rgba(74, 222, 128, 0.25)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-vermilion': 'pulseVermilion 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.65 },
        },
        pulseVermilion: {
          '0%, 100%': { 
            borderColor: '#E63B2E',
            boxShadow: '0 0 15px rgba(230, 59, 46, 0.6), inset 0 0 10px rgba(230, 59, 46, 0.2)'
          },
          '50%': { 
            borderColor: '#B8281E',
            boxShadow: '0 0 5px rgba(230, 59, 46, 0.2)'
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
