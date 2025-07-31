
import React, { useState } from "react";
import styled from "styled-components";

// 더미 데이터
const availableCoupons = [
  {
    id: 1,
    name: "신규가입 15% 할인",
    description: "전 상품 적용 가능",
    expiry: "2025-08-31",
    discount: "15%",
  },
  {
    id: 2,
    name: "여름 시즌 10,000원 할인",
    description: "50,000원 이상 구매 시",
    expiry: "2025-09-15",
    discount: "10,000원",
  },
  {
    id: 3,
    name: "VIP 무료배송",
    description: "배송비 무료",
    expiry: "2025-12-31",
    discount: "무료배송",
  },
];

const expiredCoupons = [
  {
    id: 4,
    name: "봄맞이 5% 할인",
    description: "전 상품 적용",
    expiry: "2025-05-31",
    discount: "5%",
  },
];

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive ? "#f97316" : "rgba(255, 255, 255, 0.7)"};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 0;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #f97316;
    transform: ${(props) => (props.isActive ? "scaleX(1)" : "scaleX(0)")};
    transition: transform 0.3s ease-out;
  }
`;

const CouponList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CouponCard = styled.div<{ isExpired?: boolean }>`
  background: ${(props) =>
    props.isExpired
      ? "rgba(0, 0, 0, 0.3)"
      : "linear-gradient(135deg, #4a5568, #2d3748)"};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${(props) => (props.isExpired ? 0.6 : 1)};
  border-left: 5px solid
    ${(props) => (props.isExpired ? "#718096" : "#f97316")};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const CouponHeader = styled.div`
  margin-bottom: 1rem;
`;

const CouponName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const CouponDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0;
`;

const CouponFooter = styled.div`
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExpiryDate = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

const Discount = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #f97316;
`;

const NoCouponsMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
`;

const CouponsPage = () => {
  const [activeTab, setActiveTab] = useState<"available" | "expired">(
    "available"
  );

  const couponsToDisplay =
    activeTab === "available" ? availableCoupons : expiredCoupons;

  return (
    <Container>
      <Title>쿠폰 및 포인트</Title>
      <TabContainer>
        <TabButton
          isActive={activeTab === "available"}
          onClick={() => setActiveTab("available")}
        >
          사용 가능한 쿠폰 ({availableCoupons.length})
        </TabButton>
        <TabButton
          isActive={activeTab === "expired"}
          onClick={() => setActiveTab("expired")}
        >
          만료된 쿠폰 ({expiredCoupons.length})
        </TabButton>
      </TabContainer>

      {couponsToDisplay.length > 0 ? (
        <CouponList>
          {couponsToDisplay.map((coupon) => (
            <CouponCard key={coupon.id} isExpired={activeTab === "expired"}>
              <CouponHeader>
                <CouponName>{coupon.name}</CouponName>
                <CouponDescription>{coupon.description}</CouponDescription>
              </CouponHeader>
              <CouponFooter>
                <ExpiryDate>~ {coupon.expiry}</ExpiryDate>
                <Discount>{coupon.discount}</Discount>
              </CouponFooter>
            </CouponCard>
          ))}
        </CouponList>
      ) : (
        <NoCouponsMessage>
          <p>
            {activeTab === "available"
              ? "사용 가능한 쿠폰이 없습니다."
              : "만료된 쿠폰이 없습니다."}
          </p>
        </NoCouponsMessage>
      )}
    </Container>
  );
};

export default CouponsPage;
