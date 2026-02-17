import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { CreateProcessForm } from "@/components/forms/CreateProcessForm";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PageContainer = styled("div", {
  padding: "$spacing-xl",
  maxWidth: "800px",
  margin: "0 auto",
});

const BackButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$spacing-sm",
  background: "none",
  border: "none",
  color: "$text-primary",
  fontSize: "1rem",
  cursor: "pointer",
  marginBottom: "$spacing-lg",
  padding: 0,
  transition: "color 0.2s",

  "&:hover": {
    color: "$primary",
  },
});

export function CreateProcessPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <BackButton onClick={() => navigate("/processes")}>
          <FaArrowLeft size={18} />
          Voltar
        </BackButton>

        <CreateProcessForm />
      </PageContainer>
    </motion.div>
  );
}
