import { FC } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation } from "react-router-dom";

// 애니메이션 정의
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const SidebarContainer = styled.aside<{ open: boolean }>`
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  padding: 0;
  z-index: 100;
  transform: translateX(${({ open }) => (open ? "0" : "-100%")});
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
`;

const SidebarHeader = styled.div`
  padding: 30px 20px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const SidebarLogo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SidebarSubtitle = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
`;

const MenuSection = styled.div`
  margin-bottom: 30px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const MenuTitle = styled.h3`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 0 20px;
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 50%;
    width: 20px;
    height: 2px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.5), transparent);
    transform: translateY(-50%);
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 8px;
  padding: 0 15px;
`;

const MenuLink = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: ${(props) => (props.active ? "#ffffff" : "rgba(255, 255, 255, 0.8)")};
  text-decoration: none;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"
      : "transparent"};
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

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
    color: #ffffff;
    transform: translateX(5px);

    &::before {
      left: 100%;
    }
  }

  &:hover .menu-icon {
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

const MenuIcon = styled.i<{ active?: boolean }>`
  width: 20px;
  margin-right: 15px;
  font-size: 16px;
  color: ${(props) => (props.active ? "#ffffff" : "rgba(255, 255, 255, 0.7)")};
  transition: all 0.3s ease;

  &.menu-icon {
    transition: all 0.3s ease;
  }
`;

const MenuText = styled.span`
  flex: 1;
  transition: all 0.3s ease;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  text-align: center;
`;

const SidebarFooterText = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
`;

const QuickStats = styled.div`
  padding: 20px;
  margin: 20px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const QuickStatsTitle = styled.h4`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const QuickStatItem = styled.div`
  text-align: center;
`;

const QuickStatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 4px;
`;

const QuickStatLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 99;
`;

const Sidebar: FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <>
      <Overlay open={open} onClick={onClose} />
      <SidebarContainer open={open}>
        <SidebarHeader>
          <SidebarLogo>FeedShop</SidebarLogo>
          <SidebarSubtitle>스마트한 쇼핑 경험</SidebarSubtitle>
        </SidebarHeader>

        <QuickStats>
          <QuickStatsTitle>오늘의 현황</QuickStatsTitle>
          <QuickStatsGrid>
            <QuickStatItem>
              <QuickStatValue>127</QuickStatValue>
              <QuickStatLabel>방문자</QuickStatLabel>
            </QuickStatItem>
            <QuickStatItem>
              <QuickStatValue>23</QuickStatValue>
              <QuickStatLabel>주문</QuickStatLabel>
            </QuickStatItem>
            <QuickStatItem>
              <QuickStatValue>₩890K</QuickStatValue>
              <QuickStatLabel>매출</QuickStatLabel>
            </QuickStatItem>
            <QuickStatItem>
              <QuickStatValue>4.8</QuickStatValue>
              <QuickStatLabel>평점</QuickStatLabel>
            </QuickStatItem>
          </QuickStatsGrid>
        </QuickStats>

        <MenuSection>
          <MenuTitle>쇼핑</MenuTitle>
          <MenuList>
            <MenuItem>
              <MenuLink
                to="/products"
                active={location.pathname === "/products"}
              >
                <MenuIcon
                  className="fas fa-shopping-bag menu-icon"
                  active={location.pathname === "/products"}
                />
                <MenuText>전체 상품</MenuText>
                {location.pathname === "/products" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/new" active={location.pathname === "/new"}>
                <MenuIcon
                  className="fas fa-star menu-icon"
                  active={location.pathname === "/new"}
                />
                <MenuText>신상품</MenuText>
                {location.pathname === "/new" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/best" active={location.pathname === "/best"}>
                <MenuIcon
                  className="fas fa-crown menu-icon"
                  active={location.pathname === "/best"}
                />
                <MenuText>베스트</MenuText>
                {location.pathname === "/best" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
          </MenuList>
        </MenuSection>

        <MenuSection>
          <MenuTitle>피드</MenuTitle>
          <MenuList>
            <MenuItem>
              <MenuLink to="/my-feed" active={location.pathname === "/my-feed"}>
                <MenuIcon className="fas fa-user menu-icon" active={location.pathname === "/my-feed"} />
                <MenuText>마이 피드</MenuText>
                {location.pathname === "/my-feed" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/feed-list" active={location.pathname === "/feed-list"}>
                <MenuIcon className="fas fa-list menu-icon" active={location.pathname === "/feed-list"} />
                <MenuText>피드 목록</MenuText>
                {location.pathname === "/feed-list" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
          </MenuList>
        </MenuSection>

        <MenuSection>
          <MenuTitle>마이페이지</MenuTitle>
          <MenuList>
            <MenuItem>
              <MenuLink
                to="/wishlist"
                active={location.pathname === "/wishlist"}
              >
                <MenuIcon
                  className="fas fa-heart menu-icon"
                  active={location.pathname === "/wishlist"}
                />
                <MenuText>찜한 상품</MenuText>
                {location.pathname === "/wishlist" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink
                to="/recentview"
                active={location.pathname === "/recentview"}
              >
                <MenuIcon
                  className="fas fa-clock menu-icon"
                  active={location.pathname === "/recentview"}
                />
                <MenuText>최근 본 상품</MenuText>
                {location.pathname === "/recentview" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/cart" active={location.pathname === "/cart"}>
                <MenuIcon
                  className="fas fa-shopping-cart menu-icon"
                  active={location.pathname === "/cart"}
                />
                <MenuText>장바구니</MenuText>
                {location.pathname === "/cart" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/orders" active={location.pathname === "/orders"}>
                <MenuIcon
                  className="fas fa-box menu-icon"
                  active={location.pathname === "/orders"}
                />
                <MenuText>주문 내역</MenuText>
                {location.pathname === "/orders" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
          </MenuList>
        </MenuSection>

        <MenuSection>
          <MenuTitle>고객 지원</MenuTitle>
          <MenuList>
            <MenuItem>
              <MenuLink to="/reviews" active={location.pathname === "/reviews"}>
                <MenuIcon
                  className="fas fa-star menu-icon"
                  active={location.pathname === "/reviews"}
                />
                <MenuText>리뷰 관리</MenuText>
                {location.pathname === "/reviews" && <ActiveIndicator />}
              </MenuLink>
            </MenuItem>
          </MenuList>
        </MenuSection>

        <SidebarFooter>
          <SidebarFooterText>
            © 2025 FeedShop
            <br />
            모든 권리 보유
          </SidebarFooterText>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
