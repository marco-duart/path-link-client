import { darkTheme } from '../assets/styles/themes/dark-theme';

/**
 * Utilitário para obter cor visual de um role
 * IMPORTANTE: Isto é APENAS para visualização UIOs
 * Validação de permissões sempre vem do backend!
 */
export const getRoleColor = (roleName: string | undefined): string => {
  if (!roleName) return darkTheme.text.tertiary;

  const roleColors: Record<string, string> = {
    auxiliar: darkTheme.roles.auxiliar,
    assistente: darkTheme.roles.assistente,
    analista: darkTheme.roles.analista,
    coordenador: darkTheme.roles.coordenador,
    gerente: darkTheme.roles.gerente,
    admin: darkTheme.roles.admin,
  };

  return roleColors[roleName.toLowerCase()] || darkTheme.text.tertiary;
};

/**
 * Obtém uma cor de background para um role
 */
export const getRoleBackgroundColor = (roleName: string | undefined): string => {
  const color = getRoleColor(roleName);
  // Isso é um hack para criar uma versão transparente da cor
  // Em produção, você poderia ter cores de background pré-definidas
  return `${color}15`; // Adiciona transparência
};

/**
 * Formata o nome do role para exibição
 */
export const formatRoleName = (roleName: string | undefined): string => {
  if (!roleName) return 'Desconhecido';
  return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
};

/**
 * Retorna um badge com cor baseado no role
 */
export const getRoleBadgeStyle = (roleName: string | undefined) => {
  return {
    color: getRoleColor(roleName),
    backgroundColor: getRoleBackgroundColor(roleName),
    label: formatRoleName(roleName),
  };
};
