import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FeedService from "../../api/feedService";
import { MyLikedFeedItemDto } from "../../types/feed";

const LikedFeedsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 상태 관리
  const [likedFeeds, setLikedFeeds] = useState<MyLikedFeedItemDto[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pageSize = 12;

  // 좋아요한 피드 목록 가져오기
  const fetchLikedFeeds = async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await FeedService.getMyLikedFeeds(pageNum, pageSize);
      const newFeeds = response.content || [];
      
      if (isLoadMore) {
        setLikedFeeds(prev => [...prev, ...newFeeds]);
      } else {
        setLikedFeeds(newFeeds);
      }
      
      setHasNext(response.hasNext);
      setPage(pageNum);
      
    } catch (error: any) {
      console.error('좋아요한 피드 목록 조회 실패:', error);
      setError('좋아요한 피드 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (user) {
      fetchLikedFeeds(0);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    if (!loading && hasNext) {
      fetchLikedFeeds(page + 1, true);
    }
  };

  // 좋아요 취소
  const handleUnlike = async (feedId: number) => {
    try {
      // 백엔드 API에 맞게 toggle 메서드 사용
      await FeedService.likeFeed(feedId);
      
      // 목록에서 제거 (좋아요 취소되었으므로)
      setLikedFeeds(prev => prev.filter(feed => feed.feedId !== feedId));
      
    } catch (error: any) {
      console.error('좋아요 취소 실패:', error);
      alert('좋아요 취소에 실패했습니다.');
    }
  };

  // 피드 상세 페이지로 이동
  const handleFeedClick = (feedId: number) => {
    navigate(`/feed/${feedId}`);
  };

  // 로딩 중일 때
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-5">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow p-4">
                  <div className="h-32 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchLikedFeeds(0)}
              className="bg-[#87CEEB] text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <i className="fas fa-arrow-left text-xl"></i>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">좋아요한 피드 모아보기</h1>
          </div>
          <div className="text-gray-600">
            총 {likedFeeds.length}개의 피드
          </div>
        </div>

        {/* 피드 목록 */}
        {likedFeeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">아직 좋아요한 피드가 없어요</h2>
            <p className="text-gray-500 mb-6">마음에 드는 피드에 좋아요를 눌러보세요!</p>
            <button
              onClick={() => navigate('/feeds')}
              className="bg-[#87CEEB] text-white px-8 py-3 rounded-lg hover:bg-blue-400 transition font-medium"
            >
              피드 둘러보기
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedFeeds.map((feed) => (
                <button
                  key={feed.feedId}
                  className="w-full text-left bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:ring-opacity-50"
                  onClick={() => handleFeedClick(feed.feedId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFeedClick(feed.feedId);
                    }
                  }}
                  aria-label={`${feed.title} 피드 보기`}
                >
                  {/* 피드 이미지 */}
                  {feed.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={feed.imageUrl}
                        alt={feed.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feed.feedType === 'EVENT' ? 'bg-purple-100 text-purple-800' :
                          feed.feedType === 'RANKING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {feed.feedType === 'EVENT' ? '이벤트' :
                           feed.feedType === 'RANKING' ? '랭킹' : '일상'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 피드 정보 */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {feed.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {feed.content}
                    </p>
                    
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-2 mb-3">
                      {feed.authorProfileImage && (
                        <img
                          src={feed.authorProfileImage}
                          alt={feed.authorNickname}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-gray-600">{feed.authorNickname}</span>
                    </div>
                    
                    {/* 통계 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-heart text-red-500"></i>
                          {feed.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-comment"></i>
                          {feed.commentCount}
                        </span>
                      </div>
                      <span className="text-xs">
                        {new Date(feed.likedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* 좋아요 취소 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlike(feed.feedId);
                      }}
                      className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      좋아요 취소
                    </button>
                  </div>
                </button>
              ))}
            </div>
            
            {/* 더보기 버튼 */}
            {hasNext && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-[#87CEEB] text-white px-8 py-3 rounded-lg hover:bg-blue-400 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      로딩 중...
                    </span>
                  ) : (
                    '더보기'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LikedFeedsPage;
