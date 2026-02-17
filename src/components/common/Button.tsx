import React from "react";
import { styled } from "../../assets/styles/themes/stitches.config";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  border: "1px solid",
  borderRadius: "$md",
  fontWeight: "$semibold",
  cursor: "pointer",
  transition: "all $normal",
  whiteSpace: "nowrap",

  "&:disabled": {
    opacity: "0.5",
    cursor: "not-allowed",
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primaryColor",
        color: "$bgPrimary",
        borderColor: "$primaryColor",

        "&:hover:not(:disabled)": {
          backgroundColor: "$borderAccent",
          borderColor: "$borderAccent",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 20px rgba(14, 165, 233, 0.3)",
        },

        "&:active:not(:disabled)": {
          transform: "translateY(0)",
        },
      },
      secondary: {
        backgroundColor: "$secondaryColor",
        color: "$bgPrimary",
        borderColor: "$secondaryColor",

        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(139, 92, 246, 0.8)",
          borderColor: "rgba(139, 92, 246, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)",
        },

        "&:active:not(:disabled)": {
          transform: "translateY(0)",
        },
      },
      success: {
        backgroundColor: "$successColor",
        color: "$bgPrimary",
        borderColor: "$successColor",

        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
        },

        "&:active:not(:disabled)": {
          transform: "translateY(0)",
        },
      },
      warning: {
        backgroundColor: "$warningColor",
        color: "$bgPrimary",
        borderColor: "$warningColor",

        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(245, 158, 11, 0.8)",
          borderColor: "rgba(245, 158, 11, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 20px rgba(245, 158, 11, 0.3)",
        },

        "&:active:not(:disabled)": {
          transform: "translateY(0)",
        },
      },
      error: {
        backgroundColor: "$errorColor",
        color: "#ffffff",
        borderColor: "$errorColor",

        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgba(239, 68, 68, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 20px rgba(239, 68, 68, 0.3)",
        },

        "&:active:not(:disabled)": {
          transform: "translateY(0)",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$textPrimary",
        borderColor: "$borderTertiary",

        "&:hover:not(:disabled)": {
          backgroundColor: "$bgTertiary",
          borderColor: "$borderSecondary",
        },
      },
    },

    size: {
      sm: {
        paddingLeft: "$md",
        paddingRight: "$md",
        paddingTop: "$sm",
        paddingBottom: "$sm",
        fontSize: "$xs",
      },
      md: {
        paddingLeft: "$lg",
        paddingRight: "$lg",
        paddingTop: "$md",
        paddingBottom: "$md",
        fontSize: "$sm",
      },
      lg: {
        paddingLeft: "$xl",
        paddingRight: "$xl",
        paddingTop: "$lg",
        paddingBottom: "$lg",
        fontSize: "$base",
      },
    },

    fullWidth: {
      true: {
        width: "100%",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";
