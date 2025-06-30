// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import * as echarts from "echarts";
import { useAuth } from "../contexts/AuthContext";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Header = styled.header`
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
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
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const LoginButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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
  backdrop-filter: blur(4px);
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
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
      color: #667eea;
    }
  }
`;

const MobileMenuLoginSection = styled.div`
  margin-top: 24px;
  border-top: 1px solid #eee;
`;

const FlexContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: ${(props) => (props.$isOpen ? "280px" : "60px")};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  animation: ${slideIn} 0.4s ease-out;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  @media (min-width: 769px) {
    width: ${(props) => (props.$isOpen ? "280px" : "60px")};
    transform: translateX(0);
  }
`;

const SidebarToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 16px;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #764ba2;
    transform: scale(1.1);
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

const SidebarNav = styled.nav`
  padding: 20px 0;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li`
  margin-bottom: 8px;
  padding: 0 15px;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  background: transparent;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.05)
    );
    color: white;
    transform: translateX(5px);

    &::before {
      left: 100%;
    }
  }

  &:hover .sidebar-icon {
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

const SidebarIcon = styled.i`
  width: 20px;
  margin-right: 15px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &.sidebar-icon {
    transition: all 0.3s ease;
  }
`;

const SidebarText = styled.span<{ $isOpen: boolean }>`
  flex: 1;
  transition: all 0.3s ease;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  @media (min-width: 769px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? "280px" : "60px")};
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentPadding = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 32px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Breadcrumb = styled.div`
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: #666;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    transform: translateX(2px);
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea, #764ba2)"
      : "rgba(255, 255, 255, 0.8)"};
  color: ${(props) => (props.$active ? "white" : "#666")};
  box-shadow: ${(props) =>
    props.$active
      ? "0 8px 25px rgba(102, 126, 234, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$active
        ? "0 12px 35px rgba(102, 126, 234, 0.4)"
        : "0 4px 15px rgba(0, 0, 0, 0.15)"};
  }
`;

const StatCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 20px 20px 0 0;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatChange = styled.div<{ $positive: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$positive ? "#10b981" : "#ef4444")};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatIconWrapper = styled.div<{ $bgColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation: ${pulse} 0.6s ease-in-out;
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
  text-align: center;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px 0;
  text-align: center;
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

// 리뷰 관리 관련 styled-components
const ReviewStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ReviewStatCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 20px;
  display: flex;
  align-items: center;
`;

const ReviewStatIcon = styled.div<{ $bgColor: string; $textColor: string }>`
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  padding: 12px;
  border-radius: 8px;
  margin-right: 16px;

  i {
    font-size: 1.25rem;
  }
`;

const ReviewStatContent = styled.div`
  flex: 1;
`;

const ReviewStatTitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 4px;
`;

const ReviewStatValue = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
`;

const FilterSection = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  margin-bottom: 24px;
`;

const FilterHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const FilterContent = styled.div`
  padding: 24px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #87ceeb;
    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.1);
  }
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #87ceeb;
    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.1);
  }
`;

const ReviewTableContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

const ReviewTableHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReviewTableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const ReviewCount = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ReviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ReviewTableHead = styled.thead`
  background: #f9fafb;
`;

const ReviewTableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ReviewTableBody = styled.tbody`
  background: #fff;
`;

const ReviewTableRow = styled.tr<{ $isHidden?: boolean }>`
  background: ${(props) => (props.$isHidden ? "#f9fafb" : "#fff")};
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background: #f9fafb;
  }
`;

const ReviewTableCell = styled.td`
  padding: 16px;
  vertical-align: top;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const ProductId = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
`;

const RatingValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-right: 8px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.i<{ $filled: boolean }>`
  color: ${(props) => (props.$filled ? "#fbbf24" : "#d1d5db")};
  font-size: 0.75rem;
`;

const ReviewContent = styled.div`
  max-width: 300px;
`;

const ReviewText = styled.div`
  font-size: 0.875rem;
  color: #111827;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewImages = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ImageIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;

  i {
    color: #6b7280;
    font-size: 0.75rem;
  }
`;

const ImageCount = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) =>
    props.$status === "answered" ? "#d1fae5" : "#fef3c7"};
  color: ${(props) => (props.$status === "answered" ? "#065f46" : "#92400e")};
