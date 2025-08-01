/**
 * 상품 할인 정보 유효성 검증 유틸리티
 * 
 * 할인 데이터의 유효성을 검증하고 타입을 보장하는 기능을 제공합니다.
 * 정률 할인(퍼센트)과 정액 할인(고정 금액) 두 가지 할인 타입을 지원합니다.
 */

import { Discount } from "../../types/order";

/**
 * 할인 정보의 유효성을 검증하는 타입 가드 함수
 * 할인 타입이 "정률" 또는 "정액"이고, 할인 값이 숫자인지 확인합니다.
 * @param discount 검증할 할인 정보 객체 (선택적)
 * @returns 유효한 할인 정보이면 true, 아니면 false
 */
export const isDiscountValid = (
  discount?: Discount
): discount is Discount & { discount_type: "정률" | "정액" } => {
  return (
    // 할인 타입이 "정률"(퍼센트 할인) 또는 "정액"(고정 금액 할인)인지 확인
    (discount?.discount_type === "정률" ||
      discount?.discount_type === "정액") &&
    // 할인 값이 숫자 타입인지 확인
    typeof discount.discount_value === "number"
  );
};
