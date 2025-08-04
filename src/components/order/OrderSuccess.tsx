import React from "react";
// 스타일 컴포넌트들
import {
  SuccessIcon,    // 성공 아이콘
  SuccessTitle,   // 성공 제목
  SuccessSubtitle,// 성공 부제목
  PointsEarned,   // 적립 포인트 컨테이너
  PointsLabel,    // 포인트 레이블
  PointsValue,    // 포인트 값
} from "../../pages/order/CheckoutPage.styles";

/**
 * OrderSuccess Props 인터페이스
 */
interface OrderSuccessProps {
  earnedPoints?: number; // 적립된 포인트 (선택사항, 기본값 0)
  formatPrice: (price: number) => string; // 가격 포맷팅 함수
}

/**
 * 주문 성공 메시지 컴포넌트
 * 
 * 기능:
 * - 주문 완료 후 성공 메시지와 축환 아이콘 표시
 * - 주문 완료에 대한 감사 메시지 및 배솨 예정 안내
 * - 적립된 포인트가 있는 경우 포인트 정보 표시
 * - 사용자에게 긍정적인 경험 제공
 * 
 * 표시 내용:
 * - 성공 아이콘: 축하 이모지 표시
 * - 성공 메시지: 주문 완료 알림
 * - 감사 메시지: 주문에 대한 감사와 배송 예정 안내
 * - 적립 포인트: 이번 주문으로 적립된 포인트 정보 (있는 경우에만)
 * 
 * 사용되는 곳:
 * - CheckoutPage의 최상단에서 주문 성공 알림
 * 
 * 특징:
 * - earnedPoints가 0보다 클 때만 포인트 정보 표시 (조건부 렌더링)
 * - 기본값으로 earnedPoints = 0 설정
 */
export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  earnedPoints = 0, // 적립된 포인트 (기본값 0)
  formatPrice,      // 포인트를 지역화된 형식으로 표시하는 함수
}) => {
  return (
    <>
      {/* 성공 아이콘 (축하 이모지) */}
      <SuccessIcon>🎉</SuccessIcon>
      
      {/* 주문 완료 제목 */}
      <SuccessTitle>주문이 완료되었습니다!</SuccessTitle>
      
      {/* 감사 메시지 및 배송 예정 안내 */}
      <SuccessSubtitle>
        주문해주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.
      </SuccessSubtitle>

      {/* 적립 포인트 정보 (있는 경우에만 표시) */}
      {earnedPoints > 0 && (
        <PointsEarned>
          <PointsLabel>적립된 포인트</PointsLabel>
          <PointsValue>{formatPrice(earnedPoints)}P</PointsValue>
        </PointsEarned>
      )}
    </>
  );
};
