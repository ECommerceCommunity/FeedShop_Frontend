import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FeedService from "../../api/feedService";
import { FeedPost, FeedComment, FeedVoteRequest } from "../../types/feed";
import { useLikedPosts } from "../../hooks/useLikedPosts";

const FeedDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [feed, setFeed] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeUsersOpen, setLikeUsersOpen] = useState(false);
  const [likeUsers, setLikeUsers] = useState<Array<{ userId?: number; nickname: string; profileImg?: string }>>([]);
  const [likeUsersLoading, setLikeUsersLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 좋아요 상태 관리
  const { isLiked: isLikedGlobal, updateLikedPosts, likedPosts } = useLikedPosts();
  
  // 전역 좋아요 상태와 로컬 상태 동기화
  useEffect(() => {
    if (feed) {
      setLiked(isLikedGlobal(feed.id));
    }
  }, [feed, isLikedGlobal]);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!id) {
        navigate('/feeds');
        return;
      }

      try {
        setLoading(true);
        
        // 백엔드 API 연동
        const feedData = await FeedService.getFeed(parseInt(id));
        setFeed(feedData);
        
        // 백엔드에서 받은 isLiked 상태를 우선으로 설정
        const isLikedFromBackend = feedData.isLiked || false;
        setLiked(isLikedFromBackend);
        
        // 백엔드 상태를 기준으로 전역 상태 동기화
        if (isLikedFromBackend) {
          updateLikedPosts([feedData.id]);
        }
        
        // 댓글도 API로 가져오기 (추후 구현)
        // const commentsData = await FeedService.getComments(parseInt(id));
        // setComments(commentsData.content || []);
        
      } catch (error: any) {
        console.error('피드 조회 실패:', error);
        
        if (error.response?.status === 404) {
          setToastMessage("피드를 찾을 수 없습니다.");
          setShowToast(true);
          setTimeout(() => navigate('/feeds'), 2000);
        } else {
          setToastMessage("피드 조회에 실패했습니다.");
          setShowToast(true);
          setTimeout(() => navigate('/feeds'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [id, navigate]);

  // 사용자 로그아웃 시 좋아요 상태 초기화
  useEffect(() => {
    if (!user) {
      setLiked(false);
    }
  }, [user]);

  const handleLike = async () => {
    if (!feed) return;
    
    try {
      const likeResult = await FeedService.likeFeed(feed.id);
      setLiked(likeResult.liked);
      setFeed(prev => prev ? { ...prev, likeCount: likeResult.likeCount } : null);
      
      // 백엔드 응답에 따라 전역 상태 업데이트
      if (likeResult.liked) {
        updateLikedPosts([...likedPosts, feed.id]);
      } else {
        updateLikedPosts(likedPosts.filter((postId: number) => postId !== feed.id));
      }
      
      const message = likeResult.liked ? "좋아요가 추가되었습니다!" : "좋아요가 취소되었습니다!";
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error: any) {
      console.error('좋아요 실패:', error);
      
      if (error.response?.status === 401) {
        setToastMessage("로그인이 필요합니다.");
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 404) {
        setToastMessage("피드를 찾을 수 없습니다.");
      } else {
        setToastMessage(error.response?.data?.message || "좋아요 처리에 실패했습니다.");
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const openLikeUsers = async () => {
    if (!feed) return;
    try {
      setLikeUsersLoading(true);
      const list = await FeedService.getFeedLikes(feed.id);
      setLikeUsers(list);
      setLikeUsersOpen(true);
    } catch (error: any) {
      console.error('좋아요 사용자 목록 조회 실패:', error);
      
      if (error.response?.status === 404) {
        setToastMessage('피드를 찾을 수 없습니다.');
      } else {
        setToastMessage('좋아요한 사용자 목록을 불러오지 못했습니다.');
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setLikeUsersLoading(false);
    }
  };

  const handleVote = async () => {
    if (!feed || voted) return;
    
    try {
      // 백엔드 API 연동 (추후 구현)
      // const voteRequest: FeedVoteRequest = {
      //   eventId: feed.event.id
      // };
      // const voteResult = await FeedService.voteFeed(feed.id, voteRequest);
      // setVoted(voteResult.voted);
      // setFeed(prev => prev ? { ...prev, participantVoteCount: voteResult.voteCount } : null);
      
      setShowVoteModal(false);
      setToastMessage("투표 기능은 추후 구현 예정입니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error: any) {
      console.error('투표 실패:', error);
      setShowVoteModal(false);
      setToastMessage("투표 처리에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !feed) return;

    try {
      // 백엔드 API 연동 (추후 구현)
      // const newCommentObj = await FeedService.createComment(feed.id, {
      //   content: newComment
      // });
      // setComments([...comments, newCommentObj]);
      // setFeed(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
      
      setNewComment("");
      setToastMessage("댓글 기능은 추후 구현 예정입니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error: any) {
      console.error('댓글 등록 실패:', error);
      setToastMessage("댓글 등록에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleEdit = () => {
    navigate(`/feed-edit?id=${feed?.id}`);
  };

  const handleDelete = async () => {
    if (!feed || !window.confirm("정말로 이 피드를 삭제하시겠습니까?")) return;
    try {
      await FeedService.deleteFeed(feed.id);
      setToastMessage("피드가 삭제되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate('/feeds'), 1200);
    } catch (error: any) {
      console.error('피드 삭제 실패:', error);
      const status = error?.response?.status;
      if (status === 401) {
        setToastMessage("로그인이 필요합니다.");
      } else if (status === 403) {
        setToastMessage("본인 피드만 삭제할 수 있습니다.");
      } else if (status === 404) {
        setToastMessage("피드를 찾을 수 없거나 이미 삭제되었습니다.");
      } else {
        setToastMessage("피드 삭제에 실패했습니다.");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const canEdit = user?.nickname && feed && feed.user.nickname === user.nickname;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">피드를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/feeds')}
            className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-200"
          >
            피드 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#87CEEB] transition duration-200"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          뒤로가기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* 이미지 섹션 */}
          <div className="lg:w-1/2">
            <div className="relative">
              {feed.images && feed.images.length > 0 ? (
                <>
                  <img
                    src={feed.images[currentImageIndex]?.imageUrl}
                    alt={feed.title}
                    className="w-full h-96 lg:h-[600px] object-cover"
                  />
                  
                  {/* 이미지 네비게이션 */}
                  {feed.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? feed.images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === feed.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      
                      {/* 이미지 인디케이터 */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {feed.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 lg:h-[600px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">이미지가 없습니다</span>
                </div>
              )}
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className="lg:w-1/2 p-6">
            {/* 사용자 정보 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img
                  src={feed.user?.profileImg || "https://readdy.ai/api/search-image?query=default%20profile&width=60&height=60"}
                  alt={feed.user?.nickname || "사용자"}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-lg">{feed.user?.nickname || "사용자"}</h3>
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
                      <a
                        href={`https://instagram.com/${feed.instagramId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-[#87CEEB] hover:underline"
                      >
                        <i className="fab fa-instagram mr-1"></i>
                        {feed.instagramId}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-medium"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{feed.title}</h2>
              {feed.orderItem && (
                <>
                  <p className="text-gray-600">상품명: {feed.orderItem.productName}</p>
                  {feed.orderItem.size && <p className="text-gray-600">신발 사이즈: {feed.orderItem.size}mm</p>}
                </>
              )}
              <p className="text-gray-500 text-sm">작성일: {feed.createdAt}</p>
            </div>

            {/* 해시태그 */}
            {feed.hashtags && feed.hashtags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {feed.hashtags.map((hashtag, index) => {
                    // 디버깅: 렌더링 시점의 해시태그 데이터 확인
                    console.log(`렌더링 해시태그 ${index}:`, hashtag, typeof hashtag);
                    
                    // hashtag가 객체인지 문자열인지 확인하고 안전하게 처리
                    let tagText: string;
                    let key: string | number;
                    
                    if (typeof hashtag === 'string') {
                      tagText = hashtag;
                      key = index;
                    } else if (hashtag && typeof hashtag === 'object' && 'tag' in hashtag) {
                      tagText = hashtag.tag;
                      key = hashtag.id || index;
                    } else if (hashtag && typeof hashtag === 'object' && 'tagId' in hashtag) {
                      // 백엔드에서 {tagId, tag} 형태로 오는 경우
                      tagText = (hashtag as any).tag;
                      key = (hashtag as any).tagId || index;
                    } else {
                      // 예상치 못한 형태의 데이터는 건너뛰기
                      console.warn('예상치 못한 해시태그 형태:', hashtag);
                      return null;
                    }
                    
                    return (
                      <span
                        key={key}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        #{tagText}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 설명 */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">내용</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feed.content}</p>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mb-6">
              <div className="flex space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center focus:outline-none ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-[#87CEEB]'
                  }`}
                >
                  <i className={`fas fa-heart mr-2 ${liked ? 'text-red-500' : ''}`}></i>
                  <span 
                    className="underline decoration-dotted cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLikeUsers();
                    }}
                  >
                    {feed.likeCount || 0}
                  </span>
                </button>
                
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-comment mr-2"></i>
                  <span>{feed.commentCount || 0}</span>
                </div>
              </div>

              {feed.feedType === "EVENT" && (
                <button
                  onClick={() => setShowVoteModal(true)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    voted
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-[#87CEEB] text-white hover:bg-blue-400'
                  }`}
                  disabled={voted}
                >
                  <i className="fas fa-vote-yea mr-1"></i>
                  {voted ? '투표완료' : '투표하기'} {feed.participantVoteCount || 0}
                </button>
              )}
            </div>

            {/* 댓글 섹션 */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium mb-4">댓글 {comments.length}개</h3>
              
              {/* 댓글 목록 */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.user?.profileImg || "https://readdy.ai/api/search-image?query=default%20profile&width=40&height=40"}
                      alt={comment.user?.nickname || "사용자"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm">{comment.user?.nickname || "사용자"}</span>
                        {comment.user?.level && (
                          <div className="ml-2 bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] text-xs px-2 py-0.5 rounded-full">
                            Lv.{comment.user.level}
                          </div>
                        )}
                        <span className="ml-2 text-xs text-gray-500">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 댓글 입력 폼 */}
              <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
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
          </div>
        </div>
      </div>

      {/* 투표 확인 모달 */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">투표 확인</h3>
            <p className="text-gray-600 mb-6">이 착용샷에 투표하시겠습니까?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleVote}
                className="px-4 py-2 bg-[#87CEEB] text-white rounded-lg hover:bg-blue-400"
              >
                투표하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#87CEEB] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-1"></i>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 좋아요 사용자 목록 모달 */}
      {likeUsersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">좋아요한 사용자</h3>
              <button className="text-gray-500" onClick={() => setLikeUsersOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {likeUsersLoading ? (
              <div className="py-6 text-center text-gray-500">불러오는 중...</div>
            ) : likeUsers.length === 0 ? (
              <div className="py-6 text-center text-gray-500">아직 좋아요한 사용자가 없습니다.</div>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y">
                {likeUsers.map((u, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-2">
                    <img
                      src={u.profileImg || 'https://via.placeholder.com/40'}
                      alt={u.nickname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-800">{u.nickname}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedDetailPage; 