import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  margin-left: 250px;
  margin-top: 60px;
  background-color: var(--background-color);
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Sidebar />
      <MainContent>
        {children}
        <Footer />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
