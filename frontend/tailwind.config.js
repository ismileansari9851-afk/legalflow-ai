/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0F1A',
          900: '#0F1626',
          800: '#141C30',
          700: '#1B2438',
          600: '#28324A',
          500: '#3B4863',
        },
        vellum: {
          50: '#FCFCFB',
          100: '#F5F6F3',
          200: '#ECEDE8',
          300: '#DFE1D9',
        },
        brass: {
          400: '#C9A567',
          500: '#B08D57',
          600: '#8F7143',
          700: '#6E5732',
        },
        seal: {
          green: '#2F6F4E',
          brick: '#8C3B2E',
        },
        text: {
          DEFAULT: '#1B1F2A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        tab: '0 1px 0 rgba(0,0,0,0.04)',
        card: '0 1px 3px rgba(15,22,38,0.06), 0 1px 2px rgba(15,22,38,0.04)',
        dark: '0 1px 3px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        seal: '999px',
      },
    },
  },
  plugins: [],
}
