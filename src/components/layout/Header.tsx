import { FC, useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";

// 애니메이션 정의
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.2);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 40;
  animation: ${slideDown} 0.4s ease-out;
  border-bottom: 1px solid rgba(249, 115, 22, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  margin-right: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: rgba(249, 115, 22, 0.2);
    color: white;
    transform: scale(1.1);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: white;
  text-decoration: none;
  margin-right: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff, #fef3c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 4px 8px rgba(249, 115, 22, 0.4);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 2;

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
      rgba(249, 115, 22, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: rgba(249, 115, 22, 0.2);
    color: white;
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: 20px;
  z-index: 2;

  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;

const SearchInput = styled.input`
  width: 300px;
  height: 40px;
  padding: 0 40px 0 16px;
  border: 2px solid rgba(249, 115, 22, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(249, 115, 22, 0.6);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }

  svg {
    width: 14px;
    height: 14px;
    color: white;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 2;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);

  &:hover {
    background: rgba(249, 115, 22, 0.2);
    border-color: rgba(249, 115, 22, 0.4);
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
  font-size: 14px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(10px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: rgba(249, 115, 22, 0.2);
    color: white;
    transform: translateX(4px);
  }

  i {
    width: 16px;
    color: rgba(249, 115, 22, 0.8);
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: white;
    transform: translateX(4px);
  }

  i {
    width: 16px;
    color: rgba(239, 68, 68, 0.8);
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(249, 115, 22, 0.2);
  margin: 8px 0;
`;

const UserButton = styled.button`
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.1));
  border: 1px solid rgba(249, 115, 22, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(239, 68, 68, 0.2));
    border-color: rgba(249, 115, 22, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  }
`;

const LoginButton = styled(Link)`
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ea580c, #dc2626);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid rgba(249, 115, 22, 0.4);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(249, 115, 22, 0.2);
    border-color: rgba(249, 115, 22, 0.6);
    color: white;
    transform: translateY(-2px);
  }
`;

const CartLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 8px;
    gap: 4px;
  }
`;

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <MenuButton onClick={onMenuClick} aria-label="메뉴 열기">
        <i className="fas fa-bars"></i>
      </MenuButton>
      <Logo to="/">FeedShop</Logo>
      <Nav>
        <NavLink to="/products">
          <i className="fas fa-shopping-bag" style={{ marginRight: "8px" }}></i>
          상품
        </NavLink>
        <NavLink to="/categories">
          <i className="fas fa-th-large" style={{ marginRight: "8px" }}></i>
          카테고리
        </NavLink>
        <NavLink to="/event-list">
          <i className="fas fa-gift" style={{ marginRight: "8px" }}></i>
          이벤트
        </NavLink>
      </Nav>
      <UserSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchButton type="submit" onClick={handleSearch}>
            <MagnifyingGlassIcon />
          </SearchButton>
        </SearchContainer>
        <CartLink to="/cart">
          <i className="fas fa-shopping-cart"></i>
          장바구니
        </CartLink>
        {user && user.nickname && user.nickname.trim() !== "" ? (
          <UserMenu ref={userMenuRef}>
            <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
              <UserAvatar>{getInitials(user.nickname)}</UserAvatar>
              <UserName>{user.nickname}님</UserName>
            </UserInfo>
            {showUserMenu && (
              <DropdownMenu>
                {user && user.userType === "admin" ? (
                  <DropdownItem to="/admin-dashboard">
                    <i className="fas fa-chart-line"></i>
                    관리자 대시보드
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    to={
                      user && user.userType === "seller"
                        ? "/seller-mypage"
                        : "/mypage"
                    }
                  >
                    <i className="fas fa-user"></i>
                    마이페이지
                  </DropdownItem>
                )}
                {user && user.userType !== "admin" && (
                  <DropdownItem to="/profile-settings">
                    <i className="fas fa-cog"></i>
                    프로필 설정
                  </DropdownItem>
                )}
                {user && user.userType === "user" && (
                  <DropdownItem to="/become-seller">
                    <i className="fas fa-store"></i>
                    판매자 전환
                  </DropdownItem>
                )}
                <DropdownDivider />
                <DropdownButton onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  로그아웃
                </DropdownButton>
              </DropdownMenu>
            )}
          </UserMenu>
        ) : (
          <LoginButton to="/login">
            <i
              className="fas fa-sign-in-alt"
              style={{ marginRight: "8px" }}
            ></i>
            로그인
          </LoginButton>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
