/**
 * 상품 상세 정보 처리 유틸리티
 * 
 * 상품 상세 페이지에서 사용되는 가격 포매팅 및 할인율 계산 기능을 제공합니다.
 * ProductDetail 타입의 상품 데이터를 기반으로 UI에 필요한 정보를 가공합니다.
 */

import { ProductDetail } from "types/products";

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
 * 상품의 할인율을 계산하는 함수
 * 원가와 할인가를 비교하여 할인율을 퍼센트로 계산합니다.
 * @param product 할인율을 계산할 상품 정보 (null 허용)
 * @returns 할인율 (퍼센트, 반올림된 정수값)
 */
export const getDiscountRate = (product: ProductDetail | null): number => {
  // 상품 정보가 없거나 할인이 없는 경우 0% 반환
  if (!product || product.price === product.discountPrice) return 0;
  
  // 할인율 계산: ((원가 - 할인가) / 원가) × 100, 반올림
  return Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );
};