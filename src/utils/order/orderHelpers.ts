/**
 * 주문 처리 헬퍼 유틸리티
 * 
 * 주문 상태 텍스트 변환 및 가격 포매팅 기능을 제공합니다.
 * 영문 주문 상태를 한국어로 변환하고 가격을 표시 형식으로 변환합니다.
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

/**
 * 영문 주문 상태를 한국어로 변환하는 함수
 * 시스템에서 사용하는 영문 상태 코드를 사용자에게 보여줄 한국어로 변환합니다.
 * @param status 영문 상태 코드 (ORDERED, SHIPPED, DELIVERED, CANCELLED, RETURNED)
 * @returns 한국어로 변환된 주문 상태 텍스트
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case "ORDERED":
      return "주문 완료";      // 주문이 성공적으로 접수된 상태
    case "SHIPPED":
      return "배송 중";        // 상품이 발송되어 배송 중인 상태
    case "DELIVERED":
      return "배송 완료";      // 상품이 고객에게 배송 완료된 상태
    case "CANCELLED":
      return "주문 취소";      // 주문이 취소된 상태
    case "RETURNED":
      return "반품";          // 반품 처리된 상태
    default:
      return status;         // 정의되지 않은 상태는 원본 그대로 반환
  }
};