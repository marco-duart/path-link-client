import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { Machine } from "@/types";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1000px",
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

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    available: "Livre",
    in_use: "Em uso",
    stopped: "Parado",
    maintenance: "Manutenção",
    retired: "Baixado",
  };

  return map[status] || status;
};

export const MachineDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { canAccess } = usePermission();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMachine(id);
    }
  }, [id]);

  const loadMachine = async (machineId: string) => {
    try {
      const data = await apiClient.getMachine(machineId);
      setMachine(data);
    } catch (error) {
      console.error("Erro ao carregar máquina:", error);
      toast.error("Erro ao carregar máquina");
      navigate("/logistics/machines");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar esta máquina?")) {
      return;
    }

    if (!id) return;

    try {
      await apiClient.deleteMachine(id);
      toast.success("Máquina deletada com sucesso");
      navigate("/logistics/machines");
    } catch (error: any) {
      console.error("Erro ao deletar máquina:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar máquina");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!machine) {
    return (
      <PageContainer>
        <LoadingContainer>Máquina não encontrada</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <TitleGroup>
          <BackButton onClick={() => navigate("/logistics/machines")}>
            <FiArrowLeft size={22} />
          </BackButton>
          <Title>{machine.assetTag}</Title>
        </TitleGroup>

        <ActionButtons>
          {canAccess(40) && (
            <>
              <Button variant="secondary" onClick={() => navigate(`/logistics/machines/${machine.id}/edit`)}>
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
            <InfoLabel>Etiqueta</InfoLabel>
            <InfoValue>{machine.assetTag}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>{formatStatus(machine.status)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Tipo</InfoLabel>
            <InfoValue>{machine.isPda ? "PDA" : machine.deviceType || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Utilizador</InfoLabel>
            <InfoValue>{machine.assignee || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Processador</InfoLabel>
            <InfoValue>{machine.cpu || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Memória RAM</InfoLabel>
            <InfoValue>{machine.ramGb ? `${machine.ramGb} GB` : "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Armazenamento</InfoLabel>
            <InfoValue>
              {machine.storageGb || machine.storageType
                ? `${machine.storageGb || "?"} GB ${machine.storageType || ""}`.trim()
                : "-"}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Monitor</InfoLabel>
            <InfoValue>{machine.monitorInfo || "-"}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Sala</InfoLabel>
            <InfoValue>{machine.room || "-"}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <DescriptionSection>
          <InfoLabel>Observações</InfoLabel>
          <InfoValue>{machine.notes || "Sem observações"}</InfoValue>
        </DescriptionSection>
      </ContentCard>
    </PageContainer>
  );
};
