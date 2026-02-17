import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { ImageCropModal } from "./ImageCropModal";

const SectionContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$lg",
});

const SectionTitle = styled("h3", {
  fontSize: "$base",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "& svg": {
    color: "$primaryColor",
  },
});

const DropZoneContainer = styled("div", {
  position: "relative",
  borderRadius: "$md",
  overflow: "hidden",
});

const DropZone = styled("div", {
  padding: "$2xl",
  border: "2px dashed $borderPrimary",
  borderRadius: "$md",
  backgroundColor: "$bgPrimary",
  cursor: "pointer",
  transition: "all $normal",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "$md",
  minHeight: "180px",
  textAlign: "center",

  variants: {
    isDragActive: {
      true: {
        borderColor: "$primaryColor",
        backgroundColor: "rgba(99, 102, 241, 0.05)",
        transform: "scale(1.02)",
      },
    },
  },

  "&:hover": {
    borderColor: "$primaryColor",
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
});

const UploadIcon = styled("div", {
  fontSize: "2.5rem",
  color: "$primaryColor",
});

const DropZoneText = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
});

const MainText = styled("p", {
  fontSize: "$base",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
});

const SubText = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  margin: 0,
});

const HiddenInput = styled("input", {
  display: "none",
});

const PreviewContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "$md",
});

const PreviewItem = styled(motion.div, {
  position: "relative",
  borderRadius: "$md",
  overflow: "hidden",
  border: "1px solid $borderPrimary",
  backgroundColor: "$bgPrimary",
  aspectRatio: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const PreviewImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const NoImagePlaceholder = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$bgSecondary",
  color: "$textSecondary",
});

const RemoveButton = styled("button", {
  position: "absolute",
  top: "$xs",
  right: "$xs",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#991b1b",
  border: "none",
  color: "$bgPrimary",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all $normal",
  opacity: 0,

  "&:hover": {
    backgroundColor: "#b91c1c",
    transform: "scale(1.1)",
  },
});

const PreviewItemWrapper = styled("div", {
  position: "relative",

  "&:hover": {
    [`${RemoveButton}`]: {
      opacity: 1,
    },
  },
});

const UploadingOverlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$bgPrimary",
  fontSize: "$xs",
  fontWeight: "$semibold",
});

const CaptionInput = styled("input", {
  padding: "$sm",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$sm",
  color: "$textPrimary",
  fontSize: "$xs",
  width: "100%",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
  },
});

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  caption?: string;
  isUploading?: boolean;
}

interface ImageUploadSectionProps {
  onImagesLoaded: (images: UploadedImage[]) => void;
  maxFiles?: number;
  onCropModalStateChange?: (isOpen: boolean) => void;
}

interface ImageToCrop {
  file: File;
  preview: string;
}

