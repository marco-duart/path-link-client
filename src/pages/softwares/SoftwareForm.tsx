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

const softwareSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  downloadUrl: z.string().url("URL inválida").min(1, "Link é obrigatório"),
  version: z.string().optional(),
  description: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type SoftwareFormData = z.infer<typeof softwareSchema>;

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
});

const Textarea = styled("textarea", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  minHeight: "120px",
  resize: "vertical",
  fontFamily: "inherit",
});

const Select = styled("select", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
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
      },
      secondary: {
        backgroundColor: "$bgTertiary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",
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

interface SoftwareFormProps {
  isEditing?: boolean;
}

export const SoftwareForm: React.FC<SoftwareFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id && isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SoftwareFormData>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
      version: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadSoftware(id);
    }
  }, [id, isEditing]);

  const loadSoftware = async (softwareId: string) => {
    try {
      const data = await apiClient.getSoftware(softwareId);
      reset({
        name: data.name,
        downloadUrl: data.downloadUrl,
        version: data.version || "",
        description: data.description || "",
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar software:", error);
      toast.error("Erro ao carregar software");
      navigate("/softwares");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SoftwareFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateSoftware(id, data);
        toast.success("Software atualizado com sucesso");
      } else {
        await apiClient.createSoftware(data);
        toast.success("Software criado com sucesso");
      }
      navigate("/softwares");
    } catch (error: any) {
      console.error("Erro ao salvar software:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar software");
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
        <Title>{isEditing ? "Editar Software" : "Novo Software"}</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input type="text" placeholder="Ex: AnyDesk" {...register("name")} />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Versão</Label>
              <Input type="text" placeholder="Ex: 8.0.10" {...register("version")} />
            </FormGroup>
            <FormGroup>
              <Label>Nível mínimo de acesso</Label>
              <Select
                {...register("requiredLevel", { valueAsNumber: true })}
              >
                <option value={RoleLevel.Auxiliar}>Auxiliar</option>
                <option value={RoleLevel.Técnico}>Técnico</option>
                <option value={RoleLevel.Gestor}>Gestor</option>
                <option value={RoleLevel.Gerente}>Gerente</option>
                <option value={RoleLevel.Administrador}>Administrador</option>
              </Select>
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Link para Download</Label>
            <Input type="url" placeholder="https://..." {...register("downloadUrl")} />
            {errors.downloadUrl && (
              <ErrorMessage>{errors.downloadUrl.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <Textarea
              placeholder="Contexto de uso, observações ou escopo desse software"
              {...register("description")}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={() => navigate("/softwares")}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>
    </PageContainer>
  );
};
