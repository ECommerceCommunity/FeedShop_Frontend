/**
 * 상품 목록 빈 상태 표시 컴포넌트
 * 
 * 기능:
 * - 등록된 상품이 없을 때 표시되는 빈 상태 UI
 * - 사용자에게 친근한 안내 메시지 제공
 * - 박스 이모지로 시각적 표현 강화
 * 
 * 제공 기능:
 * - 중앙 정렬된 빈 상태 컨테이너
 * - 상품 없음을 나타내는 아이콘 (📦)
 * - 명확한 상태 설명 제목
 * - 사용자를 위한 안내 메시지
 * 
 * 사용되는 곳:
 * - Lists.tsx (상품 목록 페이지)에서 상품이 없을 때
 * - ProductGrid 컴포넌트에서 필터링 결과가 없을 때
 * 
 * UX 고려사항:
 * - 단순하고 명확한 메시지로 사용자 혼란 방지
 * - 향후 상품 추가 예정임을 안내하여 기대감 유발
 * - 시각적 아이콘으로 빈 상태의 직관적 이해 도움
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import {
  EmptyContainer,  // 빈 상태 전체 컨테이너
  EmptyIcon,       // 빈 상태 아이콘
  EmptyTitle,      // 빈 상태 제목
  EmptyMessage,    // 빈 상태 안내 메시지
} from "../../pages/products/Lists.styles";

/**
 * 상품 목록 빈 상태 표시 컴포넌트
 * 
 * 상품 목록이 비어있을 때 사용자에게 친근하고 명확한 안내를 제공합니다.
 * 박스 이모지와 함께 상품이 없음을 시각적으로 표현하고,
 * 향후 상품 추가 예정임을 안내하여 사용자의 이해를 돕습니다.
 */
export const EmptyState: React.FC = () => {
  return (
    <EmptyContainer>
      {/* 상품 없음을 나타내는 박스 이모지 */}
      <EmptyIcon>📦</EmptyIcon>
      
      {/* 빈 상태 제목 - 명확한 상황 설명 */}
      <EmptyTitle>등록된 상품이 없습니다</EmptyTitle>
      
      {/* 사용자를 위한 친근한 안내 메시지 */}
      <EmptyMessage>
        아직 등록된 상품이 없습니다. 곧 다양한 상품을 만나보실 수 있습니다.
      </EmptyMessage>
    </EmptyContainer>
  );
};
