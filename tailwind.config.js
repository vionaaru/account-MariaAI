/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'neuropol': ['Neuropol', 'sans-serif'],
        'xolonium': ['Xolonium', 'sans-serif'],
        'tektur': ['Tektur', 'sans-serif'],
      },
      animation: {
        'glowScan': 'glowScan 3s linear infinite',
        'glowScanVertical': 'glowScanVertical 3s linear infinite',
        'blinkSlow': 'blink 3s ease-in-out infinite',
        'blinkMedium': 'blink 2s ease-in-out infinite',
        'blinkFast': 'blink 1s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'floatUp': 'floatUp 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glowScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        glowScanVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        blink: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 }
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
    },
  },
  plugins: [],
};
