import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { styled } from "@/assets/styles/themes/stitches.config";
import { ConditionalRender } from "@/components/ConditionalRender";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { Process, Step } from "@/types";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiCheckCircle,
  FiFile,
  FiLink,
  FiKey,
  FiDatabase,
  FiGitBranch,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1400px",
  margin: "0 auto",
  minHeight: "100vh",
  background: "linear-gradient(135deg, $bgPrimary 0%, $bgSecondary 100%)",
});

const Header = styled("div", {
  marginBottom: "$2xl",
});

const BackButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  padding: "$md $lg",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  cursor: "pointer",
  transition: "all $normal",
  fontSize: "$sm",
  marginBottom: "$lg",

  "&:hover": {
    backgroundColor: "$borderPrimary",
    transform: "translateX(-4px)",
  },
});

const HeaderContent = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "$lg",

  "@xs": {
    flexDirection: "column",
  },
});

const TitleSection = styled("div", {
  flex: 1,
});

const Title = styled("h1", {
  fontSize: "2.5rem",
  fontWeight: 800,
  color: "$textPrimary",
  margin: 0,
  marginBottom: "$md",
  background: "linear-gradient(135deg, $primaryColor, $borderAccent)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

const Description = styled("p", {
  fontSize: "$base",
  color: "$textSecondary",
  margin: 0,
  lineHeight: "1.6",
  maxWidth: "600px",
});

const StatsBar = styled("div", {
  display: "flex",
  gap: "$md",
  marginTop: "$lg",

  "@xs": {
    flexWrap: "wrap",
  },
});

const StatCard = styled("div", {
  padding: "$md $lg",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  fontSize: "$sm",

  "& strong": {
    color: "$primaryColor",
  },
});

const ActionButtons = styled("div", {
  display: "flex",
  gap: "$md",
  flexWrap: "wrap",
  marginTop: "$lg",

  "@xs": {
    width: "100%",
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
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primaryColor",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "$borderAccent",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
        },
      },
      secondary: {
        backgroundColor: "$bgSecondary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",

        "&:hover": {
          backgroundColor: "$borderPrimary",
        },
      },
    },
  },
});

const TimelineContainer = styled("div", {
  position: "relative",
  paddingLeft: "$4xl",

  "&::before": {
    content: '""',
    position: "absolute",
    left: "15px",
    top: 0,
    bottom: 0,
    width: "2px",
    background: "linear-gradient(180deg, $primaryColor, transparent)",
  },
});

const TimelineItem = styled(motion.div, {
  marginBottom: "$2xl",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    left: "-35px",
    top: "24px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "$bgSecondary",
    border: "3px solid $primaryColor",
    transition: "all $normal",
  },
});

const StepCard = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  overflow: "hidden",
  transition: "all $normal",

  "&:hover": {
    borderColor: "$primaryColor",
    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.15)",
  },
});

const StepHeader = styled("div", {
  padding: "$lg",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "linear-gradient(135deg, $bgPrimary, $bgSecondary)",
  borderBottom: "1px solid $borderPrimary",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$borderPrimary",
  },

  "@xs": {
    flexWrap: "wrap",
  },
});

const StepTitle = styled("div", {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "$md",
});

const StepNumber = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "$primaryColor",
  color: "$bgPrimary",
  fontWeight: 800,
  fontSize: "$lg",
  marginRight: "$md",
});

const StepName = styled("h3", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: "0 0 $xs 0",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "& svg": {
    color: "$primaryColor",
  },
});

const StepMeta = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  margin: 0,
});

const ExpandIcon = styled("div", {
  color: "$textSecondary",
  transition: "transform $normal",

  variants: {
    expanded: {
      true: {
        transform: "rotate(180deg)",
      },
    },
  },
});

const StepContent = styled(motion.div, {
  padding: "$lg",
  borderTop: "1px solid $borderPrimary",
});

const StepContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$xl",
  alignItems: "start",

  "@md": {
    gridTemplateColumns: "1fr",
    gap: "$lg",
  },
});

const StepMediaColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
});

const StepDetailsColumn = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$lg",
});

const StepSection = styled("div", {
  marginBottom: "$lg",

  "&:last-child": {
    marginBottom: 0,
  },
});

