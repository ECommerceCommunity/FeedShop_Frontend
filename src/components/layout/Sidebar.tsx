import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 250px;
  background-color: var(--background-color);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  z-index: 900;
`;

const MenuSection = styled.div`
  margin-bottom: 30px;
`;

const MenuTitle = styled.h3`
  font-size: 14px;
  color: #666;
  padding: 0 20px;
  margin-bottom: 10px;
`;

const MenuList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  margin-bottom: 5px;
`;

const MenuLink = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: ${(props) =>
    props.active ? "var(--primary-color)" : "var(--text-color)"};
  text-decoration: none;
  font-size: 14px;
  background-color: ${(props) =>
    props.active ? "rgba(135, 206, 235, 0.1)" : "transparent"};

  &:hover {
    background-color: rgba(135, 206, 235, 0.1);
    color: var(--primary-color);
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <MenuSection>
        <MenuTitle>쇼핑</MenuTitle>
        <MenuList>
          <MenuItem>
            <MenuLink to="/products" active={location.pathname === "/products"}>
              전체 상품
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/new" active={location.pathname === "/new"}>
              신상품
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/best" active={location.pathname === "/best"}>
              베스트
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <MenuSection>
        <MenuTitle>마이페이지</MenuTitle>
        <MenuList>
          <MenuItem>
            <MenuLink
              to="/mypage/recentview"
              active={location.pathname === "/mypage/recentview"}
            >
              최근본상품
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              to="/mypage/wishlist"
              active={location.pathname === "/mypage/wishlist"}
            >
              찜한상품
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              to="/mypage/reviews"
              active={location.pathname === "/mypage/reviews"}
            >
              리뷰관리
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              to="/mypage/profile"
              active={location.pathname === "/mypage/profile"}
            >
              프로필설정
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <MenuSection>
        <MenuTitle>채팅</MenuTitle>
        <MenuList>
          <MenuItem>
            <MenuLink
              to="/chatrooms"
              active={location.pathname === "/chatrooms"}
            >
              채팅방 목록
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>
    </SidebarContainer>
  );
};

export default Sidebar;
