import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { styled } from "../../assets/styles/themes/stitches.config";
import { Button, Card } from "../common";
import apiClient from "../../services/api/client";

const createProcessSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome não pode exceder 255 caracteres"),
  description: z.string().optional(),
  category: z
    .string()
    .min(1, "Categoria é obrigatória")
    .max(100, "Categoria não pode exceder 100 caracteres"),
  requiredLevel: z
    .number()
    .min(10, "Nível mínimo deve ser 10")
    .max(99, "Nível máximo deve ser 99"),
  is_active: z.boolean().default(true),
});

type CreateProcessFormData = z.infer<typeof createProcessSchema>;

const FormContainer = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$lg",
});

const FormGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
});

const Label = styled("label", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
});

const Input = styled("input", {
  width: "100%",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "$bgTertiary",
  border: "1px solid $borderSecondary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.15)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },
});

const TextArea = styled("textarea", {
  width: "100%",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "$bgTertiary",
  border: "1px solid $borderSecondary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  fontFamily: "inherit",
  minHeight: "120px",
  resize: "vertical",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.15)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },
});

const Select = styled("select", {
  width: "100%",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "$bgTertiary",
  border: "1px solid $borderSecondary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",
  cursor: "pointer",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.15)",
  },

  "& option": {
    backgroundColor: "$bgSecondary",
    color: "$textPrimary",
  },
});

const CheckboxContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
});

const CheckboxInput = styled("input", {
  width: "20px",
  height: "20px",
  cursor: "pointer",
});

const ErrorMessage = styled("span", {
  fontSize: "$xs",
  color: "$errorColor",
  fontWeight: "$medium",
});

const ButtonGroup = styled("div", {
  display: "flex",
  gap: "$md",
  marginTop: "$lg",
  justifyContent: "flex-end",

  "@xs": {
    flexDirection: "column-reverse",
  },
});

const CATEGORIES = [
  "Deploy",
  "Atendimento",
  "Sankhya",
  "Jira",
  "Documentação",
  "Outra",
];

const ROLE_LEVELS = [
  { value: 10, label: "Auxiliar" },
  { value: 20, label: "Assistente" },
  { value: 30, label: "Analista" },
  { value: 40, label: "Coordenador" },
  { value: 50, label: "Gerente" },
  { value: 99, label: "Admin" },
];

interface CreateProcessFormProps {
  onSuccess?: (processId: string) => void;
}

export const CreateProcessForm: React.FC<CreateProcessFormProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProcessFormData>({
    resolver: zodResolver(createProcessSchema),
    defaultValues: {
      is_active: true,
      requiredLevel: 10,
    },
  });

  const onSubmit = async (data: CreateProcessFormData) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.createProcess(data);
      toast.success("Processo criado com sucesso!");

      if (onSuccess) {
        onSuccess(response.id);
      } else {
        navigate(`/processes/${response.id}`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar processo";
      toast.error(message);
      console.error("Erro ao criar processo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Novo Processo">
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Nome do Processo *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Deploy em Produção"
            {...register("name")}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Descrição</Label>
          <TextArea
            id="description"
            placeholder="Descrição detalhada do processo..."
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Categoria *</Label>
          <Select id="category" {...register("category")}>
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          {errors.category && (
            <ErrorMessage>{errors.category.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="requiredLevel">Nível de Acesso Mínimo *</Label>
          <Select
            id="requiredLevel"
            {...register("requiredLevel", { valueAsNumber: true })}
          >
            {ROLE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} (Nível {level.value})
              </option>
            ))}
          </Select>
          {errors.requiredLevel && (
            <ErrorMessage>{errors.requiredLevel.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <CheckboxInput
              id="is_active"
              type="checkbox"
              defaultChecked={true}
              {...register("is_active")}
            />
            <Label htmlFor="is_active" style={{ margin: 0 }}>
              Processo Ativo
            </Label>
          </CheckboxContainer>
        </FormGroup>

        <ButtonGroup>
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/processes")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Processo"}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </Card>
  );
};
