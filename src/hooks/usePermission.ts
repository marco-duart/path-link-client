import { useAuth } from "../contexts/AuthContext";

export type AppFeature =
  | "healthCheck"
  | "processes"
  | "links"
  | "configurationItems"
  | "accounts"
  | "softwares"
  | "databases"
  | "deploys"
  | "repositories"
  | "environmentVariables"
  | "machines";

const normalizeTeamName = (teamName?: string | null): string => {
  return (teamName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

export const usePermission = () => {
  const { user } = useAuth();

  const teamName = normalizeTeamName(user?.team?.name);

  const getUserLevel = (): number => {
    return user?.roleLevel ?? 0;
  };

  const getUserRole = (): string => {
    return user?.roleName ?? "Desconhecido";
  };

  const canAccess = (requiredLevel: number): boolean => {
    const userLevel = getUserLevel();
    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => {
    return getUserLevel() >= 99;
  };

  const isManager = (): boolean => {
    return getUserLevel() >= 50;
  };

  const isAnalyst = (): boolean => {
    return getUserLevel() >= 30;
  };

  const getDepartment = () => {
    return user?.department;
  };

  const getTeam = () => {
    return user?.team;
  };

  const isInfraTeam = (): boolean => {
    return ["infra", "telefonia"].includes(teamName);
  };

  const isDevTeam = (): boolean => {
    return ["dev", "projetos"].includes(teamName);
  };

  const canAccessFeature = (feature: AppFeature): boolean => {
    switch (feature) {
      case "repositories":
      case "environmentVariables":
        return isDevTeam();
      case "softwares":
      case "machines":
        return isInfraTeam();
      case "healthCheck":
      case "processes":
      case "links":
      case "configurationItems":
      case "accounts":
      case "databases":
      case "deploys":
        return true;
      default:
        return false;
    }
  };

  const getPermissionInfo = () => {
    return {
      level: getUserLevel(),
      role: getUserRole(),
      department: getDepartment(),
      team: getTeam(),
      isInfraTeam: isInfraTeam(),
      isDevTeam: isDevTeam(),
      isAdmin: isAdmin(),
      isManager: isManager(),
      isAnalyst: isAnalyst(),
    };
  };

  return {
    getUserLevel,
    getUserRole,
    canAccess,
    isAdmin,
    isManager,
    isAnalyst,
    getDepartment,
    getTeam,
    isInfraTeam,
    isDevTeam,
    canAccessFeature,
    getPermissionInfo,
  };
};

export const useRenderAccess = (
  requiredLevel?: number,
  feature?: AppFeature,
) => {
  const { user } = useAuth();
  const { canAccess, canAccessFeature } = usePermission();

  if (!user) {
    return {
      shouldRender: false,
      reason: "Usuário não autenticado",
    };
  }

  if (requiredLevel === undefined) {
    return {
      shouldRender: true,
      reason: null,
    };
  }

  if (feature && !canAccessFeature(feature)) {
    return {
      shouldRender: false,
      reason: "Seu time não possui acesso a este recurso.",
    };
  }

  const hasAccess = canAccess(requiredLevel);

  return {
    shouldRender: hasAccess,
    reason: !hasAccess
      ? `Nível de acesso insuficiente. Seu nível: ${user.roleLevel}, Requerido: ${requiredLevel}`
      : null,
  };
};
