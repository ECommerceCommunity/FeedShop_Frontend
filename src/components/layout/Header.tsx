import { FC, useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 40;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
  margin-right: 40px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-size: 16px;

  &:hover {
    color: var(--primary-color);
  }
`;

const UserSection = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  margin-right: 16px;
  cursor: pointer;
  color: var(--primary-color);
  display: flex;
  align-items: center;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 6px 32px 6px 12px; /* 오른쪽 공간 확보 */
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 220px;
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  color: var(--primary-color);
  cursor: pointer; /* 손가락 커서 표시 */
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
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(135, 206, 235, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
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
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 50;
  margin-top: 4px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 8px 16px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
`;

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { nickname, logout } = useAuth();
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
        &#9776;
      </MenuButton>
      <Logo to="/">feedShop</Logo>
      <Nav>
        <NavLink to="/products">상품</NavLink>
        <NavLink to="/categories">카테고리</NavLink>
        <NavLink to="/events">이벤트</NavLink>
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
        <NavLink to="/cart">장바구니</NavLink>
        {nickname && nickname.trim() !== "" ? (
          <UserMenu ref={userMenuRef}>
            <UserInfo onClick={() => setShowUserMenu(!showUserMenu)}>
              <UserAvatar>{getInitials(nickname)}</UserAvatar>
              <UserName>{nickname}님</UserName>
            </UserInfo>
            {showUserMenu && (
              <DropdownMenu>
                <DropdownItem to="/mypage">마이페이지</DropdownItem>
                <DropdownItem to="/profile-settings">프로필 설정</DropdownItem>
                <DropdownDivider />
                <DropdownButton onClick={handleLogout}>로그아웃</DropdownButton>
              </DropdownMenu>
            )}
          </UserMenu>
        ) : (
          <NavLink to="/login">로그인</NavLink>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
