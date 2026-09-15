import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { component, hexToRgbChannels, primitive, semantic } from './lib/tokens';

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const primitiveColors = Object.fromEntries(Object.keys(primitive).map((k) => [k, v(`p-${k}`)]));

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '375px', md: '768px', lg: '1024px', xl: '1440px' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...primitiveColors,
      canvas: v('s-canvas'),
      surface: v('s-surface'),
      ink: { DEFAULT: v('s-ink'), muted: v('s-ink-muted'), 'on-cta': v('s-ink-on-cta') },
      accent: v('s-accent'),
      cta: { DEFAULT: v('s-cta'), hover: v('c-btn-primary-hover') },
      line: v('s-line'),
      focus: v('s-focus'),
      alert: v('s-alert'),
      route: { carrera: v('c-route-carrera'), travesia: v('c-route-travesia') },
    },
    fontFamily: {
      display: ['var(--font-clash)', 'var(--font-archivo)', 'system-ui', 'sans-serif'],
      sans: ['var(--font-hanken)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    // Escala 12/14/16/20/28/40/64/96 + display fluido para el H1 del hero.
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.5' }],
      sm: ['0.875rem', { lineHeight: '1.5' }],
      base: ['1rem', { lineHeight: '1.6' }],
      lg: ['1.25rem', { lineHeight: '1.5' }],
      xl: ['1.75rem', { lineHeight: '1.15' }],
      '2xl': ['2.5rem', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
      '3xl': ['4rem', { lineHeight: '0.95', letterSpacing: '-0.015em' }],
      '4xl': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
      display: ['clamp(3.25rem, 12.5vw, 10.5rem)', { lineHeight: '0.84', letterSpacing: '-0.025em' }],
    },
    // Radios con intención: controles (sm), hojas de información (xs), sellos/logos (full).
    borderRadius: { none: '0', xs: '2px', sm: '6px', full: '9999px' },
    extend: {
      boxShadow: {
        'lift-1': 'var(--e-1)',
        'lift-2': 'var(--e-2)',
        'lift-3': 'var(--e-3)',
      },
      maxWidth: { measure: '68ch', 'measure-sm': '52ch', frame: '1320px' },
      transitionDuration: { 150: '150ms', 200: '200ms', 240: '240ms', 300: '300ms', 400: '400ms' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        in: 'cubic-bezier(0.55, 0, 1, 0.45)',
      },
      zIndex: { canvas: '0', content: '10', nav: '40', float: '45', menu: '50', toast: '60' },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const vars: Record<string, string> = {};
      for (const [k, hex] of Object.entries(primitive)) vars[`--p-${k}`] = hexToRgbChannels(hex);
      for (const [k, p] of Object.entries(semantic)) vars[`--s-${k}`] = `var(--p-${p})`;
      for (const [k, p] of Object.entries(component)) vars[`--c-${k}`] = `var(--p-${p})`;
      // Tinte derivado del ocre para hover del CTA (misma familia, +8% luminosidad).
      vars['--c-btn-primary-hover'] = '230 160 92';
      // Elevación: sombras teñidas de bruma, nunca gris neutro.
      vars['--e-1'] = 'inset 0 1px 0 0 rgb(var(--p-niebla) / 0.06)';
      vars['--e-2'] = '0 16px 40px -20px rgb(var(--p-bruma-noche) / 0.9)';
      vars['--e-3'] = '0 28px 80px -24px rgb(var(--p-bruma-noche) / 1)';
      addBase({ ':root': vars });
    }),
  ],
};

export default config;
