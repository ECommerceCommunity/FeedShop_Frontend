import { FC, useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // ✅ 추가
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "280px" : "0")};
  margin-top: 60px;
  background-color: var(--background-color);
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 70px;
  }
`;

const Layout: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 렌더링 시 사이드바 깜빡임 방지
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <LayoutContainer>
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      {isInitialized && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <MainContent sidebarOpen={sidebarOpen}>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
