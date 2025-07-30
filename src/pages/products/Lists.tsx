import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ProductService } from "../../api/productService";
import PreparationNotice from "../../components/PreparationNotice";
import { toUrl } from "../../utils/images";
import { ProductListItem } from "types/products";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ProductCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ProductStore = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 12px;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DiscountPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ef4444;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const WishCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: #6b7280;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #ef4444;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

const PaginationButton = styled.button<{
  $active?: boolean;
  $disabled?: boolean;
}>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 6px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const Lists: React.FC = () => {
  // 상태 관리
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPreparation, setShowPreparation] = useState(false);

  const pageSize = 9;

  // 상품 데이터 로딩 함수
  const loadProducts = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      // API 호출
      const response = await ProductService.getProducts(page, pageSize);

      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("상품 목록 로딩 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadProducts(0);
  }, []);

  // 필터 변경 핸들러 (아직 API가 없어서 준비중 표시)
  const handleFilterChange = (filter: string) => {
    if (filter !== "all") {
      setShowPreparation(true);
      return;
    }
    setActiveFilter(filter);
    setShowPreparation(false);
    loadProducts(0);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      loadProducts(page);
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 준비중 페이지 표시
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

  // 로딩 중
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div>상품을 불러오는 중...</div>
        </LoadingContainer>
      </Container>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <button
            onClick={() => loadProducts(currentPage)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <Title>전체 상품</Title>
      </Header>

      {/* 필터 섹션 */}
      <FilterSection>
        <FilterButton
          $active={activeFilter === "all"}
          onClick={() => handleFilterChange("all")}
        >
          전체
        </FilterButton>
        <FilterButton
          $active={activeFilter === "category"}
          onClick={() => handleFilterChange("category")}
        >
          신상품
        </FilterButton>
        <FilterButton
          $active={activeFilter === "popular"}
          onClick={() => handleFilterChange("popular")}
        >
          인기상품
        </FilterButton>
      </FilterSection>

      {/* 상품이 없는 경우 */}
      {products.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon>📦</EmptyIcon>
          <EmptyTitle>등록된 상품이 없습니다</EmptyTitle>
          <EmptyMessage>
            아직 등록된 상품이 없습니다. 곧 다양한 상품을 만나보실 수 있습니다.
          </EmptyMessage>
        </EmptyContainer>
      ) : (
        <>
          {/* 상품 그리드 */}
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                to={`/products/${product.productId}`}
              >
                <ProductImage
                  src={toUrl(product.mainImageUrl)}
                  alt={product.name}
                  onError={(e) => {
                    // 이미지 로드 실패시 기본 이미지로 대체
                    (e.target as HTMLImageElement).src = toUrl(
                      "images/common/no-image.png"
                    );
                  }}
                />
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductStore>{product.storeName}</ProductStore>
                  <PriceSection>
                    <DiscountPrice>
                      {formatPrice(product.discountPrice)}원
                    </DiscountPrice>
                    {product.price !== product.discountPrice && (
                      <OriginalPrice>
                        {formatPrice(product.price)}원
                      </OriginalPrice>
                    )}
                  </PriceSection>
                  <WishCount>
                    <span>❤️</span>
                    <span>{product.wishNumber}</span>
                  </WishCount>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                $disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                이전
              </PaginationButton>

              {/* 동적 페이지 버튼 */}
              {(() => {
                const maxPageCount = 5;
                let startPage = Math.max(
                  0,
                  currentPage - Math.floor(maxPageCount / 2)
                );
                let endPage = startPage + maxPageCount;

                if (endPage > totalPages) {
                  endPage = totalPages;
                  startPage = Math.max(0, endPage - maxPageCount);
                }

                return Array.from({ length: endPage - startPage }, (_, i) => {
                  const pageNum = startPage + i;
                  return (
                    <PaginationButton
                      key={pageNum}
                      $active={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </PaginationButton>
                  );
                });
              })()}

              <PaginationButton
                $disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                다음
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default Lists;
