import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { ConfigurationItem } from "@/types";
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
    20: "Assistente",
    30: "Analista",
    40: "Coordenador",
    50: "Gerente",
    99: "Admin",
  };
  return levels[level] || `Nível ${level}`;
};

export const ConfigurationItemDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canAccess } = usePermission();
  const [configItem, setConfigItem] = useState<ConfigurationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadConfigurationItem(id);
    }
  }, [id]);

  const loadConfigurationItem = async (configItemId: string) => {
    try {
      const data = await apiClient.getConfigurationItem(configItemId);
      setConfigItem(data);
    } catch (error) {
      console.error("Erro ao carregar recurso:", error);
      toast.error("Erro ao carregar recurso");
      navigate("/configuration-items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este recurso?")) {
      return;
    }

    if (!id) return;

    try {
      await apiClient.deleteConfigurationItem(id);
      toast.success("Recurso deletado com sucesso");
      navigate("/configuration-items");
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar recurso");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!configItem) {
    return (
      <PageContainer>
        <LoadingContainer>Recurso não encontrado</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <TitleGroup>
          <BackButton onClick={() => navigate("/configuration-items")}>
            <FiArrowLeft />
          </BackButton>
          <Title>{configItem.name}</Title>
        </TitleGroup>

        <ActionButtons>
          {canAccess(40) && (
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/configuration-items/${configItem.id}/edit`)
              }
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
            <InfoValue>{configItem.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Tipo</InfoLabel>
            <InfoValue style={{ color: "#8b5cf6", fontWeight: 500 }}>
              {configItem.type}
            </InfoValue>
          </InfoItem>
          <InfoItem style={{ gridColumn: "1 / -1" }}>
            <InfoLabel>Detalhes</InfoLabel>
            <InfoValue>{configItem.details}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Nível Requerido</InfoLabel>
            <InfoValue>{getRoleLevelName(configItem.requiredLevel)}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <DescriptionSection>
          <InfoLabel>Observações</InfoLabel>
          <InfoValue>{configItem.notes || "Sem observações"}</InfoValue>
        </DescriptionSection>
      </ContentCard>
    </PageContainer>
  );
};
