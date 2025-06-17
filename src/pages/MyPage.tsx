import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;

const UserInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #666;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const MenuCard = styled(Link)`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MenuTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const MenuDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const RecentOrders = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const OrderNumber = styled.span`
  font-weight: bold;
  color: #333;
`;

const OrderDate = styled.span`
  color: #666;
`;

const OrderStatus = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${(props) => {
    switch (props.status) {
      case "배송중":
        return "#e3f2fd";
      case "배송완료":
        return "#e8f5e9";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "배송중":
        return "#1976d2";
      case "배송완료":
        return "#2e7d32";
      default:
        return "#666";
    }
  }};
`;

const MyPage: React.FC = () => {
  // 임시 사용자 데이터
  const user = {
    name: "홍길동",
    email: "hong@example.com",
  };

  // 임시 주문 데이터
  const recentOrders = [
    {
      id: "1",
      date: "2024-03-15",
      status: "배송중",
      items: ["프리미엄 티셔츠", "스니커즈"],
    },
    {
      id: "2",
      date: "2024-03-10",
      status: "배송완료",
      items: ["청바지"],
    },
  ];

  return (
    <MyPageContainer>
      <Header>
        <Title>마이페이지</Title>
      </Header>
      <UserInfo>
        <UserName>{user.name}님</UserName>
        <UserEmail>{user.email}</UserEmail>
      </UserInfo>
      <MenuGrid>
        <MenuCard to="/recentview">
          <MenuTitle>최근 본 상품</MenuTitle>
          <MenuDescription>
            최근 본 상품을 확인하세요.
          </MenuDescription>
        </MenuCard>
        <MenuCard to="/wishlist">
          <MenuTitle>찜한 상품</MenuTitle>
          <MenuDescription>관심 있는 상품을 모아보세요.</MenuDescription>
        </MenuCard>
        <MenuCard to="/reviews">
          <MenuTitle>리뷰 관리</MenuTitle>
          <MenuDescription>작성한 리뷰를 관리하세요.</MenuDescription>
        </MenuCard>
        <MenuCard to="/profile">
          <MenuTitle>프로필 설정</MenuTitle>
          <MenuDescription>개인정보를 수정하세요.</MenuDescription>
        </MenuCard>
      </MenuGrid>
      <RecentOrders>
        <SectionTitle>최근 주문</SectionTitle>
        <OrderList>
          {recentOrders.map((order) => (
            <OrderItem key={order.id}>
              <OrderHeader>
                <OrderNumber>주문번호: {order.id}</OrderNumber>
                <OrderDate>{order.date}</OrderDate>
              </OrderHeader>
              <div>
                <p>{order.items.join(", ")}</p>
                <OrderStatus status={order.status}>{order.status}</OrderStatus>
              </div>
            </OrderItem>
          ))}
        </OrderList>
      </RecentOrders>
    </MyPageContainer>
  );
};

export default MyPage;
