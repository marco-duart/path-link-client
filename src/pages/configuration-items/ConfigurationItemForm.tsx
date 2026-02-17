import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { RoleLevel } from "@/types";
import apiClient from "@/services/api/client";

const configSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  details: z.string().min(1, "Detalhes são obrigatórios"),
  notes: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type ConfigFormData = z.infer<typeof configSchema>;

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "900px",
  margin: "0 auto",
});

const FormSection = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$xl",
  marginBottom: "$xl",
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$textPrimary",
  marginBottom: "$lg",
});

const FormGroup = styled("div", {
  marginBottom: "$lg",

  "&:last-of-type": {
    marginBottom: 0,
  },
});

const Label = styled("label", {
  display: "block",
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  marginBottom: "$md",
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
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },
});

const Textarea = styled("textarea", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",
  minHeight: "120px",
  fontFamily: "inherit",
  resize: "vertical",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  },

  "&::placeholder": {
    color: "$textMuted",
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
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  },

  "& option": {
    backgroundColor: "$bgPrimary",
    color: "$textPrimary",
  },
});

const ErrorMessage = styled("span", {
  fontSize: "$xs",
  color: "$errorColor",
  marginTop: "$xs",
  display: "block",
});

const ButtonGroup = styled("div", {
  display: "flex",
  gap: "$md",
  marginTop: "$2xl",
  justifyContent: "flex-end",

  "@xs": {
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
    },
  },

  defaultVariants: {
    variant: "primary",
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const Row = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$lg",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

interface ConfigFormProps {
  isEditing?: boolean;
}

export const ConfigurationItemForm: React.FC<ConfigFormProps> = ({
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id && isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadConfigurationItem(id);
    }
  }, [id, isEditing]);

  const loadConfigurationItem = async (configItemId: string) => {
    try {
      const data = await apiClient.getConfigurationItem(configItemId);
      reset({
        name: data.name,
        type: data.type,
        details: data.details,
        notes: data.notes,
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar recurso:", error);
      toast.error("Erro ao carregar recurso");
      navigate("/configuration-items");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ConfigFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateConfigurationItem(id, data);
        toast.success("Recurso atualizado com sucesso");
      } else {
        await apiClient.createConfigurationItem(data);
        toast.success("Recurso criado com sucesso");
      }
      navigate("/configuration-items");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar recurso");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <FormSection>
          <p>Carregando...</p>
        </FormSection>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FormSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title>{isEditing ? "Editar Recurso" : "Novo Recurso"}</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Ex: API Rate Limit"
              {...register("name")}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Tipo</Label>
              <Input
                type="text"
                placeholder="Ex: Performance, Email, Storage"
                {...register("type")}
              />
              {errors.type && (
                <ErrorMessage>{errors.type.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Nível de Acesso Requerido</Label>
              <Select {...register("requiredLevel", { valueAsNumber: true })}>
                <option value={RoleLevel.Auxiliar}>Auxiliar (10)</option>
                <option value={20}>Assistente (20)</option>
                <option value={30}>Analista (30)</option>
                <option value={40}>Coordenador (40)</option>
                <option value={50}>Gerente (50)</option>
                <option value={99}>Admin (99)</option>
              </Select>
              {errors.requiredLevel && (
                <ErrorMessage>{errors.requiredLevel.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Detalhes</Label>
            <Textarea
              placeholder="Descrição detalhada do recurso"
              {...register("details")}
            />
            {errors.details && (
              <ErrorMessage>{errors.details.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <Textarea placeholder="Notas adicionais" {...register("notes")} />
            {errors.notes && (
              <ErrorMessage>{errors.notes.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/configuration-items")}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>
    </PageContainer>
  );
};
