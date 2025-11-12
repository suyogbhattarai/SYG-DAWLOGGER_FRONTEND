// tailwind.config.js
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
        // Brand Colors - Use these as primary, primary-hover, etc.
        primary: {
          DEFAULT: '#ef8e32',
          hover: '#d67a28',
          light: '#f5a556',
          dark: '#c76f20',
        },
        // Background Colors
        background: {
          DEFAULT: '#111827',
          secondary: '#1f2937',
          tertiary: '#374151',
        },
        // Text Colors
        text: {
          primary: '#ffffff',
          secondary: '#d1d5db',
          tertiary: '#9ca3af',
        },
        // Border Colors
        border: {
          DEFAULT: '#374151',
          light: '#4b5563',
        },
      },
    },
  },
  plugins: [],
}