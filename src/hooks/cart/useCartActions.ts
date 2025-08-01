import { useState } from "react";
import { CartService } from "../../api/cartService";
import { CartItem } from "../../types/cart";

/**
 * 장바구니 액션 관리 훅
 *
 * 장바구니에서 수행할 수 있는 다양한 액션들을 관리합니다:
 * - 상품 수량 변경
 * - 상품 삭제
 * - 상품 선택/해제
 * - 전체 선택/해제
 */

// 훅에 전달받을 props 타입 정의
interface UseCartActionsProps {
  // 장바구니 데이터
  cartData: {
    items: CartItem[];
    totalOriginalPrice: number;
    totalDiscountPrice: number;
    totalSavings: number;
    totalItemCount: number;
  } | null;
  // 장바구니 데이터 업데이트 함수
  setCartData: React.Dispatch<React.SetStateAction<any>>;
  // 장바구니 데이터 다시 불러오기 함수
  reloadCartData: () => Promise<void>;
  // 에러 처리 콜백 함수
  onError: (message: string) => void;
}

// 훅에서 반환할 값들의 타입 정의
interface UseCartActionsReturn {
  // 선택된 아이템 ID 배열
  selectedItems: number[];
  // 선택된 아이템 설정 함수
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  // 수량 변경 처리 함수
  handleQuantityChange: (
    cartItemId: number,
    newQuantity: number
  ) => Promise<void>;
  // 아이템 삭제 처리 함수
  handleRemoveItem: (cartItemId: number) => Promise<void>;
  // 아이템 선택/해제 처리 함수
  handleSelectItem: (cartItemId: number, selected: boolean) => Promise<void>;
  // 전체 선택/해제 처리 함수
  handleSelectAll: (selectAll: boolean) => Promise<void>;
}

export const useCartActions = ({
  cartData,
  setCartData,
  reloadCartData,
  onError,
}: UseCartActionsProps): UseCartActionsReturn => {
  // 선택된 장바구니 아이템 ID들을 관리하는 상태
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  /**
   * 장바구니 아이템의 수량을 변경하는 함수
   * @param cartItemId 장바구니 아이템 ID
   * @param newQuantity 새로운 수량 (1-5 사이)
   */
  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    // 수량 유효성 검사 (1-5 사이만 허용)
    if (newQuantity < 1 || newQuantity > 5) return;

    // 로컬 상태 즉시 업데이트 (UI 반응성 향상)
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

    try {
      // 서버에 수량 변경 요청
      await CartService.updateCartItem(cartItemId, { quantity: newQuantity });
    } catch (err: any) {
      // 실패 시 서버 데이터로 롤백
      await reloadCartData();
      onError("수량 변경에 실패했습니다.");
    }
  };

  /**
   * 장바구니에서 아이템을 삭제하는 함수
   * @param cartItemId 삭제할 장바구니 아이템 ID
   */
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      // 서버에서 아이템 삭제
      await CartService.removeCartItem(cartItemId);
      // 장바구니 데이터 새로고침
      await reloadCartData();
      // 선택된 아이템 목록에서도 제거
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    } catch (err: any) {
      onError("상품 삭제에 실패했습니다.");
    }
  };

  /**
   * 개별 아이템의 선택 상태를 변경하는 함수
   * @param cartItemId 대상 장바구니 아이템 ID
   * @param selected 선택 여부 (true: 선택, false: 해제)
   */
  const handleSelectItem = async (cartItemId: number, selected: boolean) => {
    // 선택된 아이템 목록 업데이트
    if (selected) {
      setSelectedItems((prev) => [...prev, cartItemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    }

    // 로컬 장바구니 데이터의 선택 상태 업데이트
    if (cartData) {
      const updatedItems = cartData.items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, selected } : item
      );
      setCartData({
        ...cartData,
        items: updatedItems,
      });
    }

    // 서버에 선택 상태 동기화
    await CartService.updateCartItem(cartItemId, { selected });
  };

  /**
   * 모든 아이템의 선택 상태를 일괄 변경하는 함수
   * @param selectAll 전체 선택 여부 (true: 전체 선택, false: 전체 해제)
   */
  const handleSelectAll = async (selectAll: boolean) => {
    if (!cartData) return;

    // 선택된 아이템 목록 업데이트
    if (selectAll) {
      // 모든 아이템 ID를 선택 목록에 추가
      setSelectedItems(cartData.items.map((item) => item.cartItemId));
    } else {
      // 선택 목록 비우기
      setSelectedItems([]);
    }

    // 로컬 장바구니 데이터의 모든 아이템 선택 상태 업데이트
    const updatedItems = cartData.items.map((item) => ({
      ...item,
      selected: selectAll,
    }));
    setCartData({
      ...cartData,
      items: updatedItems,
    });

    // 모든 아이템의 선택 상태를 서버에 병렬로 업데이트
    const updatePromises = cartData.items.map((item) =>
      CartService.updateCartItem(item.cartItemId, { selected: selectAll })
    );
    await Promise.all(updatePromises);
  };

  return {
    selectedItems,
    setSelectedItems,
    handleQuantityChange,
    handleRemoveItem,
    handleSelectItem,
    handleSelectAll,
  };
};
