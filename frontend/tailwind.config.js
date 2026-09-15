/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          DEFAULT: '#080D16',
          surface: '#111827',
          border: '#1E293B',
          'text-primary': '#F8FAFC',
          'text-secondary': '#C5CBD5',
          'text-muted': '#8F98A8',
        },
        canvas: {
          DEFAULT: '#080D16',
          subtle: '#0F172A',
          inset: '#0B0F19',
        },
        sidebar: {
          DEFAULT: '#F9FAFB',
          hover: '#F3F4F6',
          active: '#F3F4F6',
          border: '#E5E7EB',
          text: '#111827',
          'text-secondary': '#4B5563',
          'text-muted': '#6B7280',
        },
        panel: {
          DEFAULT: '#FFFFFF',
          hover: '#F9FAFB',
          border: '#E5E7EB',
          'border-strong': '#D1D5DB',
        },
        brand: {
          dark: '#0E382B',
          'dark-hover': '#08261D',
          green: '#059669',
          'green-light': '#10B981',
          'green-subtle': '#ECFDF5',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#0E382B',
          hover: '#08261D',
          subtle: '#ECFDF5',
          border: '#A7F3D0',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
