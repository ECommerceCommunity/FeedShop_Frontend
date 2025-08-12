import { useState, useEffect } from 'react';

export const useLikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // localStorage에서 초기값 로드
  useEffect(() => {
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      try {
        const parsed = JSON.parse(savedLikedPosts);
        setLikedPosts(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('localStorage 파싱 오류:', error);
        setLikedPosts([]);
      }
    }
  }, []);

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'likedPosts') {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : [];
          setLikedPosts(Array.isArray(newValue) ? newValue : []);
        } catch (error) {
          console.error('localStorage 변경 감지 파싱 오류:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 좋아요 상태 업데이트 함수 (최적화)
  const updateLikedPosts = (newLikedPosts: number[]) => {
    // 중복 제거 및 정렬
    const uniqueLikedPosts = Array.from(new Set(newLikedPosts)).sort((a, b) => a - b);
    
    setLikedPosts(uniqueLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(uniqueLikedPosts));
    
    // 다른 탭/창에서도 변경사항을 감지할 수 있도록 storage 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'likedPosts',
      newValue: JSON.stringify(uniqueLikedPosts)
    }));
  };

  // 특정 피드 좋아요 토글
  const toggleLike = (feedId: number) => {
    const newLikedPosts = likedPosts.includes(feedId)
      ? likedPosts.filter(id => id !== feedId)
      : [...likedPosts, feedId];
    
    updateLikedPosts(newLikedPosts);
  };

  // 특정 피드가 좋아요 상태인지 확인
  const isLiked = (feedId: number) => likedPosts.includes(feedId);

  return {
    likedPosts,
    updateLikedPosts,
    toggleLike,
    isLiked
  };
};
