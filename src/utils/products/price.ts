/**
 * 상품 가격 계산 유틸리티
 * 
 * 상품의 할인 적용 가격을 계산하는 기능을 제공합니다.
 * 정률 할인(퍼센트)과 정액 할인(고정 금액) 두 가지 할인 방식을 지원하며,
 * 할인 기간과 할인 값의 유효성을 검증합니다.
 */

import { Discount } from "../../types/order";

/**
 * 할인이 적용된 최종 가격을 계산하는 함수
 * 할인 정보의 유효성을 검증한 후 할인 타입에 따라 가격을 계산합니다.
 * @param originalPrice 상품 원가
 * @param discount 할인 정보 (선택적)
 * @returns 할인이 적용된 최종 가격 (소수점 아래 버림)
 */
export const getDiscountPrice = (
  originalPrice: number,
  discount?: Discount
): number => {
  // 할인 정보 유효성 검증
  const isDiscountValid =
    discount &&
    // 할인 타입이 "정률" 또는 "정액"인지 확인
    (discount.discount_type === "정률" || discount.discount_type === "정액") &&
    // 할인 값이 숫자인지 확인
    typeof discount.discount_value === "number" &&
    // 할인 시작일이 존재하는지 확인
    !!discount.discount_start &&
    // 할인 종료일이 존재하는지 확인
    !!discount.discount_end;

  // 유효하지 않은 할인인 경우 원가 그대로 반환
  if (!isDiscountValid) return originalPrice;

  // 할인 타입에 따른 가격 계산
  return discount.discount_type === "정률"
    ? // 정률 할인: 원가 × (1 - 할인율/100), 소수점 아래 버림
      Math.floor(originalPrice * (1 - discount.discount_value / 100))
    : // 정액 할인: 원가 - 할인 금액
      originalPrice - discount.discount_value;
};
