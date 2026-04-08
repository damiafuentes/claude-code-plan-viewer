import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        claude: {
          bg: { light: '#F5F0E5', dark: '#201918' },
          surface: { light: '#FBFAF1', dark: '#2A2723' },
          border: { light: '#DFD7C6', dark: '#44403B' },
          'text-primary': { light: '#282218', dark: '#EDE7DC' },
          'text-secondary': { light: '#666656', dark: '#9E9995' },
          'text-tertiary': { light: '#8E8370', dark: '#6D676A' },
          accent: { light: '#CD7357', dark: '#D67F63' },
          success: { light: '#4895AC', dark: '#6FBB94' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        '2xl': '64px',
      },
    },
  },
  plugins: [],
} satisfies Config;
