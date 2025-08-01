import { useState, useEffect } from "react";
import { CartService } from "../../api/cartService";
import { CartItem } from "../../types/cart";

interface CartData {
  items: CartItem[];
  totalOriginalPrice: number;
  totalDiscountPrice: number;
  totalSavings: number;
  totalItemCount: number;
}

interface UseCartDataReturn {
  cartData: CartData | null;
  loading: boolean;
  error: string | null;
  reloadCartData: () => Promise<void>;
}

export const useCartData = (): UseCartDataReturn => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CartService.getCartItems();
      setCartData(data);
    } catch (err: any) {
      setError("장바구니 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  return {
    cartData,
    loading,
    error,
    reloadCartData: loadCartData,
  };
};
