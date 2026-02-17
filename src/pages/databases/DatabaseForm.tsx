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

const databaseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  host: z.string().min(1, "Host é obrigatório"),
  port: z
    .number()
    .min(1, "Porta deve ser maior que 0")
    .max(65535, "Porta deve ser menor que 65536"),
  credentialsEncrypted: z.string().min(1, "Credenciais são obrigatórias"),
  notes: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type DatabaseFormData = z.infer<typeof databaseSchema>;

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

interface DatabaseFormProps {
  isEditing?: boolean;
}

export const DatabaseForm: React.FC<DatabaseFormProps> = ({
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
  } = useForm<DatabaseFormData>({
    resolver: zodResolver(databaseSchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadDatabase(id);
    }
  }, [id, isEditing]);

  const loadDatabase = async (databaseId: string) => {
    try {
      const data = await apiClient.getDatabase(databaseId);
      reset({
        name: data.name,
        type: data.type,
        host: data.host,
        port: data.port,
        credentialsEncrypted: data.credentialsEncrypted,
        notes: data.notes,
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar banco de dados:", error);
      toast.error("Erro ao carregar banco de dados");
      navigate("/databases");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DatabaseFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateDatabase(id, data);
        toast.success("Banco de dados atualizado com sucesso");
      } else {
        await apiClient.createDatabase(data);
        toast.success("Banco de dados criado com sucesso");
      }
      navigate("/databases");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(
        error.response?.data?.message || "Erro ao salvar banco de dados",
      );
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
        <Title>
          {isEditing ? "Editar Banco de Dados" : "Novo Banco de Dados"}
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Ex: Production DB"
              {...register("name")}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Tipo</Label>
              <Input
                type="text"
                placeholder="Ex: PostgreSQL, MySQL, MongoDB"
                {...register("type")}
              />
              {errors.type && (
                <ErrorMessage>{errors.type.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Host</Label>
              <Input
                type="text"
                placeholder="Ex: db.example.com"
                {...register("host")}
              />
              {errors.host && (
                <ErrorMessage>{errors.host.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Porta</Label>
              <Input
                type="number"
                placeholder="Ex: 5432"
                {...register("port", { valueAsNumber: true })}
              />
              {errors.port && (
                <ErrorMessage>{errors.port.message}</ErrorMessage>
              )}
            </FormGroup>

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
            <Label>Credenciais (Dados de Conexão)</Label>
            <Textarea
              placeholder="Ex: user=postgres password=secret dbname=mydb"
              {...register("credentialsEncrypted")}
            />
            {errors.credentialsEncrypted && (
              <ErrorMessage>{errors.credentialsEncrypted.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Notas</Label>
            <Textarea
              placeholder="Informações adicionais sobre este banco de dados..."
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
              onClick={() => navigate("/databases")}
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
