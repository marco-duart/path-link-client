import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { styled } from "@/assets/styles/themes/stitches.config";
import { ConditionalRender } from "@/components/ConditionalRender";
import apiClient from "@/services/api/client";
import type { EnvironmentVariable } from "@/types";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1000px",
  margin: "0 auto",
});

const HeaderSection = styled("div", {
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

const BackButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  padding: "$md $lg",
  backgroundColor: "$bgTertiary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  cursor: "pointer",
  transition: "all $normal",
  fontSize: "$sm",

  "&:hover": {
    backgroundColor: "$borderPrimary",
    transform: "translateX(-4px)",
  },
});

const ActionsSection = styled("div", {
  display: "flex",
  gap: "$md",

  "@xs": {
    width: "100%",
    flexWrap: "wrap",
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
      danger: {
        backgroundColor: "#ef4444",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "#dc2626",
        },
      },
    },
  },
});

const Card = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$2xl",
  marginBottom: "$lg",
});

const Section = styled("div", {
  marginBottom: "$2xl",

  "&:last-child": {
    marginBottom: 0,
  },
});

const SectionTitle = styled("h2", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$textSecondary",
  marginBottom: "$md",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const Field = styled("div", {
  marginBottom: "$lg",

  "&:last-child": {
    marginBottom: 0,
  },
});

const Label = styled("label", {
  display: "block",
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textSecondary",
  marginBottom: "$xs",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const Value = styled("div", {
  fontSize: "$base",
  color: "$textPrimary",
  backgroundColor: "$bgPrimary",
  padding: "$md",
  borderRadius: "$md",
  wordBreak: "break-word",
  fontFamily: "monospace",
});

const ValueContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
});

const ToggleValueButton = styled("button", {
  padding: "$xs $sm",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  color: "$textSecondary",
  transition: "all $normal",

  "&:hover": {
    color: "$primaryColor",
  },

  display: "flex",
  alignItems: "center",
  gap: "$xs",
});

const Loading = styled("div", {
  padding: "$4xl $lg",
  textAlign: "center",
  color: "$textMuted",
});

const ErrorContainer = styled("div", {
  padding: "$lg",
  backgroundColor: "#6b2121",
  border: "1px solid #991b1b",
  borderRadius: "$md",
  color: "$bgPrimary",
});

export function EnvironmentVariableDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [envVar, setEnvVar] = useState<EnvironmentVariable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    loadEnvironmentVariable();
  }, [id]);

  const loadEnvironmentVariable = async () => {
    if (!id) {
      setError("ID da variável não foi fornecido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getEnvironmentVariable(id);
      setEnvVar(data);
    } catch (error: any) {
      console.error("Erro ao carregar variável:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Erro ao carregar variável de ambiente";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar esta variável de ambiente?",
      )
    ) {
      return;
    }

    if (!id) return;

    try {
      await apiClient.deleteEnvironmentVariable(id);
      toast.success("Variável de ambiente deletada com sucesso");
      navigate("/environment-variables");
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast.error(
        error.response?.data?.message || "Erro ao deletar variável de ambiente",
      );
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loading>Carregando...</Loading>
      </PageContainer>
    );
  }

  if (error || !envVar) {
    return (
      <PageContainer>
        <BackButton onClick={() => navigate("/environment-variables")}>
          <FiArrowLeft size={16} />
          Voltar
        </BackButton>
        <ErrorContainer>{error || "Variável não encontrada"}</ErrorContainer>
      </PageContainer>
    );
  }

  const getLevelName = (level: number) => {
    const levelNames: Record<number, string> = {
      10: "Auxiliar",
      20: "Assistente",
      30: "Analista",
      40: "Coordenador",
      50: "Gerente",
      99: "Admin",
    };
    return levelNames[level] || `Nível ${level}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <HeaderSection>
          <BackButton onClick={() => navigate("/environment-variables")}>
            <FiArrowLeft size={16} />
            Voltar
          </BackButton>
          <ActionsSection>
            <ConditionalRender requiredLevel={40}>
              <Button
                variant="primary"
                onClick={() =>
                  navigate(`/environment-variables/${envVar.id}/edit`)
                }
              >
                <FiEdit2 size={16} />
                Editar
              </Button>
            </ConditionalRender>
            <ConditionalRender requiredLevel={50}>
              <Button variant="danger" onClick={handleDelete}>
                <FiTrash2 size={16} />
                Deletar
              </Button>
            </ConditionalRender>
          </ActionsSection>
        </HeaderSection>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Section>
            <SectionTitle>Informações Básicas</SectionTitle>
            <Field>
              <Label>Nome</Label>
              <Value>{envVar.name}</Value>
            </Field>
            <Field>
              <Label>Escopo</Label>
              <Value>{envVar.scope}</Value>
            </Field>
            {envVar.description && (
              <Field>
                <Label>Descrição</Label>
                <Value>{envVar.description}</Value>
              </Field>
            )}
          </Section>

          <Section>
            <SectionTitle>Valor e Segurança</SectionTitle>
            <Field>
              <Label>Valor</Label>
              <ValueContainer>
                <Value
                  style={{
                    flex: 1,
                  }}
                >
                  {showValue ? envVar.valueEncrypted : "••••••••••"}
                </Value>
                <ToggleValueButton onClick={() => setShowValue(!showValue)}>
                  {showValue ? (
                    <>
                      <FiEyeOff size={16} />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <FiEye size={16} />
                      Mostrar
                    </>
                  )}
                </ToggleValueButton>
              </ValueContainer>
            </Field>
          </Section>

          <Section>
            <SectionTitle>Permissões</SectionTitle>
            <Field>
              <Label>Nível Requerido</Label>
              <Value>{getLevelName(envVar.requiredLevel)}</Value>
            </Field>
          </Section>
        </Card>
      </PageContainer>
    </motion.div>
  );
}
