/**
 * ProductImages 컴포넌트
 *
 * 썸네일 네비게이션과 함께 메인 상품 이미지를 표시하는 상품 상세 페이지용
 * 인터랙티브 이미지 갤러리 컴포넌트입니다. 이 컴포넌트는 사용자에게
 * 여러 각도와 관점에서 상품의 포괄적인 보기를 제공하여
 * 상품 평가 경험을 향상시킵니다.
 *
 * 주요 기능:
 * - 고품질 보기가 가능한 큰 메인 이미지 표시
 * - 이미지 선택을 위한 썸네일 네비게이션
 * - 현재 선택에 대한 활성 썸네일 하이라이팅
 * - 메인 이미지의 필터링된 표시 (타입 "MAIN"만)
 * - 깨진 이미지에 대한 우아한 성능 저하를 위한 이미지 오류 처리
 * - 조건부 썸네일 표시 (여러 이미지가 존재할 때만 표시)
 *
 * 사용 위치:
 * - 상품 상세 페이지 (DetailPage.tsx)
 * - 상품 미리보기 모달
 * - 상품 비교 보기
 *
 * UX 고려사항:
 * - 큰 메인 이미지로 상세한 상품 시각화 제공
 * - 썸네일 네비게이션으로 쉬운 이미지 전환 가능
 * - 활성 상태 피드백으로 현재 선택을 명확히 표시
 * - 오류 처리로 깨진 이미지에서도 깔끔한 레이아웃 유지
 * - 반응형 디자인으로 다양한 화면 크기에 적응
 * - 접근 가능한 alt 텍스트로 스크린 리더 지원
 */

import React from "react"; // 컴포넌트 생성을 위한 핵심 React 라이브러리
import { ProductDetail } from "types/products"; // 상세 상품 데이터 구조를 위한 TypeScript 인터페이스
import { toUrl } from "../../utils/common/images"; // 이미지 경로를 전체 URL로 변환하는 유틸리티 함수
import {
  ImageSection,
  MainImage,
  ThumbnailContainer,
  ThumbnailImage,
} from "../../pages/products/DetailPage.styles"; // 상품 이미지 갤러리 UI 요소를 위한 스타일된 컴포넌트

/**
 * ProductImages 컴포넌트의 Props 인터페이스
 *
 * @interface ProductImagesProps
 * @property {ProductDetail} product - 이미지 정보를 포함하는 상세 상품 데이터 객체
 * @property {number} selectedImageIndex - 메인 표시용 현재 선택된 이미지의 인덱스
 * @property {function} onImageSelect - 사용자가 다른 썸네일 이미지를 선택할 때 트리거되는 콜백 함수
 */
interface ProductImagesProps {
  product: ProductDetail;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

/**
 * ProductImages 함수형 컴포넌트
 *
 * 메인 이미지 표시와 썸네일 네비게이션이 있는 인터랙티브 이미지 갤러리를 렌더링합니다.
 * 이미지를 필터링하여 메인 타입 이미지만 표시하고 여러 이미지가 사용 가능할 때
 * 썸네일 선택 기능을 제공합니다.
 *
 * @param {ProductImagesProps} props - 컴포넌트 props
 * @returns {JSX.Element} 메인 이미지와 썸네일 네비게이션이 있는 렌더링된 이미지 갤러리
 */
export const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  selectedImageIndex,
  onImageSelect,
}) => {
  // 상품 이미지를 필터링하여 메인 이미지만 포함 (상세 이미지 제외)
  const mainImages = product.images.filter((img) => img.type === "MAIN");

  return (
    <ImageSection>
      {/* 메인 이미지 표시 - 현재 선택된 상품 이미지 표시 */}
      <MainImage
        src={toUrl(product.images[selectedImageIndex]?.url)} // null 안전성을 포함한 상대 경로를 전체 URL로 변환
        alt={product.name} // 상품명을 사용한 접근 가능한 alt 텍스트
      />

      {/* 썸네일 네비게이션 - 여러 메인 이미지가 존재할 때만 표시 */}
      {mainImages.length > 1 && (
        <ThumbnailContainer>
          {mainImages.map((image, index) => (
            <ThumbnailImage
              key={image.imageId} // React 목록 렌더링 최적화를 위한 고유 키
              src={toUrl(image.url)} // 상대 경로를 전체 URL로 변환
              alt={`${product.name} ${index + 1}`} // 이미지 번호가 있는 접근 가능한 alt 텍스트
              $active={selectedImageIndex === index} // 현재 선택된 썸네일에 대한 시각적 활성 상태
              onClick={() => onImageSelect(index)} // 메인 이미지 변경을 위한 썸네일 클릭 처리
              onError={(e) => {
                // 깨진 썸네일 이미지를 숨겨 깔끔한 레이아웃 유지
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ))}
        </ThumbnailContainer>
      )}
    </ImageSection>
  );
};
