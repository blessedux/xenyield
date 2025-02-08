/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          500: '#f59e0b',
        },
      },
      borderColor: {
        DEFAULT: 'rgb(var(--foreground))',
      },
      backgroundColor: {
        DEFAULT: 'rgb(var(--background))',
      },
      textColor: {
        DEFAULT: 'rgb(var(--foreground))',
      },
    },
  },
  plugins: [],
}

