import { globalCss } from './themes/theme';

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  'html, body': {
    width: '100%',
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    backgroundColor: '$darkBg',
    color: '$textPrimary',
    lineHeight: '$normal',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  body: {
    overflow: 'hidden',
  },

  '#root, #__next': {
    width: '100%',
    height: '100%',
  },

  button: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  a: {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'color 200ms ease',

    '&:hover': {
      color: '$primary',
    },
  },

  input: {
    fontFamily: 'inherit',
    fontSize: 'inherit',

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  textarea: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    resize: 'vertical',

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  select: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },

  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '$bold',
    lineHeight: '$tight',
  },

  h1: {
    fontSize: '$4xl',
  },

  h2: {
    fontSize: '$3xl',
  },

  h3: {
    fontSize: '$2xl',
  },

  h4: {
    fontSize: '$xl',
  },

  h5: {
    fontSize: '$lg',
  },

  h6: {
    fontSize: '$base',
  },

  p: {
    fontWeight: '$normal',
  },

  ul: {
    listStyle: 'none',
  },

  ol: {
    listStyle: 'decimal',
    paddingLeft: '$xl',
  },

  'li, dd': {
    marginBottom: '$sm',
  },

  pre: {
    backgroundColor: '$darkBg3',
    color: '$primary',
    padding: '$lg',
    borderRadius: '$md',
    overflow: 'auto',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '$sm',
  },

  code: {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '$sm',
  },

  'code:not(pre code)': {
    backgroundColor: '$darkBg3',
    color: '$accent',
    padding: '0.125rem 0.375rem',
    borderRadius: '$sm',
  },

  '::selection': {
    backgroundColor: '$primary',
    color: '$black',
  },

  '::placeholder': {
    color: '$textTertiary',
  },

  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },

  '::-webkit-scrollbar-track': {
    backgroundColor: '$darkBg2',
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: '$borderMedium',
    borderRadius: '$sm',

    '&:hover': {
      backgroundColor: '$borderLight',
    },
  },

  // Animations
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
});

export default globalStyles;
