import React from "react";
// 타입 정의
import { OrderDetail } from "../../types/order"; // 주문 상세 정보 타입
// 스타일 컴포넌트들
import {
  Card,           // 카드 컨테이너
  SectionTitle,   // 섹션 제목
  ProductList,    // 상품 목록 컨테이너
  ProductItem,    // 개별 상품 아이템
  ProductInfo,    // 상품 정보 영역
  ProductName,    // 상품 이름
  ProductDetails, // 상품 상세 정보 (수량 등)
  ProductPrice,   // 상품 가격
} from "../../pages/order/CheckoutPage.styles";

/**
 * OrderItems Props 인터페이스
 */
interface OrderItemsProps {
  items: OrderDetail["items"]; // 주문한 상품 목록
  formatPrice: (price: number) => string; // 가격 포맷팅 함수
}

/**
 * 주문 상품 목록 표시 컴포넌트
 * 
 * 기능:
 * - 주문 완료 후 주문한 상품들의 목록을 카드 형태로 표시
 * - 각 상품의 이름, 수량, 최종 가격 정보 제공
 * - 여러 상품을 주문한 경우 모든 상품을 리스트로 표시
 * - 빈 목록일 경우 컴포넌트를 렌더링하지 않음
 * 
 * 표시 정보:
 * - 상품 이름: 주문한 상품의 정확한 이름
 * - 수량: 주문한 개수 (예: "수량: 2개")
 * - 최종 가격: 할인이 적용된 실제 결제 금액
 * 
 * 사용되는 곳:
 * - CheckoutPage에서 주문 완료 후 상품 목록 표시
 * - 주문 상세 조회 페이지
 * 
 * 특징:
 * - items 배열이 비어있으면 null 반환 (조건부 렌더링)
 * - 반복문을 통해 모든 주문 상품을 동적으로 렌더링
 */
export const OrderItems: React.FC<OrderItemsProps> = ({
  items,       // 주문 상품 목록 배열
  formatPrice, // 가격을 천 단위 콤마 형식으로 변환하는 함수
}) => {
  // 주문 상품이 없는 경우 컴포넌트를 렌더링하지 않음
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>주문 상품</SectionTitle>
      
      {/* 상품 목록 */}
      <ProductList>
        {items.map((item, index) => (
          <ProductItem key={index}>
            {/* 상품 정보 영역 (이름, 수량) */}
            <ProductInfo>
              <ProductName>{item.productName}</ProductName>
              <ProductDetails>수량: {item.quantity}개</ProductDetails>
            </ProductInfo>
            
            {/* 상품 최종 가격 */}
            <ProductPrice>{formatPrice(item.finalPrice)}원</ProductPrice>
          </ProductItem>
        ))}
      </ProductList>
    </Card>
  );
};
