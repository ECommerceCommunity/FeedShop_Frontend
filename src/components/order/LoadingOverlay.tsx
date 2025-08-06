import React from "react";
// 스타일 컴포넌트들
import {
  LoadingOverlay as StyledLoadingOverlay, // 전체 화면 오버레이
  LoadingSpinner,                         // 로딩 스피너 컨테이너
} from "../../pages/order/PaymentPage.styles";

/**
 * LoadingOverlay Props 인터페이스
 */
interface LoadingOverlayProps {
  isVisible: boolean; // 오버레이 표시 여부
}

/**
 * 결제 처리 중 로딩 오버레이 컴포넌트
 * 
 * 기능:
 * - 결제 처리 중일 때 전체 화면을 덮는 오버레이 표시
 * - 사용자의 추가 조작을 방지하고 처리 중임을 알림
 * - 로딩 메시지와 함께 시각적 피드백 제공
 * - 결제 완료까지 사용자가 대기하도록 유도
 * 
 * 표시 조건:
 * - 결제 버튼 클릭 후 서버 응답을 기다리는 동안
 * - API 호출이 진행 중일 때
 * - isVisible prop이 true일 때
 * 
 * 사용되는 곳:
 * - PaymentPage에서 결제 처리 중
 * - 주문 완료 처리 중
 * 
 * UX 고려사항:
 * - 결제 중 브라우저 새로고침이나 뒤로가기 방지
 * - 명확한 진행 상황 안내로 사용자 불안감 해소
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible, // 오버레이 표시 여부
}) => {
  // 오버레이가 보이지 않을 때는 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <StyledLoadingOverlay>
      <LoadingSpinner>
        {/* 메인 로딩 메시지 */}
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>
          결제 처리 중입니다...
        </div>
        
        {/* 보조 안내 메시지 */}
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          잠시만 기다려주세요.
        </div>
      </LoadingSpinner>
    </StyledLoadingOverlay>
  );
};
