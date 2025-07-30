import { useState, useEffect, useCallback } from "react";
import { CartService } from "../api/cartService";
import { useAuth } from "../contexts/AuthContext";

/**
 * 장바구니 상태 관리 훅
 *
 * 이 훅은 장바구니의 아이템 개수를 관리하고 업데이트하는 기능을 제공합니다.
 * 서버 API를 통해 실제 장바구니 데이터와 동기화됩니다.
 */

interface UseCartReturn {
  // 장바구니 아이템 개수
  cartItemCount: number;

  // 장바구니 개수를 서버에서 다시 가져와서 업데이트하는 함수
  updateCartItemCount: () => Promise<void>;

  // 장바구니 개수를 직접 설정하는 함수 (로컬 업데이트용)
  setCartItemCount: (count: number) => void;

  // 로딩 상태
  loading: boolean;

  // 에러 상태
  error: string | null;
}

export const useCart = (): UseCartReturn => {
  // 상태 관리
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 인증 상태 가져오기
  const { user } = useAuth();

  /**
   * 서버에서 장바구니 데이터를 가져와서 아이템 개수를 업데이트하는 함수
   */
  const updateCartItemCount = useCallback(async (): Promise<void> => {
    // 로그인하지 않은 사용자는 장바구니 개수를 0으로 설정
    if (!user) {
      setCartItemCount(0);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 서버에서 장바구니 데이터 가져오기
      const cartData = await CartService.getCartItems();

      // 실제 아이템 개수 계산 (수량 합계)
      const totalCount = cartData.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartItemCount(totalCount);

      console.log(`장바구니 아이템 개수 업데이트: ${totalCount}개`);
    } catch (err: any) {
      console.error("장바구니 개수 업데이트 실패:", err);

      // 에러 발생 시 개수를 0으로 설정
      setCartItemCount(0);
      setError(err.message || "장바구니 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * 컴포넌트 마운트 시 장바구니 개수 초기화
   */
  useEffect(() => {
    updateCartItemCount();
  }, [updateCartItemCount]);

  /**
   * 로그인 상태 변경 시 장바구니 개수 재조회
   */
  useEffect(() => {
    if (user) {
      // 로그인한 경우 장바구니 개수 조회
      updateCartItemCount();
    } else {
      // 로그아웃한 경우 개수를 0으로 초기화
      setCartItemCount(0);
      setError(null);
    }
  }, [user, updateCartItemCount]);

  return {
    cartItemCount,
    updateCartItemCount,
    setCartItemCount,
    loading,
    error,
  };
};
