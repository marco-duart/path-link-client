import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { Software } from "@/types";
import { FiArrowLeft, FiDownloadCloud, FiEdit2, FiTrash2 } from "react-icons/fi";

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
      },
      secondary: {
        backgroundColor: "$bgTertiary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "$bgPrimary",
      },
    },
  },
});

const ContentCard = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$xl",
});

const InfoGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$xl",

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
const LinkValue = styled("a", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  fontSize: "$sm",
  color: "$primaryColor",
  textDecoration: "none",
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
    20: "Técnico",
    30: "Gestor",
    40: "Gerente",
    50: "Administrador",
  };
  return levels[level] || `Nível ${level}`;
};

export const SoftwareDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canAccess } = usePermission();
  const [software, setSoftware] = useState<Software | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSoftware(id);
    }
  }, [id]);

  const loadSoftware = async (softwareId: string) => {
    try {
      const data = await apiClient.getSoftware(softwareId);
      setSoftware(data);
    } catch (error) {
      console.error("Erro ao carregar software:", error);
      toast.error("Erro ao carregar software");
      navigate("/softwares");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este software?")) {
      return;
    }

    if (!id) return;

    try {
      await apiClient.deleteSoftware(id);
      toast.success("Software deletado com sucesso");
      navigate("/softwares");
    } catch (error: any) {
      console.error("Erro ao deletar software:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar software");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!software) {
    return (
      <PageContainer>
        <LoadingContainer>Software não encontrado</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <TitleGroup>
          <BackButton onClick={() => navigate("/softwares")}>
            <FiArrowLeft size={22} />
          </BackButton>
          <Title>{software.name}</Title>
        </TitleGroup>

        <ActionButtons>
          {canAccess(40) && (
            <>
              <Button variant="secondary" onClick={() => navigate(`/softwares/${software.id}/edit`)}>
                <FiEdit2 size={16} />
                Editar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <FiTrash2 size={16} />
                Deletar
              </Button>
            </>
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
            <InfoValue>{software.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Nível de Acesso</InfoLabel>
            <InfoValue>{getRoleLevelName(software.requiredLevel || 10)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Versão</InfoLabel>
            <InfoValue>{software.version || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Download</InfoLabel>
            <LinkValue href={software.downloadUrl} target="_blank" rel="noopener noreferrer">
              <FiDownloadCloud size={16} />
              {software.downloadUrl}
            </LinkValue>
          </InfoItem>
        </InfoGrid>

        <DescriptionSection>
          <InfoLabel>Descrição</InfoLabel>
          <InfoValue>{software.description || "Sem descrição"}</InfoValue>
        </DescriptionSection>
      </ContentCard>
    </PageContainer>
  );
};
