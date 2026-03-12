/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#f0fafa',
          100: '#d0f0f0',
          200: '#a0dfe0',
          300: '#5ec8cb',
          400: '#2fb0b5',
          500: '#1a8f96',
          600: '#157378',
          700: '#0f5a60',
          800: '#0a4448',
          900: '#062e31',
        },
        sand: {
          50:  '#fdf9f3',
          100: '#f7f0e3',
          200: '#eeddc0',
          300: '#e2c596',
          400: '#d4a96a',
          500: '#c78d42',
        },
        accent: {
          coral: '#e8705a',
          mint:  '#7dd3c4',
          warm:  '#f5a623',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave':  'wave 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
