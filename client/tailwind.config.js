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
        // PLAYRO LEAGUE Brand Colors
        'brand-blue': 'hsl(var(--brand-blue))',
        'brand-cyan': 'hsl(var(--brand-cyan))',
        'brand-green': 'hsl(var(--brand-green))',
        'brand-orange': 'hsl(var(--brand-orange))',
        'brand-navy': 'hsl(var(--brand-navy))',
        // Semantic surface colors
        'bg-page': 'hsl(var(--bg-page))',
        'bg-surface': 'hsl(var(--bg-surface))',
        'bg-panel': 'hsl(var(--bg-panel))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-muted': 'hsl(var(--text-muted))',
        'text-invert': 'hsl(var(--text-invert))',
        'border-soft': 'hsl(var(--border-soft))',
        'border-strong': 'hsl(var(--border-strong))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'brand': '14px',
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
        'soft': '0 2px 8px hsl(var(--brand-blue) / 0.08)',
        'medium': '0 4px 12px hsl(var(--brand-blue) / 0.12)',
        'strong': '0 8px 24px hsl(var(--brand-blue) / 0.16)',
        'brand': '0 4px 12px hsl(var(--brand-orange) / 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
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
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

