import React, { useState, useEffect } from 'react';
import { FeedPost } from '../../types/feed';
import FeedVoteButton from './FeedVoteButton';
import FeedUserProfile from './FeedUserProfile';
import FollowButton from './FollowButton';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfileService } from '../../api/userProfileService';

// 한국 시간으로 날짜 포맷팅하는 유틸리티 함수
const formatKoreanTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const koreanTime = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    }).format(date);
    return koreanTime;
  } catch (error) {
    console.warn('날짜 파싱 실패:', error);
    return dateString; // 파싱 실패 시 원본 반환
  }
};

interface FeedDetailModalProps {
  open: boolean;
  onClose: () => void;
  feed: FeedPost | null;
  comments: any[];
  showComments: boolean;
  onToggleComments: () => void;
  onLike: () => void;
  liked: boolean;
  onVote?: () => void;
  voted?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showVoteButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean; // optional; defaults to showEditButton when undefined
  showVoteModal?: boolean;
  onVoteModalClose?: () => void;
  onVoteConfirm?: () => void;
  showToast?: boolean;
  toastMessage?: string;
  newComment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onShowLikeUsers?: () => void;
  onDeleteComment?: (commentId: number) => void;
  currentUser?: { nickname?: string };
  onUserClick?: (userId: number) => void; // 사용자 클릭 핸들러 추가
}

const FeedDetailModal: React.FC<FeedDetailModalProps> = ({
  open,
  onClose,
  feed,
  comments,
  showComments,
  onToggleComments,
  onLike,
  liked,
  onVote,
  voted,
  onEdit,
  onDelete,
  showVoteButton,
  showEditButton,
  showDeleteButton,
  showVoteModal,
  onVoteModalClose,
  onVoteConfirm,
  showToast,
  toastMessage,
  newComment,
  onCommentChange,
  onCommentSubmit,
  onShowLikeUsers,
  onDeleteComment,
  currentUser,
  onUserClick,
}) => {
  const { user } = useAuth();
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
  
  if (!open || !feed) return null;
  const heroImage = feed.images && feed.images.length > 0 ? feed.images[0].imageUrl : 'https://via.placeholder.com/600x800?text=No+Image';
  const canShowDelete = (showDeleteButton ?? showEditButton) && !!onDelete;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
          onClick={onClose}
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <div className="flex flex-col md:flex-row">
          {/* 이미지 */}
          <div className="md:w-1/2">
            <img src={heroImage} alt={feed.title} className="w-full h-80 object-cover object-top rounded-l-lg" />
          </div>
          {/* 상세 정보 */}
          <div className="md:w-1/2 p-6">
            <div className="mb-6">
              {feed.user && (
                <div className="flex items-center justify-between">
                  <FeedUserProfile
                    userId={feed.user.id || 0}
                    nickname={feed.user.nickname}
                    profileImageUrl={feed.user.profileImg}
                    showBodyInfo={true}
                    size="large"
                    onClick={() => {
                      if (feed.user?.id) {
                        window.location.href = `/my-feeds?userId=${feed.user.id}`;
                      }
                    }}
                  />
                  {/* 팔로우 버튼 */}
                  {feed.user && user && currentUserId && feed.user.id !== currentUserId && (
                    <FollowButton
                      targetUserId={feed.user.id}
                      targetUserNickname={feed.user.nickname}
                      size="small"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{feed.title}</h2>
              {feed.orderItem && (
                <p className="text-gray-600">신발 사이즈: {feed.orderItem.size}mm</p>
              )}
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">상품 설명</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feed.content}</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex space-x-6">
                <button
                  className={`flex items-center cursor-pointer focus:outline-none ${liked ? 'text-red-500' : 'text-gray-500 hover:text-[#87CEEB]'}`}
                  onClick={onLike}
                >
                  <i className={`fas fa-heart mr-2 ${liked ? 'text-red-500' : ''}`}></i>
                  <span 
                    className="underline decoration-dotted cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowLikeUsers?.();
                    }}
                  >
                    {feed.likeCount || 0}
                  </span>
                </button>
                <button
                  className="flex items-center text-gray-500 hover:text-[#87CEEB] cursor-pointer"
                  onClick={onToggleComments}
                >
                  <i className="fas fa-comment mr-2"></i>
                  <span>{feed.commentCount || 0}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {showVoteButton && (
                  <button
                    onClick={onVote}
                    className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer ${voted ? 'bg-gray-200 text-gray-600' : 'bg-[#87CEEB] text-white hover:bg-blue-400'}`}
                    disabled={voted}
                  >
                    <i className="fas fa-vote-yea mr-1"></i>
                    {voted ? '투표완료' : '투표하기'} {feed.participantVoteCount || 0}
                  </button>
                )}
                {showEditButton && (
                  <button
                    className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-medium"
                    onClick={onEdit}
                  >
                    수정
                  </button>
                )}
                {canShowDelete && (
                  <button
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                    onClick={onDelete}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
            {/* 투표 확인 모달 */}
            {showVoteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">투표 확인</h3>
                  <p className="text-gray-600 mb-6">이 착용샷에 투표하시겠습니까?</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onVoteModalClose}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      onClick={onVoteConfirm}
                      className="px-4 py-2 bg-[#87CEEB] text-white rounded-lg hover:bg-blue-400 cursor-pointer"
                    >
                      투표하기
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* 댓글 섹션 */}
            {showComments && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-medium mb-4">댓글 {comments.length}개</h3>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.user?.profileImg || "https://readdy.ai/api/search-image?query=default%20profile&width=40&height=40"}
                        alt={comment.user?.nickname || "사용자"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{comment.user?.nickname || comment.userNickname || "사용자"}</span>
                            {comment.user?.level && (
                              <div className="ml-2 bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] text-xs px-2 py-0.5 rounded-full">
                                Lv.{comment.user.level}
                              </div>
                            )}
                            <span className="ml-2 text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                          {/* 댓글 작성자만 삭제 버튼 표시 */}
                          {currentUser?.nickname && (comment.user?.nickname || comment.userNickname) === currentUser.nickname && onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold"
                              title="댓글 삭제"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 댓글 입력 폼 */}
                <form onSubmit={onCommentSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={onCommentChange}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#87CEEB]"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-200"
                    disabled={!newComment.trim()}
                  >
                    등록
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal; 