const SectionTitle = styled("h4", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textSecondary",
  marginBottom: "$md",
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const Instructions = styled("div", {
  fontSize: "$sm",
  color: "$textPrimary",
  lineHeight: "1.6",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  borderRadius: "$md",
  border: "1px solid $borderPrimary",
});

const ExpectedResult = styled("div", {
  padding: "$md",
  backgroundColor: "$bgPrimary",
  borderLeft: "4px solid $primaryColor",
  borderRadius: "$md",
  fontSize: "$sm",
  color: "$textPrimary",
  lineHeight: "1.6",
});

const AssetGalleryContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  backgroundColor: "$bgPrimary",
  padding: "$lg",
  borderRadius: "$lg",
  border: "1px solid $borderPrimary",
});

const AssetMainImage = styled("div", {
  borderRadius: "$md",
  overflow: "hidden",
  border: "1px solid $borderPrimary",
  aspectRatio: "4 / 3",
  backgroundColor: "$bgSecondary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const AssetThumbnailsRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
  gap: "$sm",
});

const AssetThumbnail = styled("div", {
  borderRadius: "$md",
  overflow: "hidden",
  border: "2px solid $borderPrimary",
  aspectRatio: "1",
  backgroundColor: "$bgSecondary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all $normal",

  "&:hover": {
    borderColor: "$primaryColor",
    transform: "scale(1.05)",
  },

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const RelatedResourcesContainer = styled("div", {
  marginTop: "$md",
});

const RelatedResourcesGrid = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$sm",
});

const RelatedResourceTag = styled("div", {
  padding: "$sm $md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  fontSize: "$xs",
  color: "$textSecondary",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "& svg": {
    color: "$primaryColor",
  },
});

const StepActions = styled("div", {
  display: "flex",
  gap: "$sm",
  marginTop: "$lg",
  paddingTop: "$lg",
  borderTop: "1px solid $borderPrimary",
});

const ActionButton = styled("button", {
  flex: 1,
  padding: "$md",
  borderRadius: "$md",
  border: "none",
  cursor: "pointer",
  transition: "all $normal",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  fontSize: "$sm",
  fontWeight: "$semibold",

  variants: {
    variant: {
      edit: {
        backgroundColor: "$bgPrimary",
        border: "1px solid $primaryColor",
        color: "$primaryColor",

        "&:hover": {
          backgroundColor: "$primaryColor",
          color: "$bgPrimary",
        },
      },
      delete: {
        backgroundColor: "#6b2121",
        border: "1px solid #991b1b",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "#991b1b",
        },
      },
    },
  },
});

const EmptyState = styled("div", {
  textAlign: "center",
  padding: "$4xl $lg",
  color: "$textMuted",

  "& h3": {
    fontSize: "$lg",
    marginBottom: "$md",
  },
});

const LoadingContainer = styled("div", {
  padding: "$4xl",
  textAlign: "center",
  color: "$textMuted",
});

