import { FC, ReactNode } from "react";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  margin-top: 60px;
  background-color: var(--background-color);
`;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Sidebar />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
