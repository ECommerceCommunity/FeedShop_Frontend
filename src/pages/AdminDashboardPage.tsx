// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
`;

const Header = styled.header`
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #87ceeb;
  width: 180px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #444;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: #87ceeb;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: #87ceeb;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(to right, #87ceeb, #5cacee);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  &:hover {
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  transition: opacity 0.3s;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 256px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s;
`;

const MobileMenuHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileMenuTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  color: #87ceeb;
`;

const MobileMenuNav = styled.nav`
  padding: 16px;
`;

const MobileMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  space-y: 16px;
`;

const MobileMenuListItem = styled.li`
  a {
    display: block;
    padding: 8px 0;
    color: #444;
    &:hover {
      color: #87ceeb;
    }
  }
`;

const MobileMenuLoginSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const FlexContainer = styled.div`
  display: flex;
  flex: 1;
  padding-top: 60px;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: ${(props) => (props.$isOpen ? "240px" : "60px")};
  transition: all 0.3s;
  z-index: 40;

  @media (min-width: 769px) {
    width: ${(props) => (props.$isOpen ? "240px" : "60px")};
    transform: translateX(0);
  }
`;

const SidebarToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 16px;
  background: #fff;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #666;
  cursor: pointer;
  &:hover {
    color: #87ceeb;
  }
`;

const SidebarNav = styled.nav`
  padding: 16px;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  space-y: 8px;
`;

const SidebarItem = styled.li`
  a {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    border-radius: 8px;
    color: #444;
    cursor: pointer;
    &:hover {
      background: #f1f5f9;
      color: #87ceeb;
    }
  }
`;

const ActiveSidebarItem = styled(SidebarItem)`
  a {
    background: rgba(135, 206, 235, 0.2);
    color: #87ceeb;
    &:hover {
      background: rgba(135, 206, 235, 0.2);
    }
  }
`;

const SidebarIcon = styled.i`
  width: 24px;
`;

const SidebarText = styled.span<{ $isOpen: boolean }>`
  margin-left: 8px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  @media (min-width: 769px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  transition: all 0.3s;
  margin-left: ${(props) => (props.$sidebarOpen ? "240px" : "60px")};
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentPadding = styled.div`
  padding: 24px 32px;
  @media (min-width: 769px) {
    padding: 32px;
  }
`;

const Breadcrumb = styled.div`
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: #666;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  &:hover {
    color: #87ceeb;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
`;

const StatCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatTitle = styled.p`
  color: #666;
  font-size: 0.875rem;
`;

const StatValue = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 4px;
`;

const StatChange = styled.p<{ $positive: boolean }>`
  font-size: 0.875rem;
  margin-top: 8px;
  color: ${(props) => (props.$positive ? "#28a745" : "#dc3545")};
  i {
    margin-right: 4px;
  }
`;

const StatIconWrapper = styled.div<{ $bgColor: string }>`
  background: ${(props) => props.$bgColor};
  padding: 12px;
  border-radius: 8px;
  i {
    color: inherit; /* Icon color will be set by parent */
    font-size: 1.25rem;
  }
`;

const RecentActivityCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px;
  margin-bottom: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
`;

const ViewAllButton = styled.button`
  color: #87ceeb;
  text-decoration: none;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
`;

const ActivityList = styled.div`
  space-y: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ActivityIconWrapper = styled.div<{ $bgColor: string }>`
  background: ${(props) => props.$bgColor};
  padding: 8px;
  border-radius: 8px;
  margin-right: 16px;
  i {
    color: inherit; /* Icon color will be set by parent */
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActivityTitle = styled.p`
  font-weight: 500;
`;

const ActivityTime = styled.span`
  color: #999;
  font-size: 0.875rem;
`;

const ActivityDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const TableCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px 0;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f8f8f8;
  &:hover {
    background: #fcfcfc;
  }
`;

const TableCell = styled.td`
  padding: 16px 0;
  font-size: 0.875rem;
  color: #666;
`;

const OrderIdCell = styled(TableCell)`
  font-weight: 500;
  color: #333;
`;

