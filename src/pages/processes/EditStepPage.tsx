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
import { type Step, type StepRelationship } from "@/types";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "900px",
  margin: "0 auto",
  minHeight: "100vh",
  background: "linear-gradient(135deg, $bgPrimary 0%, $bgSecondary 100%)",
});

const Header = styled("div", {
  marginBottom: "$4xl",
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

const LoadingContainer = styled("div", {
  padding: "$4xl",
  textAlign: "center",
  color: "$textMuted",
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

export function EditStepPage() {
  const { id, stepId } = useParams<{ id: string; stepId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const uploadedImagesRef = useRef<UploadedImage[]>([]);
  const [selectedResources, setSelectedResources] = useState<
    SelectedResource[]
  >([]);
  const [originalSelectedResources, setOriginalSelectedResources] = useState<
    SelectedResource[]
  >([]);

  useEffect(() => {
    uploadedImagesRef.current = uploadedImages;
    console.log(
      "[EditStepPage] uploadedImagesRef atualizado:",
      uploadedImagesRef.current,
    );
  }, [uploadedImages]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StepFormData>({
    resolver: zodResolver(stepFormSchema),
  });

  useEffect(() => {
    loadStep();
  }, [stepId]);

  const loadStep = async () => {
    try {
      setIsLoadingData(true);
      if (!stepId) return;

      const step = (await apiClient.getStep(parseInt(stepId))) as Step;
      setValue("stepNumber", step.stepNumber);
      setValue("title", step.title);
      setValue("instructions", step.instructions);
      if (step.expectedResult) setValue("expectedResult", step.expectedResult);
      if (step.notes) setValue("notes", step.notes);
      setValue("isOptional", step.isOptional || false);

      const relationshipsData = (await apiClient
        .getStepRelationships(parseInt(stepId))
        .catch(() => [])) as StepRelationship[];

      console.log("[loadStep] Relacionamentos carregados:", relationshipsData);

      if (relationshipsData.length > 0) {
        const converted = relationshipsData.map((rel: StepRelationship) => {
          const resourceName =
            rel.relatedObject?.name || "Recurso desconhecido";
          console.log(
            `[loadStep] Convertendo relacionamento: ${rel.relatedModel}(${rel.relatedId}) -> ${resourceName}`,
          );
          return {
            id: rel.relatedId,
            name: resourceName,
            type: rel.relatedModel as
              | "Link"
              | "EnvironmentVariable"
              | "ConfigurationItem"
              | "Account"
              | "Database"
              | "Repository",
          };
        });
        console.log("[loadStep] Recursos convertidos:", converted);
        setSelectedResources(converted);
        setOriginalSelectedResources(converted);
      }
    } catch (error: unknown) {
      console.error("Erro ao carregar passo:", error);
      toast.error("Erro ao carregar passo");
      navigate(`/processes/${id}`);
    } finally {
      setIsLoadingData(false);
    }
  };

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
      "[EditStep-uploadImages] USANDO REF:",
      uploadedImagesRef.current,
    );
    console.log(
      `[EditStep-uploadImages] Iniciando upload de ${uploadedImagesRef.current.length} imagem(ns) para Step ${stepId}`,
    );
    console.log(
      "[EditStep-uploadImages] uploadedImages (ref):",
      uploadedImagesRef.current,
    );

    const uploadPromises = uploadedImagesRef.current.map(async (image) => {
      if (!image.file) {
        console.warn("[EditStep-uploadImages] Imagem sem arquivo:", image.id);
        return;
      }

      try {
        console.log(
          `[EditStep-uploadImages] Iniciando upload: ${image.file.name}, Size: ${image.file.size} bytes, Caption: ${image.caption || "(vazio)"}`,
        );

        const uploadedAsset = await apiClient.uploadAsset(image.file, {
          requiredLevel: 10,
        });

        console.log(`[EditStep-uploadImages] Asset enviado com sucesso:`, {
          id: uploadedAsset.id,
          filename: uploadedAsset.filename,
          url: uploadedAsset.url,
        });

        console.log(
          `[EditStep-uploadImages] Criando StepAsset com stepId=${stepId}, assetId=${uploadedAsset.id}`,
        );

        await apiClient.createStepAsset({
          stepId,
          assetId: uploadedAsset.id,
          caption: image.caption || undefined,
        });

        console.log(`[EditStep-uploadImages] StepAsset criado com sucesso`);
      } catch (error) {
        const errorMsg = getErrorMessage(error);
        const filename = image.file?.name || "desconhecido";
        console.error(
          `[EditStep-uploadImages] Erro ao fazer upload de ${filename}: ${errorMsg}`,
          error,
        );
        toast.error(`Erro ao fazer upload de ${filename}: ${errorMsg}`);
        throw error;
      }
    });

    if (uploadPromises.length > 0) {
      console.log(
        `[EditStep-uploadImages] Aguardando ${uploadPromises.length} uploads...`,
      );
      await Promise.all(uploadPromises);
      console.log("[EditStep-uploadImages] Todos os uploads completados");
    } else {
      console.log(
        "[EditStep-uploadImages] Nenhuma imagem para fazer upload (length=0)",
      );
    }
  };

  const createRelationships = async (stepId: number): Promise<void> => {
    console.log("[createRelationships] Iniciando...");
    console.log(
      "[createRelationships] Recursos selecionados originalmente:",
      originalSelectedResources,
    );
    console.log(
      "[createRelationships] Recursos selecionados agora:",
      selectedResources,
    );

    const originalIds = new Set(originalSelectedResources.map((r) => r.id));

    const toAdd = selectedResources.filter((r) => !originalIds.has(r.id));
    console.log("[createRelationships] Recursos a adicionar:", toAdd);

    const addPromises = toAdd.map(async (resource) => {
      try {
        console.log(
          "[createRelationships] Enviando relacionamento:",
          JSON.stringify({
            stepId,
            relatedModel: resource.type,
            relatedId: resource.id,
            resourceName: resource.name,
          }),
        );
        await apiClient.createStepRelationship({
          stepId,
          relatedModel: resource.type,
          relatedId: resource.id,
        });
        console.log(
          "[createRelationships] Relacionamento criado com sucesso para:",
          resource.name,
        );
      } catch (error) {
        console.error(
          "[createRelationships] Erro ao criar relacionamento para:",
          resource.name,
          error,
        );
        toast.error(`Erro ao relacionar ${resource.name}`);
        throw error;
      }
    });

    if (addPromises.length > 0) {
      await Promise.all(addPromises);
    }

    const currentIds = new Set(selectedResources.map((r) => r.id));
    const toRemove = originalSelectedResources.filter(
      (r) => !currentIds.has(r.id),
    );
    console.log("[createRelationships] Recursos a remover:", toRemove);

    const deletePromises = toRemove.map(async (resource) => {
      try {
        console.log(
          `[createRelationships] Removendo relacionamento: ${resource.type}(${resource.id}) - ${resource.name}`,
        );
        const relationships = (await apiClient.getStepRelationships(
          stepId,
        )) as StepRelationship[];
        const relToDelete = relationships.find(
          (rel: StepRelationship) =>
            rel.relatedId === resource.id && rel.relatedModel === resource.type,
        );
        if (relToDelete) {
          console.log(
            `[createRelationships] Deletando relacionamento ID: ${relToDelete.id}`,
          );
          await apiClient.deleteStepRelationship(relToDelete.id);
        }
      } catch (error: unknown) {
        console.error("Erro ao deletar relacionamento:", error);
      }
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }
  };

  const onSubmit = async (data: StepFormData) => {
    if (!stepId) return;

    try {
      setIsLoading(true);

      console.log("[EditStep-onSubmit] ===== INICIANDO SUBMIT =====");
      console.log("[EditStep-onSubmit] FormData:", data);
      console.log(
        "[EditStep-onSubmit] uploadedImages (state):",
        uploadedImages,
      );
      console.log(
        "[EditStep-onSubmit] uploadedImages (ref):",
        uploadedImagesRef.current,
      );
      console.log(
        "[EditStep-onSubmit] uploadedImages.length (state):",
        uploadedImages.length,
      );
      console.log(
        "[EditStep-onSubmit] uploadedImages.length (ref):",
        uploadedImagesRef.current.length,
      );

      await apiClient.updateStep(parseInt(stepId), data);
      toast.success("Passo atualizado com sucesso!");

      if (uploadedImagesRef.current.length > 0) {
        console.log("[EditStep-onSubmit] Iniciando upload de imagens...");
        try {
          await uploadImages(parseInt(stepId));
          toast.success(
            `${uploadedImagesRef.current.length} imagem(ns) adicionada(s)!`,
          );
        } catch (error) {
          console.error("[EditStep-onSubmit] Erro no upload:", error);
        }
      } else {
        console.log(
          "[EditStep-onSubmit] Nenhuma imagem para fazer upload (ref.length=0)",
        );
      }

      try {
        await createRelationships(parseInt(stepId));
        const newCount =
          selectedResources.length - originalSelectedResources.length;
        if (newCount > 0) {
          toast.success(`${newCount} recurso(s) relacionado(s)!`);
        }
      } catch (error) {}

      navigate(`/processes/${id}`);
    } catch (error: unknown) {
      console.error("Erro ao atualizar passo:", error);
      let errorMessage = "Erro ao atualizar passo";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const errorObj = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = errorObj.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <PageContainer>
        <LoadingContainer>
          <h2>Carregando passo...</h2>
        </LoadingContainer>
      </PageContainer>
    );
  }

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
          <Title>Editar Passo</Title>
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
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </PageContainer>
    </motion.div>
  );
}
