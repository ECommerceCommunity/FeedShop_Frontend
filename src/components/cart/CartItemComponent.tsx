import React from "react";
// 타입 정의
import { CartItem } from "../../types/cart"; // 장바구니 아이템 타입
// 유틸리티 함수
import { toUrl } from "../../utils/common/images"; // 이미지 URL 변환 함수
// 스타일 컴포넌트들
import {
  CartItemCard, // 장바구니 아이템 카드 컨테이너
  ItemCheckbox, // 아이템 선택 체크박스
  ItemImage, // 상품 이미지
  ItemInfo, // 상품 정보 컨테이너
  ItemDetails, // 상품 상세 정보 영역
  ItemName, // 상품 이름
  ItemOption, // 상품 옵션 (사이즈, 색상)
  ItemPrice, // 가격 정보 컨테이너
  DiscountPrice, // 할인된 가격
  OriginalPrice, // 원래 가격 (할인 전)
  ItemControls, // 수량 조절 및 삭제 버튼 영역
  QuantityControls, // 수량 조절 컨트롤
  QuantityButton, // 수량 증감 버튼
  QuantityInput, // 수량 직접 입력 필드
  RemoveButton, // 아이템 삭제 버튼
} from "../../pages/cart/CartPage.styles";

/**
 * CartItemComponent Props 인터페이스
 */
interface CartItemComponentProps {
  item: CartItem; // 표시할 장바구니 아이템 데이터
  isSelected: boolean; // 현재 아이템 선택 여부
  onSelect: (cartItemId: number, selected: boolean) => void; // 아이템 선택/해제 콜백
  onQuantityChange: (cartItemId: number, newQuantity: number) => void; // 수량 변경 콜백
  onRemove: (cartItemId: number) => void; // 아이템 삭제 콜백
  formatPrice: (price: number) => string; // 가격 포맷팅 함수
}

/**
 * 장바구니 개별 아이템 컴포넌트
 *
 * 기능:
 * - 상품 이미지, 이름, 옵션 정보 표시
 * - 할인 가격 및 원가 표시 (할인이 있는 경우)
 * - 아이템 선택/해제 체크박스
 * - 수량 증감 및 직접 입력 (1~5개 제한)
 * - 아이템 삭제 버튼
 * - 이미지 로드 실패 시 기본 이미지로 대체
 *
 * 사용되는 곳:
 * - CartPage의 장바구니 아이템 목록
 */
export const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item, // 장바구니 아이템 데이터
  isSelected, // 현재 선택 상태
  onSelect, // 선택/해제 핸들러
  onQuantityChange, // 수량 변경 핸들러
  onRemove, // 삭제 핸들러
  formatPrice, // 가격 포맷팅 함수
}) => {
  return (
    <CartItemCard>
      {/* 아이템 선택 체크박스 */}
      <ItemCheckbox
        checked={isSelected}
        onChange={(e) => onSelect(item.cartItemId, e.target.checked)}
      />

      {/* 상품 이미지 */}
      <ItemImage
        src={toUrl(item.imageUrl)} // 이미지 URL 변환
        alt={item.productName}
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />

      {/* 상품 정보 및 컨트롤 영역 */}
      <ItemInfo>
        {/* 상품 상세 정보 */}
        <ItemDetails>
          {/* 상품 이름 */}
          <ItemName>{item.productName}</ItemName>

          {/* 상품 옵션 (사이즈, 색상) */}
          <ItemOption>
            사이즈: {item.optionDetails?.size?.replace("SIZE_", "")} | 색상:{" "}
            {item.optionDetails?.color}
          </ItemOption>

          {/* 가격 정보 */}
          <ItemPrice>
            {/* 할인된 가격 (메인 가격) */}
            <DiscountPrice>{formatPrice(item.discountPrice)}원</DiscountPrice>
            {/* 할인이 있는 경우에만 원가 표시 */}
            {item.productPrice !== item.discountPrice && (
              <OriginalPrice>{formatPrice(item.productPrice)}원</OriginalPrice>
            )}
          </ItemPrice>
        </ItemDetails>

        {/* 수량 조절 및 삭제 버튼 영역 */}
        <ItemControls>
          {/* 수량 조절 컨트롤 */}
          <QuantityControls>
            {/* 수량 감소 버튼 */}
            <QuantityButton
              onClick={() =>
                onQuantityChange(item.cartItemId, item.quantity - 1)
              }
              disabled={item.quantity <= 1} // 최소 수량 1개 제한
            >
              -
            </QuantityButton>

            {/* 수량 직접 입력 필드 */}
            <QuantityInput
              type="number"
              value={item.quantity || 1}
              onChange={(e) =>
                onQuantityChange(item.cartItemId, Number(e.target.value) || 1)
              }
              min="1"
              max="5" // 최대 수량 5개 제한
            />

            {/* 수량 증가 버튼 */}
            <QuantityButton
              onClick={() =>
                onQuantityChange(item.cartItemId, item.quantity + 1)
              }
              disabled={item.quantity >= 5} // 최대 수량 5개 제한
            >
              +
            </QuantityButton>
          </QuantityControls>

          {/* 아이템 삭제 버튼 */}
          <RemoveButton onClick={() => onRemove(item.cartItemId)}>
            삭제
          </RemoveButton>
        </ItemControls>
      </ItemInfo>
    </CartItemCard>
  );
};
