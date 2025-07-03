import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FeedList from "../../components/feed/FeedList";

// 더미 데이터 생성 함수 및 타입 정의
interface FeedPost {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  images: string[];
  productName: string;
  size: number;
  gender: string;
  height: number;
  description: string;
  likes: number;
  votes: number;
  comments: number;
  instagramId: string;
  createdAt: string;
  isLiked?: boolean;
  feedType: string;
}

interface Comment {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  content: string;
  createdAt: string;
}

function getSecureRandomInt(min: number, max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return min + (array[0] % (max - min));
}

const generateFeedPost = (id: number): FeedPost => ({
  id,
  username: `패션러버${id}`,
  level: getSecureRandomInt(1, 6),
  profileImg: `https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=60&height=60&seq=profile${id}&orientation=squarish`,
  images: [
    `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20trendy%20outfit&width=400&height=500&seq=post${id}&orientation=portrait`,
    `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20casual%20streetwear&width=400&height=500&seq=post${id}a&orientation=portrait`,
    `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20elegant%20outfit&width=400&height=500&seq=post${id}b&orientation=portrait`
  ],
  productName: `트렌디 아이템 ${id}`,
  size: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300][getSecureRandomInt(0, 17)],
  gender: getSecureRandomInt(0, 2) === 0 ? '여성' : '남성',
  height: getSecureRandomInt(155, 185),
  description: `트렌디한 스타일의 아이템입니다. 데일리룩으로 활용하기 좋아요. ${id}`,
  likes: getSecureRandomInt(50, 250),
  votes: getSecureRandomInt(10, 60),
  comments: getSecureRandomInt(5, 25),
  instagramId: `fashion_lover${id}`,
  createdAt: '2025-06-12',
  isLiked: false,
  feedType: 'all',
});

const events = [
  {
    id: 1,
    title: '여름 스타일 챌린지',
    description: '여름 시즌 베스트 코디를 공유하고 투표에 참여하세요!',
    purchasePeriod: '2025.06.25 - 2025.07.07',
    votePeriod: '2025.07.08 - 2025.07.14',
    announcementDate: '2025.07.15',
    image: 'https://readdy.ai/api/search-image?query=summer%20fashion%20event%20promotional%20image&width=600&height=300&seq=event1&orientation=landscape',
    rewards: [
      { rank: 1, reward: '전액 환급 또는 한정판 상품' },
      { rank: 2, reward: '50,000원 쿠폰' },
      { rank: 3, reward: '30,000원 쿠폰' }
    ]
  },
  {
    id: 2,
    title: '가을 트렌드 페스티벌',
    description: '다가오는 가을, 트렌디한 스타일을 공유하고 특별한 혜택을 받아가세요!',
    purchasePeriod: '2025.08.01 - 2025.08.15',
    votePeriod: '2025.08.16 - 2025.08.22',
    announcementDate: '2025.08.23',
    image: 'https://readdy.ai/api/search-image?query=autumn%20fashion%20event%20promotional%20image&width=600&height=300&seq=event2&orientation=landscape',
    rewards: [
      { rank: 1, reward: '100만원 상당 브랜드 상품권' },
      { rank: 2, reward: '30만원 상당 브랜드 상품권' },
      { rank: 3, reward: '10만원 상당 브랜드 상품권' }
    ]
  }
];

