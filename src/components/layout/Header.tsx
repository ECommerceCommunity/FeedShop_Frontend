import { FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";

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
  z-index: 1000;
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

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
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
        <NavLink to="/mypage">마이페이지</NavLink>
        <NavLink to="/login">로그인</NavLink>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
