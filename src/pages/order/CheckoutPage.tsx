import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { OrderService } from "../../api/orderService";
import { OrderDetail } from "../../types/order";
import Fail from "../../components/modal/Fail";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 960px;
  margin: 60px auto;
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
`;

const SuccessIcon = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 4rem;
`;

const SuccessTitle = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 8px;
`;

const SuccessSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 32px;
`;

const OrderNumber = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #3b82f6;
`;

const OrderNumberLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const OrderNumberValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
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

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const ProductDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
  font-size: 1rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 8px;
`;

const FinalTotalRow = styled(TotalRow)`
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  margin-top: 12px;
`;

const PointsEarned = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid #f59e0b;
`;

const PointsLabel = styled.div`
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 4px;
`;

const PointsValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #b45309;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;

const ThankYou = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
`;

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 상태 관리
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // PaymentPage에서 전달받은 orderId
  const orderId = location.state?.orderId;
  const orderData = location.state?.orderData; // 임시 데이터 (API 호출 실패 시 백업용)

  // 주문 상세 정보 로딩
  useEffect(() => {
    const loadOrderDetail = async () => {
      if (!orderId) {
        setError("주문 ID가 없습니다. 잘못된 접근입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // API를 통해 주문 상세 정보 조회
        const detail = await OrderService.getOrderDetail(orderId);
        setOrderDetail(detail);
      } catch (err: any) {
        // API 호출 실패 시 PaymentPage에서 받은 데이터로 대체
        if (orderData) {
          // orderData를 OrderDetail 형식으로 변환
          const fallbackDetail: OrderDetail = {
            orderId: orderData.orderId,
            status: orderData.status,
            orderedAt: orderData.orderedAt,
            usedPoints: orderData.usedPoints || 0,
            earnedPoints: orderData.earnedPoints || 0,
            currency: "KRW",
            deliveryFee: orderData.deliveryFee || 0,
            totalDiscountPrice: 0,
            totalPrice: orderData.totalPrice,
            finalPrice: orderData.totalPrice,
            shippingInfo: {
              recipientName: "주문자",
              recipientPhone: "",
              postalCode: "",
              deliveryAddress: "",
              deliveryDetailAddress: "",
              deliveryMessage: "",
            },
            paymentInfo: {
              paymentMethod: orderData.paymentMethod,
            },
            items: [], // 아이템 정보는 생략
          };

          setOrderDetail(fallbackDetail);
        } else {
          setError("주문 정보를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetail();
  }, [orderId, orderData]);

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 주문 상태 한글 변환
  const getStatusText = (status: string): string => {
    switch (status) {
      case "ORDERED":
        return "주문 완료";
      case "SHIPPED":
        return "배송 중";
      case "DELIVERED":
        return "배송 완료";
      case "CANCELLED":
        return "주문 취소";
      case "RETURNED":
        return "반품";
      default:
        return status;
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <Container>
        <LoadingContainer>주문 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>❌</div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            오류가 발생했습니다
          </div>
          <div style={{ marginBottom: "24px" }}>{error}</div>
          <SecondaryButton onClick={() => navigate("/products")}>
            쇼핑 계속하기
          </SecondaryButton>
        </ErrorContainer>
      </Container>
    );
  }

  // 주문 정보가 없는 경우
  if (!orderDetail) {
    return (
      <Container>
        <ErrorContainer>
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🚫</div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            주문 정보를 찾을 수 없습니다
          </div>
          <div style={{ marginBottom: "24px" }}>
            주문이 정상적으로 처리되지 않았을 수 있습니다.
          </div>
          <SecondaryButton onClick={() => navigate("/products")}>
            쇼핑 계속하기
          </SecondaryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <>
      {showErrorModal && (
        <Fail
          title="알림"
          message="주문 정보를 불러오는데 실패했습니다."
          onClose={() => setShowErrorModal(false)}
        />
      )}

      <Container>
        {/* 성공 메시지 */}
        <SuccessIcon>🎉</SuccessIcon>
        <SuccessTitle>주문이 완료되었습니다!</SuccessTitle>
        <SuccessSubtitle>
          주문해주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.
        </SuccessSubtitle>

        {/* 주문 번호 */}
        <OrderNumber>
          <OrderNumberLabel>주문번호</OrderNumberLabel>
          <OrderNumberValue>#{orderDetail.orderId}</OrderNumberValue>
        </OrderNumber>

        {/* 적립 포인트 (있는 경우만 표시) */}
        {orderDetail.earnedPoints > 0 && (
          <PointsEarned>
            <PointsLabel>적립된 포인트</PointsLabel>
            <PointsValue>{formatPrice(orderDetail.earnedPoints)}P</PointsValue>
          </PointsEarned>
        )}

        {/* 주문 정보 */}
        <Card>
          <SectionTitle>주문 정보</SectionTitle>
          <InfoRow>
            <Bold>주문 상태:</Bold> {getStatusText(orderDetail.status)}
          </InfoRow>
          <InfoRow>
            <Bold>주문 일시:</Bold>{" "}
            {new Date(orderDetail.orderedAt).toLocaleString("ko-KR")}
          </InfoRow>
          <InfoRow>
            <Bold>결제 방법:</Bold> {orderDetail.paymentInfo.paymentMethod}
          </InfoRow>
        </Card>

        {/* 배송 정보 (정보가 있는 경우만 표시) */}
        {orderDetail.shippingInfo.recipientName && (
          <Card>
            <SectionTitle>배송 정보</SectionTitle>
            <InfoRow>
              <Bold>수령인:</Bold> {orderDetail.shippingInfo.recipientName}
            </InfoRow>
            {orderDetail.shippingInfo.recipientPhone && (
              <InfoRow>
                <Bold>연락처:</Bold> {orderDetail.shippingInfo.recipientPhone}
              </InfoRow>
            )}
            {orderDetail.shippingInfo.deliveryAddress && (
              <InfoRow>
                <Bold>주소:</Bold>
                {orderDetail.shippingInfo.postalCode &&
                  `(${orderDetail.shippingInfo.postalCode}) `}
                {orderDetail.shippingInfo.deliveryAddress}{" "}
                {orderDetail.shippingInfo.deliveryDetailAddress}
              </InfoRow>
            )}
            {orderDetail.shippingInfo.deliveryMessage && (
              <InfoRow>
                <Bold>배송 요청사항:</Bold>{" "}
                {orderDetail.shippingInfo.deliveryMessage}
              </InfoRow>
            )}
          </Card>
        )}

        {/* 주문 상품 (상품 정보가 있는 경우만 표시) */}
        {orderDetail.items.length > 0 && (
          <Card>
            <SectionTitle>주문 상품</SectionTitle>
            <ProductList>
              {orderDetail.items.map((item, index) => (
                <ProductItem key={index}>
                  <ProductInfo>
                    <ProductName>{item.productName}</ProductName>
                    <ProductDetails>수량: {item.quantity}개</ProductDetails>
                  </ProductInfo>
                  <ProductPrice>{formatPrice(item.finalPrice)}원</ProductPrice>
                </ProductItem>
              ))}
            </ProductList>
          </Card>
        )}

        {/* 결제 정보 */}
        <Card>
          <SectionTitle>결제 정보</SectionTitle>

          <TotalRow>
            <span>상품금액</span>
            <span>{formatPrice(orderDetail.totalPrice)}원</span>
          </TotalRow>

          <TotalRow>
            <span>배송비</span>
            <span>
              {orderDetail.deliveryFee === 0
                ? "무료"
                : `${formatPrice(orderDetail.deliveryFee)}원`}
            </span>
          </TotalRow>

          {orderDetail.usedPoints > 0 && (
            <TotalRow>
              <span>포인트 사용</span>
              <span>-{formatPrice(orderDetail.usedPoints)}원</span>
            </TotalRow>
          )}

          <FinalTotalRow>
            <span>최종 결제금액</span>
            <span>{formatPrice(orderDetail.finalPrice)}원</span>
          </FinalTotalRow>
        </Card>

        {/* 안내 메시지 */}
        <ThankYou>
          주문이 정상적으로 완료되었습니다. 🎉
          <br />
          마이페이지에서 주문 내역 및 배송 현황을 확인하실 수 있습니다.
          <br />
          문의사항이 있으시면 고객센터로 연락해주세요.
        </ThankYou>

        {/* 액션 버튼들 */}
        <ActionButtons>
          <PrimaryButton onClick={() => navigate("/my-page")}>
            주문 내역 확인
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/products")}>
            쇼핑 계속하기
          </SecondaryButton>
        </ActionButtons>
      </Container>
    </>
  );
};

export default CheckoutPage;
