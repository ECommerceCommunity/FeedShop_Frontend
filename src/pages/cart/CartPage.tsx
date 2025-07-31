import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CartService } from "../../api/cartService";
import UserProtectedRoute from "../../components/UserProtectedRoute";
import Fail from "../../components/modal/Fail";
import { toUrl } from "../../utils/images";
import { CartItem } from "../../types/cart";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const CartTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const SelectAllLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #374151;
  cursor: pointer;
`;

const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItemCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ItemCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemDetails = styled.div``;

const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ItemOption = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DiscountPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #3b82f6;
`;

const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #374151;
  background: white;

  &:focus {
    outline: none;
  }
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #ef4444;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const SummaryCard = styled(Card)`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.span`
  color: #6b7280;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: #374151;
`;

const TotalRow = styled(SummaryRow)`
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
`;

const TotalValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #3b82f6;
`;

const CheckoutButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) =>
    props.disabled
      ? "#9ca3af"
      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 24px;
`;

const ShoppingButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const CartPageContent: React.FC = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    totalOriginalPrice: number;
    totalDiscountPrice: number;
    totalSavings: number;
    totalItemCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 장바구니 데이터 로딩 함수
  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await CartService.getCartItems();
      setCartData(data);

      // 기본적으로 모든 아이템 선택
      setSelectedItems(data.items.map((item) => item.cartItemId));
    } catch (err: any) {
      setErrorMessage("장바구니 정보를 불러오는데 실패했습니다.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 선택된 아이템들의 총합 계산 함수
  const getSelectedTotals = () => {
    if (!cartData)
      return { totalPrice: 0, totalDiscount: 0, deliveryFee: 0, finalPrice: 0 };

    const selectedCartItems = cartData.items.filter((item) =>
      selectedItems.includes(item.cartItemId)
    );

    const totalPrice = selectedCartItems.reduce(
      (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 1),
      0
    );

    const totalDiscount = selectedCartItems.reduce(
      (sum, item) =>
        sum +
        ((item.productPrice || 0) - (item.discountPrice || 0)) *
          (item.quantity || 1),
      0
    );

    const finalPrice = totalPrice - totalDiscount;
    const deliveryFee = finalPrice >= 50000 ? 0 : 3000;

    return { totalPrice, totalDiscount, deliveryFee, finalPrice };
  };

  // 수량 변경 함수
  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1 || newQuantity > 5) return;

    // 1. 즉시 로컬 상태 업데이트 (UX 개선)
    if (cartData) {
      const updatedItems = cartData.items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartData({
        ...cartData,
        items: updatedItems,
      });
    }

    // 2. 백그라운드에서 API 호출
    try {
      await CartService.updateCartItem(cartItemId, { quantity: newQuantity });
    } catch (err: any) {
      // API 실패 시 원래 데이터로 복구
      await loadCartData();
      setErrorMessage("수량 변경에 실패했습니다.");
      setShowErrorModal(true);
    }
  };

  // 아이템 삭제 함수
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await CartService.removeCartItem(cartItemId);
      await loadCartData(); // 데이터 다시 로딩

      // 선택된 아이템 목록에서도 제거
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    } catch (err: any) {
      setErrorMessage("상품 삭제에 실패했습니다.");
      setShowErrorModal(true);
    }
  };

  // 선택 상태 변경 함수
  const handleSelectItem = async (cartItemId: number, selected: boolean) => {
    // 1. 즉시 로컬 상태 업데이트
    if (selected) {
      setSelectedItems((prev) => [...prev, cartItemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    }

    // 2. 장바구니 데이터도 업데이트
    if (cartData) {
      const updatedItems = cartData.items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, selected } : item
      );
      setCartData({
        ...cartData,
        items: updatedItems,
      });
    }

    // 3. 백그라운드에서 API 호출
    await CartService.updateCartItem(cartItemId, { selected });
  };

  // 전체 선택/해제 함수
  const handleSelectAll = async (selectAll: boolean) => {
    if (!cartData) return;

    // 1. 즉시 로컬 상태 업데이트
    if (selectAll) {
      setSelectedItems(cartData.items.map((item) => item.cartItemId));
    } else {
      setSelectedItems([]);
    }

    // 2. 장바구니 데이터도 업데이트
    const updatedItems = cartData.items.map((item) => ({
      ...item,
      selected: selectAll,
    }));
    setCartData({
      ...cartData,
      items: updatedItems,
    });

    // 3. 백그라운드에서 API 호출
    const updatePromises = cartData.items.map((item) =>
      CartService.updateCartItem(item.cartItemId, { selected: selectAll })
    );
    await Promise.all(updatePromises);
  };

  // 주문하기 함수
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      setErrorMessage("주문할 상품을 1개 이상 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 선택된 아이템들만 주문 페이지로 전달
    const selectedCartItems =
      cartData?.items.filter((item) =>
        selectedItems.includes(item.cartItemId)
      ) || [];

    navigate("/payment", {
      state: {
        cartItems: selectedCartItems,
        fromCart: true,
      },
    });
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <Container>
        <LoadingContainer>장바구니 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  // 장바구니가 비어있을 때
  if (!cartData || cartData.items.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyTitle>장바구니가 비어있습니다</EmptyTitle>
          <EmptyMessage>원하는 상품을 장바구니에 담아보세요!</EmptyMessage>
          <ShoppingButton onClick={() => navigate("/products")}>
            쇼핑 계속하기
          </ShoppingButton>
        </EmptyContainer>
      </Container>
    );
  }

  const selectedTotals = getSelectedTotals();

  return (
    <Container>
      <CartSection>
        {/* 장바구니 아이템 목록 */}
        <Card>
          <CartHeader>
            <CartTitle>장바구니 ({cartData.totalItemCount}개)</CartTitle>
            <SelectAllLabel>
              <input
                type="checkbox"
                checked={selectedItems.length === cartData.items.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              전체 선택
            </SelectAllLabel>
          </CartHeader>

          <CartItemContainer>
            {cartData.items.map((item) => (
              <CartItemCard key={item.cartItemId}>
                <ItemCheckbox
                  checked={selectedItems.includes(item.cartItemId)}
                  onChange={(e) =>
                    handleSelectItem(item.cartItemId, e.target.checked)
                  }
                />

                <ItemImage
                  src={toUrl(item.imageUrl)}
                  alt={item.productName}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />

                <ItemInfo>
                  <ItemDetails>
                    <ItemName>{item.productName}</ItemName>
                    <ItemOption>
                      사이즈: {item.optionDetails?.size?.replace("SIZE_", "")} |
                      색상: {item.optionDetails?.color}
                    </ItemOption>
                    <ItemPrice>
                      <DiscountPrice>
                        {formatPrice(item.discountPrice)}원
                      </DiscountPrice>
                      {item.productPrice !== item.discountPrice && (
                        <OriginalPrice>
                          {formatPrice(item.productPrice)}원
                        </OriginalPrice>
                      )}
                    </ItemPrice>
                  </ItemDetails>

                  <ItemControls>
                    <QuantityControls>
                      <QuantityButton
                        onClick={() =>
                          handleQuantityChange(
                            item.cartItemId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityInput
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.cartItemId,
                            Number(e.target.value) || 1
                          )
                        }
                        min="1"
                        max="5"
                      />
                      <QuantityButton
                        onClick={() =>
                          handleQuantityChange(
                            item.cartItemId,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= 5}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>

                    <RemoveButton
                      onClick={() => handleRemoveItem(item.cartItemId)}
                    >
                      삭제
                    </RemoveButton>
                  </ItemControls>
                </ItemInfo>
              </CartItemCard>
            ))}
          </CartItemContainer>
        </Card>

        {/* 주문 요약 */}
        <SummaryCard>
          <SummaryTitle>주문 요약</SummaryTitle>

          <SummaryRow>
            <SummaryLabel>상품금액</SummaryLabel>
            <SummaryValue>
              {formatPrice(selectedTotals.totalPrice)}원
            </SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>할인금액</SummaryLabel>
            <SummaryValue>
              -{formatPrice(selectedTotals.totalDiscount)}원
            </SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>배송비</SummaryLabel>
            <SummaryValue>
              {selectedTotals.deliveryFee === 0
                ? "무료"
                : `${formatPrice(selectedTotals.deliveryFee)}원`}
            </SummaryValue>
          </SummaryRow>

          <TotalRow>
            <TotalLabel>총 결제금액</TotalLabel>
            <TotalValue>
              {formatPrice(
                selectedTotals.finalPrice + selectedTotals.deliveryFee
              )}
              원
            </TotalValue>
          </TotalRow>

          <CheckoutButton
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            {selectedItems.length > 0
              ? `주문하기 (${selectedItems.length}개)`
              : "상품을 선택해주세요"}
          </CheckoutButton>
        </SummaryCard>
      </CartSection>

      {/* 에러 모달 */}
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

// 권한 확인이 포함된 메인 컴포넌트
const CartPage: React.FC = () => {
  return (
    <UserProtectedRoute requireUserRole={true} showNotice={true}>
      <CartPageContent />
    </UserProtectedRoute>
  );
};

export default CartPage;
