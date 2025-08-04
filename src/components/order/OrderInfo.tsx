import React from "react";
// 타입 정의
import { OrderDetail } from "../../types/order"; // 주문 상세 정보 타입
// 스타일 컴포넌트들
import {
  Card,         // 카드 컨테이너
  SectionTitle, // 섹션 제목
  InfoRow,      // 정보 행
  Bold,         // 굵은 텍스트
} from "../../pages/order/CheckoutPage.styles";

/**
 * OrderInfo Props 인터페이스
 */
interface OrderInfoProps {
  orderDetail: OrderDetail; // 주문 상세 정보
  getStatusText: (status: string) => string; // 주문 상태를 한글로 변환하는 함수
}

/**
 * 주문 기본 정보 표시 컴포넌트
 * 
 * 기능:
 * - 주문 완료 후 주문의 기본 정보를 카드 형태로 표시
 * - 주문 상태, 주문 일시, 결제 방법 정보 제공
 * - 사용자가 주문 내역을 한눈에 확인할 수 있도록 구성
 * - 한국어 날짜 형식으로 주문 일시 표시
 * 
 * 표시 정보:
 * - 주문 상태: 주문완료, 배송중, 배송완료 등 (한글 변환)
 * - 주문 일시: 년-월-일 오전/오후 시:분:초 형식
 * - 결제 방법: 카드, 무통장입금, 휴대폰 결제 등
 * 
 * 사용되는 곳:
 * - CheckoutPage에서 주문 완료 후 정보 표시
 * - 주문 상세 조회 페이지
 */
export const OrderInfo: React.FC<OrderInfoProps> = ({
  orderDetail,  // 주문 상세 정보 객체
  getStatusText, // 상태 코드를 한글로 변환하는 함수
}) => {
  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>주문 정보</SectionTitle>
      
      {/* 주문 상태 */}
      <InfoRow>
        <Bold>주문 상태:</Bold> {getStatusText(orderDetail.status)}
      </InfoRow>
      
      {/* 주문 일시 (한국어 형식) */}
      <InfoRow>
        <Bold>주문 일시:</Bold>{" "}
        {new Date(orderDetail.orderedAt).toLocaleString("ko-KR")}
      </InfoRow>
      
      {/* 결제 방법 */}
      <InfoRow>
        <Bold>결제 방법:</Bold> {orderDetail.paymentInfo.paymentMethod}
      </InfoRow>
    </Card>
  );
};
