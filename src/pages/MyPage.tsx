import React, { useEffect, useState } from "react";
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

const OrderContent = styled.div`
  margin-bottom: 12px;
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
  const [recentOrders, setRecentOrders] = useState<
    {
      order_id: number;
      ordered_at: string;
      status: string;
      products: { name: string }[];
    }[]
  >([]);
  // 임시 사용자 데이터
  const user = {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
  };

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = orders
      .filter((order: any) => order.user_id === user.id)
      .sort(
        (a: any, b: any) =>
          new Date(b.ordered_at).getTime() - new Date(a.ordered_at).getTime()
      )
      .slice(0, 5);

    setRecentOrders(userOrders);
  }, [user.id]);

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
          <MenuDescription>최근 본 상품을 확인하세요.</MenuDescription>
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
          {recentOrders.length === 0 ? (
            <p>최근 주문 내역이 없습니다.</p>
          ) : (
            recentOrders.map((order) => (
              <OrderItem key={order.order_id}>
                <OrderHeader>
                  <OrderNumber>주문번호: {order.order_id}</OrderNumber>
                  <OrderDate>
                    {new Date(order.ordered_at).toLocaleDateString()}
                  </OrderDate>
                </OrderHeader>
                <div>
                  <OrderContent>
                    {order.products.map((p: any) => (
                      <div key={p.name}>{p.name}</div>
                    ))}
                  </OrderContent>
                  <OrderStatus status={convertStatus(order.status)}>
                    {convertStatus(order.status)}
                  </OrderStatus>
                </div>
              </OrderItem>
            ))
          )}
        </OrderList>
      </RecentOrders>
    </MyPageContainer>
  );
};

const convertStatus = (status: string) => {
  switch (status) {
    case "ORDERED":
      return "주문완료";
    case "SHIPPED":
      return "배송중";
    case "DELIVERED":
      return "배송완료";
    case "CANCELLED":
      return "취소됨";
    case "RETURNED":
      return "반품됨";
    default:
      return "처리중";
  }
};

export default MyPage;
