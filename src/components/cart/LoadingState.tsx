import React from "react";
// 스타일 컴포넌트
import { LoadingContainer } from "../../pages/cart/CartPage.styles"; // 로딩 상태 컨테이너

/**
 * 장바구니 로딩 상태 컴포넌트
 * 
 * 기능:
 * - 장바구니 데이터를 불러오는 동안 표시되는 로딩 화면
 * - 사용자에게 데이터 로딩 중임을 알리는 메시지 표시
 * - 간단하고 명확한 로딩 인디케이터 제공
 * 
 * 표시 조건:
 * - 장바구니 데이터를 서버에서 불러오는 중일 때
 * - useCartData 훅에서 loading 상태가 true일 때
 * 
 * 사용되는 곳:
 * - CartPage에서 초기 데이터 로딩 시
 * - 장바구니 데이터 새로고침 시
 */
export const LoadingState: React.FC = () => {
  return (
    <LoadingContainer>
      장바구니 정보를 불러오는 중...
    </LoadingContainer>
  );
};
