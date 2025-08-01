export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "ORDERED":
      return "주문 완료";
    case "SHIPPED":
      return "배송 중";
    case "DELIVERED":
      return "배송 완료";
    case "CANCELLED":
      return "주문 취소";
    case "RETURNED":
      return "반품";
    default:
      return status;
  }
};