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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 40;
  animation: ${slideDown} 0.4s ease-out;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin-right: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
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
  border-radius: 8px;
  transition: all 0.3s ease;
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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }
`;

const UserSection = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 20px;
  margin-right: 16px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    animation: ${pulse} 0.6s ease-in-out;
  }

  @media (max-width: 768px) {
    margin-right: 12px;
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  margin-right: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 40px 10px 16px;
  border-radius: 25px;
  border: none;
  font-size: 14px;
  width: 240px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  &::placeholder {
    color: #666;
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #764ba2;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: white;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    background-color: rgba(135, 206, 235, 0.1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 50;
  margin-top: 8px;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px;

  &:hover {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateX(5px);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
    margin-top: 8px;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
    margin-bottom: 8px;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px;

  &:hover {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    transform: translateX(5px);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
    margin-top: 8px;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
    margin-bottom: 8px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 8px 16px;
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

const LoginLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
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
        <SearchForm onSubmit={handleSearch}>
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchIcon />
          </SearchWrapper>
        </SearchForm>
        <CartLink to="/cart">
          <i className="fas fa-shopping-cart"></i>
          장바구니
        </CartLink>
        {user ? (
          <UserMenu ref={userMenuRef}>
            <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
              <UserAvatar>{getInitials(user.nickname)}</UserAvatar>
              <UserName>
                {user.nickname}님
                {user.userType === "admin" && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#fbbf24",
                      marginLeft: "4px",
                    }}
                  >
                    관리자
                  </span>
                )}
              </UserName>
            </UserInfo>
            {showUserMenu && (
              <DropdownMenu>
                <DropdownItem to="/mypage">
                  <i className="fas fa-user"></i>
                  마이페이지
                </DropdownItem>
                <DropdownItem to="/profile-settings">
                  <i className="fas fa-cog"></i>
                  프로필 설정
                </DropdownItem>
                {user.userType === "customer" && (
                  <DropdownItem to="/become-admin">
                    <i className="fas fa-user-shield"></i>
                    관리자 전환
                  </DropdownItem>
                )}
                {user.userType === "admin" && (
                  <DropdownItem to="/admin-dashboard">
                    <i className="fas fa-chart-line"></i>
                    관리자 대시보드
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
          <LoginLink to="/login">
            <i
              className="fas fa-sign-in-alt"
              style={{ marginRight: "8px" }}
            ></i>
            로그인
          </LoginLink>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
