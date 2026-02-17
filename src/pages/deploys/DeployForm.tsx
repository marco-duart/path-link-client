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

const deploySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  environment: z.string().min(1, "Ambiente é obrigatório"),
  region: z.string().optional(),
  endpoint: z.string().min(1, "Endpoint é obrigatório"),
  description: z.string().optional(),
  notes: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type DeployFormData = z.infer<typeof deploySchema>;

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
});

const Row = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$lg",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

interface DeployFormProps {
  isEditing?: boolean;
}

export const DeployForm: React.FC<DeployFormProps> = ({
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
  } = useForm<DeployFormData>({
    resolver: zodResolver(deploySchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
      environment: "development",
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadDeploy(id);
    }
  }, [id, isEditing]);

  const loadDeploy = async (deployId: string) => {
    try {
      const data = await apiClient.getDeploy(deployId);
      reset({
        name: data.name,
        type: data.type,
        environment: data.environment,
        region: data.region,
        endpoint: data.endpoint,
        description: data.description,
        notes: data.notes,
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar deploy:", error);
      toast.error("Erro ao carregar deploy");
      navigate("/deploys");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DeployFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateDeploy(id, data);
        toast.success("Deploy atualizado com sucesso");
      } else {
        await apiClient.createDeploy(data);
        toast.success("Deploy criado com sucesso");
      }
      navigate("/deploys");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar deploy");
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
        <Title>{isEditing ? "Editar Deploy" : "Novo Deploy"}</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Ex: API Production AWS"
              {...register("name")}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Tipo</Label>
              <Select {...register("type")}>
                <option value="">Selecione o tipo</option>
                <option value="AWS">AWS</option>
                <option value="Google Cloud">Google Cloud</option>
                <option value="Azure">Azure</option>
                <option value="Local VM">Local VM</option>
                <option value="DigitalOcean">DigitalOcean</option>
                <option value="Heroku">Heroku</option>
                <option value="Railway">Railway</option>
              </Select>
              {errors.type && (
                <ErrorMessage>{errors.type.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Ambiente</Label>
              <Select {...register("environment")}>
                <option value="">Selecione o ambiente</option>
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </Select>
              {errors.environment && (
                <ErrorMessage>{errors.environment.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Região</Label>
              <Input
                type="text"
                placeholder="Ex: us-east-1, eu-west-1"
                {...register("region")}
              />
              {errors.region && (
                <ErrorMessage>{errors.region.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Endpoint</Label>
              <Input
                type="text"
                placeholder="Ex: https://api.example.com ou IP/hostname"
                {...register("endpoint")}
              />
              {errors.endpoint && (
                <ErrorMessage>{errors.endpoint.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

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
              placeholder="Contexto e objetivos deste deploy"
              {...register("description")}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Notas</Label>
            <Textarea
              placeholder="Notas adicionais sobre o deploy"
              {...register("notes")}
            />
            {errors.notes && (
              <ErrorMessage>{errors.notes.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/deploys")}
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
