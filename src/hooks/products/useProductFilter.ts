import { useState } from "react";

/**
 * 상품 필터 관리 훅
 *
 * 상품 목록 페이지에서 카테고리별 필터링 기능을 관리합니다.
 * 현재는 "all" 필터만 완전히 구현되어 있고, 다른 필터들은 준비 중 상태를 표시합니다.
 */
export const useProductFilter = () => {
  // 현재 선택된 필터 (기본값: "all")
  const [activeFilter, setActiveFilter] = useState("all");
  // 준비 중 상태 표시 여부
  const [showPreparation, setShowPreparation] = useState(false);

  /**
   * 필터 변경을 처리하는 함수
   * "all" 이외의 필터는 아직 구현되지 않았으므로 준비 중 메시지를 표시
   * @param filter 선택된 필터 값
   * @param onFilterAll "all" 필터 선택 시 호출할 콜백 함수 (옵션)
   */
  const handleFilterChange = (filter: string, onFilterAll?: () => void) => {
    if (filter !== "all") {
      // "all" 이외의 필터는 아직 미구현 상태로 준비 중 메시지 표시
      setShowPreparation(true);
      return;
    }
    // "all" 필터 선택 시 정상 처리
    setActiveFilter(filter);
    setShowPreparation(false);
    if (onFilterAll) {
      onFilterAll(); // 전체 상품 로드 등의 콜백 실행
    }
  };

  // 필터 관련 상태와 함수를 반환
  return {
    activeFilter,        // 현재 선택된 필터
    showPreparation,     // 준비 중 상태 표시 여부
    handleFilterChange,  // 필터 변경 처리 함수
  };
};