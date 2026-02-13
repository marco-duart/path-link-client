// Cores do tema Dark Moderno - Sistema de Documentação para TI
export const darkTheme = {
  // Backgrounds
  bg: {
    // Backgrounds principais
    primary: '#0f172a', // Azul muito escuro (navbar, sidebar)
    secondary: '#1e293b', // Azul escuro (cards, panels)
    tertiary: '#334155', // Cinza-azulado (hover, borders)
    surface: '#0f172a', // Superfícies principais
    overlay: 'rgba(15, 23, 42, 0.8)', // Overlay com opacidade
    modal: '#1e293b', // Fundo para modais
  },

  // Borders
  border: {
    primary: '#334155', // Cinza-azulado padrão
    secondary: '#475569', // Cinza-azulado mais claro
    accent: '#0ea5e9', // Azul cyan para ênfase
    subtle: '#1e293b', // Muito sutil
  },

  // Text
  text: {
    primary: '#f8fafc', // Branco quase puro
    secondary: '#cbd5e1', // Cinza claro
    tertiary: '#94a3b8', // Cinza médio
    inverted: '#0f172a', // Texto invertido (sobre fundos claros)
    muted: '#64748b', // Cinza mais escuro
  },

  // Cores Semânticas
  semantic: {
    success: '#10b981', // Verde emerald
    error: '#ef4444', // Vermelho
    warning: '#f59e0b', // Âmbar/Amarelo
    info: '#3b82f6', // Azul Royal
    primary: '#0ea5e9', // Azul Cyan (chamadas para ação)
    secondary: '#8b5cf6', // Roxo
  },

  // Cores por Role (apenas para MOSTRAR - não validar)
  roles: {
    auxiliar: '#06b6d4', // Cyan (baseado)
    assistente: '#3b82f6', // Azul (support)
    analista: '#8b5cf6', // Roxo (análise)
    coordenador: '#f59e0b', // Âmbar (coordenação)
    gerente: '#ef4444', // Vermelho (gerenciamento)
    admin: '#ec4899', // Rosa (acesso total)
  },

  // Efeitos
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },

  // Gradientes
  gradient: {
    primary:
      'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', // Azul para Cyan
    secondary:
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', // Roxo para Rosa
    success:
      'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', // Verde para Teal
    warning:
      'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', // Âmbar para Laranja
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },

  // Transições
  transition: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
} as const;

export type DarkTheme = typeof darkTheme;
