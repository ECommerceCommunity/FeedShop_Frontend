import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartService } from "../../api/cartService";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "hooks/cart/useCart";
import { ProductDetail } from "types/products";
import { SelectedOptions } from "./useProductOptions";

export const useProductActions = (
  product: ProductDetail | null,
  selectedOptions: SelectedOptions[]
) => {
  const { user } = useAuth();
  const { updateCartItemCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateUser = (onError: (message: string) => void): boolean => {
    if (!user) {
      onError("로그인이 필요한 서비스입니다.");
      return false;
    }

    if (user.userType !== "user") {
      onError("일반 사용자만 이용할 수 있는 서비스입니다.");
      return false;
    }

    return true;
  };

  const validateOptions = (onError: (message: string) => void): boolean => {
    if (selectedOptions.length === 0) {
      onError("사이즈를 선택해주세요.");
      return false;
    }
    return true;
  };

  const handleAddToCart = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void,
    clearOptions: () => void
  ) => {
    if (!validateUser(onError) || !validateOptions(onError)) return;

    try {
      for (const option of selectedOptions) {
        await CartService.addCartItem({
          optionId: option.optionId,
          imageId: product?.images[0].imageId || 1,
          quantity: option.quantity,
        });
      }

      await updateCartItemCount();
      onSuccess("장바구니에 상품이 추가되었습니다.");
      clearOptions();
    } catch (err: any) {
      onError("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDirectOrder = async (onError: (message: string) => void) => {
    if (!validateUser(onError) || !validateOptions(onError)) return;

    const tempCartItemIds: number[] = [];

    try {
      setLoading(true);

      for (const option of selectedOptions) {
        const response = await CartService.addCartItem({
          optionId: option.optionId,
          imageId: product?.images[0].imageId || 1,
          quantity: option.quantity,
        });

        if (response?.cartItemId) {
          tempCartItemIds.push(response.cartItemId);
        }
      }

      navigate("/payment", {
        state: {
          isDirectOrder: true,
          tempCartItemIds,
          originalProductInfo: {
            productId: product?.productId,
            productName: product?.name,
            selectedOptions: selectedOptions,
          },
        },
      });
    } catch (error: any) {
      if (tempCartItemIds.length > 0) {
        for (const cartItemId of tempCartItemIds) {
          await CartService.removeCartItem(cartItemId);
        }
      }
      onError("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddToCart,
    handleDirectOrder,
    loading,
  };
};
