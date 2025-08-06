import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OrderService } from "api/orderService";
import { OrderListItem } from "types/order";
import { toUrl } from "utils/common/images";

// 주문 상태 한글 레이블 매핑
const statusLabels: Record<string, string> = {
  ORDERED: "주문완료",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
  RETURNED: "반품",
};

const Section = styled.section`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 12px;
`;

const OrderThumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderName = styled.p`
  font-weight: 600;
  margin: 0;
`;

const OrderDate = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const OrderStatus = styled.span`
  background: #f97316;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

interface MyRecentOrdersProps {
  maxItems?: number;
}

const MyRecentOrders: React.FC<MyRecentOrdersProps> = ({ maxItems = 5 }) => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getOrders(0, maxItems);
        setOrders(response.content);
      } catch (error: any) {
        console.error("주문 목록 조회 실패:", error);
        setError("주문 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [maxItems]);

  return (
    <Section>
      <SectionTitle>최근 주문 내역</SectionTitle>
      {loading ? (
        <LoadingState>주문 내역을 불러오는 중...</LoadingState>
      ) : error ? (
        <ErrorState>{error}</ErrorState>
      ) : orders.length === 0 ? (
        <EmptyState>주문 내역이 없습니다.</EmptyState>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderItem key={order.orderId}>
              <OrderThumbnail
                src={
                  order.items[0]
                    ? toUrl(order.items[0].imageUrl)
                    : "/placeholder-image.jpg"
                }
                alt={order.items[0]?.productName || "상품"}
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              <OrderInfo>
                <OrderName>
                  {order.items[0]?.productName || "상품"}
                  {order.items.length > 1 && ` 외 ${order.items.length - 1}개`}
                </OrderName>
                <OrderDate>
                  {new Date(order.orderedAt).toLocaleDateString()}
                </OrderDate>
              </OrderInfo>
              <OrderStatus>
                {statusLabels[order.status] || order.status}
              </OrderStatus>
            </OrderItem>
          ))}
        </OrdersList>
      )}
    </Section>
  );
};

export default MyRecentOrders;
