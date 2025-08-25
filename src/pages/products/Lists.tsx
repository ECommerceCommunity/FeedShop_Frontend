import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// 상품 관련 커스텀 훅
import { useProductList } from "../../hooks/products/useProductList"; // 상품 목록 관리 훅
// 인증 컨텍스트
import { useAuth } from "../../contexts/AuthContext";
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
import { 
  Container, 
  Header, 
  Title,
  AIRecommendSection,
  AIRecommendTitle,
  AIInputContainer,
  AIInput,
  AIButton,
  AIResultsHeader,
  AIResultsTitle,
  AIResultsCount,
  ClearAIButton
} from "./Lists.styles";
// 카테고리 서비스
import { CategoryService } from "../../api/categoryService";
// AI 추천 관련
import { ProductService, AIRecommendResponse } from "../../api/productService";
import { ProductListItem } from "../../types/products";

/**
 * 상품 목록 페이지 컴포넌트
 *
 * 기능:
 * - 전체 상품 목록을 페이지네이션으로 표시
 * - 카테고리별 필터링 지원 (URL 쿼리 파라미터 기반)
 * - 가격 범위 필터링 지원
 * - 최신순, 인기순 정렬 기능
 * - 로딩, 에러, 빈 상태 처리
 *
 * 사용되는 커스텀 훅:
 * - useProductList: 상품 데이터 패칭, 페이지네이션, 정렬, 필터링 관리
 */
const Lists: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 상품 목록 데이터와 페이지네이션, 정렬, 필터링 관련 상태 및 함수들
  const {
    products, // 현재 페이지의 상품 목록
    loading, // 로딩 상태
    error, // 에러 메시지
    currentPage, // 현재 페이지 번호 (0부터 시작)
    totalPages, // 전체 페이지 수
    currentSort, // 현재 정렬 방식
    filters, // 현재 필터 상태
    loadProducts, // 상품 목록을 다시 로드하는 함수
    handlePageChange, // 페이지 변경 핸들러
    handleSortChange: handleSortChangeFromHook, // 훅에서 제공하는 정렬 변경 핸들러 (이름 충돌 방지)
    handleFiltersChange, // 필터 변경 핸들러
    retry, // 에러 발생 시 재시도 함수
  } = useProductList();

  // AI 추천 관련 상태
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<ProductListItem[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiPromptUsed, setAiPromptUsed] = useState<string>("");

  // AI 추천 요청 핸들러
  const handleAIRecommend = async () => {
    if (!aiPrompt.trim()) return;

    // 로그인 상태 확인
    if (!user) {
      setAiError("AI 추천 기능을 사용하려면 로그인이 필요합니다.");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const response = await ProductService.getAIRecommendations({
        prompt: aiPrompt.trim(),
        limit: 9
      });
      setAiRecommendations(response.products);
      setAiPromptUsed(aiPrompt.trim());
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAiError("로그인이 필요합니다. 다시 로그인해주세요.");
      } else {
        setAiError(error.response?.data?.message || "AI 추천 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  // AI 추천 결과 초기화
  const handleClearAI = () => {
    setAiRecommendations(null);
    setAiPrompt("");
    setAiPromptUsed("");
    setAiError(null);
  };

  // 정렬 변경 핸들러 (URL 주도 + 훅 연동)
  const handleSortChange = (sort: string) => {
    // URL 파라미터 업데이트
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", sort);
    // 정렬 변경 시 첫 페이지로 이동
    searchParams.delete("page");
    navigate(`/products?${searchParams.toString()}`);

    // 훅의 정렬 변경 핸들러도 호출하여 즉시 반영
    handleSortChangeFromHook(sort);
  };

  // URL에서 현재 적용된 필터 정보 추출 및 페이지 제목 생성
  // - 검색어가 있으면: `"검색어" 검색 결과`
  // - 없고 카테고리가 있으면: `{카테고리명} 상품`
  // - 둘 다 없으면: `전체 상품`
  const pageTitle = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q");
    const categoryId = searchParams.get("categoryId");

    if (q && q.trim().length > 0) {
      // 검색어와 카테고리가 모두 있는 경우
      if (categoryId) {
        const category = CategoryService.DEFAULT_CATEGORIES.find(
          (cat) => cat.categoryId === Number(categoryId)
        );
        const categoryName = category ? category.name : "카테고리";
        return `"${q}" ${categoryName} 검색 결과`;
      }
      return `"${q}" 검색 결과`;
    }

    if (categoryId) {
      const category = CategoryService.DEFAULT_CATEGORIES.find(
        (cat) => cat.categoryId === Number(categoryId)
      );
      return category ? `${category.name} 상품` : "카테고리 상품";
    }

    return "전체 상품";
  }, [location.search]);

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

  // 표시할 상품 목록 결정 (AI 추천이 있으면 AI 추천, 없으면 기본 상품 목록)
  const displayProducts = aiRecommendations || products;
  const showingAIResults = !!aiRecommendations;

  // 메인 렌더링: 상품 목록과 관련 UI 요소들
  return (
    <Container>
      {/* 페이지 제목 */}
      <Header>
        <Title>{pageTitle}</Title>
      </Header>

      {/* AI 추천 섹션 */}
      <AIRecommendSection>
        <AIRecommendTitle>AI 맞춤 추천</AIRecommendTitle>
        <AIInputContainer>
          <AIInput
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={
              user 
                ? "원하는 신발을 설명해주세요 (예: 편안한 러닝화, 정장용 구두, 여름 샌들)"
                : "AI 추천 기능을 사용하려면 로그인이 필요합니다"
            }
            onKeyPress={(e) => e.key === 'Enter' && handleAIRecommend()}
            disabled={aiLoading || !user}
          />
          <AIButton 
            onClick={handleAIRecommend}
            disabled={aiLoading || !aiPrompt.trim() || !user}
            $loading={aiLoading}
          >
            {aiLoading ? "추천 중..." : user ? "스마트 추천" : "로그인 필요"}
          </AIButton>
        </AIInputContainer>
        {aiError && (
          <div style={{ color: '#fca5a5', marginTop: '12px', fontSize: '0.875rem' }}>
            {aiError}
          </div>
        )}
      </AIRecommendSection>

      {/* AI 추천 결과 헤더 */}
      {showingAIResults && (
        <AIResultsHeader>
          <div>
            <AIResultsTitle>AI 추천 결과</AIResultsTitle>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>
              "{aiPromptUsed}"에 대한 추천 상품
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AIResultsCount>{aiRecommendations?.length}개 추천</AIResultsCount>
            <ClearAIButton onClick={handleClearAI}>
              전체 상품 보기
            </ClearAIButton>
          </div>
        </AIResultsHeader>
      )}

      {/* 필터 및 정렬 버튼들 (AI 추천 중이 아닐 때만 표시) */}
      {!showingAIResults && (
        <FilterButtons
          activeSort={currentSort}
          onSortChange={handleSortChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {/* 상품 목록 또는 빈 상태 표시 */}
      {displayProducts.length === 0 ? (
        // 상품이 없을 때 빈 상태 메시지 표시
        <EmptyState />
      ) : (
        <>
          {/* 상품 그리드 레이아웃으로 상품들 표시 */}
          <ProductGrid products={displayProducts} formatPrice={formatPrice} />

          {/* 페이지네이션 컨트롤 (기본 상품 목록일 때만 표시) */}
          {!showingAIResults && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Lists;
