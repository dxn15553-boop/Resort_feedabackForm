import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dxn: {
          50: '#fdf2f6',
          100: '#fce7f0',
          200: '#f9cfde',
          300: '#f5a6c1',
          400: '#ef6f99',
          500: '#e54378',
          600: '#d0265f',
          700: '#b0194c',
          800: '#921740',
          900: '#7a1738',
          950: '#48071c',
        },
        royal: {
          pink: '#C2185B',
          pinkHover: '#AD1457',
          pinkDark: '#880E4F',
          pinkLight: '#FCE4EC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(194, 24, 91, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(194, 24, 91, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'hover': '0 15px 35px -5px rgba(194, 24, 91, 0.18), 0 6px 15px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;

