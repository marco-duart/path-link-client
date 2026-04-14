import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import apiClient from "@/services/api/client";
import type { CreateAccountDTO, UpdateAccountDTO } from "@/types";
import {
  ImageUploadSection,
  type UploadedImage,
} from "@/components/forms/ImageUploadSection";
import { resolveUploadUrl } from "@/utils/assetUrl";
import { FiArrowLeft, FiSave, FiLoader, FiTrash2 } from "react-icons/fi";

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

const SecondaryButton = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$xs",
  padding: "$sm $md",
  borderRadius: "$sm",
  border: "1px solid $borderPrimary",
  backgroundColor: "$bgSecondary",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "$xs",

  "&:hover": {
    borderColor: "$primaryColor",
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const QrPreview = styled("img", {
  width: "220px",
  maxWidth: "100%",
  borderRadius: "$sm",
  border: "1px solid $borderPrimary",
  backgroundColor: "$bgSecondary",
  marginTop: "$md",
});

const UploadNote = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  marginTop: "$sm",
});

const schemaCreate = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.string().min(1, "Tipo é obrigatório"),
  username: z.string().min(1, "Usuário é obrigatório"),
  passwordEncrypted: z.string().min(1, "Senha é obrigatória"),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  notes: z.string().optional(),
  requiredLevel: z.number().min(10, "Nível mínimo é 10"),
});

const schemaUpdate = schemaCreate;

type FormData = z.infer<typeof schemaCreate>;

interface FormProps {
  isEditing?: boolean;
}

