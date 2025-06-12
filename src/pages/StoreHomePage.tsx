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
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 24px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenuButton = styled.button`
  margin-right: 8px;
  color: #4b5563;
  cursor: pointer;
  font-size: 1.25rem;
  background: none;
  border: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #87ceeb;
  width: 150px;

  @media (min-width: 768px) {
    width: 200px;
  }

  i {
    margin-right: 8px;
  }
`;

const Nav = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 24px;
  }
`;

const NavLink = styled.a`
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;

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
  position: relative;
  color: #4b5563;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.25rem;

  span {
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    border-radius: 9999px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserDropdownContainer = styled.div`
  position: relative;
  &:hover > div {
    display: block;
  }
`;

const UserDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  background: none;
  border: none;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background-color: #87ceeb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserDropdownMenu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 8px;
  width: 192px;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding-top: 4px;
  padding-bottom: 4px;
  z-index: 50;
  display: none;
`;

const UserDropdownItem = styled.a`
  display: block;
  padding: 8px 16px;
  font-size: 0.875rem;
  color: #4b5563;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    margin-right: 8px;
  }
`;

const Divider = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: ${(props) => (props.$isOpen ? "block" : "none")};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MobileMenuTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #87ceeb;
`;

const MobileMenuCloseButton = styled.button`
  color: #6b7280;
  cursor: pointer;
  background: none;
  border: none;
`;

const MobileMenuSectionTitle = styled.div`
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const MobileMenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #4b5563;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    width: 20px;
    margin-right: 8px;
    color: #87ceeb;
  }
`;

const MobileMenuDivider = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  z-index: 40;
  transition: all 0.3s ease-in-out;
  width: ${(props) => (props.$isOpen ? "250px" : "60px")};

  @media (max-width: 767px) {
    display: none;
  }
`;

const SidebarToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 16px;
  background: #fff;
  border-radius: 9999px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #87ceeb;
  cursor: pointer;
  border: none;
`;

const SidebarNav = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 16px 0;
`;

const SidebarSectionTitle = styled.div<{ $isOpen: boolean }>`
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const SidebarItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${(props) => (props.$active ? "#87ceeb" : "#4b5563")};
  border-left: ${(props) => (props.$active ? "4px solid #87ceeb" : "none")};
  background-color: ${(props) => (props.$active ? "#e3f2fd" : "transparent")};
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    width: 20px;
    color: #87ceeb;
  }
`;

const SidebarText = styled.span<{ $isOpen: boolean }>`
  margin-left: 8px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const SubMenu = styled.div<{ $isOpen: boolean }>`
  margin-left: 36px;
  margin-top: 4px;
  padding-bottom: 4px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const SubMenuItem = styled.a`
  display: block;
  padding: 8px 0;
  font-size: 0.875rem;
  color: #4b5563;
  text-decoration: none;

  &:hover {
    color: #87ceeb;
  }
