/** @type {import('tailwindcss').Config} */
export default {
  content: ['./web/**/*.{js,jsx,ts,tsx}'],
  important: '#root',
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
