import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "types/types";
import Fail from "components/modal/Fail";

const Container = styled.div`
  max-width: 960px;
  margin: 60px auto;
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 32px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 8px;
`;

const InfoRow = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
`;

const Bold = styled.span`
  font-weight: 600;
  color: #111827;
`;

const ProductList = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

const ProductItem = styled.li`
  margin-bottom: 8px;
  font-size: 15px;
  color: #374151;
`;

const TotalSummary = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 8px;
`;

const TotalAmount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  text-align: right;
  margin-top: 12px;
`;

const ThankYou = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #4b5563;
`;

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = orders.find((order: any) => orderId === order.orderId);
    setOrderInfo(order);
  }, [orderId]);

  if (orderInfo === null) {
    return null;
  }

  return (
    <>
      {showAccessModal && (
        <Fail
          title="접근 실패"
          message="잘못된 접근입니다."
          onClose={() => setShowAccessModal(false)}
        />
      )}
      <Container>
        <Card>
          <SectionTitle>배송 정보</SectionTitle>
          <InfoRow>
            <Bold>수령인:</Bold> {orderInfo.shippingInfo.recipientName}
          </InfoRow>
          <InfoRow>
            <Bold>연락처:</Bold> {orderInfo.shippingInfo.recipientPhone}
          </InfoRow>
          <InfoRow>
            <Bold>주소:</Bold> ({orderInfo.shippingInfo.postalCode}){" "}
            {orderInfo.shippingInfo.deliveryAddress}{" "}
            {orderInfo.shippingInfo.detailDeliveryAddress}
          </InfoRow>
          <InfoRow>
            <Bold>요청사항:</Bold>{" "}
            {orderInfo.shippingInfo.deliveryMessage || "없음"}
          </InfoRow>
        </Card>

        <Card>
          <SectionTitle>주문 상품</SectionTitle>
          <ProductList>
            {orderInfo.items.map((item) => (
              <ProductItem key={item.id}>
                {item.name} / {item.price.toLocaleString()}원 / {item.option} ×{" "}
                {item.quantity}개
              </ProductItem>
            ))}
          </ProductList>
        </Card>

        <Card>
          <SectionTitle>결제 정보</SectionTitle>
          <InfoRow>
            <Bold>결제 수단:</Bold> {orderInfo.paymentInfo.paymentMethod}
          </InfoRow>
          {orderInfo.paymentInfo.paymentMethod === "카드" && (
            <>
              <InfoRow>
                <Bold>카드 번호:</Bold> {orderInfo.paymentInfo.cardNumber}
              </InfoRow>
              <InfoRow>
                <Bold>유효 기간:</Bold> {orderInfo.paymentInfo.cardExpiry}
              </InfoRow>
            </>
          )}

          <TotalSummary>
            <TotalRow>
              <span>배송비</span>
              <span>
                {orderInfo.deliveryFee === 0
                  ? "무료"
                  : `${orderInfo.deliveryFee?.toLocaleString()}원`}
              </span>
            </TotalRow>
            <TotalRow>
              <span>사용한 포인트</span>
              <span>-{(orderInfo.usedPoints ?? 0).toLocaleString()}원</span>
            </TotalRow>
            <TotalRow>
              <span>총 결제 금액</span>
              <span>{orderInfo.totalPrice?.toLocaleString()}원</span>
            </TotalRow>
            <TotalAmount>
              {orderInfo.totalPrice?.toLocaleString()}원 결제 완료
            </TotalAmount>
            <TotalRow style={{ marginTop: 12 }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>
                적립 예정 포인트
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {orderInfo.earnedPoints?.toLocaleString() ?? 0}P
              </span>
            </TotalRow>
          </TotalSummary>
        </Card>

        <ThankYou>
          주문이 정상적으로 완료되었습니다. 🎉
          <br />
          마이페이지에서 배송 현황을 확인하실 수 있습니다.
        </ThankYou>
      </Container>
    </>
  );
};

export default CheckoutPage;
