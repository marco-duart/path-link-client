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

const linkSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().url("URL inválida").min(1, "URL é obrigatória"),
  description: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type LinkFormData = z.infer<typeof linkSchema>;

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

interface LinkFormProps {
  isEditing?: boolean;
}

export const LinkForm: React.FC<LinkFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id && isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadLink(id);
    }
  }, [id, isEditing]);

  const loadLink = async (linkId: string) => {
    try {
      const data = await apiClient.getLink(linkId);
      reset({
        name: data.name,
        url: data.url,
        description: data.description,
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar link:", error);
      toast.error("Erro ao carregar link");
      navigate("/links");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LinkFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateLink(id, data);
        toast.success("Link atualizado com sucesso");
      } else {
        await apiClient.createLink(data);
        toast.success("Link criado com sucesso");
      }
      navigate("/links");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar link");
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
        <Title>{isEditing ? "Editar Link" : "Novo Link"}</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Ex: Documentação da API"
              {...register("name")}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>URL</Label>
            <Input
              type="text"
              placeholder="https://exemplo.com.br"
              {...register("url")}
            />
            {errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Nível de Acesso Requerido</Label>
              <Select {...register("requiredLevel", { valueAsNumber: true })}>
                <option value={RoleLevel.Auxiliar}>Auxiliar (10)</option>
                <option value={RoleLevel.Técnico}>Técnico (20)</option>
                <option value={RoleLevel.Gestor}>Gestor (30)</option>
                <option value={RoleLevel.Gerente}>Gerente (40)</option>
                <option value={RoleLevel.Administrador}>
                  Administrador (50)
                </option>
              </Select>
              {errors.requiredLevel && (
                <ErrorMessage>{errors.requiredLevel.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Descrição</Label>
            <Textarea
              placeholder="Descrição ou contexto sobre este link"
              {...register("description")}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/links")}
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
