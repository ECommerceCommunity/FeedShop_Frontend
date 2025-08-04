import React from "react";
import { useNavigate } from "react-router-dom";
// 스타일 컴포넌트들
import {
  ThankYou,         // 감사 메시지 컨테이너
  ActionButtons,    // 액션 버튼 컨테이너
  PrimaryButton,    // 주 버튼 (주문 내역 확인)
  SecondaryButton,  // 보조 버튼 (쇼핑 계속하기)
} from "../../pages/order/CheckoutPage.styles";

/**
 * 감사 메시지 및 다음 액션 컴포넌트
 * 
 * 기능:
 * - 주문 완료 후 최종 감사 메시지 표시
 * - 마이페이지와 상품 목록으로 이동할 수 있는 버튼 제공
 * - 주문 후 사용자 경험 마무리 및 다음 액션 유도
 * - 고객 지원 안내 메시지 포함
 * 
 * 제공 기능:
 * - 주문 내역 확인: MyPage로 이동하여 주문 내역 및 배송 현황 확인
 * - 쇼핑 계속하기: 상품 목록 페이지로 이동하여 추가 쇼핑 유도
 * - 고객센터 연락 안내
 * 
 * 사용되는 곳:
 * - CheckoutPage의 하단에서 마무리 메시지
 * 
 * UX 고려사항:
 * - 주 버튼(주문 내역 확인)을 전면에 배치하여 사용자가 바로 다음 액션을 수행하도록 유도
 * - 보조 버튼(쇼핑 계속하기)으로 추가 구매 기회 제공
 */
export const ThankYouMessage: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅

  return (
    <>
      {/* 감사 메시지 및 추가 안내 */}
      <ThankYou>
        주문이 정상적으로 완료되었습니다. 🎉
        <br />
        마이페이지에서 주문 내역 및 배송 현황을 확인하실 수 있습니다.
        <br />
        문의사항이 있으시면 고객센터로 연락해주세요.
      </ThankYou>

      {/* 다음 액션 버튼들 */}
      <ActionButtons>
        {/* 주문 내역 확인 버튼 (주 액션) */}
        <PrimaryButton onClick={() => navigate("/mypage")}>
          주문 내역 확인
        </PrimaryButton>
        
        {/* 쇼핑 계속하기 버튼 (보조 액션) */}
        <SecondaryButton onClick={() => navigate("/products")}>
          쇼핑 계속하기
        </SecondaryButton>
      </ActionButtons>
    </>
  );
};
