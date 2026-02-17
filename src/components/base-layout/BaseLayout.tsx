import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled } from "../../assets/styles/themes/stitches.config";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const LayoutContainer = styled("div", {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "$bgPrimary",
  color: "$textPrimary",
});

const MainContent = styled("main", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
});

const PageContainer = styled("div", {
  flex: 1,
  overflow: "auto",
});

const Overlay = styled("div", {
  position: "fixed",
  inset: 0,
  backgroundColor: "$bgOverlay",
  zIndex: "$backdrop",
  display: "none",

  "@xs": {
    display: "block",
  },

  variants: {
    visible: {
      true: {
        display: "block",
      },
    },
  },
});

export const BaseLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <MainContent>
        <Header onMenuClick={handleMenuClick} />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </MainContent>

      <Overlay visible={sidebarOpen} onClick={handleCloseSidebar} />
    </LayoutContainer>
  );
};
