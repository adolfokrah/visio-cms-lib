/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./lib/**/*.{ts,tsx}'],
  prefix: 'visio-cms-',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--visio-cms-border))',
        input: 'hsl(var(--visio-cms-input))',
        ring: 'hsl(var(--visio-cms-ring))',
        background: 'hsl(var(--visio-cms-background))',
        foreground: 'hsl(var(--visio-cms-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--visio-cms-primary))',
          foreground: 'hsl(var(--visio-cms-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--visio-cms-secondary))',
          foreground: 'hsl(var(--visio-cms-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--visio-cms-destructive))',
          foreground: 'hsl(var(--visio-cms-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--visio-cms-muted))',
          foreground: 'hsl(var(--visio-cms-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--visio-cms-accent))',
          foreground: 'hsl(var(--visio-cms-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--visio-cms-popover))',
          foreground: 'hsl(var(--visio-cms-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--visio-cms-card))',
          foreground: 'hsl(var(--visio-cms-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--visio-cms-radius)',
        md: 'calc(var(--visio-cms-radius) - 2px)',
        sm: 'calc(var(--visio-cms-radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--visio-cms-radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--visio-cms-radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
