import React from "react";
// 스타일 컴포넌트들
import {
  EmptyContainer,  // 빈 장바구니 컨테이너
  EmptyIcon,       // 빈 장바구니 아이콘
  EmptyTitle,      // 빈 장바구니 제목
  EmptyMessage,    // 빈 장바구니 안내 메시지
  ShoppingButton,  // 쇼핑 계속하기 버튼
} from "../../pages/cart/CartPage.styles";

/**
 * EmptyCart Props 인터페이스
 */
interface EmptyCartProps {
  onContinueShopping: () => void; // 쇼핑 계속하기 버튼 클릭 콜백
}

/**
 * 빈 장바구니 상태 컴포넌트
 * 
 * 기능:
 * - 장바구니가 비어있을 때 표시되는 안내 화면
 * - 장바구니 아이콘과 안내 메시지 표시
 * - 상품 목록 페이지로 이동할 수 있는 버튼 제공
 * - 사용자에게 쇼핑을 계속하도록 유도
 * 
 * 표시 조건:
 * - 장바구니에 담긴 상품이 없을 때
 * - 장바구니 데이터 로딩이 완료된 후 아이템이 없을 때
 * 
 * 사용되는 곳:
 * - CartPage에서 장바구니가 비어있을 때
 */
export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
  return (
    <EmptyContainer>
      {/* 빈 장바구니를 나타내는 이모지 아이콘 */}
      <EmptyIcon>🛒</EmptyIcon>
      
      {/* 빈 장바구니 안내 제목 */}
      <EmptyTitle>장바구니가 비어있습니다</EmptyTitle>
      
      {/* 사용자에게 쇼핑을 유도하는 메시지 */}
      <EmptyMessage>원하는 상품을 장바구니에 담아보세요!</EmptyMessage>
      
      {/* 상품 목록 페이지로 이동하는 버튼 */}
      <ShoppingButton onClick={onContinueShopping}>
        쇼핑 계속하기
      </ShoppingButton>
    </EmptyContainer>
  );
};
