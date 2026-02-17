import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { styled } from "@/assets/styles/themes/stitches.config";
import { motion } from "framer-motion";
import apiClient from "@/services/api/client";
import {
  ImageUploadSection,
  type UploadedImage,
} from "@/components/forms/ImageUploadSection";
import {
  ResourcesSelector,
  type SelectedResource,
} from "@/components/forms/ResourcesSelector";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "900px",
  margin: "0 auto",
  minHeight: "100vh",
  background: "linear-gradient(135deg, $bgPrimary 0%, $bgSecondary 100%)",
});

const Header = styled("div", {
  marginBottom: "$lg",
  display: "flex",
  alignItems: "center",
  gap: "$md",
});

const BackButton = styled("button", {
  padding: "$md $lg",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  cursor: "pointer",
  transition: "all $normal",
  fontSize: "$sm",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "&:hover": {
    backgroundColor: "$borderPrimary",
    transform: "translateX(-4px)",
  },
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 800,
  color: "$textPrimary",
  margin: 0,
  background: "linear-gradient(135deg, $primaryColor, $borderAccent)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

const FormContainer = styled("form", {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$2xl",
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
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "& span": {
    color: "#ef4444",
  },
});

const Input = styled("input", {
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",
  fontFamily: "inherit",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&:disabled": {
    backgroundColor: "$bgSecondary",
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const TextArea = styled("textarea", {
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
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
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&:disabled": {
    backgroundColor: "$bgSecondary",
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const CheckboxContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  borderRadius: "$md",
  border: "1px solid $borderPrimary",
});

const Checkbox = styled("input", {
  width: "20px",
  height: "20px",
  cursor: "pointer",
  accentColor: "$primaryColor",
});

const CheckboxLabel = styled("label", {
  cursor: "pointer",
  color: "$textSecondary",
  fontSize: "$sm",
  margin: 0,
});

const ErrorMessage = styled("span", {
  fontSize: "$xs",
  color: "#ef4444",
  marginTop: "$xs",
});

const FormRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$lg",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

const ButtonContainer = styled("div", {
  display: "flex",
  gap: "$md",
  justifyContent: "flex-end",
  paddingTop: "$lg",
  borderTop: "1px solid $borderPrimary",
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

        "&:hover:not(:disabled)": {
          backgroundColor: "$borderAccent",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
        },
      },
      secondary: {
        backgroundColor: "$bgPrimary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",

        "&:hover": {
          borderColor: "$primaryColor",
          backgroundColor: "$borderPrimary",
        },
      },
    },
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const stepFormSchema = z.object({
  stepNumber: z.coerce.number().int().min(1, "Deve ser um número maior que 0"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Mínimo 3 caracteres"),
  instructions: z
    .string()
    .min(1, "Instruções são obrigatórias")
    .min(10, "Mínimo 10 caracteres"),
  expectedResult: z.string().optional(),
  notes: z.string().optional(),
  isOptional: z.boolean().optional(),
});

type StepFormData = z.infer<typeof stepFormSchema>;

export function CreateStepPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const uploadedImagesRef = useRef<UploadedImage[]>([]);
  const [selectedResources, setSelectedResources] = useState<
    SelectedResource[]
  >([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Sincronizar ref com state
  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
    console.log(
      "[CreateStepPage] uploadedImagesRef atualizado:",
      uploadedImagesRef.current,
    );
  }, [uploadedImages]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFormData>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      stepNumber: 1,
      isOptional: false,
    },
  });

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    const errorObj = error as any;
    return (
      errorObj?.response?.data?.message ||
      errorObj?.response?.data?.error ||
      "Erro desconhecido"
    );
  };

  const uploadImages = async (stepId: number): Promise<void> => {
    console.log(
      "[CreateStep-uploadImages] USANDO REF:",
      uploadedImagesRef.current,
    );
    console.log(
      `[CreateStep-uploadImages] Iniciando upload de ${uploadedImagesRef.current.length} imagem(ns) para Step ${stepId}`,
    );
    console.log(
      "[CreateStep-uploadImages] uploadedImages (ref):",
      uploadedImagesRef.current,
    );

    const uploadPromises = uploadedImagesRef.current.map(async (image) => {
      if (!image.id.startsWith("uploaded-") && image.file) {
        try {
          console.log(
            `[CreateStep-uploadImages] Iniciando upload: ${image.file.name}, Size: ${image.file.size} bytes, Type: ${image.file.type}, Caption: ${image.caption || "(vazio)"}`,
          );

          const uploadedAsset = await apiClient.uploadAsset(image.file, {
            requiredLevel: 10,
          });

          console.log(`[CreateStep-uploadImages] Asset enviado com sucesso:`, {
            id: uploadedAsset.id,
            filename: uploadedAsset.filename,
            url: uploadedAsset.url,
          });

          console.log(
            `[CreateStep-uploadImages] Criando StepAsset com stepId=${stepId}, assetId=${uploadedAsset.id}`,
          );

          await apiClient.createStepAsset({
            stepId,
            assetId: uploadedAsset.id,
            caption: image.caption || undefined,
          });

          console.log(`[CreateStep-uploadImages] StepAsset criado com sucesso`);
        } catch (error) {
          const errorMsg = getErrorMessage(error);
          const filename = image.file?.name || "desconhecido";
          console.error(
            `[CreateStep-uploadImages] Erro ao fazer upload de ${filename}: ${errorMsg}`,
            error,
          );
          toast.error(`Erro ao fazer upload de ${filename}: ${errorMsg}`);
          throw error;
        }
      }
    });

    if (uploadPromises.length > 0) {
      console.log(
        `[CreateStep-uploadImages] Aguardando ${uploadPromises.length} uploads...`,
      );
      await Promise.all(uploadPromises);
      console.log("[CreateStep-uploadImages] Todos os uploads completados");
    } else {
      console.log(
        "[CreateStep-uploadImages] Nenhuma imagem para fazer upload (length=0)",
      );
    }
  };

  const createRelationships = async (stepId: number): Promise<void> => {
    const relationshipPromises = selectedResources.map(async (resource) => {
      try {
        await apiClient.createStepRelationship({
          stepId,
          relatedModel: resource.type,
          relatedId: resource.id,
        });
      } catch (error) {
        console.error("Erro ao criar relacionamento:", error);
        toast.error(`Erro ao relacionar ${resource.name}`);
        throw error;
      }
    });

    if (relationshipPromises.length > 0) {
      await Promise.all(relationshipPromises);
    }
  };

  const onSubmit = async (data: StepFormData) => {
    if (!id) return;

    try {
      setIsLoading(true);

      console.log("[CreateStep-onSubmit] ===== INICIANDO SUBMIT =====");
      console.log("[CreateStep-onSubmit] FormData:", data);
      console.log(
        "[CreateStep-onSubmit] uploadedImages (state):",
        uploadedImages,
      );
      console.log(
        "[CreateStep-onSubmit] uploadedImages (ref):",
        uploadedImagesRef.current,
      );
      console.log(
        "[CreateStep-onSubmit] uploadedImages.length (state):",
        uploadedImages.length,
      );
      console.log(
        "[CreateStep-onSubmit] uploadedImages.length (ref):",
        uploadedImagesRef.current.length,
      );

      const createdStep = await apiClient.createStep({
        processId: id,
        ...data,
      });

      console.log("[CreateStep-onSubmit] Passo criado com ID:", createdStep.id);
      toast.success("Passo criado com sucesso!");

      if (uploadedImagesRef.current.length > 0) {
        console.log("[CreateStep-onSubmit] Iniciando upload de imagens...");
        try {
          await uploadImages(createdStep.id);
          toast.success(
            `${uploadedImagesRef.current.length} imagem(ns) adicionada(s)!`,
          );
        } catch (error) {
          console.error(
            "[CreateStep-onSubmit] Erro no upload de imagens:",
            error,
          );
        }
      } else {
        console.log(
          "[CreateStep-onSubmit] Nenhuma imagem para fazer upload (ref.length=0)",
        );
      }

      if (selectedResources.length > 0) {
        try {
          await createRelationships(createdStep.id);
          toast.success(
            `${selectedResources.length} recurso(s) relacionado(s)!`,
          );
        } catch (error) {}
      }

      console.log("[CreateStep-onSubmit] Navegando para ProcessDetailPage");
      navigate(`/processes/${id}`);
    } catch (error: any) {
      console.error("Erro ao criar passo:", error);
      toast.error(error.response?.data?.message || "Erro ao criar passo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(`/processes/${id}`)}>
            <FiArrowLeft size={18} />
          </BackButton>
          <Title>Novo Passo</Title>
        </Header>

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label>
                Número do Passo
                <span>*</span>
              </Label>
              <Input
                type="number"
                placeholder="Ex: 1"
                {...register("stepNumber")}
                disabled={isLoading}
              />
              {errors.stepNumber && (
                <ErrorMessage>{errors.stepNumber.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Título
                <span>*</span>
              </Label>
              <Input
                type="text"
                placeholder="Ex: Validar dados"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>
              Instruções
              <span>*</span>
            </Label>
            <TextArea
              placeholder="Descreva o que deve ser feito neste passo..."
              {...register("instructions")}
              disabled={isLoading}
            />
            {errors.instructions && (
              <ErrorMessage>{errors.instructions.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Resultado Esperado</Label>
            <TextArea
              placeholder="Qual é o resultado esperado após executar este passo?"
              {...register("expectedResult")}
              disabled={isLoading}
            />
            {errors.expectedResult && (
              <ErrorMessage>{errors.expectedResult.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Notas</Label>
            <TextArea
              placeholder="Notas adicionais ou observações importantes..."
              {...register("notes")}
              disabled={isLoading}
            />
            {errors.notes && (
              <ErrorMessage>{errors.notes.message}</ErrorMessage>
            )}
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="isOptional"
              {...register("isOptional")}
            />
            <CheckboxLabel htmlFor="isOptional">
              Este é um passo opcional?
            </CheckboxLabel>
          </CheckboxContainer>

          <ImageUploadSection
            onImagesLoaded={setUploadedImages}
            maxFiles={5}
            onCropModalStateChange={setIsCropModalOpen}
          />

          <ResourcesSelector
            onResourcesSelected={setSelectedResources}
            selectedResources={selectedResources}
          />

          <ButtonContainer>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/processes/${id}`)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || isCropModalOpen}
            >
              <FiSave size={18} />
              {isLoading ? "Criando..." : "Criar Passo"}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </PageContainer>
    </motion.div>
  );
}
