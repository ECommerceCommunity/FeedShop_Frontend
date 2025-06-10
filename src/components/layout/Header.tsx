import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
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

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">쇼핑몰</Logo>
      <Nav>
        <NavLink to="/products">상품</NavLink>
        <NavLink to="/categories">카테고리</NavLink>
        <NavLink to="/events">이벤트</NavLink>
        <NavLink to="/chatrooms">채팅방</NavLink>
      </Nav>
      <UserSection>
        <NavLink to="/cart">장바구니</NavLink>
        <NavLink to="/mypage">마이페이지</NavLink>
        <NavLink to="/login">로그인</NavLink>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