export function AccountForm({ isEditing = false }: FormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(Boolean(isEditing && id));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);
  const [existingQrAssetId, setExistingQrAssetId] = useState<string | null>(
    null,
  );
  const [shouldRemoveExistingQr, setShouldRemoveExistingQr] =
    useState(false);

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
      type: "",
      username: "",
      passwordEncrypted: "",
      url: "",
      notes: "",
      requiredLevel: 20,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadAccount();
    }
  }, [id, isEditing]);

  useEffect(() => {
    return () => {
      if (qrPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(qrPreviewUrl);
      }
    };
  }, [qrPreviewUrl]);

  const resolveAssetUrl = (assetUrl?: string) => resolveUploadUrl(assetUrl);

  const clearQrPreview = () => {
    if (qrPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(qrPreviewUrl);
    }
    setQrPreviewUrl(null);
  };

  const handleRemoveQr = () => {
    clearQrPreview();

    if (existingQrAssetId) {
      setShouldRemoveExistingQr(true);
    }
  };

  const loadAccount = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setLoadError(null);
      const data = await apiClient.getAccount(id);
      reset({
        name: data.name,
        type: data.type,
        username: data.username,
        passwordEncrypted: data.passwordEncrypted || "",
        url: data.url || "",
        notes: data.notes || "",
        requiredLevel: data.requiredLevel,
      });

      const currentQrAsset = data.twoFactorQrAsset;
      if (currentQrAsset?.id) {
        setExistingQrAssetId(currentQrAsset.id);
        setQrPreviewUrl(resolveAssetUrl(currentQrAsset.url));
        setShouldRemoveExistingQr(false);
      } else {
        setExistingQrAssetId(null);
        clearQrPreview();
      }
    } catch (error: any) {
      console.error("Erro ao carregar conta:", error);
      const errorMsg =
        error.response?.data?.message || "Erro ao carregar conta";
      setLoadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    let uploadedQrAssetId: string | null = null;
    const qrFile = uploadedImages[0]?.file;

    try {
      setSubmitting(true);

      if (qrFile) {
        const uploadedAsset = await apiClient.uploadAsset(qrFile, {
          requiredLevel: data.requiredLevel,
        });
        uploadedQrAssetId = uploadedAsset.id;
      }

      const payloadQrAssetId =
        uploadedQrAssetId !== null
          ? uploadedQrAssetId
          : shouldRemoveExistingQr
            ? null
            : undefined;

      if (isEditing && id) {
        const updateData: UpdateAccountDTO = {
          ...data,
          ...(payloadQrAssetId !== undefined
            ? { twoFactorQrAssetId: payloadQrAssetId }
            : {}),
        };
        await apiClient.updateAccount(id, updateData);

        if ((uploadedQrAssetId || shouldRemoveExistingQr) && existingQrAssetId) {
          await apiClient.deleteAsset(existingQrAssetId).catch(() => {
            toast.error(
              "Conta salva, mas não foi possível remover o QR Code antigo",
            );
          });
        }

        toast.success("Conta atualizada com sucesso");
      } else {
        const createData: CreateAccountDTO = {
          ...data,
          ...(uploadedQrAssetId ? { twoFactorQrAssetId: uploadedQrAssetId } : {}),
        };
        await apiClient.createAccount(createData);
        toast.success("Conta criada com sucesso");
      }

      navigate("/accounts");
    } catch (error: any) {
      if (uploadedQrAssetId) {
        await apiClient.deleteAsset(uploadedQrAssetId).catch(() => null);
      }

      console.error("Erro ao salvar:", error);
      const errorMsg = error.response?.data?.message || "Erro ao salvar conta";
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
        <BackButton onClick={() => navigate("/accounts")}>
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

  const title = isEditing ? "Editar Conta" : "Nova Conta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <HeaderSection>
          <BackButton onClick={() => navigate("/accounts")}>
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
                  placeholder="Ex: GitHub Account"
                  disabled={submitting}
                />
                {errors.name && <Error>{errors.name.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label>Tipo *</Label>
                <Input
                  {...register("type")}
                  placeholder="Ex: GitHub, AWS, Slack"
                  disabled={submitting}
                />
                {errors.type && <Error>{errors.type.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label>Usuário *</Label>
                <Input
                  {...register("username")}
                  placeholder="Ex: usuario@example.com"
                  disabled={submitting}
                />
                {errors.username && <Error>{errors.username.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label>URL</Label>
                <Input
                  {...register("url")}
                  type="url"
                  placeholder="https://github.com"
                  disabled={submitting}
                />
                {errors.url && <Error>{errors.url.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label>Notas</Label>
                <TextArea
                  {...register("notes")}
                  placeholder="Descreva detalhes da conta..."
                  disabled={submitting}
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Segurança</SectionTitle>

              <FormGroup>
                <Label>Senha *</Label>
                <Input
                  {...register("passwordEncrypted")}
                  type="password"
                  placeholder="Digite uma senha segura"
                  disabled={submitting}
                />
                {errors.passwordEncrypted && (
                  <Error>{errors.passwordEncrypted.message}</Error>
                )}
              </FormGroup>

              <FormGroup>
                <Label>QR Code (2FA)</Label>
                <ImageUploadSection
                  onImagesLoaded={(images) => {
                    setUploadedImages(images);
                    if (images.length > 0) {
                      setShouldRemoveExistingQr(false);
                    }
                  }}
                  maxFiles={1}
                  title="QR Code (2FA)"
                  mainText="Arraste o QR Code aqui ou clique"
                  subText="PNG, JPG, GIF até 10MB. Máximo 1 imagem."
                  cropHintText="Ajuste o recorte antes de salvar a conta."
                  cropAspectRatio={1}
                  showCaptionInput={false}
                  onCropModalStateChange={setIsCropModalOpen}
                />
                <UploadNote>
                  O arquivo é enviado ao salvar a conta.
                </UploadNote>

                {qrPreviewUrl && uploadedImages.length === 0 && (
                  <>
                    <QrPreview src={qrPreviewUrl} alt="QR Code 2FA atual" />
                    <div>
                      <SecondaryButton
                        type="button"
                        onClick={handleRemoveQr}
                        disabled={submitting}
                      >
                        <FiTrash2 size={14} />
                        Remover QR Code atual
                      </SecondaryButton>
                    </div>
                  </>
                )}
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

            <SubmitButton type="submit" disabled={submitting || isCropModalOpen}>
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
                  Salvar Conta
                </>
              )}
            </SubmitButton>
          </form>
        </Card>
      </PageContainer>
    </motion.div>
  );
}
