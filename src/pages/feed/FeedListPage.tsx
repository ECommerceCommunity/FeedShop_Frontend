import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FeedList from "../../components/feed/FeedList";
import FeedService from "../../api/feedService";
import { FeedPost, FeedListParams } from "../../types/feed";

// 더미 데이터 생성 함수 (백엔드 연동 실패시 fallback용)
function getSecureRandomInt(min: number, max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return min + (array[0] % (max - min));
}

const generateDummyFeed = (id: number): FeedPost => ({
  id,
  title: `트렌디 아이템 ${id}`,
  content: `트렌디한 스타일의 아이템입니다. 데일리룩으로 활용하기 좋아요. ${id}`,
  instagramId: `fashion_lover${id}`,
  feedType: ["DAILY", "EVENT", "RANKING"][getSecureRandomInt(0, 3)] as "DAILY" | "EVENT" | "RANKING",
  likeCount: getSecureRandomInt(50, 250),
  commentCount: getSecureRandomInt(5, 25),
  participantVoteCount: getSecureRandomInt(10, 60),
  user: {
    id,
    nickname: `패션러버${id}`,
    level: getSecureRandomInt(1, 6),
    profileImg: `https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait&width=60&height=60&seq=profile${id}`,
    gender: getSecureRandomInt(0, 2) === 0 ? "여성" : "남성",
    height: getSecureRandomInt(155, 185),
  },
  orderItem: {
    id,
    productName: `트렌디 아이템 ${id}`,
    size: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300][getSecureRandomInt(0, 17)],
  },
  images: [
    {
      id: id * 10 + 1,
      imageUrl: `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20trendy%20outfit&width=400&height=500&seq=post${id}`,
      sortOrder: 0,
    },
    {
      id: id * 10 + 2,
      imageUrl: `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20casual%20streetwear&width=400&height=500&seq=post${id}a`,
      sortOrder: 1,
    },
  ],
  hashtags: [
    { id: id * 10 + 1, tag: "데일리룩" },
    { id: id * 10 + 2, tag: "패션" },
  ],
  createdAt: "2025-06-12",
  isLiked: false,
});

const events = [
  {
    id: 1,
    title: "여름 스타일 챌린지",
    description: "여름 시즌 베스트 코디를 공유하고 투표에 참여하세요!",
    purchasePeriod: "2025.06.25 - 2025.07.07",
    votePeriod: "2025.07.08 - 2025.07.14",
    announcementDate: "2025.07.15",
    image: "https://readdy.ai/api/search-image?query=summer%20fashion%20event%20promotional%20image&width=600&height=300&seq=event1&orientation=landscape",
    rewards: [
      { rank: 1, reward: "전액 환급 또는 한정판 상품" },
      { rank: 2, reward: "50,000원 쿠폰" },
      { rank: 3, reward: "30,000원 쿠폰" },
    ],
  },
  {
    id: 2,
    title: "가을 트렌드 페스티벌",
    description: "다가오는 가을, 트렌디한 스타일을 공유하고 특별한 혜택을 받아가세요!",
    purchasePeriod: "2025.08.01 - 2025.08.15",
    votePeriod: "2025.08.16 - 2025.08.22",
    announcementDate: "2025.08.23",
    image: "https://readdy.ai/api/search-image?query=autumn%20fashion%20event%20promotional%20image&width=600&height=300&seq=event2&orientation=landscape",
    rewards: [
      { rank: 1, reward: "100만원 상당 브랜드 상품권" },
      { rank: 2, reward: "30만원 상당 브랜드 상품권" },
      { rank: 3, reward: "10만원 상당 브랜드 상품권" },
    ],
  },
];

const FeedListPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 🔧 백엔드 연동 버전: 실제 Feed Entity 구조 사용
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const postsPerPage = 6;

  // 좋아요 상태
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔧 백엔드에서 피드 목록 가져오기
  const fetchFeeds = async (page: number = 1, feedType?: string) => {
    try {
      const params: FeedListParams = {
        page: page - 1, // 백엔드는 0부터 시작
        size: postsPerPage,
        sort: sortBy === 'latest' ? 'createdAt,desc' : 'likeCount,desc'
      };

      if (feedType && feedType !== 'all') {
        params.feedType = feedType.toUpperCase() as 'DAILY' | 'EVENT' | 'RANKING';
      }

      const feedListResponse = await FeedService.getFeeds(params);
      
      return {
        feeds: feedListResponse.content || [],
        hasMore: !feedListResponse.last,
        totalPages: feedListResponse.totalPages || 0
      };
      
    } catch (error: any) {
      console.error('피드 목록 조회 실패:', error);
      
      // 백엔드 연결 실패시 더미 데이터 사용
      if (error.code === 'NETWORK_ERROR' || error.response?.status >= 500) {
        console.warn('백엔드 서버 연결 실패 - 더미 데이터 사용');
        const dummyFeeds = Array.from({ length: postsPerPage }, (_, i) => 
          generateDummyFeed((page - 1) * postsPerPage + i + 1)
        );
        
        return {
          feeds: dummyFeeds,
          hasMore: page < 3,
          totalPages: 3
        };
      }
      
      return { feeds: [], hasMore: false, totalPages: 0 };
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      const result = await fetchFeeds(1, activeTab);
      setFeedPosts(result.feeds);
      setHasMore(result.hasMore);
      setCurrentPage(1);
      setInitialLoading(false);
    };

    loadInitialData();
  }, [activeTab, sortBy]);

  const handleFilterToggle = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // 🔧 백엔드 연동 버전: 더보기 버튼
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const nextPage = currentPage + 1;
    const result = await fetchFeeds(nextPage, activeTab);
    
    setFeedPosts([...feedPosts, ...result.feeds]);
    setHasMore(result.hasMore);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  // 피드 상세 페이지로 이동
  const handleFeedClick = (feed: FeedPost) => {
    navigate(`/feed/${feed.id}`);
  };

  // 🔧 백엔드 연동 버전: 좋아요 토글
  const handleLike = async (postId: number) => {
    if (!postId) return;
    
    try {
      const likeResult = await FeedService.likeFeed(postId);
      
      // 백엔드 응답에 따라 좋아요 상태 업데이트
      if (likeResult.liked) {
        setLikedPosts([...likedPosts, postId]);
      } else {
        setLikedPosts(likedPosts.filter(id => id !== postId));
      }
      
      setFeedPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likeCount: likeResult.likeCount } : p))
      );
      
      const message = likeResult.liked ? "좋아요가 추가되었습니다!" : "좋아요가 취소되었습니다!";
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error: any) {
      console.error('좋아요 실패:', error);
      
      if (error.response?.status === 401) {
        setToastMessage("로그인이 필요합니다.");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setToastMessage(error.response?.data?.message || "좋아요 처리에 실패했습니다.");
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // FeedList에서 투표하기 버튼 클릭 시 상세 페이지로 이동
  const handleVoteCardClick = (feed: FeedPost) => {
    navigate(`/feed/${feed.id}`);
  };

  if (initialLoading) {
    return (
      <div className="p-5 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB] mx-auto"></div>
        <p className="mt-2 text-gray-600">피드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Toast 알림 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            {toastMessage}
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-3 px-6 font-medium text-lg ${
            activeTab === "all"
              ? "text-[#87CEEB] border-b-2 border-[#87CEEB]"
              : "text-gray-500 hover:text-[#87CEEB]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          일상 피드
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${
            activeTab === "event"
              ? "text-[#87CEEB] border-b-2 border-[#87CEEB]"
              : "text-gray-500 hover:text-[#87CEEB]"
          }`}
          onClick={() => setActiveTab("event")}
        >
          이벤트 피드
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${
            activeTab === "ranking"
              ? "text-[#87CEEB] border-b-2 border-[#87CEEB]"
              : "text-gray-500 hover:text-[#87CEEB]"
          }`}
          onClick={() => setActiveTab("ranking")}
        >
          랭킹 피드
        </button>
      </div>

      {/* 필터 및 정렬 옵션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {sortBy === "latest"
                  ? "최신순"
                  : sortBy === "popular"
                  ? "인기순"
                  : "유사 유저"}
              </span>
              <i
                className={`fas fa-chevron-down text-sm transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortBy("latest");
                    setIsDropdownOpen(false);
                  }}
                >
                  최신순
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortBy("popular");
                    setIsDropdownOpen(false);
                  }}
                >
                  인기순
                </button>
              </div>
            )}
          </div>
        </div>

        <Link
          to="/feed-create"
          className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition duration-200 no-underline"
        >
          + 피드 작성
        </Link>
      </div>

      {/* 일상 피드 */}
      {activeTab === "all" && (
        <div className="mb-8">
          <FeedList
            feeds={feedPosts.filter((f) => f.feedType === "DAILY")}
            onFeedClick={handleFeedClick}
            onLikeClick={(feed) => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
        </div>
      )}

      {/* 이벤트 피드 */}
      {activeTab === "event" && (
        <div className="mb-8">
          {/* 이벤트 정보 카드 */}
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start mb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-24 h-24 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 mb-2">
                    <span>구매기간: {event.purchasePeriod}</span>
                    <span>투표기간: {event.votePeriod}</span>
                    <span>발표일: {event.announcementDate}</span>
                  </div>
                  <div className="flex gap-2">
                    {event.rewards.map((reward, idx) => (
                      <span
                        key={idx}
                        className="bg-[#87CEEB] bg-opacity-10 px-2 py-1 rounded text-[#87CEEB] font-bold"
                      >
                        {reward.rank}위: {reward.reward}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 bg-[#87CEEB] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition duration-200 cursor-pointer">
                    이벤트 참여하기
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* 이벤트 피드용 피드 카드 */}
          <FeedList
            feeds={feedPosts.filter((f) => f.feedType === "EVENT")}
            onFeedClick={handleFeedClick}
            onVoteClick={handleVoteCardClick}
            onLikeClick={(feed) => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
        </div>
      )}

      {/* 랭킹 피드 */}
      {activeTab === "ranking" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            이번 주 베스트 콘텐츠
          </h2>
          
          <FeedList
            feeds={feedPosts.filter((f) => f.feedType === "RANKING")}
            onFeedClick={handleFeedClick}
            onLikeClick={(feed) => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
        </div>
      )}

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-[#87CEEB] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                로딩 중...
              </div>
            ) : (
              "더보기"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedListPage;
