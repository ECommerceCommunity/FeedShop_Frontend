/**
 * SizeSelector 컴포넌트
 *
 * 사용 가능한 상품 사이즈를 그리드 레이아웃으로 표시하며,
 * 선택 상태와 재고 상태에 대한 시각적 피드백을 제공하는 인터랙티브 사이즈 선택 인터페이스입니다.
 * 이 컴포넌트는 사용자가 상품 사이즈 옵션을 선택할 수 있도록 하며,
 * 품절 상품과 현재 선택된 사이즈에 대한 명확한 표시를 제공합니다.
 *
 * 주요 기능:
 * - 사용 가능한 사이즈 옵션의 그리드 레이아웃
 * - 선택된 사이즈에 대한 시각적 피드백
 * - 품절 표시 및 버튼 비활성화
 * - 사이즈 라벨 포맷팅 ("SIZE_" 접두사 제거)
 * - 한국어 현지화 라벨 및 품절 메시지
 * - 콜백 처리가 포함된 인터랙티브 사이즈 선택
 *
 * 사용 위치:
 * - 상품 상세 페이지 (DetailPage.tsx)
 * - 상품 커스터마이징 인터페이스
 * - 장바구니 상품 수정
 *
 * UX 고려사항:
 * - 사용 가능/선택됨/품절 사이즈 간의 명확한 시각적 구분
 * - 비활성화 상태로 선택 불가 옵션 방지
 * - 그리드 레이아웃으로 쉬운 스캔 및 선택 제공
 * - 가독성을 위한 사이즈 라벨 정제
 * - 품절 항목에 즉각적인 피드백을 주는 빨간색 표시
 * - 선택 상태로 사용자가 자신의 선택을 쉽게 추적 가능
 */

import React from "react"; // 컴포넌트 생성을 위한 핵심 React 라이브러리
import { ProductDetail } from "types/products"; // 상세 상품 데이터 구조를 위한 TypeScript 인터페이스
import { SelectedOptions } from "../../hooks/products/useProductOptions"; // 선택된 상품 옵션을 위한 커스텀 훅 타입
import {
  OptionSection,
  OptionTitle,
  SizeGrid,
  SizeButton,
} from "../../pages/products/DetailPage.styles"; // 사이즈 선택 UI 요소를 위한 스타일된 컴포넌트

/**
 * SizeSelector 컴포넌트의 Props 인터페이스
 *
 * @interface SizeSelectorProps
 * @property {ProductDetail} product - 사용 가능한 사이즈 옵션이 포함된 상세 상품 데이터 객체
 * @property {SelectedOptions[]} selectedOptions - 비교를 위한 현재 선택된 옵션 배열
 * @property {function} onSizeSelect - 사용자가 사이즈 옵션을 선택할 때 트리거되는 콜백 함수
 */
interface SizeSelectorProps {
  product: ProductDetail;
  selectedOptions: SelectedOptions[];
  onSizeSelect: (optionId: number) => void;
}

/**
 * SizeSelector 함수형 컴포넌트
 *
 * 사용 가능, 선택됨, 품절 옵션에 대한 시각적 상태가 있는 인터랙티브 사이즈 선택 그리드를 렌더링합니다.
 * 사용자 상호작용에 대한 명확한 피드백을 제공하며, 사용 불가 사이즈 선택을 방지합니다.
 *
 * @param {SizeSelectorProps} props - 컴포넌트 props
 * @returns {JSX.Element} 사이즈 버튼 그리드가 있는 렌더링된 사이즈 선택 인터페이스
 */
export const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  selectedOptions,
  onSizeSelect,
}) => {
  return (
    <OptionSection>
      {/* 섹션 제목 - 선택 목적을 명확히 식별 */}
      <OptionTitle>사이즈 선택</OptionTitle>

      {/* 사이즈 그리드 컨테이너 - 사이즈 버튼을 반응형 그리드로 정렬 */}
      <SizeGrid>
        {/* 상품 옵션을 매핑하여 개별 사이즈 버튼 렌더링 */}
        {product.options.map((option) => (
          <SizeButton
            key={option.optionId} // React 목록 렌더링 최적화를 위한 고유 키
            $selected={selectedOptions.some(
              (opt) => opt.optionId === option.optionId
            )} // 현재 이 옵션이 선택되었는지 확인
            $outOfStock={option.stock === 0} // 품절 항목에 대한 시각적 스타일링
            disabled={option.stock === 0} // 품절 항목에 대한 상호작용 비활성화
            onClick={() => onSizeSelect(option.optionId)} // 사이즈 선택 처리
          >
            {/* 사이즈 라벨 - "SIZE_" 접두사 제거로 깔끔하게 표시 */}
            {option.size.replace("SIZE_", "")}

            {/* 품절 표시 - 재고가 0일 때만 표시 */}
            {option.stock === 0 && (
              <div style={{ fontSize: "10px", color: "#ef4444" }}>품절</div>
            )}
          </SizeButton>
        ))}
      </SizeGrid>
    </OptionSection>
  );
};
