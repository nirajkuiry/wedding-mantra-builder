/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        panel: '#141414',
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E8CD73',
          deep: '#9C7A22',
        },
        ivory: '#FFFFFF',
        smoke: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(135deg, #9C7A22 0%, #D4AF37 45%, #F3E5AB 55%, #D4AF37 70%, #9C7A22 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        goldGlow: '0 0 24px rgba(212,175,55,0.25)',
      },
    },
  },
  plugins: [],
};
