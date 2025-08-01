import { useState, useEffect } from "react";
import { CartService } from "../../api/cartService";
import { CartItem } from "../../types/cart";

/**
 * 장바구니 데이터 관리 훅
 *
 * 서버에서 장바구니 데이터를 가져오고 관리하는 기능을 제공합니다.
 * 로딩, 에러 상태를 포함하여 전체적인 데이터 및 상태 관리를 담당합니다.
 */

// 장바구니 데이터 구조 정의
interface CartData {
  items: CartItem[];           // 장바구니 아이템 목록
  totalOriginalPrice: number;  // 전체 원가
  totalDiscountPrice: number;  // 전체 할인가
  totalSavings: number;        // 전체 절약 금액
  totalItemCount: number;      // 전체 아이템 개수
}

// 훅에서 반환할 값들의 타입 정의
interface UseCartDataReturn {
  cartData: CartData | null;              // 장바구니 데이터 (로딩 중이거나 에러 시 null)
  loading: boolean;                       // 로딩 상태
  error: string | null;                   // 에러 메시지
  reloadCartData: () => Promise<void>;    // 데이터 다시 불러오기 함수
}

export const useCartData = (): UseCartDataReturn => {
  // 장바구니 데이터 상태
  const [cartData, setCartData] = useState<CartData | null>(null);
  // 로딩 상태 (초기값은 true로 설정)
  const [loading, setLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  /**
   * 서버에서 장바구니 데이터를 불러오는 함수
   * 로딩 상태와 에러 처리를 포함하여 안전하게 데이터를 가져옵니다.
   */
  const loadCartData = async () => {
    try {
      setLoading(true);  // 로딩 시작
      setError(null);    // 이전 에러 초기화
      
      // CartService를 통해 장바구닄 데이터 요청
      const data = await CartService.getCartItems();
      setCartData(data); // 성공시 데이터 설정
    } catch (err: any) {
      // 에러 발생 시 에러 메시지 설정
      setError("장바구니 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false); // 성공/실패 관계없이 로딩 종료
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
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
