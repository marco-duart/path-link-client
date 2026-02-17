import React from "react";
import { styled } from "../../assets/styles/themes/stitches.config";
import { motion } from "framer-motion";

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: "success" | "warning" | "error";
}

const CardContainer = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  overflow: "hidden",
  transition: "all $normal",
  display: "flex",
  flexDirection: "column",

  variants: {
    hoverable: {
      true: {
        cursor: "pointer",

        "&:hover": {
          borderColor: "$primaryColor",
          boxShadow: "$lg",
          transform: "translateY(-4px)",
        },
      },
    },
    variant: {
      success: {
        borderColor: "$successColor",

        "&:hover": {
          borderColor: "$successColor",
          boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.1)",
        },
      },
      warning: {
        borderColor: "$warningColor",

        "&:hover": {
          borderColor: "$warningColor",
          boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.1)",
        },
      },
      error: {
        borderColor: "$errorColor",

        "&:hover": {
          borderColor: "$errorColor",
          boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.1)",
        },
      },
    },
  },
});

const CardHeader = styled("div", {
  paddingLeft: "$lg",
  paddingRight: "$lg",
  paddingTop: "$md",
  paddingBottom: "$md",
  borderBottom: "1px solid $borderPrimary",

  variants: {
    isEmpty: {
      true: {
        display: "none",
      },
    },
  },
});

const CardTitle = styled("h3", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
  marginBottom: "$xs",
});

const CardSubtitle = styled("p", {
  fontSize: "$sm",
  color: "$textSecondary",
  margin: 0,
});

const CardContent = styled("div", {
  paddingLeft: "$lg",
  paddingRight: "$lg",
  paddingTop: "$lg",
  paddingBottom: "$lg",
  flex: 1,
});

const CardFooter = styled("div", {
  paddingLeft: "$lg",
  paddingRight: "$lg",
  paddingTop: "$md",
  paddingBottom: "$md",
  borderTop: "1px solid $borderPrimary",
  display: "flex",
  gap: "$md",
  justifyContent: "flex-end",
});

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  hoverable = false,
  onClick,
  variant = "default",
}) => {
  const showHeader = title || subtitle;

  const cardProps: any = {
    hoverable,
    onClick,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  if (variant) {
    cardProps.variant = variant;
  }

  return (
    <CardContainer {...cardProps}>
      {showHeader && (
        <CardHeader isEmpty={!showHeader}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}

      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};
