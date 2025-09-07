/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        bg: 'hsl(215 27% 97%)',
        accent: 'hsl(219 81% 58%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 13% 18%)',
        'text-secondary': 'hsl(220 13% 44%)',
      },
      borderRadius: {
        'lg': '0.875rem',
        'md': '0.5rem',
        'sm': '0.375rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      spacing: {
        'lg': '1.25rem',
        'md': '0.75rem',
        'sm': '0.5rem',
      }
    },
  },
  plugins: [],
}