export function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canAccess } = usePermission();
  const [process, setProcess] = useState<Process | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [stepAssets, setStepAssets] = useState<Map<number, any[]>>(new Map());
  const [stepRelationships, setStepRelationships] = useState<
    Map<number, any[]>
  >(new Map());
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<
    Map<number, number>
  >(new Map());

  useEffect(() => {
    if (id) {
      loadProcess();
    }
  }, [id]);

  const loadProcess = async () => {
    try {
      setLoading(true);
      const processData = await apiClient.getProcess(id!);
      setProcess(processData as Process);

      const stepsData = await apiClient.getSteps(id!);
      setSteps(Array.isArray(stepsData) ? stepsData : []);
    } catch (error) {
      console.error("Erro ao carregar processo:", error);
      toast.error("Erro ao carregar processo");
      navigate("/processes");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
      loadStepAssets(stepId);
      loadStepRelationships(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const loadStepAssets = async (stepId: number) => {
    try {
      console.log(`[loadStepAssets] Carregando assets para passo ${stepId}`);
      const assets = await apiClient.getStepAssets(stepId);
      console.log(
        `[loadStepAssets] ${assets.length} asset(s) carregado(s):`,
        assets,
      );
      setStepAssets((prev) =>
        new Map(prev).set(stepId, Array.isArray(assets) ? assets : []),
      );
    } catch (error) {
      console.error(`[loadStepAssets] Erro ao carregar assets: ${error}`);
    }
  };

  const loadStepRelationships = async (stepId: number) => {
    try {
      const relationships = await apiClient.getStepRelationships(stepId);
      setStepRelationships((prev) =>
        new Map(prev).set(
          stepId,
          Array.isArray(relationships) ? relationships : [],
        ),
      );
    } catch (error) {
      console.error("Erro ao carregar relacionamentos do passo:", error);
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este passo?")) {
      return;
    }

    try {
      await apiClient.deleteStep(stepId);
      toast.success("Passo deletado com sucesso");
      loadProcess();
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar passo");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <h2>Carregando processo...</h2>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!process) {
    return (
      <PageContainer>
        <EmptyState>
          <h3>Processo não encontrado</h3>
          <Button variant="secondary" onClick={() => navigate("/processes")}>
            <FiArrowLeft size={16} />
            Voltar
          </Button>
        </EmptyState>
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
          <BackButton onClick={() => navigate("/processes")}>
            <FiArrowLeft size={18} />
            Voltar para Processos
          </BackButton>

          <HeaderContent>
            <TitleSection>
              <Title>{process.name}</Title>
              {process.description && (
                <Description>{process.description}</Description>
              )}
            </TitleSection>
          </HeaderContent>

          <StatsBar>
            <StatCard>
              <FiCheckCircle size={16} />
              <span>
                <strong>{steps.length}</strong> passo
                {steps.length !== 1 ? "s" : ""}
              </span>
            </StatCard>
            <StatCard>
              <span>
                Categoria: <strong>{process.category}</strong>
              </span>
            </StatCard>
            <StatCard>
              <span>
                Status:{" "}
                <strong>{process.isActive ? "Ativo" : "Inativo"}</strong>
              </span>
            </StatCard>
          </StatsBar>

          <ActionButtons>
            <ConditionalRender requiredLevel={30}>
              <Button
                variant="primary"
                onClick={() => navigate(`/processes/${id}/steps/new`)}
              >
                <FiPlus size={18} />
                Novo Passo
              </Button>
            </ConditionalRender>
            <ConditionalRender requiredLevel={30}>
              <Button
                variant="secondary"
                onClick={() => navigate(`/processes/${id}/edit`)}
              >
                <FiEdit2 size={18} />
                Editar Processo
              </Button>
            </ConditionalRender>
          </ActionButtons>
        </Header>

        {steps.length === 0 ? (
          <EmptyState>
            <h3>Nenhum passo cadastrado</h3>
            <p>Comece criando o primeiro passo do seu processo</p>
            <ConditionalRender requiredLevel={30}>
              <Button
                variant="primary"
                onClick={() => navigate(`/processes/${id}/steps/new`)}
              >
                <FiPlus size={18} />
                Criar Primeiro Passo
              </Button>
            </ConditionalRender>
          </EmptyState>
        ) : (
          <TimelineContainer>
            {steps.map((step, index) => (
              <TimelineItem
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StepCard>
                  <StepHeader onClick={() => toggleStep(step.id)}>
                    <StepTitle>
                      <StepNumber>{index + 1}</StepNumber>
                      <div>
                        <StepName>
                          <FiCheckCircle size={18} />
                          {(step as any).title ||
                            (step as any).name ||
                            "Passo sem título"}
                        </StepName>
                        <StepMeta>
                          {(step as any).description &&
                            `${(step as any).description.substring(0, 50)}...`}
                        </StepMeta>
                      </div>
                    </StepTitle>
                    <ExpandIcon expanded={expandedSteps.has(step.id)}>
                      {expandedSteps.has(step.id) ? (
                        <FiChevronUp size={20} />
                      ) : (
                        <FiChevronDown size={20} />
                      )}
                    </ExpandIcon>
                  </StepHeader>

                  {expandedSteps.has(step.id) && (
                    <StepContent
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {stepAssets.get(step.id) &&
                      stepAssets.get(step.id)!.length > 0 ? (
                        <>
                          <StepContentWrapper>
                            <StepMediaColumn>
                              <AssetGalleryContainer>
                                {stepAssets.get(step.id) &&
                                  stepAssets.get(step.id)!.length > 0 && (
                                    <>
                                      <AssetMainImage>
                                        {(() => {
                                          const selectedIdx =
                                            selectedAssetIndex.get(step.id) ||
                                            0;
                                          const stepAsset = stepAssets.get(
                                            step.id,
                                          )![selectedIdx];
                                          const asset =
                                            stepAsset.asset || stepAsset;
                                          const imageUrl =
                                            asset.url ||
                                            asset.assetFilePath ||
                                            asset.filename;

                                          return imageUrl && imageUrl.trim() ? (
                                            <img
                                              src={
                                                imageUrl.startsWith("/uploads")
                                                  ? imageUrl
                                                  : `/uploads/${imageUrl}`
                                              }
                                              alt={
                                                stepAsset.caption ||
                                                "Imagem do passo"
                                              }
                                              onError={(e) => {
                                                console.error(
                                                  `[AssetMainRender] Erro ao carregar imagem: ${imageUrl}`,
                                                  e,
                                                );
                                              }}
                                              onLoad={() => {
                                                console.log(
                                                  `[AssetMainRender] Imagem carregada com sucesso: ${imageUrl}`,
                                                );
                                              }}
                                            />
                                          ) : (
                                            <FiFile
                                              size={48}
                                              color="var(--colors-textSecondary)"
                                            />
                                          );
                                        })()}
                                      </AssetMainImage>

                                      {stepAssets.get(step.id)!.length > 1 && (
                                        <AssetThumbnailsRow>
                                          {stepAssets
                                            .get(step.id)!
                                            .map(
                                              (stepAsset: any, idx: number) => {
                                                const asset =
                                                  stepAsset.asset || stepAsset;
                                                const imageUrl =
                                                  asset.url ||
                                                  asset.assetFilePath ||
                                                  asset.filename;
                                                const isSelected =
                                                  (selectedAssetIndex.get(
                                                    step.id,
                                                  ) || 0) === idx;

                                                return (
                                                  <AssetThumbnail
                                                    key={stepAsset.id}
                                                    title={
                                                      stepAsset.caption ||
                                                      "Imagem"
                                                    }
                                                    onClick={() => {
                                                      const newSelected =
                                                        new Map(
                                                          selectedAssetIndex,
                                                        );
                                                      newSelected.set(
                                                        step.id,
                                                        idx,
                                                      );
                                                      setSelectedAssetIndex(
                                                        newSelected,
                                                      );
                                                    }}
                                                    style={{
                                                      borderColor: isSelected
                                                        ? "var(--colors-primaryColor)"
                                                        : undefined,
                                                      boxShadow: isSelected
                                                        ? "0 0 0 1px var(--colors-primaryColor)"
                                                        : undefined,
                                                    }}
                                                  >
                                                    {imageUrl &&
                                                    imageUrl.trim() ? (
                                                      <img
                                                        src={
                                                          imageUrl.startsWith(
                                                            "/uploads",
                                                          )
                                                            ? imageUrl
                                                            : `/uploads/${imageUrl}`
                                                        }
                                                        alt={
                                                          stepAsset.caption ||
                                                          "Imagem"
                                                        }
                                                        onError={(e) => {
                                                          console.error(
                                                            `[AssetThumbRender] Erro ao carregar thumbnail: ${imageUrl}`,
                                                            e,
                                                          );
                                                        }}
                                                      />
                                                    ) : (
                                                      <FiFile
                                                        size={20}
                                                        color="var(--colors-textSecondary)"
                                                      />
                                                    )}
                                                  </AssetThumbnail>
                                                );
                                              },
                                            )}
                                        </AssetThumbnailsRow>
                                      )}
                                    </>
                                  )}
                              </AssetGalleryContainer>
                            </StepMediaColumn>

                            <StepDetailsColumn>
                              {(step as any).instructions && (
                                <StepSection>
                                  <SectionTitle>📝 Instruções</SectionTitle>
                                  <Instructions>
                                    {(step as any).instructions}
                                  </Instructions>
                                </StepSection>
                              )}

                              {(step as any).expectedResult && (
                                <StepSection>
                                  <SectionTitle>
                                    ✅ Resultado Esperado
                                  </SectionTitle>
                                  <ExpectedResult>
                                    {(step as any).expectedResult}
                                  </ExpectedResult>
                                </StepSection>
                              )}

                              {(step as any).notes && (
                                <StepSection>
                                  <SectionTitle>📌 Notas</SectionTitle>
                                  <Instructions>
                                    {(step as any).notes}
                                  </Instructions>
                                </StepSection>
                              )}
                            </StepDetailsColumn>
                          </StepContentWrapper>

                          {stepRelationships.get(step.id) &&
                            stepRelationships.get(step.id)!.length > 0 && (
                              <StepSection style={{ marginTop: "$xl" }}>
                                <RelatedResourcesContainer>
                                  <SectionTitle>
                                    🔗 Recursos Vinculados
                                  </SectionTitle>
                                  <RelatedResourcesGrid>
                                    {stepRelationships
                                      .get(step.id)!
                                      .map((relationship: any) => (
                                        <RelatedResourceTag
                                          key={`${relationship.relatedModel}-${relationship.relatedId}`}
                                        >
                                          {relationship.relatedModel ===
                                            "Link" && <FiLink size={12} />}
                                          {relationship.relatedModel ===
                                            "EnvironmentVariable" && (
                                            <FiKey size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Database" && (
                                            <FiDatabase size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Repository" && (
                                            <FiGitBranch size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Account" && <FiUser size={12} />}
                                          {relationship.relatedModel ===
                                            "ConfigurationItem" && (
                                            <FiSettings size={12} />
                                          )}
                                          {relationship.relatedObject?.name ||
                                            relationship.relatedModel}
                                        </RelatedResourceTag>
                                      ))}
                                  </RelatedResourcesGrid>
                                </RelatedResourcesContainer>
                              </StepSection>
                            )}
                        </>
                      ) : (
                        <>
                          {(step as any).instructions && (
                            <StepSection>
                              <SectionTitle>📝 Instruções</SectionTitle>
                              <Instructions>
                                {(step as any).instructions}
                              </Instructions>
                            </StepSection>
                          )}

                          {(step as any).expectedResult && (
                            <StepSection>
                              <SectionTitle>✅ Resultado Esperado</SectionTitle>
                              <ExpectedResult>
                                {(step as any).expectedResult}
                              </ExpectedResult>
                            </StepSection>
                          )}

                          {(step as any).notes && (
                            <StepSection>
                              <SectionTitle>📌 Notas</SectionTitle>
                              <Instructions>{(step as any).notes}</Instructions>
                            </StepSection>
                          )}

                          {stepRelationships.get(step.id) &&
                            stepRelationships.get(step.id)!.length > 0 && (
                              <StepSection>
                                <RelatedResourcesContainer>
                                  <SectionTitle>
                                    🔗 Recursos Vinculados
                                  </SectionTitle>
                                  <RelatedResourcesGrid>
                                    {stepRelationships
                                      .get(step.id)!
                                      .map((relationship: any) => (
                                        <RelatedResourceTag
                                          key={`${relationship.relatedModel}-${relationship.relatedId}`}
                                        >
                                          {relationship.relatedModel ===
                                            "Link" && <FiLink size={12} />}
                                          {relationship.relatedModel ===
                                            "EnvironmentVariable" && (
                                            <FiKey size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Database" && (
                                            <FiDatabase size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Repository" && (
                                            <FiGitBranch size={12} />
                                          )}
                                          {relationship.relatedModel ===
                                            "Account" && <FiUser size={12} />}
                                          {relationship.relatedModel ===
                                            "ConfigurationItem" && (
                                            <FiSettings size={12} />
                                          )}
                                          {relationship.relatedObject?.name ||
                                            relationship.relatedModel}
                                        </RelatedResourceTag>
                                      ))}
                                  </RelatedResourcesGrid>
                                </RelatedResourcesContainer>
                              </StepSection>
                            )}
                        </>
                      )}

                      <ConditionalRender requiredLevel={30}>
                        <StepActions>
                          <ActionButton
                            variant="edit"
                            onClick={() =>
                              navigate(`/processes/${id}/steps/${step.id}/edit`)
                            }
                          >
                            <FiEdit2 size={16} />
                            Editar
                          </ActionButton>
                          {canAccess(50) && (
                            <ActionButton
                              variant="delete"
                              onClick={() => handleDeleteStep(step.id)}
                            >
                              <FiTrash2 size={16} />
                              Deletar
                            </ActionButton>
                          )}
                        </StepActions>
                      </ConditionalRender>
                    </StepContent>
                  )}
                </StepCard>
              </TimelineItem>
            ))}
          </TimelineContainer>
        )}
      </PageContainer>
    </motion.div>
  );
}
