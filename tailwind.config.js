/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C5CE7', light: '#A29BFE' },
        app: {
          bg: { DEFAULT: '#F7F8FC', dark: '#151718' },
          card: { DEFAULT: '#FFFFFF', dark: '#1E2022' },
          surface: { DEFAULT: '#F5F6FA', dark: '#22252A' },
          border: { DEFAULT: '#EBEBEF', dark: '#2D3038' },
          'text-primary': { DEFAULT: '#1A1B1F', dark: '#E8E9ED' },
          'text-secondary': { DEFAULT: '#8E919A', dark: '#7A7E87' },
          placeholder: { DEFAULT: '#B0B3BA', dark: '#4A4E57' },
          'input-bg': { DEFAULT: '#F7F8FC', dark: '#22252A' },
          'input-border': { DEFAULT: '#E4E5EA', dark: '#2D3038' },
        },
        danger: '#DC2626',
        success: '#34D399',
        warning: '#F59E0B',
        signout: '#EF6C57',
      },
    },
  },
  plugins: [],
};
