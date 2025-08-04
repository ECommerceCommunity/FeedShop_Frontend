/**
 * 상품 관련 오류 상태 표시 컴포넌트
 * 
 * 기능:
 * - API 요청 실패나 기타 오류 발생 시 표시
 * - 구체적인 오류 메시지 표시
 * - 재시도 버튼으로 복구 기회 제공
 * - 사용자 친화적인 오류 처리 UI
 * 
 * 제공 기능:
 * - 오류 상황을 명확히 알리는 제목
 * - 구체적인 오류 내용 표시
 * - 클릭 한 번으로 재시도 가능한 버튼
 * - 중앙 정렬된 오류 컨테이너
 * 
 * 사용되는 곳:
 * - Lists.tsx에서 상품 목록 로딩 실패 시
 * - ProductGrid에서 데이터 로딩 오류 시
 * - 네트워크 오류나 서버 오류 발생 시
 * 
 * UX 고려사항:
 * - 사용자가 당황하지 않도록 친근한 메시지 제공
 * - 재시도 버튼으로 즉시 문제 해결 시도 가능
 * - 구체적인 오류 정보로 문제 상황 파악 도움
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import { 
  ErrorContainer,  // 오류 상태 전체 컨테이너
  RetryButton      // 재시도 버튼
} from "../../pages/products/Lists.styles";

/**
 * ErrorState 컴포넌트의 Props 인터페이스
 */
interface ErrorStateProps {
  error: string;          // 표시할 오류 메시지
  onRetry: () => void;    // 재시도 버튼 클릭 핸들러
}

/**
 * 상품 관련 오류 상태 표시 컴포넌트
 * 
 * 상품 데이터 로딩 실패나 기타 오류 발생 시 사용자에게 
 * 명확한 오류 정보를 제공하고 재시도 기회를 제공합니다.
 * 사용자 친화적인 오류 처리를 통해 UX를 개선합니다.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <ErrorContainer>
      {/* 오류 발생 알림 제목 */}
      <h3>오류가 발생했습니다</h3>
      
      {/* 구체적인 오러 메시지 표시 */}
      <p>{error}</p>
      
      {/* 재시도 버튼 - 사용자가 즉시 문제 해결 시도 가능 */}
      <RetryButton onClick={onRetry}>다시 시도</RetryButton>
    </ErrorContainer>
  );
};
