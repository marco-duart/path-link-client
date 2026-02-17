import { useAuth } from "../contexts/AuthContext";

export const usePermission = () => {
  const { user } = useAuth();

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

  const getPermissionInfo = () => {
    return {
      level: getUserLevel(),
      role: getUserRole(),
      department: getDepartment(),
      team: getTeam(),
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
    getPermissionInfo,
  };
};

export const useRenderAccess = (requiredLevel?: number) => {
  const { user } = useAuth();
  const { canAccess } = usePermission();

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

  const hasAccess = canAccess(requiredLevel);

  return {
    shouldRender: hasAccess,
    reason: !hasAccess
      ? `Nível de acesso insuficiente. Seu nível: ${user.roleLevel}, Requerido: ${requiredLevel}`
      : null,
  };
};
