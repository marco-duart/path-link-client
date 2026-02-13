import { createStitches } from '@stitches/react';
import { darkTheme } from './dark-theme';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      // Backgrounds
      bgPrimary: darkTheme.bg.primary,
      bgSecondary: darkTheme.bg.secondary,
      bgTertiary: darkTheme.bg.tertiary,
      bgSurface: darkTheme.bg.surface,
      bgOverlay: darkTheme.bg.overlay,
      bgModal: darkTheme.bg.modal,

      // Borders
      borderPrimary: darkTheme.border.primary,
      borderSecondary: darkTheme.border.secondary,
      borderAccent: darkTheme.border.accent,
      borderSubtle: darkTheme.border.subtle,

      // Text
      textPrimary: darkTheme.text.primary,
      textSecondary: darkTheme.text.secondary,
      textTertiary: darkTheme.text.tertiary,
      textInverted: darkTheme.text.inverted,
      textMuted: darkTheme.text.muted,

      // Semantic
      successColor: darkTheme.semantic.success,
      errorColor: darkTheme.semantic.error,
      warningColor: darkTheme.semantic.warning,
      infoColor: darkTheme.semantic.info,
      primaryColor: darkTheme.semantic.primary,
      secondaryColor: darkTheme.semantic.secondary,
    },

    space: {
      xs: darkTheme.spacing.xs,
      sm: darkTheme.spacing.sm,
      md: darkTheme.spacing.md,
      lg: darkTheme.spacing.lg,
      xl: darkTheme.spacing.xl,
      '2xl': darkTheme.spacing['2xl'],
      '3xl': darkTheme.spacing['3xl'],
    },

    sizes: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '2.5rem',
      '3xl': '3rem',
      full: '100%',
    },

    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },

    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeights: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },

    radii: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px',
    },

    zIndex: {
      hide: '-1',
      auto: 'auto',
      base: '0',
      dropdown: '1000',
      sticky: '1020',
      fixed: '1030',
      backdrop: '1040',
      offcanvas: '1050',
      modal: '1060',
      popover: '1070',
      tooltip: '1080',
    },
  },

  media: {
    xs: '(max-width: 480px)',
    sm: '(min-width: 481px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },

  utils: {
    // Utilitários customizados
    p: (value: string | number) => ({
      padding: value,
    }),
    pt: (value: string | number) => ({
      paddingTop: value,
    }),
    pr: (value: string | number) => ({
      paddingRight: value,
    }),
    pb: (value: string | number) => ({
      paddingBottom: value,
    }),
    pl: (value: string | number) => ({
      paddingLeft: value,
    }),
    px: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    m: (value: string | number) => ({
      margin: value,
    }),
    mt: (value: string | number) => ({
      marginTop: value,
    }),
    mr: (value: string | number) => ({
      marginRight: value,
    }),
    mb: (value: string | number) => ({
      marginBottom: value,
    }),
    ml: (value: string | number) => ({
      marginLeft: value,
    }),
    mx: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: string | number) => ({
      marginTop: value,
      marginBottom: value,
    }),

    fd: (value: string) => ({
      flexDirection: value,
    }),
    ai: (value: string) => ({
      alignItems: value,
    }),
    jc: (value: string) => ({
      justifyContent: value,
    }),

    linearGradient: (value: string) => ({
      backgroundImage: value,
    }),

    size: (value: string | number) => ({
      width: value,
      height: value,
    }),

    appearance: (value: string) => ({
      WebkitAppearance: value,
      appearance: value,
    }),
  },
});

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  html: {
    fontSize: '16px',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    height: '100%',
  },

  body: {
    bg: '$bgPrimary',
    color: '$textPrimary',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '$base',
    lineHeight: '$normal',
    letterSpacing: '0.5px',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    width: '100%',
  },

  '#root': {
    width: '100%',
    height: '100%',
  },

  a: {
    color: '$primaryColor',
    textDecoration: 'none',
    transition: 'color $normal',

    '&:hover': {
      color: '$borderAccent',
    },
  },

  button: {
    cursor: 'pointer',
    border: 'none',
    font: 'inherit',
  },

  input: {
    font: 'inherit',
    color: 'inherit',
  },

  '[role="button"]': {
    cursor: 'pointer',
  },

  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '$bold',
    lineHeight: '$tight',
  },

  'code, pre': {
    fontFamily:
      '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
    fontSize: '0.875em',
  },

  '::selection': {
    bg: '$primaryColor',
    color: '$textInverted',
  },
});
