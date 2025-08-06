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
 * ShippingInfo Props 인터페이스
 */
interface ShippingInfoProps {
  shippingInfo: OrderDetail["shippingInfo"]; // 배송 정보 객체
}

/**
 * 배송 정보 표시 컴포넌트
 * 
 * 기능:
 * - 주문 완료 후 배송 관련 정보를 카드 형태로 표시
 * - 수령인, 연락처, 주소, 배송 요청사항 등 배송에 필요한 모든 정보 제공
 * - 조건부 렌더링으로 빈 값들은 표시하지 않음
 * - 우편번호가 있는 경우 주소와 함께 표시
 * 
 * 표시 정보:
 * - 수령인: 배송받을 사람의 이름 (필수)
 * - 연락처: 배송 시 연락할 전화번호 (선택사항)
 * - 주소: 우편번호, 기본주소, 상세주소 (선택사항)
 * - 배송 요청사항: 배송 시 특별 요청 메시지 (선택사항)
 * 
 * 사용되는 곳:
 * - CheckoutPage에서 주문 완료 후 배송 정보 표시
 * - 주문 상세 조회 페이지
 * 
 * 특징:
 * - 수령인 이름이 없으면 전체 컴포넌트를 렌더링하지 않음
 * - 각 정보별로 조건부 렌더링 적용
 */
export const ShippingInfo: React.FC<ShippingInfoProps> = ({ shippingInfo }) => {
  // 수령인 이름이 없으면 컴포넌트를 렌더링하지 않음
  if (!shippingInfo.recipientName) {
    return null;
  }

  return (
    <Card>
      {/* 섹션 제목 */}
      <SectionTitle>배송 정보</SectionTitle>
      
      {/* 수령인 이름 (필수 정보) */}
      <InfoRow>
        <Bold>수령인:</Bold> {shippingInfo.recipientName}
      </InfoRow>
      
      {/* 연락처 (있는 경우에만 표시) */}
      {shippingInfo.recipientPhone && (
        <InfoRow>
          <Bold>연락처:</Bold> {shippingInfo.recipientPhone}
        </InfoRow>
      )}
      
      {/* 배송 주소 (있는 경우에만 표시) */}
      {shippingInfo.deliveryAddress && (
        <InfoRow>
          <Bold>주소:</Bold>
          {/* 우편번호가 있으면 괄호로 감싸서 앞에 표시 */}
          {shippingInfo.postalCode && `(${shippingInfo.postalCode}) `}
          {shippingInfo.deliveryAddress} {shippingInfo.deliveryDetailAddress}
        </InfoRow>
      )}
      
      {/* 배송 요청사항 (있는 경우에만 표시) */}
      {shippingInfo.deliveryMessage && (
        <InfoRow>
          <Bold>배송 요청사항:</Bold> {shippingInfo.deliveryMessage}
        </InfoRow>
      )}
    </Card>
  );
};
