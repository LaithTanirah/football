/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        'border-subtle': 'hsl(var(--border-subtle))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // Surface levels
        'surface-1': 'hsl(var(--surface-1))',
        'surface-2': 'hsl(var(--surface-2))',
        'surface-3': 'hsl(var(--surface-3))',
        // Text hierarchy
        text: 'hsl(var(--text))',
        'text-muted': 'hsl(var(--text-muted))',
        'text-subtle': 'hsl(var(--text-subtle))',
        // Brand accents (15% usage)
        'playro-blue': 'hsl(var(--playro-blue))',
        'playro-green': 'hsl(var(--playro-green))',
        'playro-orange': 'hsl(var(--playro-orange))',
        // Legacy aliases for compatibility
        'brand-blue': 'hsl(var(--playro-blue))',
        'brand-green': 'hsl(var(--playro-green))',
        'brand-orange': 'hsl(var(--playro-orange))',
        'bg-page': 'hsl(var(--bg-page))',
        'bg-surface': 'hsl(var(--bg-surface))',
        'bg-panel': 'hsl(var(--bg-panel))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-invert': 'hsl(var(--text-invert))',
        'border-soft': 'hsl(var(--border-soft))',
        'border-strong': 'hsl(var(--border-strong))',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      spacing: {
        'page': '1.5rem',
        'section': '2rem',
        'card': '1.5rem',
      },
      fontSize: {
        'page-title': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'section-title': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'soft': 'var(--glow-subtle)',
        'glow': 'var(--glow-soft)',
        'focus': 'var(--glow-focus)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 20s ease-in-out infinite',
        'float-slow': 'floatSlow 15s ease-in-out infinite',
        'gradient-shift': 'gradientShift 20s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) translateX(10px) rotate(120deg)' },
          '66%': { transform: 'translateY(10px) translateX(-10px) rotate(240deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-30px) translateX(15px)' },
        },
        gradientShift: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-strong': '18px',
        'glass-subtle': '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

