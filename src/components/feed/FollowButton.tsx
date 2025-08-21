import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfileService } from '../../api/userProfileService';
import axiosInstance from '../../api/axios';

interface FollowButtonProps {
  targetUserId: number;
  targetUserNickname: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUserNickname,
  size = 'medium',
  className = '',
  onFollowChange
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userProfile = await UserProfileService.getUserProfile();
        setCurrentUserId(userProfile.userId || null);
      } catch (error) {
        console.error('사용자 ID 가져오기 실패:', error);
      }
    };

    if (user) {
      getCurrentUserId();
    }
  }, [user]);

  // 현재 사용자가 대상 사용자를 팔로우하고 있는지 확인
  useEffect(() => {
    if (!user || !targetUserId || !currentUserId) return;
    
    const checkFollowStatus = async () => {
      try {
        console.log('팔로우 상태 확인 시작 - targetUserId:', targetUserId);
        
        const response = await axiosInstance.get(`/api/users/${targetUserId}/follow-status`);
        
        console.log('팔로우 상태 확인 응답:', response.data);
        const followStatus = response.data.data;
        console.log('팔로우 상태:', followStatus);
        setIsFollowing(followStatus);
      } catch (error: any) {
        console.error('팔로우 상태 확인 실패:', error);
        
        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          window.location.href = '/login';
          return;
        }
        
        // 403 에러인 경우 권한 부족
        if (error.response?.status === 403) {
          alert('접근 권한이 없습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
          return;
        }
      }
    };

    checkFollowStatus();
  }, [user, targetUserId, currentUserId]);

  // 팔로우/언팔로우 토글
  const handleFollowToggle = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      // navigate('/login'); // 페이지 이동 제거
      return;
    }

    if (currentUserId === targetUserId) {
      alert('자기 자신을 팔로우할 수 없습니다.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('팔로우 토글 시작 - targetUserId:', targetUserId);
      
      const response = await axiosInstance.post('/api/users/follow', {
        followingUserId: targetUserId
      });
      
      console.log('팔로우 토글 응답:', response.data);
      console.log('응답 data 필드:', response.data.data);
      
      // 올바른 응답 구조 사용 (백엔드에서 'following' 필드 사용)
      const newFollowStatus = response.data.data?.following;
      console.log('새로운 팔로우 상태:', newFollowStatus);
      
      if (newFollowStatus !== undefined) {
        setIsFollowing(newFollowStatus);
        
        if (onFollowChange) {
          onFollowChange(newFollowStatus);
        }

        // 성공 메시지 표시
        const message = newFollowStatus ? '팔로우가 완료되었습니다!' : '언팔로우가 완료되었습니다!';
        console.log(message);
      } else {
        console.error('응답에서 isFollowing 필드를 찾을 수 없습니다:', response.data);
        console.error('응답 data 필드 상세:', JSON.stringify(response.data.data, null, 2));
        alert('팔로우 상태를 확인할 수 없습니다.');
      }
    } catch (error: any) {
      console.error('팔로우 처리 실패:', error);
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
        return;
      }
      
      // 403 에러인 경우 권한 부족
      if (error.response?.status === 403) {
        alert('접근 권한이 없습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return;
      }
      
      alert(error.response?.data?.message || '팔로우 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로그인하지 않은 사용자이거나 자기 자신인 경우 버튼 숨김
  if (!user || currentUserId === targetUserId) {
    return null;
  }

  // 사이즈별 스타일 클래스
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-xs';
      case 'large':
        return 'px-6 py-3 text-base';
      default: // medium
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`
        ${getSizeClasses()}
        font-medium rounded-lg transition-all duration-200
        ${isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-[#87CEEB] text-white hover:bg-blue-400'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
          처리중...
        </span>
      ) : (
        <span className="flex items-center">
          <i className={`fas ${isFollowing ? 'fa-user-check' : 'fa-user-plus'} mr-2`}></i>
          {isFollowing ? '언팔로우' : '팔로우'}
        </span>
      )}
    </button>
  );
};

export default FollowButton;
