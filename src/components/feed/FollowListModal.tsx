import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';
import axiosInstance from '../../api/axios';

interface FollowUser {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  followedAt: string;
}

interface FollowListModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  type: 'followers' | 'followings';
  title: string;
  onFollowChange?: () => void; // 팔로우 상태 변경 시 콜백 추가
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  open,
  onClose,
  userId,
  type,
  title,
  onFollowChange
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // 팔로워/팔로잉 목록 로드
  useEffect(() => {
    if (open && userId) {
      loadFollowList();
    }
  }, [open, userId, type, page]);

  const loadFollowList = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = type === 'followers' 
        ? `/api/users/${userId}/followers`
        : `/api/users/${userId}/followings`;

      const response = await axiosInstance.get(endpoint, {
        params: { page, size: 20 }
      });

      const data = response.data;
      const newUsers = data.data.users || [];
      
      if (page === 0) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setHasNext(data.data.pagination?.hasNext || false);
    } catch (error) {
      console.error('팔로우 목록 로드 실패:', error);
      setError('목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userNickname: string, userId: number) => {
    onClose();
    navigate(`/my-feeds?userId=${userId}`);
  };

  const handleLoadMore = () => {
    if (!loading && hasNext) {
      setPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadFollowList}
                className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : users.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-users text-3xl mb-3"></i>
              <p>아직 {type === 'followers' ? '팔로워' : '팔로잉'}가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={user.profileImageUrl || "https://readdy.ai/api/search-image?query=default%20profile&width=40&height=40"}
                    alt={user.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://readdy.ai/api/search-image?query=default%20profile&width=40&height=40";
                    }}
                  />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleUserClick(user.nickname, user.userId)}>
                    <p className="font-medium text-gray-900 truncate hover:text-[#87CEEB] transition-colors">{user.nickname}</p>
                    <p className="text-xs text-gray-500">
                      {type === 'followers' ? '팔로우 시작' : '팔로우 시작'}: {formatDate(user.followedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FollowButton
                      targetUserId={user.userId}
                      targetUserNickname={user.nickname}
                      size="small"
                                          onFollowChange={(isFollowing) => {
                      // 팔로우 상태 변경 시 즉시 UI 업데이트
                      if (isFollowing !== undefined) {
                        // 팔로워 목록에서 팔로우 버튼을 누르면 해당 사용자를 목록에서 제거
                        if (type === 'followers' && !isFollowing) {
                          setUsers(prev => prev.filter(u => u.userId !== user.userId));
                        }
                        // 팔로잉 목록에서 언팔로우 버튼을 누르면 해당 사용자를 목록에서 제거
                        else if (type === 'followings' && !isFollowing) {
                          setUsers(prev => prev.filter(u => u.userId !== user.userId));
                        }
                        
                        // 팔로우 수 업데이트 콜백 실행
                        if (onFollowChange) {
                          onFollowChange();
                        }
                      }
                    }}
                    />
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </div>
              ))}
              
              {/* 더보기 버튼 */}
              {hasNext && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? '로딩 중...' : '더보기'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
