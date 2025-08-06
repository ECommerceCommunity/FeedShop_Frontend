import React from "react";
// 스타일 컴포넌트
import { LoadingContainer } from "../../pages/order/CheckoutPage.styles"; // 로딩 상태 컨테이너

/**
 * 주문 관련 로딩 상태 컴포넌트
 * 
 * 기능:
 * - 주문 정보를 불러오는 동안 표시되는 로딩 화면
 * - 사용자에게 데이터 로딩 중임을 알리는 메시지 표시
 * - 간단하고 명확한 로딩 인디케이터 제공
 * 
 * 표시 조건:
 * - 주문 상세 정보를 서버에서 불러오는 중일 때
 * - useOrderDetail 훅에서 loading 상태가 true일 때
 * - 페이지 초기 로딩 시
 * 
 * 사용되는 곳:
 * - CheckoutPage에서 주문 정보 로딩 시
 * - 주문 완료 후 상세 정보 불러올 때
 * 
 * LoadingOverlay와의 차이점:
 * - LoadingOverlay: 전체 화면 덮는 모달 형태 (결제 처리 중)
 * - LoadingState: 페이지 내 콘텐츠 영역 표시 (데이터 로딩 중)
 */
export const LoadingState: React.FC = () => {
  return (
    <LoadingContainer>
      주문 정보를 불러오는 중...
    </LoadingContainer>
  );
};
