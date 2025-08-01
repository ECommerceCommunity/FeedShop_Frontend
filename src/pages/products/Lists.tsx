import React from "react";
// 공통 컴포넌트
import PreparationNotice from "../../components/PreparationNotice"; // 준비중 안내 컴포넌트
// 상품 관련 커스텀 훅
import { useProductList } from "../../hooks/products/useProductList"; // 상품 목록 관리 훅
import { useProductFilter } from "../../hooks/products/useProductFilter"; // 필터링 상태 관리 훅
// 상품 목록 UI 컴포넌트들
import { FilterButtons } from "../../components/products/FilterButtons"; // 필터 버튼 그룹
import { ProductGrid } from "../../components/products/ProductGrid"; // 상품 그리드 레이아웃
import { PaginationControls } from "../../components/products/PaginationControls"; // 페이지네이션 컨트롤
import { EmptyState } from "../../components/products/EmptyState"; // 빈 상태 표시
import { ErrorState } from "../../components/products/ErrorState"; // 에러 상태 표시
import { LoadingState } from "../../components/products/LoadingState"; // 로딩 상태 표시
// 유틸리티 함수
import { formatPrice } from "../../utils/products/listUtils"; // 가격 포맷팅 함수
// 스타일 컴포넌트
import { Container, Header, Title } from "./Lists.styles";

/**
 * 상품 목록 페이지 컴포넌트
 * 
 * 기능:
 * - 전체 상품 목록을 페이지네이션으로 표시
 * - 카테고리별 필터링 (현재 준비중)
 * - 상품 검색 및 정렬 (향후 추가 예정)
 * - 로딩, 에러, 빈 상태 처리
 * 
 * 사용되는 커스텀 훅:
 * - useProductList: 상품 데이터 패칭, 페이지네이션 관리
 * - useProductFilter: 필터 상태 관리, 준비중 기능 처리
 */
const Lists: React.FC = () => {
  // 상품 목록 데이터와 페이지네이션 관련 상태 및 함수들
  const {
    products,        // 현재 페이지의 상품 목록
    loading,         // 로딩 상태
    error,           // 에러 메시지
    currentPage,     // 현재 페이지 번호 (0부터 시작)
    totalPages,      // 전체 페이지 수
    loadProducts,    // 상품 목록을 다시 로드하는 함수
    handlePageChange, // 페이지 변경 핸들러
    retry,           // 에러 발생 시 재시도 함수
  } = useProductList();

  // 필터링 관련 상태 및 함수들
  const { 
    activeFilter,      // 현재 활성화된 필터 (예: 'sneakers', 'sandals')
    showPreparation,   // 준비중 메시지 표시 여부
    handleFilterChange // 필터 변경 핸들러
  } = useProductFilter();

  // 준비중인 기능에 대한 안내 표시 (필터링 기능 등)
  if (showPreparation) {
    return (
      <Container>
        <PreparationNotice
          title="필터 기능 준비중입니다"
          message="카테고리별 필터링 및 정렬 기능을 준비 중입니다."
          subMessage="현재는 전체 상품만 조회 가능합니다."
        />
      </Container>
    );
  }

  // 데이터 로딩 중일 때 로딩 스피너 표시
  if (loading) {
    return (
      <Container>
        <LoadingState />
      </Container>
    );
  }

  // API 호출 실패 등 에러 발생 시 에러 메시지와 재시도 버튼 표시
  if (error) {
    return (
      <Container>
        <ErrorState error={error} onRetry={retry} />
      </Container>
    );
  }

  // 메인 렌더링: 상품 목록과 관련 UI 요소들
  return (
    <Container>
      {/* 페이지 제목 */}
      <Header>
        <Title>전체 상품</Title>
      </Header>

      {/* 필터 버튼들 (카테고리별 필터링) */}
      <FilterButtons
        activeFilter={activeFilter}
        onFilterChange={(filter) =>
          // 필터 변경 시 첫 페이지부터 새로 로드
          handleFilterChange(filter, () => loadProducts(0))
        }
      />

      {/* 상품 목록 또는 빈 상태 표시 */}
      {products.length === 0 ? (
        // 상품이 없을 때 빈 상태 메시지 표시
        <EmptyState />
      ) : (
        <>
          {/* 상품 그리드 레이아웃으로 상품들 표시 */}
          <ProductGrid products={products} formatPrice={formatPrice} />
          
          {/* 페이지네이션 컨트롤 (이전/다음 페이지 버튼) */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default Lists;
