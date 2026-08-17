/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arcade: {
          dark: '#130924',
          darker: '#0B0515',
          slate: '#24143D',
          card: '#2A1847',
          yellow: '#FFE600',
          pink: '#FF5DA2',
          cyan: '#00F5FF',
          green: '#2CE885',
          orange: '#FF8800',
          purple: '#8B53FF',
          white: '#F2F2F2',
          black: '#000000',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        arcade: ['Silkscreen', 'monospace'],
        dialog: ['VT323', 'monospace'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px #000000',
        'pixel': '3px 3px 0px 0px #000000',
        'pixel-lg': '4px 4px 0px 0px #000000',
        'pixel-yellow': '3px 3px 0px 0px #FFE600',
        'pixel-pink': '3px 3px 0px 0px #FF5DA2',
        'pixel-cyan': '3px 3px 0px 0px #00F5FF',
        'pixel-green': '3px 3px 0px 0px #2CE885',
      }
    },
  },
  plugins: [],
}
