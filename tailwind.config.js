/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        geo: {
          sky: '#e0f2fe',
          land: '#f0fdf4',
          accent: '#2563eb',
          warm: '#f97316',
          good: '#16a34a',
          bad: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
