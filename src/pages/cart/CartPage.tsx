import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 권한 확인 컴포넌트
import UserProtectedRoute from "../../components/UserProtectedRoute"; // 사용자 로그인 상태 및 권한 확인
// 모달 컴포넌트
import Fail from "../../components/modal/Fail"; // 에러 알림 모달
// 장바구니 관련 커스텀 훅
import { useCartData } from "../../hooks/cart/useCartData"; // 장바구니 데이터 관리 훅
import { useCartActions } from "../../hooks/cart/useCartActions"; // 장바구니 액션 관리 훅 (수량 변경, 삭제 등)
// 유틸리티 함수들
import {
  formatPrice, // 가격 포맷팅 함수
  getSelectedTotals, // 선택된 상품들의 총 금액 계산
} from "../../utils/cart/cartCalculations";
// 장바구니 UI 컴포넌트들
import { CartItemComponent } from "../../components/cart/CartItemComponent"; // 개별 장바구니 아이템 컴포넌트
import { CartSummary } from "../../components/cart/CartSummary"; // 결제 요약 및 주문하기 버튼
import { EmptyCart } from "../../components/cart/EmptyCart"; // 빈 장바구니 상태 표시
import { LoadingState } from "../../components/cart/LoadingState"; // 로딩 상태 표시
// 스타일 컴포넌트들
import {
  Container,
  CartSection,
  Card,
  CartHeader,
  CartTitle,
  SelectAllLabel,
  CartItemContainer,
} from "./CartPage.styles";

/**
 * 장바구니 페이지 내용 컴포넌트
 * 
 * 기능:
 * - 장바구니에 담긴 상품 목록 표시
 * - 개별 상품 선택/해제 및 전체 선택/해제
 * - 상품 수량 변경 및 삭제
 * - 선택된 상품들의 총 금액 계산 및 표시
 * - 결제 페이지로 이동 (선택된 상품들만)
 * - 빈 장바구니 상태 및 로딩 상태 처리
 * 
 * 제약사항:
 * - 사용자 로그인 필수 (UserProtectedRoute로 보호됨)
 * - 최소 1개 상품은 선택되어야 주문 가능
 */