`;

const HiddenBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  margin-left: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $variant: "view" | "hide" | "delete" }>`
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) => {
    switch (props.$variant) {
      case "view":
        return `
          color: #3b82f6;
          &:hover { color: #1d4ed8; }
        `;
      case "hide":
        return `
          color: #f59e0b;
          &:hover { color: #d97706; }
        `;
      case "delete":
        return `
          color: #ef4444;
          &:hover { color: #dc2626; }
        `;
    }
  }}
`;

const PaginationContainer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ItemsPerPageSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: #fff;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const PaginationButton = styled.button<{
  $active?: boolean;
  $disabled?: boolean;
}>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: ${(props) => (props.$active ? "#87ceeb" : "#fff")};
  color: ${(props) =>
    props.$active ? "#fff" : props.$disabled ? "#9ca3af" : "#374151"};
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? "#87ceeb" : "#f9fafb")};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{
  $variant: "primary" | "secondary" | "danger";
}>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background: #87ceeb;
          color: #fff;
          border-color: #87ceeb;
          &:hover { background: #5cacee; }
        `;
      case "secondary":
        return `
          background: #fff;
          color: #374151;
          border-color: #d1d5db;
          &:hover { background: #f9fafb; }
        `;
      case "danger":
        return `
          background: #fff;
          color: #dc2626;
          border-color: #fca5a5;
          &:hover { background: #fef2f2; }
        `;
    }
  }}
`;

const ReviewDetailSection = styled.div`
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const ReviewDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ReviewDetailInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReviewDetailContent = styled.div`
  font-size: 0.875rem;
  color: #111827;
  line-height: 1.5;
  white-space: pre-line;
`;

const ReviewDetailImages = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ReviewDetailImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #87ceeb;
    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.1);
  }
`;

const ChartContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const ChartWrapper = styled.div`
  height: 300px;
