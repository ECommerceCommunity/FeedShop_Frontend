import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserProfileService, UserProfileData } from '../../api/userProfileService';

interface FeedUserProfileProps {
  userId: number;
  nickname?: string;
  profileImageUrl?: string;
  showBodyInfo?: boolean;
  showBodyInfoOnly?: boolean; // 신체 정보만 표시 (닉네임, 사진 제외)
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const FeedUserProfile: React.FC<FeedUserProfileProps> = ({
  userId,
  nickname,
  profileImageUrl,
  showBodyInfo = true,
  showBodyInfoOnly = false,
  size = 'medium',
  onClick,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const profile = await UserProfileService.getUserProfileById(userId);
        setUserProfile(profile);
      } catch (err: any) {
        console.error('사용자 프로필 조회 실패:', err);
        setError(err.message || '프로필 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // 신체 정보 텍스트 생성
  const getBodyInfoText = () => {
    if (!userProfile) return '';
    
    const infoParts = [];
    
    // 성별
    if (userProfile.gender) {
      infoParts.push(userProfile.gender === 'MALE' ? '남성' : '여성');
    }
    
    // 키
    if (userProfile.height) {
      infoParts.push(`${userProfile.height}cm`);
    }
    
    // 몸무게
    if (userProfile.weight) {
      infoParts.push(`${userProfile.weight}kg`);
    }
    
    // 발 사이즈
    if (userProfile.footSize) {
      infoParts.push(`${userProfile.footSize}mm`);
    }
    
    return infoParts.join(' · ');
  };

  // 크기에 따른 스타일 클래스
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'flex items-center space-x-2',
          image: 'w-6 h-6',
          text: 'text-sm',
          bodyInfo: 'text-xs text-gray-500'
        };
      case 'large':
        return {
          container: 'flex items-center space-x-3',
          image: 'w-12 h-12',
          text: 'text-lg',
          bodyInfo: 'text-sm text-gray-600'
        };
      default: // medium
        return {
          container: 'flex items-center space-x-2',
          image: 'w-8 h-8',
          text: 'text-base',
          bodyInfo: 'text-sm text-gray-500'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  // props로 전달된 nickname을 우선 사용 (피드 데이터의 실제 닉네임)
  const displayNickname = nickname || userProfile?.nickname || '사용자';
  console.log('FeedUserProfile 닉네임 정보:', { 
    propsNickname: nickname, 
    userProfileNickname: userProfile?.nickname, 
    displayNickname 
  });
  const displayProfileImage = userProfile?.profileImageUrl || profileImageUrl;
  const bodyInfoText = getBodyInfoText();

  if (loading) {
    return (
      <div className={`${sizeClasses.container} animate-pulse`}>
        {!showBodyInfoOnly && (
          <div className={`${sizeClasses.image} bg-gray-200 rounded-full`}></div>
        )}
        <div className="space-y-1">
          {!showBodyInfoOnly && (
            <div className={`${sizeClasses.text} bg-gray-200 h-4 w-20 rounded`}></div>
          )}
          {showBodyInfo && (
            <div className={`${sizeClasses.bodyInfo} bg-gray-200 h-3 w-24 rounded`}></div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sizeClasses.container} text-red-500`}>
        {!showBodyInfoOnly && (
          <div className={`${sizeClasses.image} bg-red-100 rounded-full flex items-center justify-center`}>
            <i className="fas fa-exclamation-triangle text-red-400"></i>
          </div>
        )}
        <div className={sizeClasses.text}>프로필 로드 실패</div>
      </div>
    );
  }

  // 신체 정보만 표시하는 경우
  if (showBodyInfoOnly) {
    return (
      <div className={`${sizeClasses.bodyInfo} text-gray-600`}>
        {bodyInfoText}
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses.container} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
    >
      {/* 프로필 이미지 */}
      <div className={`${sizeClasses.image} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
        {displayProfileImage ? (
          <img
            src={displayProfileImage}
            alt={displayNickname}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${sizeClasses.image} rounded-full bg-gray-300 flex items-center justify-center ${displayProfileImage ? 'hidden' : ''}`}>
          <i className="fas fa-user text-gray-500"></i>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="flex flex-col min-w-0">
        <div className={`${sizeClasses.text} font-medium text-gray-900 truncate`}>
          {displayNickname}
        </div>
        {showBodyInfo && bodyInfoText && (
          <div className={`${sizeClasses.bodyInfo} truncate`}>
            {bodyInfoText}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedUserProfile;
