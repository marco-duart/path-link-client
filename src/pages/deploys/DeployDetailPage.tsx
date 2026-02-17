import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { Deploy } from "@/types";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "900px",
  margin: "0 auto",
});

const Header = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$2xl",
  gap: "$lg",

  "@xs": {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const TitleGroup = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$lg",
});

const BackButton = styled("button", {
  backgroundColor: "transparent",
  border: "none",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "1.5rem",
  padding: "$sm",
  borderRadius: "$md",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgTertiary",
    color: "$primaryColor",
  },
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$textPrimary",
  margin: 0,
});

const ActionButtons = styled("div", {
  display: "flex",
  gap: "$md",

  "@xs": {
    width: "100%",
    flexDirection: "column",
  },
});

const Button = styled("button", {
  padding: "$md $lg",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
  border: "none",
  cursor: "pointer",
  transition: "all $normal",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primaryColor",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "$borderAccent",
          transform: "translateY(-2px)",
        },
      },
      secondary: {
        backgroundColor: "$bgTertiary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",

        "&:hover": {
          backgroundColor: "$borderPrimary",
        },
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "#dc2626",
          transform: "translateY(-2px)",
        },
      },
    },
  },

  "@xs": {
    width: "100%",
    justifyContent: "center",
  },
});

const ContentCard = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$xl",
  marginBottom: "$xl",
});

const InfoGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$xl",
  marginBottom: "$xl",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

const InfoItem = styled("div", {});

const InfoLabel = styled("label", {
  display: "block",
  fontSize: "$xs",
  fontWeight: "$semibold",
  color: "$textMuted",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "$sm",
});

const InfoValue = styled("p", {
  fontSize: "$sm",
  color: "$textPrimary",
  margin: 0,
  padding: "$md",
  backgroundColor: "$bgPrimary",
  borderRadius: "$md",
  border: "1px solid $borderPrimary",
  wordBreak: "break-word",
});

const Badge = styled("span", {
  display: "inline-block",
  fontSize: "$xs",
  fontWeight: "$semibold",
  padding: "$xs $sm",
  borderRadius: "$sm",
  whiteSpace: "nowrap",

  variants: {
    type: {
      aws: {
        backgroundColor: "#FF9900",
        color: "#000",
      },
      gcp: {
        backgroundColor: "#4285F4",
        color: "#fff",
      },
      azure: {
        backgroundColor: "#0078D4",
        color: "#fff",
      },
      vm: {
        backgroundColor: "#9333EA",
        color: "#fff",
      },
      default: {
        backgroundColor: "$bgTertiary",
        color: "$textSecondary",
      },
    },
    environment: {
      production: {
        backgroundColor: "#DC2626",
        color: "#fff",
      },
      staging: {
        backgroundColor: "#F59E0B",
        color: "#000",
      },
      development: {
        backgroundColor: "#10B981",
        color: "#fff",
      },
      default: {
        backgroundColor: "$bgTertiary",
        color: "$textSecondary",
      },
    },
  },
});

const DescriptionSection = styled("div", {
  marginTop: "$xl",
  paddingTop: "$xl",
  borderTop: "1px solid $borderPrimary",
});

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  color: "$textMuted",
});

const getRoleLevelName = (level: number): string => {
  const levels: Record<number, string> = {
    10: "Auxiliar",
    20: "Técnico",
    30: "Gestor",
    40: "Gerente",
    50: "Administrador",
  };
  return levels[level] || `Nível ${level}`;
};

const getTypeBadgeColor = (
  type: string,
): "aws" | "gcp" | "azure" | "vm" | "default" => {
  const normalized = type.toLowerCase();
  if (normalized.includes("aws")) return "aws";
  if (normalized.includes("google") || normalized.includes("gcp")) return "gcp";
  if (normalized.includes("azure")) return "azure";
  if (normalized.includes("vm") || normalized.includes("local")) return "vm";
  return "default";
};

const getEnvironmentBadgeColor = (
  environment: string,
): "production" | "staging" | "development" | "default" => {
  const normalized = environment.toLowerCase();
  if (normalized === "production" || normalized === "prod") return "production";
  if (normalized === "staging") return "staging";
  if (normalized === "development" || normalized === "dev")
    return "development";
  return "default";
};

export const DeployDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canAccess } = usePermission();
  const [deploy, setDeploy] = useState<Deploy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDeploy(id);
    }
  }, [id]);

  const loadDeploy = async (deployId: string) => {
    try {
      const data = await apiClient.getDeploy(deployId);
      setDeploy(data);
    } catch (error) {
      console.error("Erro ao carregar deploy:", error);
      toast.error("Erro ao carregar deploy");
      navigate("/deploys");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este deploy?")) {
      return;
    }

    if (!id) return;

    try {
      await apiClient.deleteDeploy(id);
      toast.success("Deploy deletado com sucesso");
      navigate("/deploys");
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar deploy");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!deploy) {
    return (
      <PageContainer>
        <LoadingContainer>Deploy não encontrado</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <TitleGroup>
          <BackButton onClick={() => navigate("/deploys")}>
            <FiArrowLeft />
          </BackButton>
          <Title>{deploy.name}</Title>
        </TitleGroup>

        <ActionButtons>
          {canAccess(40) && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/deploys/${deploy.id}/edit`)}
            >
              <FiEdit2 size={16} />
              Editar
            </Button>
          )}
          {canAccess(50) && (
            <Button variant="danger" onClick={handleDelete}>
              <FiTrash2 size={16} />
              Deletar
            </Button>
          )}
        </ActionButtons>
      </Header>

      <ContentCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Nome</InfoLabel>
            <InfoValue>{deploy.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Tipo</InfoLabel>
            <InfoValue>
              <Badge type={getTypeBadgeColor(deploy.type)}>{deploy.type}</Badge>
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Ambiente</InfoLabel>
            <InfoValue>
              <Badge environment={getEnvironmentBadgeColor(deploy.environment)}>
                {deploy.environment}
              </Badge>
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Região</InfoLabel>
            <InfoValue>{deploy.region || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Endpoint</InfoLabel>
            <InfoValue>{deploy.endpoint}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Nível Requerido</InfoLabel>
            <InfoValue>{getRoleLevelName(deploy.requiredLevel)}</InfoValue>
          </InfoItem>
        </InfoGrid>

        {deploy.description && (
          <DescriptionSection>
            <InfoLabel>Descrição</InfoLabel>
            <InfoValue>{deploy.description}</InfoValue>
          </DescriptionSection>
        )}

        {deploy.notes && (
          <DescriptionSection>
            <InfoLabel>Notas</InfoLabel>
            <InfoValue>{deploy.notes}</InfoValue>
          </DescriptionSection>
        )}
      </ContentCard>
    </PageContainer>
  );
};
