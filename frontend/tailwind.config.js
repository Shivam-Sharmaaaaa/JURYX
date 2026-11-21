/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F8",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1F2A44",
          light: "#2B3A5C",
          dark: "#141C2E",
        },
        border: "#E5E7EB",
        borderDark: "#D1D5DB",
        text: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        guilty: {
          DEFAULT: "#DC2626",
          bg: "#FEF2F2",
          border: "#FCA5A5",
        },
        notguilty: {
          DEFAULT: "#16A34A",
          bg: "#F0FDF4",
          border: "#86EFAC",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '8px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      }
    },
  },
  plugins: [],
}
