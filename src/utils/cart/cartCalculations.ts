import { CartItem } from "../../types/cart";

/**
 * 장바구니 계산 유틸리티
 *
 * 장바구니에서 선택된 상품들의 총 금액, 할인 금액, 배송비 등을 계산하는 기능을 제공합니다.
 * 가격 포매팅 및 선택된 아이템들의 합계 계산 기능을 포함합니다.
 */

// 선택된 상품들의 총계 정보 인터페이스
export interface SelectedTotals {
  totalPrice: number;     // 전체 원가 합계
  totalDiscount: number;  // 전체 할인 금액 합계
  deliveryFee: number;    // 배송비
  finalPrice: number;     // 최종 결제 금액 (원가 - 할인)
}

/**
 * 가격을 한국 형식으로 포매팅하는 함수
 * 예: 12345 -> "12,345"
 * @param price 포매팅할 가격 (숫자)
 * @returns 세 자리마다 콤마가 추가된 문자열
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

/**
 * 선택된 장바구니 아이템들의 총 계산을 수행하는 함수
 * 원가 합계, 할인 금액 합계, 배송비, 최종 결제 금액을 계산합니다.
 * @param cartItems 전체 장바구니 아이템 목록
 * @param selectedItemIds 선택된 아이템 ID 목록
 * @returns 선택된 아이템들의 총계 정보
 */
export const getSelectedTotals = (
  cartItems: CartItem[],
  selectedItemIds: number[]
): SelectedTotals => {
  // 선택된 아이템들만 필터링
  const selectedCartItems = cartItems.filter((item) =>
    selectedItemIds.includes(item.cartItemId)
  );

  // 전체 원가 합계 계산 (원가 * 수량)
  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  // 전체 할인 금액 퐈계 계산 ((원가 - 할인가) * 수량)
  const totalDiscount = selectedCartItems.reduce(
    (sum, item) =>
      sum +
      ((item.productPrice || 0) - (item.discountPrice || 0)) *
        (item.quantity || 1),
    0
  );

  // 최종 결제 금액 = 원가 합계 - 할인 금액 합계
  const finalPrice = totalPrice - totalDiscount;
  
  // 배송비 계산: 5만원 이상 무료배송, 미만시 3000원
  const deliveryFee = finalPrice >= 50000 ? 0 : 3000;

  return { totalPrice, totalDiscount, deliveryFee, finalPrice };
};