// 샘플 피드 데이터
const initialFeedPosts: FeedPost[] = [
  // 일상 피드 샘플
  {
    id: 1,
    username: '데일리러버',
    level: 2,
    profileImg: 'https://readdy.ai/api/search-image?query=asian%20woman%20profile&width=60&height=60&seq=profile1',
    images: ['https://readdy.ai/api/search-image?query=casual%20asian%20woman%20outfit&width=400&height=500&seq=post1'],
    productName: '화이트 스니커즈',
    size: 240,
    gender: '여성',
    height: 162,
    description: '데일리로 신기 좋은 화이트 스니커즈! 어디에나 잘 어울려요.',
    likes: 120,
    votes: 0,
    comments: 5,
    instagramId: 'daily_lover',
    createdAt: '2025-06-10',
    isLiked: false,
    feedType: 'all',
  },
  // 이벤트 피드 샘플
  {
    id: 2,
    username: '이벤트참가자',
    level: 3,
    profileImg: 'https://readdy.ai/api/search-image?query=asian%20man%20profile&width=60&height=60&seq=profile2',
    images: ['https://readdy.ai/api/search-image?query=summer%20event%20outfit&width=400&height=500&seq=event1'],
    productName: '여름 샌들',
    size: 260,
    gender: '남성',
    height: 175,
    description: '여름 이벤트에 맞춰 시원하게 신은 샌들! 투표 부탁드려요~',
    likes: 80,
    votes: 15,
    comments: 3,
    instagramId: 'event_guy',
    createdAt: '2025-06-25',
    isLiked: false,
    feedType: 'event',
  },
  {
    id: 3,
    username: '썸머퀸',
    level: 4,
    profileImg: 'https://readdy.ai/api/search-image?query=asian%20woman%20profile&width=60&height=60&seq=profile3',
    images: ['https://readdy.ai/api/search-image?query=summer%20fashion%20asian%20woman&width=400&height=500&seq=event2'],
    productName: '플랫폼 샌들',
    size: 235,
    gender: '여성',
    height: 168,
    description: '이벤트 참여! 플랫폼 샌들로 키도 커보이고 스타일도 굿!',
    likes: 95,
    votes: 22,
    comments: 7,
    instagramId: 'summer_queen',
    createdAt: '2025-06-26',
    isLiked: false,
    feedType: 'event',
  },
  // 랭킹 피드 샘플
  {
    id: 1001,
    username: '랭킹스타',
    level: 5,
    profileImg: 'https://readdy.ai/api/search-image?query=asian%20man%20winner%20profile&width=60&height=60&seq=ranking1',
    images: ['https://readdy.ai/api/search-image?query=award%20winning%20asian%20man%20outfit&width=400&height=500&seq=ranking1'],
    productName: '한정판 러닝화',
    size: 270,
    gender: '남성',
    height: 180,
    description: '이벤트 1위! 한정판 러닝화로 스타일과 기능 모두 잡았어요.',
    likes: 300,
    votes: 120,
    comments: 20,
    instagramId: 'ranking_star',
    createdAt: '2025-07-16',
    isLiked: false,
    feedType: 'ranking',
  },
  {
    id: 1002,
    username: '베스트퀸',
    level: 5,
    profileImg: 'https://readdy.ai/api/search-image?query=asian%20woman%20winner%20profile&width=60&height=60&seq=ranking2',
    images: ['https://readdy.ai/api/search-image?query=award%20winning%20asian%20woman%20outfit&width=400&height=500&seq=ranking2'],
    productName: '골드 스트랩 힐',
    size: 240,
    gender: '여성',
    height: 170,
    description: '랭킹 2위! 골드 스트랩 힐로 포인트를 줬어요.',
    likes: 250,
    votes: 100,
    comments: 15,
    instagramId: 'best_queen',
    createdAt: '2025-07-16',
    isLiked: false,
    feedType: 'ranking',
  },
];

const FeedListPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => initialFeedPosts);
  const [localFeeds, setLocalFeeds] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 6;
  const bestPosts = feedPosts.slice(0, 3);

  // 상세 모달, 댓글, 투표 상태
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: '패션리스타',
      level: 3,
      profileImg: 'https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=40&height=40&seq=comment1&orientation=squarish',
      content: '정말 예쁘네요! 저도 이런 스타일 도전해보고 싶어요.',
      createdAt: '2025-06-14 10:30'
    },
    {
      id: 2,
      username: '스타일마스터',
      level: 4,
      profileImg: 'https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=40&height=40&seq=comment2&orientation=squarish',
      content: '데님 자켓 핏이 너무 좋아요! 어디 제품인지 궁금합니다.',
      createdAt: '2025-06-14 11:15'
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [votedPosts, setVotedPosts] = useState<number[]>([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const { nickname } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('localFeeds') || '[]');
    setLocalFeeds(stored);
  }, []);

  const handleFilterToggle = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // 더보기 버튼
  const handleLoadMore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPosts = Array.from({ length: 6 }, (_, i) => generateFeedPost(feedPosts.length + i + 1));
    setFeedPosts([...feedPosts, ...newPosts]);
    if (currentPage >= 3) {
      setHasMore(false);
    } else {
      setCurrentPage((prev) => prev + 1);
    }
    setIsLoading(false);
  };

  // 상세 모달 열기
  const handleOpenModal = (post: FeedPost) => {
    setSelectedPost(post);
    setShowComments(false);
  };

  // 상세 모달 닫기
  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowComments(false);
    setShowVoteModal(false);
  };

  // 댓글 등록
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        username: '나',
        level: 2,
        profileImg: 'https://readdy.ai/api/search-image?query=casual%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=40&height=40&seq=myprofile&orientation=squarish',
        content: newComment,
        createdAt: new Date().toLocaleString()
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  // 투표
  const handleVote = (postId: number) => {
    if (!postId || votedPosts.includes(postId)) return;
    setVotedPosts([...votedPosts, postId]);
    setFeedPosts((prev) => prev.map((p) => p.id === postId ? { ...p, votes: p.votes + 1 } : p));
    setShowVoteModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 좋아요
  const handleLike = (postId: number) => {
    if (!postId || likedPosts.includes(postId)) return;
    setLikedPosts([...likedPosts, postId]);
    setFeedPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    setLocalFeeds((prev) => prev.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    // localStorage에도 반영
    const stored = JSON.parse(localStorage.getItem('localFeeds') || '[]');
    const updated = stored.map((p: any) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    localStorage.setItem('localFeeds', JSON.stringify(updated));
  };

  // FeedList에서 투표하기 버튼 클릭 시 상세 모달 오픈
  const handleVoteCardClick = (feed: FeedPost) => {
    setSelectedPost(feed);
    setShowComments(false);
    setShowVoteModal(true);
  };

  return (
    <div className="p-5">
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-3 px-6 font-medium text-lg ${activeTab === "all" ? "text-[#87CEEB] border-b-2 border-[#87CEEB]" : "text-gray-500 hover:text-[#87CEEB]"}`}
          onClick={() => setActiveTab("all")}
        >
          일상 피드
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${activeTab === "event" ? "text-[#87CEEB] border-b-2 border-[#87CEEB]" : "text-gray-500 hover:text-[#87CEEB]"}`}
          onClick={() => setActiveTab("event")}
        >
          이벤트 피드
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${activeTab === "ranking" ? "text-[#87CEEB] border-b-2 border-[#87CEEB]" : "text-gray-500 hover:text-[#87CEEB]"}`}
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
              <span>{sortBy === "latest" ? "최신순" : sortBy === "popular" ? "인기순" : "유사 유저"}</span>
              <i className={`fas fa-chevron-down text-sm transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setSortBy("latest"); setIsDropdownOpen(false); }}>최신순</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setSortBy("popular"); setIsDropdownOpen(false); }}>인기순</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setSortBy("similar"); setIsDropdownOpen(false); }}>유사 유저</button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {["여성", "남성", "캐주얼", "미니멀"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${selectedFilters.includes(filter) ? "bg-[#87CEEB] text-white" : "bg-white border border-gray-300 text-gray-700 hover:border-[#87CEEB]"}`}
                onClick={() => handleFilterToggle(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <Link
          to="/feed-create"
          className="bg-[#87CEEB] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-400 transition duration-200 flex items-center cursor-pointer"
        >
          <i className="fas fa-plus-circle mr-2"></i>
          착용샷 올리기
        </Link>
      </div>

      {/* 메인 콘텐츠 */}
      {activeTab === "all" && (
        <>
          {/* 피드 그리드 */}
          <FeedList
            feeds={[...feedPosts, ...localFeeds].filter(f => f.feedType === 'all')}
            onFeedClick={handleOpenModal}
            onLikeClick={feed => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
          {/* 더 보기 버튼 */}
          <div className="text-center mb-10">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                className={`bg-white border border-[#87CEEB] text-[#87CEEB] px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-200 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    로딩중...
                  </div>
                ) : (
                  <>
                    더 보기 <i className="fas fa-chevron-down ml-1"></i>
                  </>
                )}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">더 이상 게시물이 없습니다</p>
            )}
          </div>
        </>
      )}

      {/* 이벤트 피드 */}
      {activeTab === "event" && (
        <div className="mb-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span>구매기간: {event.purchasePeriod}</span>
                  <span>투표기간: {event.votePeriod}</span>
                  <span>발표일: {event.announcementDate}</span>
                </div>
                <div className="flex gap-2">
                  {event.rewards.map((reward, idx) => (
                    <span key={idx} className="bg-[#87CEEB] bg-opacity-10 px-2 py-1 rounded text-[#87CEEB] font-bold">
                      {reward.rank}위: {reward.reward}
                    </span>
                  ))}
                </div>
                <button className="mt-4 bg-[#87CEEB] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition duration-200 cursor-pointer">
                  이벤트 참여하기
              </button>
              </div>
            </div>
          ))}
          {/* 이벤트 피드용 피드 카드 */}
          <FeedList
            feeds={[...feedPosts, ...localFeeds].filter(f => f.feedType === 'event')}
            onFeedClick={handleOpenModal}
            onVoteClick={handleVoteCardClick}
            onLikeClick={feed => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
        </div>
      )}

      {/* 랭킹 피드 */}
      {activeTab === "ranking" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">이번 주 베스트 콘텐츠</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* 샘플 랭킹 피드 */}
            {[...feedPosts, ...localFeeds, {
              id: 9999,
              username: '랭킹왕',
              level: 5,
              profileImg: 'https://readdy.ai/api/search-image?query=winner&width=60&height=60',
              images: ['https://readdy.ai/api/search-image?query=winner&width=400&height=500'],
              productName: '랭킹 신발',
              size: 270,
              gender: '남성',
              height: 180,
              description: '이벤트 결과로 선정된 랭킹 피드입니다.',
              likes: 999,
              votes: 300,
              comments: 50,
              instagramId: 'ranking_king',
              createdAt: '2025-07-20',
              isLiked: false,
              feedType: 'ranking',
            }].filter(f => f.feedType === 'ranking').map((post, idx) => (
              <div key={post.id} className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100 relative">
                {/* 투표완료 뱃지 */}
                {votedPosts.includes(post.id) && (
                  <span className="absolute top-3 right-3 bg-[#87CEEB] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">투표완료</span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#87CEEB] text-white text-sm px-3 py-1 rounded-full">{post.productName}</span>
                  <div className="flex items-center">
                    <i className="fas fa-trophy text-yellow-400 mr-1"></i>
                    <span className="text-sm font-medium">{idx + 1}위</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img src={post.images[0]} alt={post.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <i className="fas fa-heart text-red-400 mr-1"></i>
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-comment text-[#87CEEB] mr-1"></i>
                      {post.comments}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-vote-yea text-[#87CEEB] mr-1"></i>
                      투표수: {post.votes}
                    </span>
                  </div>
                  <button className="text-[#87CEEB] hover:text-blue-400 font-medium cursor-pointer">자세히 보기</button>
                </div>
              </div>
            ))}
          </div>
          {/* 랭킹 피드용 피드 카드 */}
          <FeedList
            feeds={[...feedPosts, ...localFeeds].filter(f => f.feedType === 'ranking')}
            onFeedClick={handleOpenModal}
            onLikeClick={feed => handleLike(feed.id)}
            likedPosts={likedPosts}
          />
        </div>
      )}

      {/* 상세 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
              onClick={handleCloseModal}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="flex flex-col md:flex-row">
              {/* 이미지 */}
              <div className="md:w-1/2">
                <img src={selectedPost.images[0]} alt={selectedPost.productName} className="w-full h-80 object-cover object-top rounded-l-lg" />
              </div>
              {/* 상세 정보 */}
              <div className="md:w-1/2 p-6">
                <div className="flex items-center mb-6">
                  <img src={selectedPost.profileImg} alt={selectedPost.username} className="w-12 h-12 rounded-full object-cover mr-3" />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{selectedPost.username}</h3>
                      <div className="ml-2 bg-[#87CEEB] text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                        <i className="fas fa-crown text-yellow-300 mr-1 text-xs"></i>
                        <span>Lv.{selectedPost.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{selectedPost.gender} · {selectedPost.height}cm</span>
                      {selectedPost.instagramId && (
                        <a href={`https://instagram.com/${selectedPost.instagramId}`} target="_blank" rel="noopener noreferrer" className="ml-3 text-[#87CEEB] hover:underline cursor-pointer">
                          <i className="fab fa-instagram mr-1"></i>
                          {selectedPost.instagramId}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">{selectedPost.productName}</h2>
                  <p className="text-gray-600">신발 사이즈: {selectedPost.size}mm</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">상품 설명</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedPost.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex space-x-6">
                    <button
                      className={`flex items-center cursor-pointer focus:outline-none ${likedPosts.includes(selectedPost.id) ? 'text-red-500' : 'text-gray-500 hover:text-[#87CEEB]'}`}
                      onClick={(e) => { e.stopPropagation(); handleLike(selectedPost.id); }}
                      disabled={likedPosts.includes(selectedPost.id)}
                    >
                      <i className={`fas fa-heart mr-2 ${likedPosts.includes(selectedPost.id) ? 'text-red-500' : ''}`}></i>
                      <span>{selectedPost.likes + (likedPosts.includes(selectedPost.id) ? 1 : 0)}</span>
                    </button>
                    <button
                      className="flex items-center text-gray-500 hover:text-[#87CEEB] cursor-pointer"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <i className="fas fa-comment mr-2"></i>
                      <span>{selectedPost.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* 이벤트 피드일 때만 투표하기 버튼 */}
                    {selectedPost.feedType === 'event' && (
                      <button
                        onClick={() => setShowVoteModal(true)}
                        className={`px-4 py-2 rounded-lg transition duration-200 cursor-pointer ${votedPosts.includes(selectedPost.id) ? 'bg-gray-200 text-gray-600' : 'bg-[#87CEEB] text-white hover:bg-blue-400'}`}
                        disabled={votedPosts.includes(selectedPost.id)}
                      >
                        <i className="fas fa-vote-yea mr-1"></i>
                        {votedPosts.includes(selectedPost.id) ? '투표완료' : '투표하기'} {selectedPost.votes}
                      </button>
                    )}
                    {/* 본인 피드일 때만 수정 버튼 */}
                    {nickname && selectedPost.username === nickname && (
                      <button
                        className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-medium"
                        onClick={() => {
                          handleCloseModal();
                          navigate(`/feed-create?id=${selectedPost.id}`);
                        }}
                      >
                        수정
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
                          onClick={() => setShowVoteModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleVote(selectedPost.id)}
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
                      <span>투표가 완료되었습니다!</span>
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
      )}
    </div>
  );
};

export default FeedListPage;