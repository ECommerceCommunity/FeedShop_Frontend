import { useState } from 'react';

export const useLikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // 특정 피드가 좋아요 상태인지 확인
  const isLiked = (feedId: number) => likedPosts.includes(feedId);

  // 좋아요 상태 업데이트 (백엔드 응답 기반)
  const updateLikedPosts = (newLikedPosts: number[]) => {
    setLikedPosts(newLikedPosts);
  };

  // 특정 피드 좋아요 상태 토글 (백엔드 API 호출 후 상태 업데이트)
  const toggleLike = (feedId: number, isLikedNow: boolean) => {
    if (isLikedNow) {
      setLikedPosts(prev => [...prev, feedId]);
    } else {
      setLikedPosts(prev => prev.filter(id => id !== feedId));
    }
  };

  return {
    likedPosts,
    updateLikedPosts,
    toggleLike,
    isLiked
  };
};
