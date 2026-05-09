/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#0f0f0f',
        surface2: '#1a1a1a',
        accent: '#aaff3e',
        red: '#ff4466',
        blue: '#4488ff',
        gold: '#ffd060',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
