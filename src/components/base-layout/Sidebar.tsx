import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "../../assets/styles/themes/stitches.config";
import { useAuth } from "../../contexts/AuthContext";
import { usePermission } from "../../hooks/usePermission";
import { ConditionalRender } from "../ConditionalRender";
import {
  FiHome,
  FiActivity,
  FiBook,
  FiDatabase,
  FiSettings,
  FiUsers,
  FiGitBranch,
  FiPackage,
  FiLink2,
  FiKey,
  FiLock,
  FiX,
  FiCloud,
} from "react-icons/fi";

const SidebarContainer = styled("aside", {
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: "250px",
  backgroundColor: "$bgSecondary",
  borderRight: "1px solid $borderPrimary",
  overflowY: "auto",
  zIndex: "$sticky",
  paddingTop: "$xl",
  paddingLeft: "$lg",
  paddingRight: "$lg",
  transform: "translateX(-100%)",
  transition: "transform 300ms ease-in-out",

  "@md": {
    position: "static",
    transform: "none",
    transition: "none",
    top: "unset",
    margin: 0,
  },

  variants: {
    isOpen: {
      true: {
        "@xs": {
          transform: "translateX(0)",
        },
      },
    },
  },
});

const SidebarTitle = styled("h2", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textMuted",
  marginTop: "$lg",
  marginBottom: "$md",
  paddingLeft: "$md",
  paddingRight: "$md",
  textTransform: "uppercase",
  letterSpacing: "1px",

  "&:first-child": {
    marginTop: 0,
  },
});

const NavLink = styled("a", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  marginTop: "$xs",
  marginBottom: "$xs",
  color: "$textSecondary",
  borderRadius: "$md",
  cursor: "pointer",
  transition: "all $normal",
  fontSize: "$sm",
  fontWeight: "$medium",
  textDecoration: "none",

  "&:hover": {
    backgroundColor: "$bgTertiary",
    color: "$primaryColor",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "$primaryColor",
        color: "$bgPrimary",
        fontWeight: "$semibold",

        "&:hover": {
          backgroundColor: "$borderAccent",
        },
      },
    },
  },
});

const CloseButton = styled("button", {
  display: "none",
  position: "absolute",
  top: "$lg",
  right: "$lg",
  backgroundColor: "transparent",
  border: "none",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "$xl",
  padding: "$xs",
  borderRadius: "$md",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgTertiary",
  },

  "@xs": {
    display: "block",
  },
});

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
  minLevel?: number;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getUserLevel } = usePermission();

  if (!isAuthenticated) {
    return null;
  }

  const userLevel = getUserLevel();

  const mainLinks: SidebarLink[] = [
    {
      label: "Home",
      path: "/",
      icon: <FiHome size={18} />,
    },
    {
      label: "Health Check",
      path: "/health-check",
      icon: <FiActivity size={18} />,
    },
    {
      label: "Processos",
      path: "/processes",
      icon: <FiBook size={18} />,
    },
  ];

  const resourceLinks: SidebarLink[] = [
    {
      label: "Bancos de Dados",
      path: "/databases",
      icon: <FiDatabase size={18} />,
    },
    {
      label: "Repositórios",
      path: "/repositories",
      icon: <FiGitBranch size={18} />,
    },
    {
      label: "Deploys",
      path: "/deploys",
      icon: <FiCloud size={18} />,
    },
    {
      label: "Links",
      path: "/links",
      icon: <FiLink2 size={18} />,
    },
    {
      label: "Presets",
      path: "/configuration-items",
      icon: <FiPackage size={18} />,
    },
    {
      label: "Variáveis de Ambiente",
      path: "/environment-variables",
      icon: <FiKey size={18} />,
    },
    {
      label: "Contas",
      path: "/accounts",
      icon: <FiLock size={18} />,
    },
  ];

  const adminLinks: SidebarLink[] = [
    {
      label: "Usuários",
      path: "/admin/users",
      icon: <FiUsers size={18} />,
      minLevel: 50,
    },
    {
      label: "Configurações",
      path: "/admin/settings",
      icon: <FiSettings size={18} />,
      minLevel: 99,
    },
  ];

  const renderLink = (link: SidebarLink) => {
    const shouldShowLink = !link.minLevel || userLevel >= link.minLevel;

    if (!shouldShowLink) {
      return null;
    }

    const isActive = location.pathname === link.path;

    return (
      <NavLink
        key={link.path}
        onClick={() => {
          navigate(link.path);
          onClose?.();
        }}
        active={isActive}
      >
        {link.icon}
        <span>{link.label}</span>
      </NavLink>
    );
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FiX size={24} />
      </CloseButton>

      <SidebarTitle>Menu Principal</SidebarTitle>
      {mainLinks.map(renderLink)}

      <SidebarTitle>Recursos</SidebarTitle>
      {resourceLinks.map(renderLink)}

      <ConditionalRender requiredLevel={50}>
        <>
          <SidebarTitle>Administração</SidebarTitle>
          {adminLinks.map(renderLink)}
        </>
      </ConditionalRender>
    </SidebarContainer>
  );
};
