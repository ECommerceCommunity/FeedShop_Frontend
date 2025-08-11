import React from 'react';
import { FeedPost } from '../../types/feed';

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
}) => {
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
            <div className="flex items-center mb-6">
              <img src={feed.user?.profileImg || 'https://via.placeholder.com/60'} alt={feed.user?.nickname || '사용자'} className="w-12 h-12 rounded-full object-cover mr-3" />
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">{feed.user?.nickname || '사용자'}</h3>
                  {feed.user?.level && (
                    <div className="ml-2 bg-[#87CEEB] text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                      <i className="fas fa-crown text-yellow-300 mr-1 text-xs"></i>
                      <span>Lv.{feed.user.level}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {feed.user?.gender && feed.user?.height && (
                    <span>{feed.user.gender} · {feed.user.height}cm</span>
                  )}
                  {feed.instagramId && (
                    <a href={`https://instagram.com/${feed.instagramId}`} target="_blank" rel="noopener noreferrer" className="ml-3 text-[#87CEEB] hover:underline cursor-pointer">
                      <i className="fab fa-instagram mr-1"></i>
                      {feed.instagramId}
                    </a>
                  )}
                </div>
              </div>
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
                  disabled={liked}
                >
                  <i className={`fas fa-heart mr-2 ${liked ? 'text-red-500' : ''}`}></i>
                  <span>{feed.likeCount || 0}</span>
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
            {/* 토스트 알림 */}
            {showToast && (
              <div className="fixed bottom-4 right-4 bg-[#87CEEB] text-white px-6 py-3 rounded-lg shadow-lg z-[70] animate-fade-in-up">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>{toastMessage || '처리가 완료되었습니다.'}</span>
                </div>
              </div>
            )}
            {/* 댓글 섹션 */}
            {showComments && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="font-medium mb-4">댓글 {comments.length}개</h3>
                {/* 댓글 목록 */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img src={comment.profileImg} alt={comment.username} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-sm">{comment.username}</span>
                          <div className="ml-2 bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] text-xs px-2 py-0.5 rounded-full">Lv.{comment.level}</div>
                          <span className="ml-2 text-xs text-gray-500">{comment.createdAt}</span>
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
                    className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-200 cursor-pointer"
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