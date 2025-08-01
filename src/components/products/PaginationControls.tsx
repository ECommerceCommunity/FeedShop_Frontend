/**
 * PaginationControls 컴포넌트
 *
 * 상품 목록을 위한 포괄적인 페이지네이션 기능을 제공하며, 지능적인
 * 페이지 버튼 생성과 네비게이션 컨트롤을 포함합니다. 이 컴포넌트는
 * 현재 페이지 주변에 제한된 수의 페이지 버튼을 표시하여 대용량 데이터셋을
 * 처리하며, 이전/다음 네비게이션 버튼도 함께 제공합니다.
 *
 * 주요 기능:
 * - 지능적인 페이지 버튼 생성 (한 번에 최대 5개 페이지 표시)
 * - 비활성화 상태가 있는 이전/다음 네비게이션
 * - 활성 페이지 하이라이팅
 * - 현재 페이지 주변 자동 중앙 정렬
 * - 한국어 현지화된 네비게이션 라벨
 * - 한 페이지만 존재할 때 자동 숨김
 *
 * 사용 위치:
 * - 상품 목록 페이지 (Lists.tsx)
 * - 검색 결과 페이지네이션
 * - 카테고리 필터링된 상품 보기
 *
 * UX 고려사항:
 * - 너무 많은 페이지 버튼으로 사용자를 압도하지 않음
 * - 현재 페이지에 대한 명확한 시각적 피드백 제공
 * - 비활성화 상태로 잘못된 네비게이션 시도 방지
 * - 다양한 화면 크기에 적응하는 반응형 디자인
 * - 접근성을 위한 일관된 한국어 현지화
 */

import React from "react"; // 컴포넌트 생성을 위한 핵심 React 라이브러리
import {
  Pagination,
  PaginationButton,
} from "../../pages/products/Lists.styles"; // 페이지네이션 UI 요소를 위한 스타일된 컴포넌트

/**
 * PaginationControls 컴포넌트의 Props 인터페이스
 *
 * @interface PaginationControlsProps
 * @property {number} currentPage - 현재 활성 페이지의 0 기반 인덱스
 * @property {number} totalPages - 사용 가능한 총 페이지 수
 * @property {function} onPageChange - 사용자가 다른 페이지로 이동할 때 트리거되는 콜백 함수
 */
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * PaginationControls 함수형 컴포넌트
 *
 * 지능적인 페이지 버튼 생성과 함께 완전한 페이지네이션 인터페이스를 렌더링합니다.
 * 컴포넌트는 현재 페이지와 총 페이지 수를 기반으로 표시할 페이지 번호를
 * 자동으로 계산하여 대용량 데이터셋에서도 최적의 사용자 경험을 보장합니다.
 *
 * @param {PaginationControlsProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} 렌더링된 페이지네이션 컨트롤 또는 한 페이지만 존재할 경우 null
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 한 페이지 이하인 경우 페이지네이션을 완전히 숨김
  if (totalPages <= 1) return null;

  /**
   * 지능적인 범위 계산으로 페이지 번호 버튼 배열을 생성합니다
   *
   * 이 함수는 최대 5개의 페이지 버튼을 생성하며, 현재 페이지 주변에 중앙 정렬됩니다.
   * 현재 페이지가 총 페이지 범위의 시작이나 끝에 가까울 때의 엣지 케이스를 처리하여
   * 가능한 경우 일관된 버튼 수를 보장합니다.
   *
   * @returns {JSX.Element[]} 페이지 버튼 컴포넌트 배열
   */
  const generatePageButtons = () => {
    const maxPageCount = 5; // 한 번에 표시할 최대 페이지 버튼 수

    // 현재 페이지 주변에 중앙 정렬하여 시작 페이지 계산
    let startPage = Math.max(0, currentPage - Math.floor(maxPageCount / 2));
    let endPage = startPage + maxPageCount;

    // 총 페이지 수를 초과한 경우 범위 조정
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(0, endPage - maxPageCount); // 가능한 경우 시작점을 뒤로 이동
    }

    // 계산된 범위에 대한 페이지 버튼 컴포넌트 생성
    return Array.from({ length: endPage - startPage }, (_, i) => {
      const pageNum = startPage + i;
      return (
        <PaginationButton
          key={pageNum}
          $active={pageNum === currentPage} // 현재 페이지 하이라이팅
          onClick={() => onPageChange(pageNum)} // 선택된 페이지로 이동
        >
          {pageNum + 1} {/* 사용자에게 1 기반 페이지 번호 표시 */}
        </PaginationButton>
      );
    });
  };

  return (
    <Pagination>
      {/* 이전 페이지 버튼 - 첫 페이지에 있을 때 비활성화 */}
      <PaginationButton
        $disabled={currentPage === 0} // 이미 첫 페이지에 있을 때 비활성화
        onClick={() => onPageChange(currentPage - 1)} // 이전 페이지로 이동
      >
        이전
      </PaginationButton>

      {/* 동적으로 생성된 페이지 번호 버튼들 */}
      {generatePageButtons()}

      {/* 다음 페이지 버튼 - 마지막 페이지에 있을 때 비활성화 */}
      <PaginationButton
        $disabled={currentPage === totalPages - 1} // 이미 마지막 페이지에 있을 때 비활성화
        onClick={() => onPageChange(currentPage + 1)} // 다음 페이지로 이동
      >
        다음
      </PaginationButton>
    </Pagination>
  );
};
