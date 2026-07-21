/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F8E4B1',
          dark: '#2E2A31',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        softPulse: 'softPulse 3s ease-in-out infinite',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46, 42, 49, 0.08)',
        softLg: '0 20px 60px rgba(46, 42, 49, 0.12)',
      },
    },
  },
  plugins: [],
};
