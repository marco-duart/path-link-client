import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme } = createStitches({
  theme: {
    colors: {
      // Base Colors - Dark Theme
      black: '#0a0e27',
      darkBg: '#0f1419',
      darkBg2: '#1a1f2e',
      darkBg3: '#252d3d',
      
      // Primary - Vibrant Blue
      primary: '#00d4ff',
      primaryDark: '#0099cc',
      primaryLight: '#33e5ff',
      
      // Secondary - Neon Purple
      secondary: '#a78bfa',
      secondaryDark: '#7c3aed',
      secondaryLight: '#c4b5fd',
      
      // Accent - Cyberpunk Green
      accent: '#00ff88',
      accentDark: '#00cc55',
      accentLight: '#33ffaa',
      
      // Status Colors
      success: '#10b981',
      successLight: '#6ee7b7',
      warning: '#f59e0b',
      warningLight: '#fcd34d',
      error: '#ef4444',
      errorLight: '#fca5a5',
      info: '#3b82f6',
      infoLight: '#93c5fd',
      
      // Neutral
      white: '#ffffff',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',
      
      // Text Colors
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      textTertiary: '#6b7280',
      
      // Borders
      borderLight: '#374151',
      borderMedium: '#4b5563',
      borderDark: '#1f2937',
    },
    
    space: {
      xs: '0.25rem',  // 4px
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem',     // 32px
      '2xl': '2.5rem', // 40px
      '3xl': '3rem',  // 48px
      '4xl': '4rem',  // 64px
    },
    
    sizes: {
      full: '100%',
      screen: '100vw',
      screenHeight: '100vh',
      max: 'max-content',
      min: 'min-content',
      fit: 'fit-content',
    },
    
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeights: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
    
    letterSpacings: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.02em',
      wider: '0.05em',
    },
    
    radii: {
      none: '0px',
      sm: '0.375rem',   // 6px
      base: '0.5rem',   // 8px
      md: '0.75rem',    // 12px
      lg: '1rem',       // 16px
      xl: '1.5rem',     // 24px
      '2xl': '2rem',    // 32px
      full: '9999px',
    },
    
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      neon: '0 0 20px rgba(0, 212, 255, 0.5)',
      neonPurple: '0 0 20px rgba(167, 139, 250, 0.5)',
      neonGreen: '0 0 20px rgba(0, 255, 136, 0.5)',
    },
    
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    zIndex: {
      hide: '-1',
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
    sm: '(max-width: 640px)',
    md: '(max-width: 768px)',
    lg: '(max-width: 1024px)',
    xl: '(max-width: 1280px)',
    '2xl': '(max-width: 1536px)',
  },
  
  utils: {
    // Utilities para layout
    flexCenter: () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    flexBetween: () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }),
    flexCol: () => ({
      display: 'flex',
      flexDirection: 'column',
    }),
    
    // Utilities para texto
    truncate: () => ({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    textClamp: (lines: number | string) => ({
      display: '-webkit-box',
      WebkitLineClamp: lines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }),
    
    // Utilities para posicionamento
    absolute: () => ({
      position: 'absolute',
    }),
    fixed: () => ({
      position: 'fixed',
    }),
    relative: () => ({
      position: 'relative',
    }),
    
    // Utilities para dimensões
    fullSize: () => ({
      width: '100%',
      height: '100%',
    }),
    fullWidth: () => ({
      width: '100%',
    }),
    fullHeight: () => ({
      height: '100%',
    }),
  },
});
