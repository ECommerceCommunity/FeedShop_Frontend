import { useState } from "react";
import { CartService } from "../../api/cartService";
import { CartItem } from "../../types/cart";

interface UseCartActionsProps {
  cartData: {
    items: CartItem[];
    totalOriginalPrice: number;
    totalDiscountPrice: number;
    totalSavings: number;
    totalItemCount: number;
  } | null;
  setCartData: React.Dispatch<React.SetStateAction<any>>;
  reloadCartData: () => Promise<void>;
  onError: (message: string) => void;
}

interface UseCartActionsReturn {
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  handleQuantityChange: (
    cartItemId: number,
    newQuantity: number
  ) => Promise<void>;
  handleRemoveItem: (cartItemId: number) => Promise<void>;
  handleSelectItem: (cartItemId: number, selected: boolean) => Promise<void>;
  handleSelectAll: (selectAll: boolean) => Promise<void>;
}

export const useCartActions = ({
  cartData,
  setCartData,
  reloadCartData,
  onError,
}: UseCartActionsProps): UseCartActionsReturn => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1 || newQuantity > 5) return;

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
      await CartService.updateCartItem(cartItemId, { quantity: newQuantity });
    } catch (err: any) {
      await reloadCartData();
      onError("수량 변경에 실패했습니다.");
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await CartService.removeCartItem(cartItemId);
      await reloadCartData();
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    } catch (err: any) {
      onError("상품 삭제에 실패했습니다.");
    }
  };

  const handleSelectItem = async (cartItemId: number, selected: boolean) => {
    if (selected) {
      setSelectedItems((prev) => [...prev, cartItemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    }

    if (cartData) {
      const updatedItems = cartData.items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, selected } : item
      );
      setCartData({
        ...cartData,
        items: updatedItems,
      });
    }

    await CartService.updateCartItem(cartItemId, { selected });
  };

  const handleSelectAll = async (selectAll: boolean) => {
    if (!cartData) return;

    if (selectAll) {
      setSelectedItems(cartData.items.map((item) => item.cartItemId));
    } else {
      setSelectedItems([]);
    }

    const updatedItems = cartData.items.map((item) => ({
      ...item,
      selected: selectAll,
    }));
    setCartData({
      ...cartData,
      items: updatedItems,
    });

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
