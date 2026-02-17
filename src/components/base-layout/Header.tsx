import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "../../assets/styles/themes/stitches.config";
import { useAuth } from "../../contexts/AuthContext";
import { usePermission } from "../../hooks/usePermission";
import { getRoleColor, formatRoleName } from "../../utils/roleHelpers";
import { FiLogOut, FiMenu, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const HeaderContainer = styled("header", {
  backgroundColor: "$bgSecondary",
  borderBottom: "1px solid $borderPrimary",
  paddingTop: "$md",
  paddingBottom: "$md",
  paddingLeft: "$lg",
  paddingRight: "$lg",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: "$sticky",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",

  "@md": {
    paddingTop: "$lg",
    paddingBottom: "$lg",
    paddingLeft: "$xl",
    paddingRight: "$xl",
  },
});

const LogoSection = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
  cursor: "pointer",
  transition: "all $normal",

  "&:hover": {
    transform: "scale(1.02)",
  },
});

const LogoText = styled("h1", {
  fontSize: "$xl",
  fontWeight: "$bold",
  color: "$primaryColor",
  m: 0,

  "@xs": {
    fontSize: "$lg",
  },
});

const UserSection = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$lg",

  "@xs": {
    gap: "$sm",
  },
});

const UserInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
  cursor: "pointer",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$sm",
  paddingBottom: "$sm",
  borderRadius: "$md",
  transition: "all $normal",
  position: "relative",

  "&:hover": {
    backgroundColor: "$bgTertiary",
  },

  "@xs": {
    display: "none",
  },
});

const UserName = styled("span", {
  fontSize: "$sm",
  color: "$textPrimary",
  fontWeight: "$medium",
  display: "flex",
  alignItems: "center",
  gap: "$sm",
});

const RoleBadge = styled("span", {
  fontSize: "$xs",
  paddingLeft: "$sm",
  paddingRight: "$sm",
  paddingTop: "$xs",
  paddingBottom: "$xs",
  borderRadius: "$sm",
  fontWeight: "$semibold",
  whiteSpace: "nowrap",
});

const UserMenu = styled(motion.div, {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: "$xs",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  boxShadow: "$lg",
  minWidth: "200px",
  zIndex: "$dropdown",
});

const MenuItem = styled("button", {
  width: "100%",
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingTop: "$md",
  paddingBottom: "$md",
  backgroundColor: "transparent",
  color: "$textPrimary",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "$md",
  fontSize: "$sm",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgTertiary",
    color: "$primaryColor",
  },

  "&:last-child": {
    borderTop: "1px solid $borderPrimary",
    color: "$errorColor",

    "&:hover": {
      backgroundColor: "$errorColor",
      color: "$bgPrimary",
    },
  },
});

const MobileMenuButton = styled("button", {
  backgroundColor: "transparent",
  border: "none",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "$2xl",
  padding: "$sm",
  borderRadius: "$md",
  transition: "all $normal",
  display: "none",

  "&:hover": {
    backgroundColor: "$bgTertiary",
  },

  "@xs": {
    display: "flex",
  },
});

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getUserRole } = usePermission();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const roleColor = getRoleColor(getUserRole());

  return (
    <HeaderContainer>
      <LogoSection onClick={handleLogoClick}>
        <LogoText>Path Link</LogoText>
      </LogoSection>

      <UserSection>
        <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
          <div>
            <UserName>
              {user?.name || "Usuário"}
              <FiChevronDown size={16} />
            </UserName>
            <RoleBadge
              css={{
                color: roleColor,
                backgroundColor: `${roleColor}20`,
              }}
            >
              {formatRoleName(getUserRole())}
            </RoleBadge>
          </div>

          {showUserMenu && (
            <UserMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <FiLogOut size={16} />
                Sair
              </MenuItem>
            </UserMenu>
          )}
        </UserInfo>

        <MobileMenuButton onClick={onMenuClick}>
          <FiMenu size={24} />
        </MobileMenuButton>
      </UserSection>
    </HeaderContainer>
  );
};