`;

const SidebarDivider = styled.div<{ $isOpen: boolean }>`
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
  ${(props) => !props.$isOpen && "margin: 8px 8px;"}
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  transition: all 0.3s ease-in-out;
  margin-left: ${(props) => (props.$sidebarOpen ? "250px" : "60px")};

  @media (max-width: 767px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 24px;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 16px;
`;

const BreadcrumbLink = styled.a`
  color: #6b7280;
  text-decoration: none;

  &:hover {
    color: #87ceeb;
  }
`;

const BreadcrumbSeparator = styled.i`
  margin: 0 8px;
  font-size: 0.75rem;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }

  i {
    margin-right: 8px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(to right, #87ceeb, #5cacee);
  color: white;
  border: none;

  &:hover {
    opacity: 0.9;
    background: linear-gradient(to right, #87ceeb, #5cacee);
  }
`;

const StatCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIconWrapper = styled.div<{ $bgColor: string; $iconColor: string }>`
  background: ${(props) => props.$bgColor};
  border-radius: 9999px;
  padding: 12px;
  margin-right: 16px;
  flex-shrink: 0;

  i {
    color: ${(props) => props.$iconColor};
    font-size: 1.25rem;
  }
`;

const StatContent = styled.div``;

const StatTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatValue = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
`;

const StatChange = styled.p<{ $positive: boolean }>`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  margin-top: 4px;
  color: ${(props) => (props.$positive ? "#10b981" : "#ef4444")};

  i {
    margin-right: 4px;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
`;

const CardHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const CardLink = styled.a`
  font-size: 0.875rem;
  color: #87ceeb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CardBody = styled.div`
  padding: 24px;
`;

const ResponsiveTableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding-bottom: 12px;
  text-align: left;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f9fafb;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 0;
  font-size: 0.875rem;
  color: #4b5563;
`;

const StatusPill = styled.span<{ $status: string }>`
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.$status) {
      case "배달 완료":
        return "#d1fae5";
      case "배달 중":
        return "#dbeafe";
      case "준비 중":
        return "#fef3c7";
      default:
        return "#e5e7eb";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "배달 완료":
        return "#065f46";
      case "배달 중":
        return "#1e40af";
      case "준비 중":
        return "#b45309";
      default:
        return "#4b5563";
    }
  }};
`;

const PopularMenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PopularMenuImageWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #e5e7eb;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PopularMenuContent = styled.div`
  margin-left: 16px;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PopularMenuTitle = styled.h3`
  font-weight: 500;
  color: #1f2937;
`;

const PopularMenuPrice = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const PopularMenuRating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;

  .stars {
    color: #fbbf24;
    margin-right: 4px;
  }
`;

const RecentReviewItem = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
  margin-bottom: 24px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ReviewUserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background-color: #e5e7eb;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ReviewUserText = styled.div`
  margin-left: 12px;
`;

const ReviewUserName = styled.h3`
  font-weight: 500;
  color: #1f2937;
`;

const ReviewRatingDate = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;

  .stars {
    color: #fbbf24;
    font-size: 0.75rem;
  }

  span {
    font-size: 0.75rem;
    color: #6b7280;
    margin-left: 8px;
  }
`;

const ReviewMenuTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 9999px;
`;

const ReviewContent = styled.p`
  color: #4b5563;
  margin-top: 12px;
  font-size: 0.875rem;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ReviewActionButton = styled.button`
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:hover {
    color: #87ceeb;
  }

  i {
    margin-right: 4px;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const QuickActionItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    margin-right: 12px;
  }
`;

const QuickActionTitle = styled.span`
  color: #4b5563;
`;

const NotificationItem = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
  margin-bottom: 12px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const NotificationTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const NotificationDate = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
`;

const Footer = styled.footer`
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 0;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const FooterLink = styled.a`
  color: #6b7280;
  text-decoration: none;

  &:hover {
    color: #87ceeb;
  }
`;

const ToastNotification = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 80px;
  right: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  max-width: 320px;
  z-index: 50;
  transform: translateX(${(props) => (props.$show ? "0" : "150%")});
  transition: transform 0.3s ease-in-out;
`;

const ToastIconContainer = styled.div`
  border-radius: 9999px;
  background-color: #d1fae5;
  padding: 8px;
  margin-right: 12px;
  flex-shrink: 0;

  i {
    color: #10b981;
  }
`;

const ToastTextContent = styled.div``;

const ToastTitle = styled.h3`
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
`;

const ToastMessage = styled.p`
  color: #4b5563;
  font-size: 0.75rem;
  margin-top: 4px;
`;

const ToastCloseButton = styled.button`
  margin-left: 16px;
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: #6b7280;
  }
`;

const StoreHomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <Container>
      <Header>
        <LogoWrapper>
          <MobileMenuButton onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </MobileMenuButton>
          <Logo>
            <i className="fas fa-store"></i>스토어
          </Logo>
        </LogoWrapper>

        <Nav>
          <NavLink href="#">홈</NavLink>
          <NavLink href="#">상점</NavLink>
          <NavLink href="#">이벤트</NavLink>
          <NavLink href="#">커뮤니티</NavLink>
          <NavLink href="#">고객센터</NavLink>
        </Nav>

        <UserMenu>
          <IconButton onClick={handleShowToast}>
            <i className="fas fa-bell"></i>
            <span>3</span>
          </IconButton>

          <UserDropdownContainer>
            <UserDropdownButton>
              <UserAvatar>
                <i className="fas fa-user"></i>
              </UserAvatar>
              <i className="fas fa-chevron-down"></i>
            </UserDropdownButton>

            <UserDropdownMenu>
              <UserDropdownItem href="#">
                <i className="fas fa-user-circle"></i>프로필
              </UserDropdownItem>
              <UserDropdownItem href="#">
                <i className="fas fa-cog"></i>설정
              </UserDropdownItem>
              <Divider />
              <UserDropdownItem href="#">
                <i className="fas fa-sign-out-alt"></i>로그아웃
              </UserDropdownItem>
            </UserDropdownMenu>
          </UserDropdownContainer>
        </UserMenu>
      </Header>

      <MobileMenuOverlay $isOpen={mobileMenuOpen} onClick={toggleMobileMenu} />

      <MobileMenuDrawer $isOpen={mobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuTitle>스토어</MobileMenuTitle>
          <MobileMenuCloseButton onClick={toggleMobileMenu}>
            <i className="fas fa-times"></i>
          </MobileMenuCloseButton>
        </MobileMenuHeader>

        <MobileMenuSectionTitle>메인 메뉴</MobileMenuSectionTitle>
        <MobileMenuItem href="#">
          <i className="fas fa-home"></i>
          <span>홈</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-store"></i>
          <span>상점</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-calendar-alt"></i>
          <span>이벤트</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-users"></i>
          <span>커뮤니티</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-headset"></i>
          <span>고객센터</span>
        </MobileMenuItem>

        <MobileMenuDivider />

        <MobileMenuSectionTitle>사용자 메뉴</MobileMenuSectionTitle>
        <MobileMenuItem href="#">
          <i className="fas fa-user-circle"></i>
          <span>프로필</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-cog"></i>
          <span>설정</span>
        </MobileMenuItem>
        <MobileMenuItem href="#">
          <i className="fas fa-sign-out-alt"></i>
          <span>로그아웃</span>
        </MobileMenuItem>
      </MobileMenuDrawer>

      <MainContent $sidebarOpen={sidebarOpen}>
        <Sidebar $isOpen={sidebarOpen}>
          <SidebarToggleButton onClick={toggleSidebar}>
            <i
              className={`fas ${
                sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </SidebarToggleButton>

          <SidebarNav>
            <SidebarSectionTitle $isOpen={sidebarOpen}>
              메인 메뉴
            </SidebarSectionTitle>
            <SidebarItem href="#" $active={true}>
              <i className="fas fa-tachometer-alt"></i>
              <SidebarText $isOpen={sidebarOpen}>대시보드</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-store"></i>
              <SidebarText $isOpen={sidebarOpen}>상점 관리</SidebarText>
            </SidebarItem>
            <SubMenu $isOpen={sidebarOpen}>
              <SubMenuItem href="#">- 상점 정보</SubMenuItem>
              <SubMenuItem href="#">- 영업 시간</SubMenuItem>
              <SubMenuItem href="#">- 휴무일 설정</SubMenuItem>
            </SubMenu>

            <SidebarItem href="#">
              <i className="fas fa-utensils"></i>
              <SidebarText $isOpen={sidebarOpen}>메뉴 관리</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-shopping-cart"></i>
              <SidebarText $isOpen={sidebarOpen}>주문 관리</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-star"></i>
              <SidebarText $isOpen={sidebarOpen}>리뷰 관리</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-chart-line"></i>
              <SidebarText $isOpen={sidebarOpen}>매출 분석</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-bullhorn"></i>
              <SidebarText $isOpen={sidebarOpen}>프로모션</SidebarText>
            </SidebarItem>

            <SidebarDivider $isOpen={sidebarOpen} />

            <SidebarSectionTitle $isOpen={sidebarOpen}>
              설정
            </SidebarSectionTitle>
            <SidebarItem href="#">
              <i className="fas fa-cog"></i>
              <SidebarText $isOpen={sidebarOpen}>계정 설정</SidebarText>
            </SidebarItem>

            <SidebarItem href="#">
              <i className="fas fa-bell"></i>
              <SidebarText $isOpen={sidebarOpen}>알림 설정</SidebarText>
            </SidebarItem>
          </SidebarNav>
        </Sidebar>

        <ContentWrapper>
          <BreadcrumbContainer>
            <BreadcrumbLink href="#">홈</BreadcrumbLink>
            <BreadcrumbSeparator className="fas fa-chevron-right" />
            <BreadcrumbLink href="#">대시보드</BreadcrumbLink>
          </BreadcrumbContainer>

          <PageHeader>
            <PageTitle>대시보드</PageTitle>
            <HeaderButtons>
              <Button>
                <i className="fas fa-sync-alt"></i>새로고침
              </Button>
              <PrimaryButton>
                <i className="fas fa-plus"></i>새 상점 등록
              </PrimaryButton>
            </HeaderButtons>
          </PageHeader>

          <StatCardsGrid>
            <StatCard>
              <StatIconWrapper $bgColor="#e3f2fd" $iconColor="#87ceeb">
                <i className="fas fa-shopping-bag"></i>
              </StatIconWrapper>
              <StatContent>
                <StatTitle>오늘 주문</StatTitle>
                <StatValue>32</StatValue>
                <StatChange $positive={true}>
                  <i className="fas fa-arrow-up"></i>12% 증가
                </StatChange>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIconWrapper $bgColor="#e8f5e9" $iconColor="#10b981">
                <i className="fas fa-won-sign"></i>
              </StatIconWrapper>
              <StatContent>
                <StatTitle>오늘 매출</StatTitle>
                <StatValue>487,000원</StatValue>
                <StatChange $positive={true}>
                  <i className="fas fa-arrow-up"></i>8% 증가
                </StatChange>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIconWrapper $bgColor="#fff3e0" $iconColor="#f59e0b">
                <i className="fas fa-users"></i>
              </StatIconWrapper>
              <StatContent>
                <StatTitle>방문자</StatTitle>
                <StatValue>1,248</StatValue>
                <StatChange $positive={false}>
                  <i className="fas fa-arrow-down"></i>3% 감소
                </StatChange>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIconWrapper $bgColor="#ede9fe" $iconColor="#8b5cf6">
                <i className="fas fa-star"></i>
              </StatIconWrapper>
              <StatContent>
                <StatTitle>평균 평점</StatTitle>
                <StatValue>4.8/5</StatValue>
                <StatChange $positive={true}>
                  <i className="fas fa-arrow-up"></i>0.2 증가
                </StatChange>
              </StatContent>
            </StatCard>
          </StatCardsGrid>

          <TwoColumnGrid>
            <Card>
              <CardHeader>
                <CardTitle>최근 주문</CardTitle>
                <CardLink href="#">모두 보기</CardLink>
              </CardHeader>
              <CardBody>
                <ResponsiveTableContainer>
                  <StyledTable>
                    <thead>
                      <tr>
                        <TableHeader>주문 번호</TableHeader>
                        <TableHeader>메뉴</TableHeader>
                        <TableHeader>금액</TableHeader>
                        <TableHeader>상태</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow>
                        <TableCell>#ORD-7895</TableCell>
                        <TableCell>불고기 버거 세트</TableCell>
                        <TableCell>12,500원</TableCell>
                        <TableCell>
                          <StatusPill $status="배달 완료">배달 완료</StatusPill>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-7894</TableCell>
                        <TableCell>치즈 피자 L</TableCell>
                        <TableCell>24,000원</TableCell>
                        <TableCell>
                          <StatusPill $status="배달 중">배달 중</StatusPill>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-7893</TableCell>
                        <TableCell>떡볶이 + 튀김</TableCell>
                        <TableCell>15,000원</TableCell>
                        <TableCell>
                          <StatusPill $status="준비 중">준비 중</StatusPill>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-7892</TableCell>
                        <TableCell>짜장면 2 + 탕수육</TableCell>
                        <TableCell>29,000원</TableCell>
                        <TableCell>
                          <StatusPill $status="배달 완료">배달 완료</StatusPill>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-7891</TableCell>
                        <TableCell>김치찌개 + 공기밥 2</TableCell>
                        <TableCell>18,000원</TableCell>
                        <TableCell>
                          <StatusPill $status="배달 완료">배달 완료</StatusPill>
                        </TableCell>
                      </TableRow>
                    </tbody>
                  </StyledTable>
                </ResponsiveTableContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>인기 메뉴</CardTitle>
                <CardLink href="#">모두 보기</CardLink>
              </CardHeader>
              <CardBody>
                <div>
                  <PopularMenuItem>
                    <PopularMenuImageWrapper>
                      <img
                        src="https://readdy.ai/api/search-image?query=Korean%20bulgogi%20burger%20with%20lettuce%20and%20tomato%20on%20a%20wooden%20plate%2C%20professional%20food%20photography%20with%20soft%20lighting%20and%20blurred%20background%2C%20high%20resolution%2C%20appetizing&width=100&height=100&seq=1&orientation=squarish"
                        alt="불고기 버거"
                      />
                    </PopularMenuImageWrapper>
                    <PopularMenuContent>
                      <div>
                        <PopularMenuTitle>불고기 버거</PopularMenuTitle>
                        <PopularMenuRating>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                          </div>
                          <span>4.5 (128)</span>
                        </PopularMenuRating>
                      </div>
                      <PopularMenuPrice>8,500원</PopularMenuPrice>
                    </PopularMenuContent>
                  </PopularMenuItem>

                  <PopularMenuItem>
                    <PopularMenuImageWrapper>
                      <img
                        src="https://readdy.ai/api/search-image?query=Korean%20style%20cheese%20pizza%20with%20kimchi%20and%20bulgogi%20toppings%20on%20a%20wooden%20plate%2C%20professional%20food%20photography%20with%20soft%20lighting%20and%20blurred%20background%2C%20high%20resolution%2C%20appetizing&width=100&height=100&seq=2&orientation=squarish"
                        alt="치즈 피자"
                      />
                    </PopularMenuImageWrapper>
                    <PopularMenuContent>
                      <div>
                        <PopularMenuTitle>치즈 피자</PopularMenuTitle>
                        <PopularMenuRating>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <span>5.0 (96)</span>
                        </PopularMenuRating>
                      </div>
                      <PopularMenuPrice>18,000원</PopularMenuPrice>
                    </PopularMenuContent>
                  </PopularMenuItem>

                  <PopularMenuItem>
                    <PopularMenuImageWrapper>
                      <img
                        src="https://readdy.ai/api/search-image?query=Korean%20tteokbokki%20spicy%20rice%20cakes%20with%20fish%20cakes%20in%20a%20black%20bowl%2C%20professional%20food%20photography%20with%20soft%20lighting%20and%20blurred%20background%2C%20high%20resolution%2C%20appetizing&width=100&height=100&seq=3&orientation=squarish"
                        alt="떡볶이"
                      />
                    </PopularMenuImageWrapper>
                    <PopularMenuContent>
                      <div>
                        <PopularMenuTitle>떡볶이</PopularMenuTitle>
                        <PopularMenuRating>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                          </div>
                          <span>4.0 (87)</span>
                        </PopularMenuRating>
                      </div>
                      <PopularMenuPrice>12,000원</PopularMenuPrice>
                    </PopularMenuContent>
                  </PopularMenuItem>

                  <PopularMenuItem>
                    <PopularMenuImageWrapper>
                      <img
                        src="https://readdy.ai/api/search-image?query=Korean%20jajangmyeon%20black%20bean%20noodles%20in%20a%20white%20bowl%20with%20cucumber%20garnish%2C%20professional%20food%20photography%20with%20soft%20lighting%20and%20blurred%20background%2C%20high%20resolution%2C%20appetizing&width=100&height=100&seq=4&orientation=squarish"
                        alt="짜장면"
                      />
                    </PopularMenuImageWrapper>
                    <PopularMenuContent>
                      <div>
                        <PopularMenuTitle>짜장면</PopularMenuTitle>
                        <PopularMenuRating>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                          </div>
                          <span>4.5 (112)</span>
                        </PopularMenuRating>
                      </div>
                      <PopularMenuPrice>7,000원</PopularMenuPrice>
                    </PopularMenuContent>
                  </PopularMenuItem>

                  <PopularMenuItem>
                    <PopularMenuImageWrapper>
                      <img
                        src="https://readdy.ai/api/search-image?query=Korean%20kimchi%20jjigae%20stew%20in%20a%20stone%20pot%20with%20tofu%20and%20green%20onions%2C%20professional%20food%20photography%20with%20soft%20lighting%20and%20blurred%20background%2C%20high%20resolution%2C%20appetizing&width=100&height=100&seq=5&orientation=squarish"
                        alt="김치찌개"
                      />
                    </PopularMenuImageWrapper>
                    <PopularMenuContent>
                      <div>
                        <PopularMenuTitle>김치찌개</PopularMenuTitle>
                        <PopularMenuRating>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                          </div>
                          <span>4.0 (76)</span>
                        </PopularMenuRating>
                      </div>
                      <PopularMenuPrice>9,000원</PopularMenuPrice>
                    </PopularMenuContent>
                  </PopularMenuItem>
                </div>
              </CardBody>
            </Card>
          </TwoColumnGrid>

          <Card>
            <CardHeader>
              <CardTitle>최근 리뷰</CardTitle>
              <CardLink href="#">모두 보기</CardLink>
            </CardHeader>
            <CardBody>
              <div>
                <RecentReviewItem>
                  <ReviewHeader>
                    <ReviewUserInfo>
                      <ReviewAvatar>
                        <img
                          src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20young%20Asian%20woman%20with%20short%20black%20hair%20smiling%20at%20camera%2C%20neutral%20background%2C%20high%20quality%2C%20soft%20lighting&width=100&height=100&seq=6&orientation=squarish"
                          alt="User Avatar"
                        />
                      </ReviewAvatar>
                      <ReviewUserText>
                        <ReviewUserName>김지은</ReviewUserName>
                        <ReviewRatingDate>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <span>2025-06-06</span>
                        </ReviewRatingDate>
                      </ReviewUserText>
                    </ReviewUserInfo>
                    <ReviewMenuTag>불고기 버거</ReviewMenuTag>
                  </ReviewHeader>
                  <ReviewContent>
                    패티가 두껍고 소스가 정말 맛있어요! 배달도 빨리 왔고
                    따뜻하게 잘 포장되어 있었습니다. 다음에도 주문할게요!
                  </ReviewContent>
                  <ReviewActions>
                    <ReviewActionButton>
                      <i className="fas fa-reply"></i>답글 달기
                    </ReviewActionButton>
                    <ReviewActionButton>
                      <i className="fas fa-heart"></i>감사 표시
                    </ReviewActionButton>
                  </ReviewActions>
                </RecentReviewItem>

                <RecentReviewItem>
                  <ReviewHeader>
                    <ReviewUserInfo>
                      <ReviewAvatar>
                        <img
                          src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20young%20Asian%20man%20with%20glasses%20and%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20soft%20lighting&width=100&height=100&seq=7&orientation=squarish"
                          alt="User Avatar"
                        />
                      </ReviewAvatar>
                      <ReviewUserText>
                        <ReviewUserName>박민수</ReviewUserName>
                        <ReviewRatingDate>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                            <i className="far fa-star"></i>
                          </div>
                          <span>2025-06-05</span>
                        </ReviewRatingDate>
                      </ReviewUserText>
                    </ReviewUserInfo>
                    <ReviewMenuTag>치즈 피자</ReviewMenuTag>
                  </ReviewHeader>
                  <ReviewContent>
                    치즈가 풍부하고 도우도 쫄깃해서 좋았어요. 다만 배달이 조금
                    늦게 왔네요. 맛은 정말 좋았습니다!
                  </ReviewContent>
                  <ReviewActions>
                    <ReviewActionButton>
                      <i className="fas fa-reply"></i>답글 달기
                    </ReviewActionButton>
                    <ReviewActionButton>
                      <i className="fas fa-heart"></i>감사 표시
                    </ReviewActionButton>
                  </ReviewActions>
                </RecentReviewItem>

                <RecentReviewItem>
                  <ReviewHeader>
                    <ReviewUserInfo>
                      <ReviewAvatar>
                        <img
                          src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20middle-aged%20Asian%20woman%20with%20long%20black%20hair%20and%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20soft%20lighting&width=100&height=100&seq=8&orientation=squarish"
                          alt="User Avatar"
                        />
                      </ReviewAvatar>
                      <ReviewUserText>
                        <ReviewUserName>이수진</ReviewUserName>
                        <ReviewRatingDate>
                          <div className="stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <span>2025-06-04</span>
                        </ReviewRatingDate>
                      </ReviewUserText>
                    </ReviewUserInfo>
                    <ReviewMenuTag>떡볶이</ReviewMenuTag>
                  </ReviewHeader>
                  <ReviewContent>
                    매콤한 정도가 딱 좋고 떡이 쫄깃해요! 오뎅도 푸짐하게
                    들어있어서 만족스러웠습니다. 자주 시켜먹을 것 같아요.
                  </ReviewContent>
                  <ReviewActions>
                    <ReviewActionButton>
                      <i className="fas fa-reply"></i>답글 달기
                    </ReviewActionButton>
                    <ReviewActionButton>
                      <i className="fas fa-heart"></i>감사 표시
                    </ReviewActionButton>
                  </ReviewActions>
                </RecentReviewItem>
              </div>
            </CardBody>
          </Card>

          <QuickActionsGrid>
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
                <i className="fas fa-bolt" style={{ color: "#87ceeb" }}></i>
              </CardHeader>
              <CardBody>
                <QuickActionItem href="#">
                  <i
                    className="fas fa-plus-circle"
                    style={{ color: "#10b981" }}
                  ></i>
                  <QuickActionTitle>새 메뉴 추가</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i className="fas fa-edit" style={{ color: "#3b82f6" }}></i>
                  <QuickActionTitle>영업 시간 수정</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i className="fas fa-tag" style={{ color: "#9333ea" }}></i>
                  <QuickActionTitle>할인 쿠폰 생성</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i
                    className="fas fa-chart-bar"
                    style={{ color: "#f97316" }}
                  ></i>
                  <QuickActionTitle>매출 리포트 보기</QuickActionTitle>
                </QuickActionItem>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>공지사항</CardTitle>
                <i className="fas fa-bullhorn" style={{ color: "#87ceeb" }}></i>
              </CardHeader>
              <CardBody>
                <NotificationItem>
                  <NotificationTitle>6월 프로모션 안내</NotificationTitle>
                  <NotificationDate>2025-06-01</NotificationDate>
                </NotificationItem>
                <NotificationItem>
                  <NotificationTitle>배달 수수료 정책 변경</NotificationTitle>
                  <NotificationDate>2025-05-25</NotificationDate>
                </NotificationItem>
                <NotificationItem>
                  <NotificationTitle>시스템 업데이트 안내</NotificationTitle>
                  <NotificationDate>2025-05-15</NotificationDate>
                </NotificationItem>
                <CardLink
                  href="#"
                  style={{ marginTop: "16px", display: "inline-block" }}
                >
                  더 보기
                </CardLink>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>도움말</CardTitle>
                <i
                  className="fas fa-question-circle"
                  style={{ color: "#87ceeb" }}
                ></i>
              </CardHeader>
              <CardBody>
                <QuickActionItem href="#">
                  <i className="fas fa-book" style={{ color: "#14b8a6" }}></i>
                  <QuickActionTitle>사용자 가이드</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i className="fas fa-video" style={{ color: "#ef4444" }}></i>
                  <QuickActionTitle>튜토리얼 영상</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i
                    className="fas fa-headset"
                    style={{ color: "#6366f1" }}
                  ></i>
                  <QuickActionTitle>고객 지원 센터</QuickActionTitle>
                </QuickActionItem>
                <QuickActionItem href="#">
                  <i
                    className="fas fa-comments"
                    style={{ color: "#f59e0b" }}
                  ></i>
                  <QuickActionTitle>자주 묻는 질문</QuickActionTitle>
                </QuickActionItem>
              </CardBody>
            </Card>
          </QuickActionsGrid>
        </ContentWrapper>
      </MainContent>

      <Footer>
        <FooterContent>
          <p>&copy; 2025 스토어 관리 시스템. All rights reserved.</p>
          <FooterLinks>
            <FooterLink href="#">이용약관</FooterLink>
            <FooterLink href="#">개인정보처리방침</FooterLink>
            <FooterLink href="#">고객센터</FooterLink>
          </FooterLinks>
        </FooterContent>
      </Footer>

      <ToastNotification $show={showToast}>
        <ToastIconContainer>
          <i className="fas fa-check"></i>
        </ToastIconContainer>
        <ToastTextContent>
          <ToastTitle>성공!</ToastTitle>
          <ToastMessage>최신 데이터로 업데이트되었습니다.</ToastMessage>
        </ToastTextContent>
        <ToastCloseButton onClick={() => setShowToast(false)}>
          <i className="fas fa-times"></i>
        </ToastCloseButton>
      </ToastNotification>
    </Container>
  );
};

export default StoreHomePage;