`;

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 리뷰 관리 관련 상태
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' 또는 'reviews'
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    rating: "all",
    dateRange: "all",
    keyword: "",
    status: "all",
  });

  // 차트 참조
  const ratingChartRef = useRef<HTMLDivElement>(null);

  // 리뷰 데이터 타입 정의
  interface Review {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    customerName: string;
    rating: number;
    content: string;
    date: string;
    status: "answered" | "unanswered";
    images?: string[];
    reply?: string;
    isHidden?: boolean;
  }

  // 샘플 리뷰 데이터
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 101,
      productName: "프리미엄 무선 이어폰",
      productImage:
        "https://readdy.ai/api/search-image?query=premium%2520wireless%2520earbuds%2520with%2520charging%2520case%2520on%2520clean%2520white%2520background%2520professional%2520product%2520photography%2520with%2520soft%2520shadows%2520high%2520resolution%2520detailed%2520image%2520showing%2520sleek%2520modern%2520design&width=80&height=80&seq=101&orientation=squarish",
      customerName: "김민준",
      rating: 5,
      content:
        "음질이 정말 좋아요! 노이즈 캔슬링 기능도 뛰어나고 배터리 수명도 만족스럽습니다. 디자인도 세련되고 착용감도 편안해서 장시간 사용해도 불편함이 없어요.",
      date: "2025-06-25",
      status: "answered",
      images: [
        "https://readdy.ai/api/search-image?query=person%2520wearing%2520wireless%2520earbuds%2520lifestyle%2520photo%2520showing%2520earbuds%2520in%2520ear%2520clean%2520background%2520natural%2520lighting%2520casual%2520portrait%2520showing%2520comfort%2520and%2520fit%2520of%2520earbuds&width=120&height=120&seq=201&orientation=squarish",
      ],
      reply:
        "김민준 고객님, 저희 제품에 만족해주셔서 감사합니다. 앞으로도 좋은 제품으로 보답하겠습니다.",
    },
    {
      id: 2,
      productId: 102,
      productName: "스마트 워치 프로",
      productImage:
        "https://readdy.ai/api/search-image?query=smart%2520watch%2520with%2520fitness%2520tracking%2520features%2520on%2520clean%2520white%2520background%2520professional%2520product%2520photography%2520with%2520soft%2520shadows%2520high%2520resolution%2520detailed%2520image%2520showing%2520modern%2520sleek%2520design&width=80&height=80&seq=102&orientation=squarish",
      customerName: "이서연",
      rating: 4,
      content:
        "기능이 다양하고 배터리가 오래 가서 좋아요. 심박수 측정이나 수면 패턴 분석 기능이 정확한 것 같아요. 다만 앱 연동 시 가끔 끊김 현상이 있어서 별 하나 뺐습니다.",
      date: "2025-06-24",
      status: "unanswered",
    },
    {
      id: 3,
      productId: 103,
      productName: "초경량 노트북",
      productImage:
        "https://readdy.ai/api/search-image?query=ultra%2520thin%2520lightweight%2520laptop%2520computer%2520on%2520clean%2520white%2520background%2520professional%2520product%2520photography%2520with%2520soft%2520shadows%2520high%2520resolution%2520detailed%2520image%2520showing%2520sleek%2520modern%2520design&width=80&height=80&seq=103&orientation=squarish",
      customerName: "박지훈",
      rating: 2,
      content:
        "디자인은 좋은데 발열이 심하고 배터리가 너무 빨리 닳아요. 광고에서 본 것과 실제 성능 차이가 있어서 실망스럽습니다.",
      date: "2025-06-23",
      status: "answered",
      reply:
        "박지훈 고객님, 불편을 드려 죄송합니다. 발열 문제는 최신 펌웨어 업데이트로 개선될 수 있습니다.",
    },
    {
      id: 4,
      productId: 104,
      productName: "스마트 홈 스피커",
      productImage:
        "https://readdy.ai/api/search-image?query=smart%2520home%2520speaker%2520with%2520voice%2520assistant%2520on%2520clean%2520white%2520background%2520professional%2520product%2520photography%2520with%2520soft%2520shadows%2520high%2520resolution%2520detailed%2520image%2520showing%2520modern%2520design&width=80&height=80&seq=104&orientation=squarish",
      customerName: "최수아",
      rating: 5,
      content:
        "음질도 좋고 AI 비서 기능이 정말 편리해요! 집안 전체 IoT 기기와 연동이 잘 되어서 만족스럽습니다.",
      date: "2025-06-22",
      status: "unanswered",
      images: [
        "https://readdy.ai/api/search-image?query=smart%2520home%2520speaker%2520in%2520living%2520room%2520setting%2520lifestyle%2520photo%2520showing%2520speaker%2520on%2520coffee%2520table%2520modern%2520interior%2520design%2520natural%2520lighting&width=120&height=120&seq=204&orientation=squarish",
      ],
    },
    {
      id: 5,
      productId: 105,
      productName: "프리미엄 블루투스 헤드폰",
      productImage:
        "https://readdy.ai/api/search-image?query=premium%2520over%2520ear%2520bluetooth%2520headphones%2520on%2520clean%2520white%2520background%2520professional%2520product%2520photography%2520with%2520soft%2520shadows%2520high%2520resolution%2520detailed%2520image%2520showing%2520luxury%2520design&width=80&height=80&seq=105&orientation=squarish",
      customerName: "정현우",
      rating: 1,
      content:
        "배송 중 파손되어 왔고, 소리도 한쪽에서만 나와요. 교환 요청했는데 처리가 너무 느립니다.",
      date: "2025-06-21",
      status: "answered",
      reply:
        "정현우 고객님, 불편을 드려 대단히 죄송합니다. 즉시 교환 처리해드리겠습니다.",
    },
  ]);

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProductsClick = () => {
    navigate("/products");
  };

  const handleChatClick = () => {
    navigate("/chatrooms");
  };

  // 리뷰 관리 관련 함수들
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    setCurrentPage(1);
  };

  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
    setReplyText("");
  };

  const saveReply = () => {
    if (selectedReview) {
      const updatedReviews = reviews.map((review) =>
        review.id === selectedReview.id
          ? { ...review, reply: replyText, status: "answered" as "answered" }
          : review
      );
      setReviews(updatedReviews);
      closeReviewModal();
    }
  };

  const toggleHideReview = (reviewId: number) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId
        ? { ...review, isHidden: !review.isHidden }
        : review
    );
    setReviews(updatedReviews);
  };

  const deleteReview = (reviewId: number) => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews);
    }
  };

  // 필터링된 리뷰 목록
  const filteredReviews = reviews.filter((review) => {
    if (
      filters.rating !== "all" &&
      review.rating !== parseInt(filters.rating)
    ) {
      return false;
    }

    if (filters.status !== "all" && review.status !== filters.status) {
      return false;
    }

    if (
      filters.keyword &&
      !review.content.toLowerCase().includes(filters.keyword.toLowerCase()) &&
      !review.productName
        .toLowerCase()
        .includes(filters.keyword.toLowerCase()) &&
      !review.customerName.toLowerCase().includes(filters.keyword.toLowerCase())
    ) {
      return false;
    }

    if (filters.dateRange !== "all") {
      const reviewDate = new Date(review.date);
      const today = new Date();

      if (filters.dateRange === "today") {
        const isToday =
          reviewDate.getDate() === today.getDate() &&
          reviewDate.getMonth() === today.getMonth() &&
          reviewDate.getFullYear() === today.getFullYear();
        if (!isToday) return false;
      } else if (filters.dateRange === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        if (reviewDate < oneWeekAgo) return false;
      } else if (filters.dateRange === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        if (reviewDate < oneMonthAgo) return false;
      }
    }

    return true;
  });

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // 리뷰 통계 데이터
  const reviewStats = {
    totalReviews: reviews.length,
    averageRating: (
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    ).toFixed(1),
    unansweredReviews: reviews.filter(
      (review) => review.status === "unanswered"
    ).length,
    reportedReviews: 2,
    ratingDistribution: {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    },
  };

  // 별점 차트 초기화
  useEffect(() => {
    if (ratingChartRef.current && activeTab === "reviews") {
      const chart = echarts.init(ratingChartRef.current);

      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["1점", "2점", "3점", "4점", "5점"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "리뷰 수",
            type: "bar",
            barWidth: "60%",
            data: [
              {
                value: reviewStats.ratingDistribution[1],
                itemStyle: { color: "#F87171" },
              },
              {
                value: reviewStats.ratingDistribution[2],
                itemStyle: { color: "#FBBF24" },
              },
              {
                value: reviewStats.ratingDistribution[3],
                itemStyle: { color: "#60A5FA" },
              },
              {
                value: reviewStats.ratingDistribution[4],
                itemStyle: { color: "#34D399" },
              },
              {
                value: reviewStats.ratingDistribution[5],
                itemStyle: { color: "#10B981" },
              },
            ],
          },
        ],
      };

      chart.setOption(option);

      const resizeChart = () => {
        chart.resize();
      };

      window.addEventListener("resize", resizeChart);

      return () => {
        chart.dispose();
        window.removeEventListener("resize", resizeChart);
      };
    }
  }, [reviewStats.ratingDistribution, activeTab]);

  return (
    <Container>
      <Header>
        <LogoWrapper>
          <Logo onClick={handleHomeClick} style={{ cursor: "pointer" }}>
            FeedShop
          </Logo>
        </LogoWrapper>
        <Nav>
          <NavLink onClick={handleHomeClick} style={{ cursor: "pointer" }}>
            홈
          </NavLink>
          <NavLink onClick={handleProductsClick} style={{ cursor: "pointer" }}>
            상품
          </NavLink>
          <NavLink onClick={handleChatClick} style={{ cursor: "pointer" }}>
            채팅
          </NavLink>
          <NavLink href="#" style={{ cursor: "pointer" }}>
            고객지원
          </NavLink>
          <NavLink href="#" style={{ cursor: "pointer" }}>
            회사소개
          </NavLink>
        </Nav>
        <UserMenu>
          <IconButton onClick={handleShowToast}>
            <i className="fas fa-bell"></i>
          </IconButton>
          <IconButton>
            <i className="fas fa-cog"></i>
          </IconButton>
          {nickname ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                }}
              >
                {nickname}님
              </span>
              <LoginButton
                onClick={handleLogout}
                style={{
                  backgroundColor: "rgba(220, 53, 69, 0.8)",
                  borderColor: "rgba(220, 53, 69, 0.3)",
                  fontSize: "12px",
                  padding: "6px 12px",
                }}
              >
                로그아웃
              </LoginButton>
            </div>
          ) : (
            <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
          )}
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
                <NavLink
                  onClick={() => {
                    handleHomeClick();
                    toggleMobileMenu();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  홈
                </NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink
                  onClick={() => {
                    handleProductsClick();
                    toggleMobileMenu();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  상품
                </NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink
                  onClick={() => {
                    handleChatClick();
                    toggleMobileMenu();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  채팅
                </NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#" style={{ cursor: "pointer" }}>
                  고객지원
                </NavLink>
              </MobileMenuListItem>
              <MobileMenuListItem>
                <NavLink href="#" style={{ cursor: "pointer" }}>
                  회사소개
                </NavLink>
              </MobileMenuListItem>
            </MobileMenuList>
            <MobileMenuLoginSection>
              {nickname ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      textAlign: "center",
                    }}
                  >
                    {nickname}님
                  </span>
                  <LoginButton
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    style={{ width: "100%", backgroundColor: "#dc3545" }}
                  >
                    로그아웃
                  </LoginButton>
                </div>
              ) : (
                <LoginButton
                  onClick={() => {
                    navigate("/login");
                    toggleMobileMenu();
                  }}
                  style={{ width: "100%" }}
                >
                  로그인
                </LoginButton>
              )}
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
              <SidebarItem>
                <SidebarLink onClick={() => setActiveTab("dashboard")}>
                  <SidebarIcon className="fas fa-home sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>대시보드</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => setActiveTab("reviews")}>
                  <SidebarIcon className="fas fa-star sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>리뷰 관리</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/user-manage")}>
                  <SidebarIcon className="fas fa-user sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>사용자 관리</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/report-manage")}>
                  <SidebarIcon className="fas fa-flag sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>신고 관리</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/store-home")}>
                  <SidebarIcon className="fas fa-store sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>가게 관리</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/products")}>
                  <SidebarIcon className="fas fa-chart-bar sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>상품 관리</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/stats-dashboard")}>
                  <SidebarIcon className="fas fa-chart-line sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>통계 분석</SidebarText>
                </SidebarLink>
              </SidebarItem>
              <SidebarItem>
                <SidebarLink onClick={() => navigate("/profile")}>
                  <SidebarIcon className="fas fa-cog sidebar-icon"></SidebarIcon>
                  <SidebarText $isOpen={sidebarOpen}>설정</SidebarText>
                </SidebarLink>
              </SidebarItem>
            </SidebarList>
          </SidebarNav>
        </Sidebar>

        <MainContent $sidebarOpen={sidebarOpen}>
          <ContentPadding>
            <Breadcrumb>
              <BreadcrumbLink
                onClick={handleHomeClick}
                style={{ cursor: "pointer" }}
              >
                홈
              </BreadcrumbLink>{" "}
              <span className="mx-2">/</span>{" "}
              <BreadcrumbLink>
                {activeTab === "dashboard" ? "대시보드" : "리뷰 관리"}
              </BreadcrumbLink>
            </Breadcrumb>

            <PageTitle>
              {activeTab === "dashboard" ? "대시보드" : "리뷰 관리"}
            </PageTitle>

            {/* 탭 컨테이너 */}
            <TabContainer>
              <TabButton
                $active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              >
                대시보드
              </TabButton>
              <TabButton
                $active={activeTab === "reviews"}
                onClick={() => setActiveTab("reviews")}
              >
                리뷰 관리
              </TabButton>
            </TabContainer>

            {/* 대시보드 탭 내용 */}
            {activeTab === "dashboard" && (
              <>
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
                      <i
                        className="fas fa-users"
                        style={{ color: "#87ceeb" }}
                      ></i>
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
                      <i
                        className="fas fa-eye"
                        style={{ color: "#ff9800" }}
                      ></i>
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
              </>
            )}

            {/* 리뷰 관리 탭 내용 */}
            {activeTab === "reviews" && (
              <>
                {/* 리뷰 통계 */}
                <ReviewStatsGrid>
                  <ReviewStatCard>
                    <ReviewStatIcon $bgColor="#dbeafe" $textColor="#3b82f6">
                      <i className="fas fa-star"></i>
                    </ReviewStatIcon>
                    <ReviewStatContent>
                      <ReviewStatTitle>평균 별점</ReviewStatTitle>
                      <ReviewStatValue>
                        {reviewStats.averageRating}
                      </ReviewStatValue>
                    </ReviewStatContent>
                  </ReviewStatCard>

                  <ReviewStatCard>
                    <ReviewStatIcon $bgColor="#dcfce7" $textColor="#16a34a">
                      <i className="fas fa-comments"></i>
                    </ReviewStatIcon>
                    <ReviewStatContent>
                      <ReviewStatTitle>전체 리뷰</ReviewStatTitle>
                      <ReviewStatValue>
                        {reviewStats.totalReviews}
                      </ReviewStatValue>
                    </ReviewStatContent>
                  </ReviewStatCard>

                  <ReviewStatCard>
                    <ReviewStatIcon $bgColor="#fef3c7" $textColor="#d97706">
                      <i className="fas fa-clock"></i>
                    </ReviewStatIcon>
                    <ReviewStatContent>
                      <ReviewStatTitle>미답변 리뷰</ReviewStatTitle>
                      <ReviewStatValue>
                        {reviewStats.unansweredReviews}
                      </ReviewStatValue>
                    </ReviewStatContent>
                  </ReviewStatCard>

                  <ReviewStatCard>
                    <ReviewStatIcon $bgColor="#fee2e2" $textColor="#dc2626">
                      <i className="fas fa-flag"></i>
                    </ReviewStatIcon>
                    <ReviewStatContent>
                      <ReviewStatTitle>신고된 리뷰</ReviewStatTitle>
                      <ReviewStatValue>
                        {reviewStats.reportedReviews}
                      </ReviewStatValue>
                    </ReviewStatContent>
                  </ReviewStatCard>
                </ReviewStatsGrid>

                {/* 별점 분포 차트 */}
                <ChartContainer>
                  <ChartTitle>별점 분포</ChartTitle>
                  <ChartWrapper ref={ratingChartRef}></ChartWrapper>
                </ChartContainer>

                {/* 리뷰 필터 */}
                <FilterSection>
                  <FilterHeader>
                    <FilterTitle>리뷰 필터</FilterTitle>
                  </FilterHeader>
                  <FilterContent>
                    <FilterGrid>
                      <FilterGroup>
                        <FilterLabel>별점</FilterLabel>
                        <FilterSelect
                          value={filters.rating}
                          onChange={(e) =>
                            handleFilterChange("rating", e.target.value)
                          }
                        >
                          <option value="all">전체 별점</option>
                          <option value="5">5점</option>
                          <option value="4">4점</option>
                          <option value="3">3점</option>
                          <option value="2">2점</option>
                          <option value="1">1점</option>
                        </FilterSelect>
                      </FilterGroup>

                      <FilterGroup>
                        <FilterLabel>날짜 범위</FilterLabel>
                        <FilterSelect
                          value={filters.dateRange}
                          onChange={(e) =>
                            handleFilterChange("dateRange", e.target.value)
                          }
                        >
                          <option value="all">전체 기간</option>
                          <option value="today">오늘</option>
                          <option value="week">최근 7일</option>
                          <option value="month">최근 30일</option>
                        </FilterSelect>
                      </FilterGroup>

                      <FilterGroup>
                        <FilterLabel>답변 상태</FilterLabel>
                        <FilterSelect
                          value={filters.status}
                          onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                          }
                        >
                          <option value="all">전체 상태</option>
                          <option value="answered">답변 완료</option>
                          <option value="unanswered">미답변</option>
                        </FilterSelect>
                      </FilterGroup>
                    </FilterGrid>

                    <FilterGroup>
                      <FilterLabel>키워드 검색</FilterLabel>
                      <FilterInput
                        type="text"
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
                        }
                        placeholder="상품명, 리뷰 내용, 작성자 검색"
                      />
                    </FilterGroup>
                  </FilterContent>
                </FilterSection>

                {/* 리뷰 테이블 */}
                <ReviewTableContainer>
                  <ReviewTableHeader>
                    <ReviewTableTitle>리뷰 목록</ReviewTableTitle>
                    <ReviewCount>
                      총 {filteredReviews.length}개의 리뷰
                    </ReviewCount>
                  </ReviewTableHeader>

                  <div style={{ overflowX: "auto" }}>
                    <ReviewTable>
                      <ReviewTableHead>
                        <tr>
                          <ReviewTableHeaderCell>
                            상품 정보
                          </ReviewTableHeaderCell>
                          <ReviewTableHeaderCell>별점</ReviewTableHeaderCell>
                          <ReviewTableHeaderCell>
                            리뷰 내용
                          </ReviewTableHeaderCell>
                          <ReviewTableHeaderCell>작성자</ReviewTableHeaderCell>
                          <ReviewTableHeaderCell>작성일</ReviewTableHeaderCell>
                          <ReviewTableHeaderCell>상태</ReviewTableHeaderCell>
                          <ReviewTableHeaderCell style={{ textAlign: "right" }}>
                            관리
                          </ReviewTableHeaderCell>
                        </tr>
                      </ReviewTableHead>
                      <ReviewTableBody>
                        {currentReviews.length > 0 ? (
                          currentReviews.map((review) => (
                            <ReviewTableRow
                              key={review.id}
                              $isHidden={review.isHidden}
                            >
                              <ReviewTableCell>
                                <ProductInfo>
                                  <ProductImage
                                    src={review.productImage}
                                    alt={review.productName}
                                  />
                                  <ProductDetails>
                                    <ProductName>
                                      {review.productName}
                                    </ProductName>
                                    <ProductId>
                                      상품 ID: {review.productId}
                                    </ProductId>
                                  </ProductDetails>
                                </ProductInfo>
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <RatingDisplay>
                                  <RatingValue>{review.rating}</RatingValue>
                                  <StarContainer>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className="fas fa-star"
                                        $filled={review.rating >= star}
                                      />
                                    ))}
                                  </StarContainer>
                                </RatingDisplay>
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <ReviewContent>
                                  <ReviewText>{review.content}</ReviewText>
                                  {review.images &&
                                    review.images.length > 0 && (
                                      <ReviewImages>
                                        <ImageIcon>
                                          <i className="fas fa-image"></i>
                                        </ImageIcon>
                                        <ImageCount>
                                          {review.images.length}개의 이미지
                                        </ImageCount>
                                      </ReviewImages>
                                    )}
                                </ReviewContent>
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <div
                                  style={{ fontWeight: 500, color: "#111827" }}
                                >
                                  {review.customerName}
                                </div>
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <div style={{ color: "#6b7280" }}>
                                  {review.date}
                                </div>
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <StatusBadge $status={review.status}>
                                  {review.status === "answered"
                                    ? "답변 완료"
                                    : "미답변"}
                                </StatusBadge>
                                {review.isHidden && (
                                  <HiddenBadge>숨김</HiddenBadge>
                                )}
                              </ReviewTableCell>
                              <ReviewTableCell>
                                <ActionButtons>
                                  <ActionButton
                                    $variant="view"
                                    onClick={() => openReviewModal(review)}
                                    title="상세 보기"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </ActionButton>
                                  <ActionButton
                                    $variant="hide"
                                    onClick={() => toggleHideReview(review.id)}
                                    title={
                                      review.isHidden ? "표시하기" : "숨기기"
                                    }
                                  >
                                    <i
                                      className={`fas ${
                                        review.isHidden
                                          ? "fa-eye"
                                          : "fa-eye-slash"
                                      }`}
                                    ></i>
                                  </ActionButton>
                                  <ActionButton
                                    $variant="delete"
                                    onClick={() => deleteReview(review.id)}
                                    title="삭제"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </ActionButton>
                                </ActionButtons>
                              </ReviewTableCell>
                            </ReviewTableRow>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                padding: "40px 16px",
                                textAlign: "center",
                                color: "#6b7280",
                              }}
                            >
                              <i
                                className="fas fa-search"
                                style={{
                                  fontSize: "2rem",
                                  marginBottom: "12px",
                                  display: "block",
                                }}
                              ></i>
                              검색 결과가 없습니다.
                            </td>
                          </tr>
                        )}
                      </ReviewTableBody>
                    </ReviewTable>
                  </div>

                  {/* 페이지네이션 */}
                  {filteredReviews.length > 0 && (
                    <PaginationContainer>
                      <PaginationInfo>
                        전체 <strong>{filteredReviews.length}</strong>개 중{" "}
                        <strong>{indexOfFirstItem + 1}</strong>-
                        <strong>
                          {indexOfLastItem > filteredReviews.length
                            ? filteredReviews.length
                            : indexOfLastItem}
                        </strong>
                        번
                      </PaginationInfo>
                      <PaginationControls>
                        <ItemsPerPageSelect
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <option value={5}>5개씩 보기</option>
                          <option value={10}>10개씩 보기</option>
                          <option value={20}>20개씩 보기</option>
                        </ItemsPerPageSelect>
                        <PaginationButtons>
                          <PaginationButton
                            onClick={() =>
                              paginate(currentPage > 1 ? currentPage - 1 : 1)
                            }
                            disabled={currentPage === 1}
                            $disabled={currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </PaginationButton>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((number) => (
                            <PaginationButton
                              key={number}
                              onClick={() => paginate(number)}
                              $active={currentPage === number}
                            >
                              {number}
                            </PaginationButton>
                          ))}

                          <PaginationButton
                            onClick={() =>
                              paginate(
                                currentPage < totalPages
                                  ? currentPage + 1
                                  : totalPages
                              )
                            }
                            disabled={currentPage === totalPages}
                            $disabled={currentPage === totalPages}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </PaginationButton>
                        </PaginationButtons>
                      </PaginationControls>
                    </PaginationContainer>
                  )}
                </ReviewTableContainer>
              </>
            )}
          </ContentPadding>
        </MainContent>
      </FlexContainer>

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
