import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      // primary: ['Roboto', 'sans-serif'],
      primary: [
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      secondary: ['Montserrat', 'serif'],
      // secondary: ['Dosis', 'serif'],
      italic: ['Playfair Display', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#12BBB5',
        secondary: '#323232',
        background: '#000000',
        textGray: '#656B76',
        bordercolor: '#EBECED',
        graycolor: '#74788d',
        white: '#ffffff',
        textSecondary: '#595959',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem', // Default padding for all screens
          sm: '1rem', // Padding for 'sm' screen size
          lg: '2rem', // Padding for 'lg' and larger
        },
        screens: {
          '2xl': '2048px',
        },
      },

      fontSize: {
        xs: '.75rem', // 12px
        sm: '.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        title: '2rem', //32px
      },
      screens: {
        xl: { max: '2048px' },
        sm: { min: '320px' },
      },

      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [heroui()],
};
