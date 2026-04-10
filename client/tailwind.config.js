/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyan: {
          light: '#e0ffff',
          DEFAULT: '#00ced1',
          dark: '#008b8b',
        },
        purple: {
          light: '#f3e8ff',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
        golden: {
          light: '#fef3c7',
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        silver: {
          light: '#f3f4f6',
          DEFAULT: '#e5e7eb',
          dark: '#9ca3af',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        sans: ['"IBM Plex Sans"', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
