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

const machineSchema = z.object({
  assetTag: z.string().min(1, "Etiqueta é obrigatória"),
  deviceType: z.string().min(1, "Tipo é obrigatório"),
  assignee: z.string().optional(),
  ip: z.string().optional(),
  cpu: z.string().optional(),
  ramGb: z.number().optional(),
  storageType: z.string().optional(),
  storageGb: z.number().optional(),
  monitorInfo: z.string().optional(),
  room: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
  notes: z.string().optional(),
  requiredLevel: z.number().min(0, "Nível é obrigatório"),
});

type MachineFormData = z.infer<typeof machineSchema>;

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1000px",
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

const Row = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$lg",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

const FormGroup = styled("div", {
  marginBottom: "$lg",
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

const Select = styled("select", {
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

interface MachineFormProps {
  isEditing?: boolean;
}

export const MachineForm: React.FC<MachineFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id && isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      deviceType: "desktop",
      status: "available",
      requiredLevel: RoleLevel.Auxiliar,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadMachine(id);
    }
  }, [id, isEditing]);

  const loadMachine = async (machineId: string) => {
    try {
      const data = await apiClient.getMachine(machineId);
      reset({
        assetTag: data.assetTag,
        deviceType: data.deviceType || "desktop",
        assignee: data.assignee || "",
        ip: data.ip || "",
        cpu: data.cpu || "",
        ramGb: data.ramGb,
        storageType: data.storageType || "",
        storageGb: data.storageGb,
        monitorInfo: data.monitorInfo || "",
        room: data.room || "",
        status: data.status,
        notes: data.notes || "",
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error("Erro ao carregar máquina:", error);
      toast.error("Erro ao carregar máquina");
      navigate("/logistics/machines");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MachineFormData) => {
    try {
      const payload = {
        ...data,
        ramGb: data.ramGb || undefined,
        storageGb: data.storageGb || undefined,
      };

      if (isEditing && id) {
        await apiClient.updateMachine(id, payload);
        toast.success("Máquina atualizada com sucesso");
      } else {
        await apiClient.createMachine(payload);
        toast.success("Máquina criada com sucesso");
      }
      navigate("/logistics/machines");
    } catch (error: any) {
      console.error("Erro ao salvar máquina:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar máquina");
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
        <Title>{isEditing ? "Editar Máquina" : "Nova Máquina"}</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <FormGroup>
              <Label>Etiqueta</Label>
              <Input type="text" placeholder="Ex: INF-001" {...register("assetTag")} />
              {errors.assetTag && <ErrorMessage>{errors.assetTag.message}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register("status")}>
                <option value="available">Livre</option>
                <option value="in_use">Em uso</option>
                <option value="stopped">Parado</option>
                <option value="maintenance">Manutenção</option>
                <option value="retired">Baixado</option>
              </Select>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Tipo do Equipamento</Label>
              <Input type="text" placeholder="desktop, notebook, servidor" {...register("deviceType")} />
              {errors.deviceType && <ErrorMessage>{errors.deviceType.message}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Utilizador</Label>
              <Input type="text" placeholder="Nome de quem está usando" {...register("assignee")} />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>IP da Máquina</Label>
              <Input type="text" placeholder="Ex: 192.168.0.10" {...register("ip")} />
            </FormGroup>
            <FormGroup>
              <Label>Processador</Label>
              <Input type="text" placeholder="Ex: Intel i5-10400" {...register("cpu")} />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Sala</Label>
              <Input type="text" placeholder="Ex: Sala TI" {...register("room")} />
            </FormGroup>
            <FormGroup />
          </Row>

          <Row>
            <FormGroup>
              <Label>Memória RAM (GB)</Label>
              <Input type="number" {...register("ramGb", { valueAsNumber: true })} />
            </FormGroup>
            <FormGroup>
              <Label>Tipo de Armazenamento</Label>
              <Select {...register("storageType")}>
                <option value="">Selecione</option>
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
                <option value="NVME">NVME</option>
                <option value="EMMC">EMMC</option>
                <option value="HYBRID">HYBRID</option>
                <option value="OTHER">OTHER</option>
              </Select>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Armazenamento (GB)</Label>
              <Input type="number" {...register("storageGb", { valueAsNumber: true })} />
            </FormGroup>
            <FormGroup>
              <Label>Monitor</Label>
              <Input type="text" placeholder="Ex: 24 polegadas Dell" {...register("monitorInfo")} />
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Nível mínimo de acesso</Label>
            <Select {...register("requiredLevel", { valueAsNumber: true })}>
              <option value={RoleLevel.Auxiliar}>Auxiliar</option>
              <option value={RoleLevel.Técnico}>Técnico</option>
              <option value={RoleLevel.Gestor}>Gestor</option>
              <option value={RoleLevel.Gerente}>Gerente</option>
              <option value={RoleLevel.Administrador}>Administrador</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <Textarea placeholder="Observações gerais sobre estoque, avarias e uso" {...register("notes")} />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={() => navigate("/logistics/machines")}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>
    </PageContainer>
  );
};
