export const darkTheme = {
  bg: {
    primary: "#0f172a",
    secondary: "#1e293b",
    tertiary: "#334155",
    surface: "#0f172a",
    overlay: "rgba(15, 23, 42, 0.8)",
    modal: "#1e293b",
  },

  border: {
    primary: "#334155",
    secondary: "#475569",
    accent: "#0ea5e9",
    subtle: "#1e293b",
  },

  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    tertiary: "#94a3b8",
    inverted: "#0f172a",
    muted: "#64748b",
  },

  semantic: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    primary: "#0ea5e9",
    secondary: "#8b5cf6",
  },

  roles: {
    auxiliar: "#06b6d4",
    assistente: "#3b82f6",
    analista: "#8b5cf6",
    coordenador: "#f59e0b",
    gerente: "#ef4444",
    admin: "#ec4899",
  },

  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
  },

  gradient: {
    primary: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
    secondary: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },

  transition: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
} as const;

export type DarkTheme = typeof darkTheme;
