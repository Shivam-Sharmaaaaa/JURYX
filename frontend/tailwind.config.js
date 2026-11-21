/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#FAF9F6",
        mahogany: {
          light: '#4E3121',
          DEFAULT: '#3B2418',
          dark: '#24160F',
          deep: '#1A0F0A',
        },
        brass: {
          light: '#C9A979',
          DEFAULT: '#B08D57',
          dark: '#8C6E3D',
          subtle: '#E2D3BE',
        },
        courtBorder: '#E7E1D8',
        courtText: {
          primary: '#292524',
          secondary: '#78716C',
          muted: '#A8A29E',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022c22',
        },
        guilty: {
          DEFAULT: '#B91C1C',
          light: '#FEF2F2',
          border: '#FCA5A5',
          dark: '#7F1D1D',
        },
        notguilty: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          border: '#6EE7B7',
          dark: '#064E3B',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        court: '0 4px 20px -2px rgba(36, 22, 15, 0.06), 0 2px 6px -1px rgba(36, 22, 15, 0.04)',
        courtElevated: '0 12px 32px -4px rgba(36, 22, 15, 0.12), 0 4px 12px -2px rgba(36, 22, 15, 0.06)',
        courtLift: '0 8px 24px -3px rgba(176, 141, 87, 0.18), 0 4px 8px -2px rgba(36, 22, 15, 0.08)',
        subtle: '0 1px 3px 0 rgba(36, 22, 15, 0.05), 0 1px 2px 0 rgba(36, 22, 15, 0.03)',
        card: '0 2px 8px -2px rgba(36, 22, 15, 0.06), 0 1px 4px -1px rgba(36, 22, 15, 0.04)',
        elevated: '0 10px 25px -5px rgba(36, 22, 15, 0.09), 0 8px 10px -6px rgba(36, 22, 15, 0.05)',
      }
    },
  },
  plugins: [],
}