export function ImageUploadSection({
  onImagesLoaded,
  maxFiles = 5,
  onCropModalStateChange,
}: ImageUploadSectionProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<ImageToCrop | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSetImageToCrop = (image: ImageToCrop | null) => {
    setImageToCrop(image);
    if (onCropModalStateChange) {
      onCropModalStateChange(image !== null);
      console.log(
        `[ImageUploadSection] Modal state changed: ${image !== null ? "ABERTO" : "FECHADO"}`,
      );
    }
  };

  const handleFiles = useCallback(
    (files: FileList) => {
      const fileArray = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (fileArray.length === 0) {
        toast.error("Por favor, selecione apenas imagens");
        return;
      }

      if (images.length + fileArray.length > maxFiles) {
        toast.error(`Máximo de ${maxFiles} imagens permitidas`);
        return;
      }

      if (fileArray.length > 1) {
        toast.loading(
          "Processando uma imagem por vez. Você terá múltiplas oportunidades de crop.",
        );
      }

      const firstFile = fileArray[0];
      const preview = URL.createObjectURL(firstFile);
      handleSetImageToCrop({ file: firstFile, preview });

      if (fileArray.length > 1) {
        const remainingFiles = fileArray.slice(1);
        setTimeout(() => {
          handleFiles(
            Object.assign(new DataTransfer(), {
              items: remainingFiles.map((file) => {
                const dt = new DataTransfer();
                dt.items.add(file);
                return dt.items[0];
              }),
            }).files,
          );
        }, 500);
      }
    },
    [images, maxFiles],
  );

  const handleCropComplete = (croppedBlob: Blob) => {
    if (!imageToCrop) return;

    console.log("[ImageUploadSection] handleCropComplete chamado");
    console.log("[ImageUploadSection] Blob recebido:", {
      size: croppedBlob.size,
      type: croppedBlob.type,
    });

    const croppedFile = new File([croppedBlob], imageToCrop.file.name, {
      type: imageToCrop.file.type || "image/jpeg",
    });

    console.log("[ImageUploadSection] File criado:", {
      name: croppedFile.name,
      size: croppedFile.size,
      type: croppedFile.type,
    });

    const croppedPreview = URL.createObjectURL(croppedBlob);

    const newImage: UploadedImage = {
      id: Math.random().toString(36).substr(2, 9),
      file: croppedFile,
      preview: croppedPreview,
      isUploading: false,
    };

    console.log("[ImageUploadSection] Imagem adicionada à lista:", newImage.id);
    console.log("[ImageUploadSection] Imagem completa:", newImage);

    const updatedImages = [...images, newImage];
    console.log("[ImageUploadSection] updatedImages array:", updatedImages);
    console.log(
      "[ImageUploadSection] updatedImages.length:",
      updatedImages.length,
    );

    setImages(updatedImages);

    console.log(
      "[ImageUploadSection] Chamando onImagesLoaded com:",
      updatedImages.length,
      "imagens",
    );
    console.log(
      "[ImageUploadSection] Dados enviados a onImagesLoaded:",
      updatedImages,
    );
    onImagesLoaded(updatedImages);

    handleSetImageToCrop(null);

    toast.success("Imagem croppada com sucesso!");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesLoaded(updatedImages);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, caption } : img,
    );
    setImages(updatedImages);
    onImagesLoaded(updatedImages);
  };

  return (
    <>
      <SectionContainer>
        <SectionTitle>
          <FiImage size={18} />
          Imagens do Passo
        </SectionTitle>

        <DropZoneContainer
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <DropZone
            isDragActive={isDragActive}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon>
              <FiUpload size={40} />
            </UploadIcon>
            <DropZoneText>
              <MainText>Arraste as imagens aqui ou clique</MainText>
              <SubText>
                PNG, JPG, GIF até 10MB. Máximo {maxFiles} imagens.
              </SubText>
              <SubText
                style={{
                  color: "var(--colors-primaryColor)",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
                ⚠️ Você precisará fazer crop em proporção 4:3 para cada imagem
              </SubText>
            </DropZoneText>
          </DropZone>
          <HiddenInput
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
          />
        </DropZoneContainer>

        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PreviewContainer>
                {images.map((image) => (
                  <PreviewItemWrapper key={image.id}>
                    <PreviewItem
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {image.preview ? (
                        <>
                          <PreviewImage
                            src={image.preview}
                            alt={image.caption || "Preview"}
                          />
                          {image.isUploading && (
                            <UploadingOverlay>Enviando...</UploadingOverlay>
                          )}
                          <RemoveButton
                            type="button"
                            onClick={() => handleRemove(image.id)}
                            title="Remover imagem"
                          >
                            <FiX size={16} />
                          </RemoveButton>
                        </>
                      ) : (
                        <NoImagePlaceholder>
                          <FiImage size={24} />
                        </NoImagePlaceholder>
                      )}
                    </PreviewItem>
                    <CaptionInput
                      type="text"
                      placeholder="Legenda (opcional)"
                      value={image.caption || ""}
                      onChange={(e) =>
                        handleCaptionChange(image.id, e.target.value)
                      }
                    />
                  </PreviewItemWrapper>
                ))}
              </PreviewContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionContainer>

      <AnimatePresence>
        {imageToCrop && (
          <ImageCropModal
            imageSrc={imageToCrop.preview}
            imageFile={imageToCrop.file}
            onCropComplete={handleCropComplete}
            onCancel={() => handleSetImageToCrop(null)}
            aspectRatio={4 / 3}
          />
        )}
      </AnimatePresence>
    </>
  );
}
