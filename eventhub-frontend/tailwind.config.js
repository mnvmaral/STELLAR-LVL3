/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#E9D5FF',
        'pastel-orange': '#FED7AA',
        'pastel-green': '#BBF7D0',
        'pastel-pink': '#FBCFE8',
        'pastel-blue': '#BFDBFE',
        'pastel-yellow': '#FEF08A',
      },
      borderRadius: {
        'custom': '14px',
        'custom-lg': '18px',
      },
    },
  },
  plugins: [],
}
