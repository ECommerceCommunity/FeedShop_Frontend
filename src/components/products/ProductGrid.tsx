/**
 * ProductGrid 컴포넌트
 *
 * 여러 상품 카드를 체계적이고 시각적으로 매력적인 그리드 형태로 표시하는
 * 반응형 그리드 레이아웃 컴포넌트입니다. 이 컴포넌트는 상품 목록의 주요 컨테이너 역할을 하며,
 * 다양한 화면 크기와 디바이스 유형에서 최적의 보기 경험을 제공합니다.
 *
 * 주요 기능:
 * - 화면 크기에 적응하는 반응형 CSS Grid 레이아웃
 * - 고유 키를 사용한 상품 카드의 효율적인 렌더링
 * - 모든 상품 카드에서 일관된 간격과 정렬
 * - ProductCard 컴포넌트와의 원활한 통합
 * - 대용량 상품 데이터셋에 최적화된 성능
 *
 * 사용 위치:
 * - 주요 상품 목록 페이지 (Lists.tsx)
 * - 검색 결과 표시
 * - 카테고리 필터링된 상품 보기
 * - 홈페이지 추천 상품 섹션
 *
 * UX 고려사항:
 * - 그리드 레이아웃으로 상품 가시성과 비교 최대화
 * - 반응형 디자인으로 모든 디바이스에서 사용성 보장
 * - 일관된 카드 간격으로 시각적 조화 창출
 * - 최적의 카드 크기로 정보 밀도와 가독성 균형
 * - 적절한 성능 최적화로 부드러운 스크롤링 경험
 */

import React from "react"; // 컴포넌트 생성을 위한 핵심 React 라이브러리
import { ProductListItem } from "types/products"; // 상품 목록 항목 데이터 구조를 위한 TypeScript 인터페이스
import { ProductCard } from "./ProductCard"; // 그리드 항목을 위한 개별 상품 카드 컴포넌트
import { ProductGrid as StyledProductGrid } from "../../pages/products/Lists.styles"; // 스타일된 그리드 컨테이너 컴포넌트

/**
 * ProductGrid 컴포넌트의 Props 인터페이스
 *
 * @interface ProductGridProps
 * @property {ProductListItem[]} products - 그리드에 표시할 상품 데이터 객체 배열
 * @property {function} formatPrice - 적절한 현지화로 가격 숫자를 포맷하는 함수
 */
interface ProductGridProps {
  products: ProductListItem[];
  formatPrice: (price: number) => string;
}

/**
 * ProductGrid 함수형 컴포넌트
 *
 * 상품 카드의 반응형 그리드를 렌더링하며, 상품 배열을 매핑하여
 * 개별 ProductCard 컴포넌트를 생성합니다. 그리드는 화면 크기와
 * 사용 가능한 공간에 따라 자동으로 레이아웃을 조정합니다.
 *
 * @param {ProductGridProps} props - 컴포넌트 props
 * @returns {JSX.Element} 상품 카드가 있는 렌더링된 그리드 컨테이너
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  formatPrice,
}) => {
  return (
    <StyledProductGrid>
      {/* 상품 배열을 매핑하여 개별 상품 카드 렌더링 */}
      {products.map((product) => (
        <ProductCard
          key={product.productId} // React 목록 렌더링 최적화를 위한 고유 키
          product={product} // 카드 컴포넌트에 완전한 상품 데이터 전달
          formatPrice={formatPrice} // 일관성 유지를 위해 가격 포맷팅 함수 전달
        />
      ))}
    </StyledProductGrid>
  );
};
