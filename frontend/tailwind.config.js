/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: '#F7F5F0',
        primary: '#1E1E1E',
        text: '#2D2D2D',
        accent: '#D97736',
        cardHeader: '#1E1E1E',
        cardHeaderContent: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'sm': '2px',
      }
    },
  },
  plugins: [],
};
