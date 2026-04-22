import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRenderAccess, type AppFeature } from "../hooks/usePermission";
import { styled } from "../assets/styles/themes/stitches.config";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredLevel?: number;
  feature?: AppFeature;
  fallback?: React.ReactNode;
}

const AccessDeniedContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "$bgPrimary",
  padding: "$3xl",
  color: "$textPrimary",
});

const AccessDeniedTitle = styled("h1", {
  fontSize: "$3xl",
  fontWeight: "$bold",
  marginBottom: "$lg",
  color: "$errorColor",
});

const AccessDeniedText = styled("p", {
  fontSize: "$lg",
  color: "$textSecondary",
  marginBottom: "$xl",
  maxWidth: "500px",
  textAlign: "center",
});

const AccessDeniedButton = styled("a", {
  paddingLeft: "$lg",
  paddingRight: "$lg",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "$primaryColor",
  color: "$bgPrimary",
  borderRadius: "$md",
  fontWeight: "$semibold",
  cursor: "pointer",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$borderAccent",
    transform: "translateY(-2px)",
  },
});

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredLevel,
  feature,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { shouldRender, reason } = useRenderAccess(requiredLevel, feature);

  if (isLoading) {
    return (
      <AccessDeniedContainer>
        <AccessDeniedTitle>Carregando...</AccessDeniedTitle>
      </AccessDeniedContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!shouldRender && (requiredLevel !== undefined || feature !== undefined)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <AccessDeniedContainer>
        <AccessDeniedTitle>Acesso Negado</AccessDeniedTitle>
        <AccessDeniedText>
          {reason ||
            "Você não tem permissão para acessar esta página. Contate um administrador."}
        </AccessDeniedText>
        <AccessDeniedButton href="/">Voltar para Home</AccessDeniedButton>
      </AccessDeniedContainer>
    );
  }

  return <>{children}</>;
};