const StatusSpan = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$status) {
      case "완료":
        return "#e8f5e9";
      case "처리중":
        return "#e3f2fd";
      case "배송중":
        return "#fff3e0";
      case "취소":
        return "#ffebee";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "완료":
        return "#28a745";
      case "처리중":
        return "#1976d2";
      case "배송중":
        return "#ff9800";
      case "취소":
        return "#dc3545";
      default:
        return "#333";
    }
  }};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const QuickActionCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  }
`;

const QuickActionIconWrapper = styled.div<{ $bgColor: string }>`
  width: 40px;
  height: 40px;
  background: ${(props) => props.$bgColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  i {
    color: inherit; /* Icon color will be set by parent */
  }
`;

const QuickActionTitle = styled.h3`
  font-weight: 500;
  color: #333;
`;

const StyledFooter = styled.footer`
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  height: 120px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CopyrightText = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 16px;
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const FooterLink = styled.a`
  color: #666;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    color: #87ceeb;
  }
`;

const ToastNotification = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 80px;
  right: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  max-width: 280px;
  z-index: 50;
  transform: translateX(${(props) => (props.$show ? "0" : "100%")});
  transition: transform 0.3s;
`;

const ToastIconWrapper = styled.div`
  flex-shrink: 0;
  padding-top: 2px;
  i {
    color: #28a745;
    font-size: 20px;
  }
`;

const ToastContent = styled.div`
  margin-left: 12px;
  width: 0;
  flex: 1;
`;

const ToastTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
`;

const ToastMessage = styled.p`
  margin-top: 4px;
  font-size: 0.875rem;
  color: #666;
`;

const ToastCloseButton = styled.button`
  margin-left: 16px;
  flex-shrink: 0;
  display: flex;
  background: none;
  border: none;
  border-radius: 8px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #666;
  }
`;

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false); // New state for toast

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to show toast for demonstration
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide after 3 seconds
  };

  return (
    <Container>
      <Header>
        <LogoWrapper>
          <Logo>브랜드 로고</Logo>
        </LogoWrapper>
        <Nav>
          <NavLink href="#">홈</NavLink>
          <NavLink href="#">서비스</NavLink>
          <NavLink href="#">제품</NavLink>
          <NavLink href="#">고객지원</NavLink>
          <NavLink href="#">회사소개</NavLink>
        </Nav>
        <UserMenu>
          <IconButton onClick={handleShowToast}>
            <i className="fas fa-bell"></i>
          </IconButton>
          <IconButton>
            <i className="fas fa-cog"></i>
          </IconButton>
          <LoginButton>로그인</LoginButton>
          <MobileMenuButton onClick={toggleMobileMenu}>
            <i className="fas fa-bars text-xl"></i>
          </MobileMenuButton>
        </UserMenu>
      </Header>

      <MobileMenuOverlay $isOpen={mobileMenuOpen}>
        <MobileMenuDrawer $isOpen={mobileMenuOpen}>
          <MobileMenuHeader>
            <MobileMenuTitle>메뉴</MobileMenuTitle>
            <IconButton onClick={toggleMobileMenu}>
              <i className="fas fa-times"></i>
            </IconButton>
          </MobileMenuHeader>
          <MobileMenuNav>
            <MobileMenuList>
              <MobileMenuListItem>
                <NavLink href="#">홈</NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#">서비스</NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#">제품</NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#">고객지원</NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#">회사소개</NavLink>
              </MobileMenuListItem>
            </MobileMenuList>
            <MobileMenuLoginSection>
              <LoginButton style={{ width: "100%" }}>로그인</LoginButton>
            </MobileMenuLoginSection>
          </MobileMenuNav>
        </MobileMenuDrawer>
      </MobileMenuOverlay>

      <FlexContainer>
        <Sidebar $isOpen={sidebarOpen}>
          <SidebarToggleButton onClick={toggleSidebar}>
            <i
              className={`fas ${
                sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </SidebarToggleButton>
          <SidebarNav>
            <SidebarList>
              <ActiveSidebarItem>
                <a href="#">
                  <SidebarIcon className="fas fa-home"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>대시보드</SidebarText>
                </a>
              </ActiveSidebarItem>
              <SidebarItem>
                <a href="#">
                  <SidebarIcon className="fas fa-user"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>사용자 관리</SidebarText>
                </a>
              </SidebarItem>
              <SidebarItem>
                <a href="#">
                  <SidebarIcon className="fas fa-store"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>가게 관리</SidebarText>
                </a>
              </SidebarItem>
              <SidebarItem>
                <a href="#">
                  <SidebarIcon className="fas fa-chart-bar"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>통계</SidebarText>
                </a>
              </SidebarItem>
              <SidebarItem>
                <a href="#">
                  <SidebarIcon className="fas fa-cog"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>설정</SidebarText>
                </a>
              </SidebarItem>
            </SidebarList>
          </SidebarNav>
        </Sidebar>

        <MainContent $sidebarOpen={sidebarOpen}>
          <ContentPadding>
            <Breadcrumb>
              <BreadcrumbLink>홈</BreadcrumbLink>{" "}
              <span className="mx-2">/</span>{" "}
              <BreadcrumbLink>대시보드</BreadcrumbLink>
            </Breadcrumb>

            <PageTitle>대시보드</PageTitle>

            <StatCardsGrid>
              <StatCard>
                <div>
                  <StatTitle>총 사용자</StatTitle>
                  <StatValue>3,721</StatValue>
                  <StatChange $positive={true}>
                    <i className="fas fa-arrow-up"></i>
                    12.5% 증가
                  </StatChange>
                </div>
                <StatIconWrapper $bgColor="#e3f2fd">
                  <i className="fas fa-users" style={{ color: "#87ceeb" }}></i>
                </StatIconWrapper>
              </StatCard>

              <StatCard>
                <div>
                  <StatTitle>총 매출</StatTitle>
                  <StatValue>₩12,721,000</StatValue>
                  <StatChange $positive={true}>
                    <i className="fas fa-arrow-up"></i>
                    8.2% 증가
                  </StatChange>
                </div>
                <StatIconWrapper $bgColor="#e8f5e9">
                  <i
                    className="fas fa-won-sign"
                    style={{ color: "#28a745" }}
                  ></i>
                </StatIconWrapper>
              </StatCard>

              <StatCard>
                <div>
                  <StatTitle>신규 주문</StatTitle>
                  <StatValue>352</StatValue>
                  <StatChange $positive={false}>
                    <i className="fas fa-arrow-down"></i>
                    3.1% 감소
                  </StatChange>
                </div>
                <StatIconWrapper $bgColor="#ede7f6">
                  <i
                    className="fas fa-shopping-cart"
                    style={{ color: "#673ab7" }}
                  ></i>
                </StatIconWrapper>
              </StatCard>

              <StatCard>
                <div>
                  <StatTitle>방문자</StatTitle>
                  <StatValue>8,492</StatValue>
                  <StatChange $positive={true}>
                    <i className="fas fa-arrow-up"></i>
                    5.7% 증가
                  </StatChange>
                </div>
                <StatIconWrapper $bgColor="#fff3e0">
                  <i className="fas fa-eye" style={{ color: "#ff9800" }}></i>
                </StatIconWrapper>
              </StatCard>
            </StatCardsGrid>

            <RecentActivityCard>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <ViewAllButton>모두 보기</ViewAllButton>
              </CardHeader>
              <ActivityList>
                {[1, 2, 3, 4, 5].map((item) => (
                  <ActivityItem key={item}>
                    <ActivityIconWrapper $bgColor="rgba(135,206,235,0.2)">
                      <i
                        className="fas fa-user-circle"
                        style={{ color: "#87ceeb" }}
                      ></i>
                    </ActivityIconWrapper>
                    <ActivityContent>
                      <ActivityRow>
                        <ActivityTitle>새로운 사용자 가입</ActivityTitle>
                        <ActivityTime>2시간 전</ActivityTime>
                      </ActivityRow>
                      <ActivityDescription>
                        김민수님이 새로 가입했습니다.
                      </ActivityDescription>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivityList>
            </RecentActivityCard>

            <TwoColumnGrid>
              <TableCard>
                <CardHeader>
                  <CardTitle>최근 주문</CardTitle>
                  <ViewAllButton>모두 보기</ViewAllButton>
                </CardHeader>
                <div style={{ overflowX: "auto" }}>
                  <StyledTable>
                    <thead>
                      <tr>
                        <TableHeader>주문 ID</TableHeader>
                        <TableHeader>고객</TableHeader>
                        <TableHeader>금액</TableHeader>
                        <TableHeader>상태</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "#ORD-001",
                          customer: "이지은",
                          amount: "₩32,000",
                          status: "완료",
                        },
                        {
                          id: "#ORD-002",
                          customer: "박지훈",
                          amount: "₩18,500",
                          status: "처리중",
                        },
                        {
                          id: "#ORD-003",
                          customer: "김유진",
                          amount: "₩54,200",
                          status: "완료",
                        },
                        {
                          id: "#ORD-004",
                          customer: "최민준",
                          amount: "₩27,800",
                          status: "배송중",
                        },
                        {
                          id: "#ORD-005",
                          customer: "정서연",
                          amount: "₩42,600",
                          status: "취소",
                        },
                      ].map((order, index) => (
                        <TableRow key={index}>
                          <OrderIdCell>{order.id}</OrderIdCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.amount}</TableCell>
                          <TableCell>
                            <StatusSpan $status={order.status}>
                              {order.status}
                            </StatusSpan>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              </TableCard>

              <TableCard>
                <CardHeader>
                  <CardTitle>빠른 작업</CardTitle>
                  <i className="fas fa-bolt" style={{ color: "#87ceeb" }}></i>
                </CardHeader>
                <QuickActionsGrid>
                  {[
                    {
                      icon: "fa-plus-circle",
                      title: "새 상품 등록",
                      bgColor: "#e3f2fd",
                      iconColor: "#1976d2",
                    },
                    {
                      icon: "fa-user-plus",
                      title: "사용자 추가",
                      bgColor: "#e8f5e9",
                      iconColor: "#28a745",
                    },
                    {
                      icon: "fa-chart-line",
                      title: "매출 보고서",
                      bgColor: "#ede7f6",
                      iconColor: "#673ab7",
                    },
                    {
                      icon: "fa-cog",
                      title: "시스템 설정",
                      bgColor: "#fff3e0",
                      iconColor: "#ff9800",
                    },
                    {
                      icon: "fa-bell",
                      title: "알림 관리",
                      bgColor: "#ffebee",
                      iconColor: "#dc3545",
                    },
                    {
                      icon: "fa-question-circle",
                      title: "도움말",
                      bgColor: "#f5f5f5",
                      iconColor: "#666",
                    },
                  ].map((action, index) => (
                    <QuickActionCard key={index}>
                      <QuickActionIconWrapper $bgColor={action.bgColor}>
                        <i
                          className={`fas ${action.icon}`}
                          style={{ color: action.iconColor }}
                        ></i>
                      </QuickActionIconWrapper>
                      <QuickActionTitle>{action.title}</QuickActionTitle>
                    </QuickActionCard>
                  ))}
                </QuickActionsGrid>
              </TableCard>
            </TwoColumnGrid>
          </ContentPadding>
        </MainContent>
      </FlexContainer>

      <StyledFooter>
        <FooterContent>
          <CopyrightText>&copy; 2025 회사명. 모든 권리 보유.</CopyrightText>
          <FooterLinks>
            <FooterLink href="#">서비스 약관</FooterLink>
            <FooterLink href="#">개인정보처리방침</FooterLink>
            <FooterLink href="#">문의하기</FooterLink>
          </FooterLinks>
        </FooterContent>
      </StyledFooter>

      <ToastNotification $show={showToast}>
        <ToastIconWrapper>
          <i className="fas fa-check-circle"></i>
        </ToastIconWrapper>
        <ToastContent>
          <ToastTitle>성공적으로 저장되었습니다</ToastTitle>
          <ToastMessage>변경사항이 적용되었습니다.</ToastMessage>
        </ToastContent>
        <ToastCloseButton onClick={() => setShowToast(false)}>
          <i className="fas fa-times"></i>
        </ToastCloseButton>
      </ToastNotification>
    </Container>
  );
};

export default AdminDashboardPage;
