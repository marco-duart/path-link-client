import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import apiClient from "@/services/api/client";
import type {
  CreateEnvironmentVariableDTO,
  UpdateEnvironmentVariableDTO,
} from "@/types";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";

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

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$textPrimary",
  margin: 0,
});

const Card = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$2xl",
});

const FormGroup = styled("div", {
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

const Input = styled("input", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },

  "&:disabled": {
    backgroundColor: "$bgTertiary",
    color: "$textMuted",
    cursor: "not-allowed",
  },
});

const TextArea = styled("textarea", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",
  fontFamily: "inherit",
  minHeight: "100px",
  resize: "vertical",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },

  "&:disabled": {
    backgroundColor: "$bgTertiary",
    color: "$textMuted",
    cursor: "not-allowed",
  },
});

const Select = styled("select", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&:disabled": {
    backgroundColor: "$bgTertiary",
    color: "$textMuted",
    cursor: "not-allowed",
  },

  "& option": {
    backgroundColor: "$bgPrimary",
    color: "$textPrimary",
  },
});

const Error = styled("span", {
  display: "block",
  fontSize: "$xs",
  color: "#fca5a5",
  marginTop: "$xs",
});

const SubmitButton = styled("button", {
  padding: "$md $lg",
  backgroundColor: "$primaryColor",
  color: "$bgPrimary",
  border: "none",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
  cursor: "pointer",
  transition: "all $normal",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "&:hover": {
    backgroundColor: "$borderAccent",
    transform: "translateY(-2px)",
  },

  "&:disabled": {
    backgroundColor: "$textMuted",
    cursor: "not-allowed",
    transform: "none",
  },
});

const FormSection = styled("div", {
  marginBottom: "$2xl",

  "&:last-child": {
    marginBottom: 0,
  },
});

const SectionTitle = styled("h2", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$textSecondary",
  marginBottom: "$lg",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const schemaCreate = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  value: z.string().min(1, "Valor é obrigatório"),
  scope: z.string().min(1, "Escopo é obrigatório"),
  description: z.string().optional(),
  requiredLevel: z.number().min(10, "Nível mínimo é 10"),
});

const schemaUpdate = schemaCreate;

type FormData = z.infer<typeof schemaCreate>;

interface FormProps {
  isEditing?: boolean;
}

export function EnvironmentVariableForm({ isEditing = false }: FormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(Boolean(isEditing && id));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const schema = isEditing ? schemaUpdate : schemaCreate;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      value: "",
      scope: "Development",
      description: "",
      requiredLevel: 20,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadEnvironmentVariable();
    }
  }, [id, isEditing]);

  const loadEnvironmentVariable = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setLoadError(null);
      const data = await apiClient.getEnvironmentVariable(id);
      reset({
        name: data.name,
        value: data.valueEncrypted,
        scope: data.scope,
        description: data.description,
        requiredLevel: data.requiredLevel,
      });
    } catch (error: any) {
      console.error("Erro ao carregar variável:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Erro ao carregar variável de ambiente";
      setLoadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      if (isEditing && id) {
        await apiClient.updateEnvironmentVariable(
          id,
          data as UpdateEnvironmentVariableDTO,
        );
        toast.success("Variável de ambiente atualizada com sucesso");
      } else {
        await apiClient.createEnvironmentVariable(
          data as CreateEnvironmentVariableDTO,
        );
        toast.success("Variável de ambiente criada com sucesso");
      }

      navigate("/environment-variables");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      const errorMsg =
        error.response?.data?.message || "Erro ao salvar variável de ambiente";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div
          style={{
            padding: "$4xl $lg",
            textAlign: "center",
            color: "$textMuted",
          }}
        >
          Carregando...
        </div>
      </PageContainer>
    );
  }

  if (loadError) {
    return (
      <PageContainer>
        <BackButton onClick={() => navigate("/environment-variables")}>
          <FiArrowLeft size={16} />
          Voltar
        </BackButton>
        <div
          style={{
            padding: "$lg",
            backgroundColor: "#6b2121",
            border: "1px solid #991b1b",
            borderRadius: "$md",
            color: "$bgPrimary",
            marginTop: "$lg",
          }}
        >
          {loadError}
        </div>
      </PageContainer>
    );
  }

  const title = isEditing
    ? "Editar Variável de Ambiente"
    : "Nova Variável de Ambiente";

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
          <Title>{title}</Title>
        </HeaderSection>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSection>
              <SectionTitle>Informações Básicas</SectionTitle>

              <FormGroup>
                <Label>Nome *</Label>
                <Input
                  {...register("name")}
                  placeholder="Ex: DATABASE_URL"
                  disabled={submitting}
                />
                {errors.name && <Error>{errors.name.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label>Escopo *</Label>
                <Select {...register("scope")} disabled={submitting}>
                  <option value="Development">Desenvolvimento</option>
                  <option value="Staging">Staging</option>
                  <option value="Production">Produção</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <TextArea
                  {...register("description")}
                  placeholder="Descreva a finalidade desta variável de ambiente..."
                  disabled={submitting}
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Valor</SectionTitle>

              <FormGroup>
                <Label>Valor *</Label>
                <Input
                  {...register("value")}
                  type="password"
                  placeholder="Digite um valor seguro"
                  disabled={submitting}
                />
                {errors.value && <Error>{errors.value.message}</Error>}
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Permissões</SectionTitle>

              <FormGroup>
                <Label>Nível Requerido *</Label>
                <Select
                  {...register("requiredLevel", { valueAsNumber: true })}
                  disabled={submitting}
                >
                  <option value={10}>Auxiliar</option>
                  <option value={20}>Assistente</option>
                  <option value={30}>Analista</option>
                  <option value={40}>Coordenador</option>
                  <option value={50}>Gerente</option>
                  <option value={99}>Admin</option>
                </Select>
              </FormGroup>
            </FormSection>

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <FiLoader
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Salvar Variável
                </>
              )}
            </SubmitButton>
          </form>
        </Card>
      </PageContainer>
    </motion.div>
  );
}
