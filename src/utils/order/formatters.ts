/**
 * 주문 관련 포매팅 유틸리티
 * 
 * 가격을 한국 형식으로 포매팅하는 기능을 제공합니다.
 */

/**
 * 가격을 한국 형식으로 포매팅하는 함수
 * 예: 12345 -> "12,345"
 * @param price 포매팅할 가격 (숫자)
 * @returns 세 자리마다 콤마가 추가된 문자열
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};