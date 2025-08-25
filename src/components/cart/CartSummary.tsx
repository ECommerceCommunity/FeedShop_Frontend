import React from "react";
// 스타일 컴포넌트들
import {
  SummaryCard,     // 결제 요약 카드 컨테이너
  SummaryTitle,    // 요약 제목
  SummaryRow,      // 각 항목 행
  SummaryLabel,    // 항목 레이블 (상품금액, 할인금액 등)
  SummaryValue,    // 항목 값 (가격)
  TotalRow,        // 총 결제금액 행
  TotalLabel,      // 총 결제금액 레이블
  TotalValue,      // 총 결제금액 값
  CheckoutButton,  // 주문하기 버튼
} from "../../pages/cart/CartPage.styles";

/**
 * CartSummary Props 인터페이스
 */
interface CartSummaryProps {
  totalPrice: number; // 선택된 상품들의 총 가격 (할인 전)
  totalDiscount: number; // 총 할인 금액
  deliveryFee: number; // 배송비
  finalPrice: number; // 최종 결제 금액 (배송비 제외)
  selectedItemsCount: number; // 선택된 상품 개수
  onCheckout: () => void; // 주문하기 버튼 클릭 콜백
  formatPrice: (price: number) => string; // 가격 포맷팅 함수
}

/**
 * 장바구니 결제 요약 컴포넌트
 * 
 * 기능:
 * - 선택된 상품들의 가격 요약 정보 표시
 * - 상품금액, 할인금액, 배송비, 총 결제금액 계산 및 표시
 * - 배송비 무료 조건 표시
 * - 주문하기 버튼 제공 (선택된 상품이 없으면 비활성화)
 * - 선택된 상품 개수 표시
 * 
 * 사용되는 곳:
 * - CartPage의 우측 사이드바
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,         // 선택된 상품들의 총 가격
  totalDiscount,      // 총 할인 금액
  deliveryFee,        // 배송비
  finalPrice,         // 최종 결제 금액 (배송비 제외)
  selectedItemsCount, // 선택된 상품 개수
  onCheckout,         // 주문하기 콜백
  formatPrice,        // 가격 포맷팅 함수
}) => {
  return (
    <SummaryCard>
      {/* 결제 요약 제목 */}
      <SummaryTitle>주문 요약</SummaryTitle>

      {/* 상품 총 금액 (할인 전) */}
      <SummaryRow>
        <SummaryLabel>상품금액</SummaryLabel>
        <SummaryValue>{formatPrice(totalPrice)}원</SummaryValue>
      </SummaryRow>

      {/* 총 할인 금액 */}
      <SummaryRow>
        <SummaryLabel>할인금액</SummaryLabel>
        <SummaryValue>-{formatPrice(totalDiscount)}원</SummaryValue>
      </SummaryRow>

      {/* 배송비 (무료 배송 조건 처리) */}
      <SummaryRow>
        <SummaryLabel>배송비</SummaryLabel>
        <SummaryValue>
          {deliveryFee === 0 ? "무료" : `${formatPrice(deliveryFee)}원`}
        </SummaryValue>
      </SummaryRow>

      {/* 최종 결제 금액 (배송비 포함) */}
      <TotalRow>
        <TotalLabel>총 결제금액</TotalLabel>
        <TotalValue>{formatPrice(finalPrice + deliveryFee)}원</TotalValue>
      </TotalRow>

      {/* 주문하기 버튼 */}
      <CheckoutButton 
        onClick={onCheckout} 
        disabled={selectedItemsCount === 0} // 선택된 상품이 없으면 비활성화
      >
        {selectedItemsCount > 0
          ? `주문하기 (${selectedItemsCount}개)` // 선택된 상품 개수 표시
          : "상품을 선택해주세요" // 선택된 상품이 없을 때 안내 메시지
        }
      </CheckoutButton>
    </SummaryCard>
  );
};
