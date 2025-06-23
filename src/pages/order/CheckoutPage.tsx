import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartItem, ShippingInfo } from "types/types";
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
  const [showAccessModal, setShowAccessModal] = useState(false);
  const location = useLocation();
  const nav = useNavigate();

  const {
    products,
    totalPrice,
    shipping,
    usedPoints,
    earnedPoints,
    selectedMethod,
    shippingInfo
  }: {
    products?: CartItem[];
    totalPrice?: number;
    shipping?: number;
    usedPoints?: number;
    earnedPoints: number,
    selectedMethod?: string;
    shippingInfo?: ShippingInfo;
  } = location.state || {};

  useEffect(() => {
    if (!products || !shippingInfo) {
      setShowAccessModal(true);
      alert("잘못된 접근입니다.");
      nav("/products");
    }
  }, [products, shippingInfo, nav]);

  if (!products || !shippingInfo) {
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
        <InfoRow><Bold>수령인:</Bold> {shippingInfo.name}</InfoRow>
        <InfoRow><Bold>연락처:</Bold> {shippingInfo.phone}</InfoRow>
        <InfoRow>
          <Bold>주소:</Bold> ({shippingInfo.zipcode}) {shippingInfo.address} {shippingInfo.detailAddress}
        </InfoRow>
        <InfoRow><Bold>요청사항:</Bold> {shippingInfo.request || "없음"}</InfoRow>
      </Card>

      <Card>
        <SectionTitle>주문 상품</SectionTitle>
        <ProductList>
          {products.map((product) => (
            <ProductItem key={product.id}>
              {product.name} / {product.price} / {product.price.toLocaleString()}원 / {product.option} × {product.quantity}개
            </ProductItem>
          ))}
        </ProductList>
      </Card>

      <Card>
        <SectionTitle>결제 정보</SectionTitle>
        <InfoRow><Bold>결제 수단:</Bold> {selectedMethod}</InfoRow>
        {selectedMethod === "카드" && (
          <>
            <InfoRow><Bold>카드 번호:</Bold> {shippingInfo.cardNumber?.replace(/\d{12}(\d{4})/, "**** **** **** $1")}</InfoRow>
            <InfoRow><Bold>유효 기간:</Bold> {shippingInfo.cardExpiry}</InfoRow>
          </>
        )}

        <TotalSummary>
          <TotalRow>
            <span>배송비</span>
            <span>{shipping === 0 ? "무료" : `${shipping?.toLocaleString()}원`}</span>
          </TotalRow>
          <TotalRow>
            <span>사용한 포인트</span>
            <span>-{(usedPoints ?? 0).toLocaleString()}원</span>
          </TotalRow>
          <TotalRow>
            <span>총 결제 금액</span>
            <span>{totalPrice?.toLocaleString()}원</span>
          </TotalRow>
          <TotalAmount>{totalPrice?.toLocaleString()}원 결제 완료</TotalAmount>
          <TotalRow style={{marginTop: 12}}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>적립 예정 포인트</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {earnedPoints?.toLocaleString() ?? 0}P
            </span>
          </TotalRow>
        </TotalSummary>
      </Card>

      <ThankYou>
        주문이 정상적으로 완료되었습니다. 🎉<br />
        마이페이지에서 배송 현황을 확인하실 수 있습니다.
      </ThankYou>
    </Container>
    </>
  );
};

export default CheckoutPage;
