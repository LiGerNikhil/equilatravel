/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf0',
          100: '#faf3d0',
          200: '#f5e6b8',
          300: '#e8c96d',
          400: '#d9b65a',
          500: '#c9a84c',
          600: '#a88830',
          700: '#8a6e28',
          800: '#6c5520',
          900: '#4e3d18',
        },
        royal: {
          50: '#e8f0ec',
          100: '#c4d4cc',
          200: '#9cb8a8',
          300: '#6e9c84',
          400: '#4a8068',
          500: '#0f2e1e',
          600: '#0a1f14',
          700: '#071510',
          800: '#050a08',
          900: '#020405',
        },
        red: {
          50: '#fdf2f0',
          100: '#f8d6d0',
          200: '#f0b0a4',
          300: '#e48574',
          400: '#d46b5a',
          500: '#b84a3a',
          600: '#943828',
          700: '#702a1e',
          800: '#4c1e14',
          900: '#28100a',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef6c3',
          200: '#fce788',
          300: '#fad64e',
          400: '#f7dc6f',
          500: '#f0c929',
          600: '#d4a818',
          700: '#a88412',
          800: '#7c600e',
          900: '#50400a',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        accent: ['var(--font-accent)', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 160, 23, 0.7)' },
        },
      },
    },
  },
  plugins: [],
};
