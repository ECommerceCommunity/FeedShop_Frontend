/**
 * 상품 필터 버튼 컴포넌트
 *
 * 기능:
 * - 상품 목록 페이지에서 카테고리별 필터링 버튼 제공
 * - 전체, 신상품, 인기상품 3가지 필터 옵션 표시
 * - 현재 선택된 필터의 시각적 상태 관리
 * - 필터 변경 시 콜백 함수를 통한 상태 업데이트
 *
 * 제공 기능:
 * - 활성 필터에 대한 시각적 피드백
 * - 한국어 현지화된 필터 라벨
 * - 반응형 버튼 레이아웃
 * - 클릭 핸들러를 통한 필터 전환
 *
 * 사용되는 곳:
 * - Lists.tsx (상품 목록 페이지)
 * - 상품 카탈로그 뷰
 *
 * UX 고려사항:
 * - 활성 상태가 사용자에게 명확한 시각적 피드백 제공
 * - 버튼 라벨이 간결하고 이해하기 쉬움
 * - 전체 디자인 시스템과 일관된 스타일링
 * - 접근성을 고려한 버튼 인터랙션
 */

// React 라이브러리
import React from "react";
// 스타일 컴포넌트들
import {
  FilterSection, // 필터 섹션 컨테이너
  FilterButton, // 개별 필터 버튼
} from "../../pages/products/Lists.styles";

/**
 * FilterButtons 컴포넌트의 Props 인터페이스
 */
interface FilterButtonsProps {
  activeFilter: string; // 현재 선택된 필터 값 ("all", "category", "popular")
  onFilterChange: (filter: string) => void; // 필터 변경 시 호출되는 콜백 함수
}

/**
 * 상품 필터 버튼 컴포넌트
 *
 * 사용자가 상품 목록을 다양한 카테고리로 필터링할 수 있도록
 * 가로 배열의 필터 버튼들을 렌더링합니다.
 * 각 버튼은 활성 상태에서 시각적 피드백을 제공하고,
 * 부모 컴포넌트의 필터 변경 핸들러를 호출합니다.
 */
export const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <FilterSection>
      {/* "전체" 필터 버튼 - 필터링 없이 모든 상품 표시 */}
      <FilterButton
        $active={activeFilter === "all"} // "all" 필터 선택 시 시각적 활성 상태
        onClick={() => onFilterChange("all")} // 전체 상품 표시를 위한 필터 변경 트리거
      >
        전체
      </FilterButton>

      {/* "신상품" 필터 버튼 - 최신 상품들 표시 */}
      <FilterButton
        $active={activeFilter === "category"} // "category" 필터 선택 시 시각적 활성 상태
        onClick={() => onFilterChange("category")} // 신상품 표시를 위한 필터 변경 트리거
      >
        신상품
      </FilterButton>

      {/* "인기상품" 필터 버튼 - 인기 있는 상품들 표시 */}
      <FilterButton
        $active={activeFilter === "popular"} // "popular" 필터 선택 시 시각적 활성 상태
        onClick={() => onFilterChange("popular")} // 인기상품 표시를 위한 필터 변경 트리거
      >
        인기상품
      </FilterButton>
    </FilterSection>
  );
};
