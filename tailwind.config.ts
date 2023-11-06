import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        '7': 'repeat(7, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '53': 'repeat(53, minmax(0, 1fr))',
      }
    },
    colors: {
      white: '#ffffff',
      black: '#161616',
      cream: '#f7f1e0',
      charcoal: '#2c2c2e',
      orange: '#EE6D43',
      forestGreen: '#1E5F55',
      seafoamGreen: '#C9ECDE',
      spotifygreen: '#1DB954',
      error: '#cc0000',
      okayday: '#CCA000',
    }
  },
  plugins: [],
}
export default config


// white: '#ffffff',
// black: '#000000',
// primary: '#56662B',
// darkprimary: '#222911',
// spotifygreen: '#1DB954',
// mustard: '#7D671F',
// medium: '#6E551E',
// grey: '#76805C',
// lightgrey: '#A5B381',
// neutral: '#a3a3a3',
// yellow: '#D8FF6B',
// lime: '#97B34B',
// darkred: '#42211C',
// error: '#cc0000',
// okayday: '#CCA000',
// cream: '#f7f1e0',
// charcoal: '#2c2c2e'