import { useState } from "react";
import ReactEasyCrop, { type Area, type Point } from "react-easy-crop";
import { styled } from "@/assets/styles/themes/stitches.config";
import { motion } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  pointerEvents: "auto",
});

const Modal = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  borderRadius: "$lg",
  border: "1px solid $borderPrimary",
  width: "90%",
  maxWidth: "720px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pointerEvents: "auto",
});

const Header = styled("div", {
  padding: "$lg",
  borderBottom: "1px solid $borderPrimary",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Title = styled("h2", {
  margin: 0,
  fontSize: "$lg",
  color: "$textPrimary",
  fontWeight: "$semibold",
});

const CloseButton = styled("button", {
  background: "none",
  border: "none",
  color: "$textSecondary",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "$sm",
  transition: "all $normal",

  "&:hover": {
    color: "$textPrimary",
  },
});

const CropContainer = styled("div", {
  flex: 1,
  position: "relative",
  minHeight: "400px",
  backgroundColor: "$bgPrimary",

  "& .reactEasyCrop_Container": {
    backgroundColor: "$bgPrimary !important",
  },

  "& .reactEasyCrop_Image": {
    maxWidth: "100%",
  },
});

const Controls = styled("div", {
  padding: "$lg",
  borderTop: "1px solid $borderPrimary",
  display: "flex",
  gap: "$md",
  justifyContent: "flex-end",
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
});

const InfoText = styled("p", {
  margin: "0 0 $md 0",
  fontSize: "$xs",
  color: "$textSecondary",
  fontStyle: "italic",
});

interface ImageCropModalProps {
  imageSrc: string;
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropModal({
  imageSrc,
  imageFile,
  onCropComplete,
  onCancel,
  aspectRatio = 4 / 3,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      console.log("[ImageCropModal] Iniciando crop...");

      const image = new Image();
      image.src = imageSrc;

      await new Promise((resolve) => {
        image.onload = () => {
          console.log("[ImageCropModal] Imagem carregada");
          resolve(null);
        };
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Não foi possível obter contexto 2D do canvas");
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      console.log(
        `[ImageCropModal] Canvas criado: ${canvas.width}x${canvas.height}`,
      );

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      console.log("[ImageCropModal] Imagem desenhada no canvas");

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(
                `[ImageCropModal] Blob criado com tamanho: ${blob.size} bytes`,
              );
              resolve(blob);
            } else {
              reject(new Error("Canvas.toBlob retornou null"));
            }
          },
          imageFile.type || "image/jpeg",
          0.9,
        );
      });

      console.log("[ImageCropModal] Chamando onCropComplete com blob");
      onCropComplete(blob);
    } catch (error) {
      console.error("[ImageCropModal] Erro ao fazer crop:", error);
    }
  };

  const handleConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(
      "[ImageCropModal] Botão Confirmar clicado - blocando propagação",
    );
    e.stopPropagation();
    e.preventDefault();
    handleCropComplete();
  };

  return (
    <Overlay
      onClick={(e) => {
        console.log("[ImageCropModal] Overlay clicado - fechando modal");
        e.stopPropagation();
        onCancel();
      }}
    >
      <Modal
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Header>
          <Title>Ajustar Imagem</Title>
          <CloseButton onClick={onCancel}>
            <FiX size={24} />
          </CloseButton>
        </Header>

        <CropContainer>
          <ReactEasyCrop
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape="rect"
            showGrid
            onCropChange={setCrop}
            onCropComplete={(_croppedArea, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        </CropContainer>

        <Controls>
          <InfoText style={{ margin: 0, flex: 1 }}>
            Proporção: 4:3 • Faça zoom e arraste para ajustar
          </InfoText>
          <Button
            as="button"
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onCancel();
            }}
          >
            <FiX size={18} />
            Cancelar
          </Button>
          <Button
            as="button"
            type="button"
            variant="primary"
            onClick={handleConfirmClick}
          >
            <FiCheck size={18} />
            Confirmar
          </Button>
        </Controls>
      </Modal>
    </Overlay>
  );
}
