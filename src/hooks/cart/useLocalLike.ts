import { useEffect, useState } from "react";
import { addToWishList, removeToWishList } from "utils/cart/wishlist";

/**
 * 로컬 좋아요(위시리스트) 관리 훅
 *
 * localStorage를 사용하여 사용자의 좋아요 상태를 로컬에 저장하고 관리합니다.
 * 비로그인 사용자도 좋아요 기능을 사용할 수 있도록 지원합니다.
 *
 * @param key localStorage에 사용할 키 값
 */
export function useLocalLike(key: string) {
  // 좋아요한 아이템 ID들을 Set으로 관리 (중복 제거 및 빠른 검색)
  const [likes, setLikes] = useState<Set<number>>(new Set());

  /**
   * 컴포넌트 마운트 시 localStorage에서 좋아요 데이터 불러오기
   */
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 배열 형태로 저장된 데이터를 Set으로 변환
        if (Array.isArray(parsed)) {
          setLikes(new Set(parsed));
        }
      } catch (e) {
        console.error("Invalid localStorage for likes:", e);
      }
    }
  }, [key]);

  /**
   * likes 상태가 대경될 때마다 localStorage에 저장
   */
  useEffect(() => {
    // Set을 배열로 변환하여 JSON 형태로 저장
    localStorage.setItem(key, JSON.stringify(Array.from(likes)));
  }, [key, likes]);

  /**
   * 좋아요 상태를 토글하는 함수
   * 좋아요가 이미 되어있으면 해제, 없으면 추가
   * @param id 대상 상품 ID
   */
  const toggleLike = (id: number) => {
    setLikes((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        // 이미 좋아요가 되어있다면 제거
        updated.delete(id);
        removeToWishList(id); // 위시리스트에서도 제거
      } else {
        // 좋아요가 안되어있다면 추가
        updated.add(id);
        addToWishList(id); // 위시리스트에 추가
      }
      return updated;
    });
  };

  /**
   * 특정 상품이 좋아요 되어있는지 확인하는 함수
   * @param id 확인할 상품 ID
   * @returns 좋아요 여부
   */
  const hasLiked = (id: number) => likes.has(id);

  return { likes, toggleLike, hasLiked };
}