const CartPageContent: React.FC = () => {
  // 페이지 이동을 위한 네비게이션 훅
  const navigate = useNavigate();
  
  // 에러 모달 관련 로컬 상태
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달 표시 여부
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 텍스트

  // 장바구니 데이터 관리 훅
  const { cartData, loading, error, reloadCartData } = useCartData();
  const [, setCartData] = useState(cartData); // 로컬 상태 업데이트용

  /**
   * 에러 처리 핸들러
   * 장바구니 관련 모든 에러를 모달로 표시
   * @param message - 표시할 에러 메시지
   */
  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // 장바구니 액션 관리 훅 (선택, 수량변경, 삭제 등)
  const {
    selectedItems,        // 현재 선택된 장바구니 아이템 ID 목록
    setSelectedItems,     // 선택된 아이템 목록 설정 함수
    handleQuantityChange, // 상품 수량 변경 핸들러
    handleRemoveItem,     // 상품 삭제 핸들러
    handleSelectItem,     // 개별 상품 선택/해제 핸들러
    handleSelectAll,      // 전체 상품 선택/해제 핸들러
  } = useCartActions({
    cartData,
    setCartData,
    reloadCartData,
    onError: handleError,
  });

  // 장바구니 데이터가 로드되면 모든 아이템을 기본 선택 상태로 설정
  useEffect(() => {
    if (cartData && cartData.items.length > 0) {
      setSelectedItems(cartData.items.map((item) => item.cartItemId));
    }
  }, [cartData, setSelectedItems]);

  // 장바구니 데이터 로드 중 에러 발생 시 에러 모달 표시
  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  /**
   * 결제하기 버튼 클릭 핸들러
   * 선택된 상품들만 결제 페이지로 전달
   */
  const handleCheckout = () => {
    // 선택된 상품이 없으면 에러 메시지 표시
    if (selectedItems.length === 0) {
      handleError("주문할 상품을 1개 이상 선택해주세요.");
      return;
    }

    // 선택된 장바구니 아이템들만 필터링
    const selectedCartItems =
      cartData?.items.filter((item) =>
        selectedItems.includes(item.cartItemId)
      ) || [];

    // 결제 페이지로 이동하면서 선택된 아이템 정보 전달
    navigate("/payment", {
      state: {
        cartItems: selectedCartItems,
      },
    });
  };

  // 장바구니 데이터 로딩 중일 때 로딩 스피너 표시
  if (loading) {
    return (
      <Container>
        <LoadingState />
      </Container>
    );
  }

  // 장바구니가 비어있거나 데이터가 없을 때 빈 장바구니 상태 표시
  if (!cartData || cartData.items.length === 0) {
    return (
      <Container>
        <EmptyCart onContinueShopping={() => navigate("/products")} />
      </Container>
    );
  }

  // 선택된 상품들의 총 금액 정보 계산
  const selectedTotals = getSelectedTotals(cartData.items, selectedItems);

  // 메인 렌더링: 장바구니 페이지 UI
  return (
    <Container>
      <CartSection>
        {/* 장바구니 아이템 목록 카드 */}
        <Card>
          {/* 장바구니 헤더 (제목 및 전체 선택) */}
          <CartHeader>
            <CartTitle>장바구니 ({cartData.totalItemCount}개)</CartTitle>
            <SelectAllLabel>
              <input
                type="checkbox"
                checked={selectedItems.length === cartData.items.length} // 모든 아이템이 선택되었는지 확인
                onChange={(e) => handleSelectAll(e.target.checked)} // 전체 선택/해제
              />
              전체 선택
            </SelectAllLabel>
          </CartHeader>

          {/* 장바구니 아이템 목록 */}
          <CartItemContainer>
            {cartData.items.map((item) => (
              <CartItemComponent
                key={item.cartItemId}
                item={item} // 장바구니 아이템 데이터
                isSelected={selectedItems.includes(item.cartItemId)} // 현재 아이템 선택 여부
                onSelect={handleSelectItem} // 개별 아이템 선택/해제 핸들러
                onQuantityChange={handleQuantityChange} // 수량 변경 핸들러
                onRemove={handleRemoveItem} // 아이템 삭제 핸들러
                formatPrice={formatPrice}
              />
            ))}
          </CartItemContainer>
        </Card>

        {/* 결제 요약 및 주문하기 버튼 */}
        <CartSummary
          totalPrice={selectedTotals.totalPrice} // 선택된 상품 총 가격
          totalDiscount={selectedTotals.totalDiscount} // 총 할인 금액
          deliveryFee={selectedTotals.deliveryFee} // 배송비
          finalPrice={selectedTotals.finalPrice} // 최종 결제 금액
          selectedItemsCount={selectedItems.length} // 선택된 상품 개수
          onCheckout={handleCheckout} // 결제하기 버튼 클릭 핸들러
          formatPrice={formatPrice}
        />
      </CartSection>

      {/* 에러 알림 모달 */}
      {showErrorModal && (
        <Fail
          title="알림"
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </Container>
  );
};

/**
 * 장바구니 페이지 메인 컴포넌트
 * 
 * 기능:
 * - 사용자 권한 확인 (로그인 필수)
 * - 로그인하지 않은 사용자에게는 로그인 안내 표시
 * - 권한이 확인된 사용자에게만 장바구니 내용 표시
 * 
 * 권한 확인:
 * - requireUserRole={true}: 사용자 권한 필요
 * - showNotice={true}: 권한 없을 시 안내 메시지 표시
 */
const CartPage: React.FC = () => {
  return (
    <UserProtectedRoute requireUserRole={true} showNotice={true}>
      <CartPageContent />
    </UserProtectedRoute>
  );
};

export default CartPage;
