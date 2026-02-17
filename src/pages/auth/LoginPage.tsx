import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { styled } from "../../assets/styles/themes/stitches.config";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.svg";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const PageContainer = styled("div", {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "$bgPrimary",
  padding: "$lg",

  "@xs": {
    padding: "$md",
  },
});

const LoginCard = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "2px solid $borderAccent",
  borderRadius: "$lg",
  padding: "$3xl",
  width: "100%",
  maxWidth: "400px",
  boxShadow:
    "0 20px 50px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  position: "relative",
  overflow: "hidden",

  "@xs": {
    padding: "$xl",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor:
      "linear-gradient(90deg, transparent, $borderAccent, transparent)",
    pointerEvents: "none",
  },
});

const LogoImage = styled("img", {
  width: "300px",
  marginBottom: "$sm",
});

const Subtitle = styled("p", {
  fontSize: "$sm",
  color: "$textSecondary",
  textAlign: "center",
  marginBottom: "$2xl",
  fontWeight: "$normal",
  letterSpacing: "0.5px",
});

const FormGroup = styled("div", {
  marginBottom: "$lg",

  "&:last-of-type": {
    marginBottom: "$xl",
  },
});

const Label = styled("label", {
  display: "block",
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  marginBottom: "$sm",
});

const Input = styled("input", {
  width: "100%",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "$bgTertiary",
  border: "1.5px solid $borderSecondary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow:
      "0 0 0 3px rgba(14, 165, 233, 0.15), inset 0 1px 2px rgba(14, 165, 233, 0.05)",
    backgroundColor: "$bgSecondary",
  },

  "&::placeholder": {
    color: "$textMuted",
  },
});

const SubmitButton = styled("button", {
  width: "100%",
  paddingTop: "$md",
  paddingBottom: "$md",
  paddingLeft: "$lg",
  paddingRight: "$lg",
  background: "linear-gradient(135deg, $primaryColor 0%, $borderAccent 100%)",
  color: "$bgPrimary",
  border: "none",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
  cursor: "pointer",
  transition: "all $normal",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    backgroundColor:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left $normal",
  },

  "&:hover": {
    boxShadow:
      "0 10px 30px rgba(14, 165, 233, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3)",
    transform: "translateY(-2px)",

    "&::before": {
      left: "100%",
    },
  },

  "&:active": {
    transform: "translateY(0)",
  },

  "&:disabled": {
    opacity: "0.5",
    cursor: "not-allowed",
    transform: "none",
  },
});

const LinkContainer = styled("div", {
  textAlign: "center",
  fontSize: "$sm",
  color: "$textSecondary",
  marginTop: "$lg",
  paddingTop: "$lg",
  borderTop: "1px solid $borderSecondary",

  "& a": {
    background: "linear-gradient(135deg, $primaryColor 0%, $borderAccent 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textDecoration: "none",
    fontWeight: "$semibold",
    transition: "all $normal",

    "&:hover": {
      textDecoration: "underline",
      opacity: 0.8,
    },
  },
});

const ErrorMessage = styled("span", {
  display: "block",
  fontSize: "$xs",
  color: "$errorColor",
  marginTop: "$xs",
  fontWeight: "$medium",
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao fazer login";
      toast.error(message);
    }
  };

  return (
    <PageContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <LogoImage src={logo} alt="Path Link Logo" />
        </div>
        <Subtitle>Sistema de Documentação para TI</Subtitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </SubmitButton>
        </form>

        <LinkContainer>
          Não tem conta? <Link to="/register">Crie uma agora</Link>
        </LinkContainer>
      </LoginCard>
    </PageContainer>
  );
};
