import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { getRoleColor, formatRoleName } from "@/utils/roleHelpers";
import apiClient from "@/services/api/client";
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
  wordBreak: "break-all",
});

const RoleBadge = styled("span", {
  display: "inline-block",
  padding: "$sm $md",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
});

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  color: "$textMuted",
});

interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  roleLevel: number;
  department?: { id: number; name: string };
  team?: { id: number; name: string };
}

export const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request("get", `/users/${id}`);
      setUser(data as User);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      toast.error("Erro ao carregar usuário");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    try {
      await apiClient.request("delete", `/users/${id}`);
      toast.success("Usuário deletado com sucesso");
      navigate("/admin/users");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar usuário");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <p>Carregando usuário...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <LoadingContainer>
          <p>Usuário não encontrado</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <Header>
          <TitleGroup>
            <BackButton onClick={() => navigate("/admin/users")}>
              <FiArrowLeft />
            </BackButton>
            <Title>{user.name}</Title>
          </TitleGroup>
          <ActionButtons>
            <Button
              variant="secondary"
              onClick={() => navigate(`/admin/users/${id}/edit`)}
            >
              <FiEdit2 />
              Editar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <FiTrash2 />
              Deletar
            </Button>
          </ActionButtons>
        </Header>

        <ContentCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{user.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Role</InfoLabel>
              <div>
                <RoleBadge
                  style={{
                    background: getRoleColor(user.roleName),
                    color: "#0f172a",
                  }}
                >
                  {formatRoleName(user.roleName)}
                </RoleBadge>
              </div>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Nível</InfoLabel>
              <InfoValue>{user.roleLevel}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Departamento</InfoLabel>
              <InfoValue>{user.department?.name || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Time</InfoLabel>
              <InfoValue>{user.team?.name || "-"}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </ContentCard>
      </PageContainer>
    </motion.div>
  );
};
