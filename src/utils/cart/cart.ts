import products from "../../pages/data/products/products.json";
import discounts from "../../pages/data/products/discounts.json";
import { isDiscountValid } from "../products/discount";
import { getDiscountPrice } from "../products/price";

/**
 * 장바구니 관련 데이터 처리 유틸리티
 *
 * 상품 ID를 기반으로 장바구니에 필요한 상품 정보를 가공하여 반환합니다.
 * JSON 파일에서 상품 데이터와 할인 정보를 가져와서 계산합니다.
 */

/**
 * 상품 ID를 기반으로 장바구니에 필요한 상품 데이터를 가져오는 함수
 * @param id 상품 ID
 * @returns 상품 데이터, 원가, 할인가, 할인율 정보
 * @throws {Error} 상품을 찾을 수 없는 경우 예외 발생
 */
export const getCartData = (id: number) => {
  // 상품 데이터 찾기
  const productData = products.find((product) => product.id === id);
  if (!productData) {
    throw new Error("Product Data Not Found");
  }

  // 원가 추출 및 숫자 타입 보장
  const originalPrice = Number(
    typeof productData?.price === "number" ? productData.price : 0
  );
  
  // 해당 상품의 할인 정보 찾기
  const discountDataRaw = discounts.find((d) => d.product_id === Number(id));
  
  // 할인 데이터 타입 안전성 보장 (기본값: "정률")
  const discountDataTyped = discountDataRaw
    ? {
        ...discountDataRaw,
        discount_type: (discountDataRaw.discount_type ?? "정률") as
          | "정률"  // 퍼센트 할인
          | "정액",  // 고정 금액 할인
      }
    : undefined;
  
  // 할인 유효성 검사 후 안전한 할인 데이터 생성
  const safeDiscount = isDiscountValid(discountDataTyped)
    ? discountDataTyped
    : undefined;
  
  // 할인 적용된 최종 가격 계산
  const discountPrice = getDiscountPrice(originalPrice, safeDiscount);
  
  // 할인 여부 판단
  const isDiscounted = discountPrice < originalPrice;

  // 계산된 모든 데이터를 반환
  return {
    productData,                              // 원본 상품 데이터
    originalPrice,                            // 원가
    discountPrice: Math.floor(discountPrice), // 할인가 (소수점 아래 버림)
    discountRate: isDiscounted                // 할인율 (퍼센트, 소수점 아래 버림)
      ? Math.floor(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0,
  };
};
