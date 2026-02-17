import { darkTheme } from "../assets/styles/themes/dark-theme";

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

export const getRoleBackgroundColor = (
  roleName: string | undefined,
): string => {
  const color = getRoleColor(roleName);
  return `${color}15`;
};

export const formatRoleName = (roleName: string | undefined): string => {
  if (!roleName) return "Desconhecido";
  return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
};

export const getRoleBadgeStyle = (roleName: string | undefined) => {
  return {
    color: getRoleColor(roleName),
    backgroundColor: getRoleBackgroundColor(roleName),
    label: formatRoleName(roleName),
  };
};
