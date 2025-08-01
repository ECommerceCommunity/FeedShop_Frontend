/**
 * ProductDescription 컴포넌트
 *
 * 텍스트 설명과 상세 상품 이미지를 포함한 포괄적인 상품 설명 정보를 표시합니다.
 * 이 컴포넌트는 기본 상품 개요를 넘어서 정보에 기반한 구매 결정을 내리는 데
 * 필요한 심층적인 상품 정보를 고객에게 제공합니다.
 *
 * 주요 기능:
 * - 대체 메시지가 있는 상품 설명 텍스트
 * - 필터링된 상세 이미지 (타입 "DETAIL"만)
 * - 깨진 이미지에 대한 우아한 성능 저하를 위한 이미지 오류 처리
 * - 한국어 현지화된 섹션 제목과 대체 메시지
 * - 반응형 이미지 갤러리 레이아웃
 *
 * 사용 위치:
 * - 상품 상세 페이지 (DetailPage.tsx)
 * - 상품 정보 모달
 * - 확장된 상품 보기
 *
 * UX 고려사항:
 * - 정보에 기반한 결정을 위한 포괄적인 상품 정보 제공
 * - 대체 메시지로 일관된 사용자 경험 유지
 * - 이미지 오류 처리로 깨진 레이아웃 방지
 * - 명확한 섹션 제목으로 사용자가 콘텐츠 목적 이해 도움
 * - 상세 이미지로 상품 기능에 대한 시각적 컨텍스트 제공
 */

import React from "react"; // 컴포넌트 생성을 위한 핵심 React 라이브러리
import { ProductDetail } from "types/products"; // 상세 상품 데이터 구조를 위한 TypeScript 인터페이스
import { toUrl } from "../../utils/common/images"; // 이미지 경로를 전체 URL로 변환하는 유틸리티 함수
import {
  DescriptionSection,
  DescriptionTitle,
  DescriptionText,
  DetailImages,
  DetailImage,
} from "../../pages/products/DetailPage.styles"; // 상품 설명 UI 요소를 위한 스타일된 컴포넌트

/**
 * ProductDescription 컴포넌트의 Props 인터페이스
 *
 * @interface ProductDescriptionProps
 * @property {ProductDetail} product - 설명과 이미지를 포함하는 상세 상품 데이터 객체
 */
interface ProductDescriptionProps {
  product: ProductDetail;
}

/**
 * ProductDescription 함수형 컴포넌트
 *
 * 텍스트 콘텐츠와 상세 이미지가 있는 상품 설명 섹션을 렌더링합니다.
 * 이미지를 필터링하여 상세 타입 이미지만 표시하고 설명이 없을 때
 * 대체 콘텐츠를 제공합니다. 이미지 로딩 오류를 우아하게 처리합니다.
 *
 * @param {ProductDescriptionProps} props - 컴포넌트 props
 * @returns {JSX.Element} 텍스트와 이미지가 있는 렌더링된 상품 설명 섹션
 */
export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
}) => {
  // 상품 이미지를 필터링하여 상세 이미지만 포함 (메인/썸네일 이미지 제외)
  const detailImages = product.images.filter((img) => img.type === "DETAIL");

  return (
    <DescriptionSection>
      {/* 섹션 제목 - 콘텐츠 목적을 명확히 식별 */}
      <DescriptionTitle>상품 설명</DescriptionTitle>

      {/* 누락된 설명에 대한 대체가 있는 상품 설명 텍스트 */}
      <DescriptionText>
        {product.description || "상품 설명이 없습니다."}{" "}
      </DescriptionText>

      {/* 상세 이미지 섹션 - 상세 이미지가 존재할 때만 렌더링 */}
      {detailImages.length > 0 && (
        <DetailImages>
          {detailImages.map((image) => (
            <DetailImage
              key={image.imageId} // React 목록 렌더링 최적화를 위한 고유 키
              src={toUrl(image.url)} // 상대 경로를 전체 URL로 변환
              alt={`${product.name} 상세 이미지`} // 한국어 설명이 있는 접근 가능한 alt 텍스트
              onError={(e) => {
                // 깨진 이미지를 숨겨 깔끔한 레이아웃 유지
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ))}
        </DetailImages>
      )}
    </DescriptionSection>
  );
};
