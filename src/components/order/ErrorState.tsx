import React from "react";
import { useNavigate } from "react-router-dom";
// 스타일 컴포넌트들
import {
  ErrorContainer,   // 에러 상태 컨테이너
  SecondaryButton,  // 보조 버튼 (쇼핑 계속하기)
} from "../../pages/order/CheckoutPage.styles";

/**
 * ErrorState Props 인터페이스
 */
interface ErrorStateProps {
  icon: string;    // 에러를 나타내는 아이콘 (이모지)
  title: string;   // 에러 제목
  message: string; // 에러 상세 메시지
}

/**
 * 주문 관련 에러 상태 컴포넌트
 * 
 * 기능:
 * - 주문 처리 중 발생하는 에러 상황을 사용자에게 알림
 * - 커스터마이징 가능한 아이콘, 제목, 메시지 표시
 * - 쇼핑 계속하기 버튼으로 상품 목록 페이지로 이동
 * - 일관된 에러 UI 제공
 * 
 * 사용되는 경우:
 * - 주문 정보를 찾을 수 없을 때
 * - 결제 처리 중 오류 발생 시
 * - 서버 통신 실패 시
 * - 권한 없는 접근 시
 * 
 * 사용되는 곳:
 * - CheckoutPage에서 주문 정보 로드 실패 시
 * - PaymentPage에서 결제 처리 오류 시
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  icon,    // 표시할 에러 아이콘
  title,   // 에러 제목
  message, // 에러 상세 설명
}) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅

  return (
    <ErrorContainer>
      {/* 에러 아이콘 (이모지) */}
      <div style={{ fontSize: "2rem", marginBottom: "16px" }}>
        {icon}
      </div>
      
      {/* 에러 제목 */}
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      
      {/* 에러 상세 메시지 */}
      <div style={{ marginBottom: "24px" }}>
        {message}
      </div>
      
      {/* 상품 목록 페이지로 이동하는 버튼 */}
      <SecondaryButton onClick={() => navigate("/products")}>
        쇼핑 계속하기
      </SecondaryButton>
    </ErrorContainer>
  );
};
