import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeedList from "../../components/feed/FeedList";
import FeedDetailModal from "../../components/feed/FeedDetailModal";
import LikedUsersModal from "../../components/feed/LikedUsersModal";
import { useAuth } from "../../contexts/AuthContext";
import FeedService from "../../api/feedService";
import { FeedVoteRequest, FeedPost } from "../../types/feed";
import { useLikedPosts } from "../../hooks/useLikedPosts";

type Comment = {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  content: string;
  createdAt: string;
};

const MyFeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 상태 관리
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [votedPosts, setVotedPosts] = useState<number[]>([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showVoteToast, setShowVoteToast] = useState(false);
  
  // 좋아요 상태
  const { likedPosts, updateLikedPosts, isLiked } = useLikedPosts();
  
  // 좋아요 사용자 모달 상태
  const [showLikedUsersModal, setShowLikedUsersModal] = useState(false);
  const [likedUsers, setLikedUsers] = useState<{ id: number; nickname: string; profileImg?: string; }[]>([]);

  // 탭/정렬 상태
  const [activeTab, setActiveTab] = useState<
    "all" | "DAILY" | "EVENT" | "RANKING"
  >("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  // 데이터 로드 함수
  const loadMyFeeds = async () => {
    try {
      setLoading(true);
      setError(null);

      // API 파라미터 구성
      const params: any = {
        page: 0,
        size: 50, // 충분한 데이터 로드
        sort: sortBy
        // userId는 백엔드에서 JWT 토큰을 통해 자동으로 처리
      };

      // 탭 필터링
      if (activeTab !== "all") {
        params.feedType = activeTab;
      }

      const response = await FeedService.getMyFeeds(params);
      setFeedPosts(response.content || []);
      
      // 백엔드에서 받은 isLiked 상태만 사용
      const backendLikedIds = response.content
        .filter((feed: FeedPost) => feed.isLiked)
        .map((feed: FeedPost) => feed.id);
      
      // 전역 상태 업데이트
      updateLikedPosts(backendLikedIds);
      
    } catch (error: any) {
      console.error('마이피드 로드 실패:', error);
      
      if (error.response?.status === 401) {
        setError("로그인이 필요합니다.");
        navigate('/login');
      } else {
        setError(error.response?.data?.message || "피드 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (user) {
      loadMyFeeds();
    }
  }, [user, activeTab, sortBy]);

  // 사용자 로그아웃 시 좋아요 상태 초기화
  useEffect(() => {
    if (!user) {
      updateLikedPosts([]);
    }
  }, [user]);

  // 통계 계산
  const feedCount = feedPosts.length;
  const totalLikes = feedPosts.reduce(
    (sum: number, post: FeedPost) => sum + (post.likeCount || 0),
    0
  );
  const followerCount = 324; // TODO: 백엔드 API 연동 필요
  const followingCount = 156; // TODO: 백엔드 API 연동 필요

  // filteredFeeds: 탭/정렬에 따라 feedPosts를 필터링/정렬
  const filteredFeeds = feedPosts
    .filter((post: FeedPost) =>
      activeTab === "all" ? true : post.feedType === activeTab
    )
    .sort((a: FeedPost, b: FeedPost) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }
    });

  // handleFeedClick: 상세 모달 오픈
  const handleFeedClick = (post: FeedPost) => {
    setSelectedPost(post);
    setShowComments(false);
  };

  // 좋아요 토글 (백엔드 API 연동)
  const handleLike = async (postId: number) => {
    if (!postId) return;
    
    try {
      const likeResult = await FeedService.likeFeed(postId);
      
      // 백엔드 응답에 따라 좋아요 상태 업데이트
      updateLikedPosts(isLiked(postId) ? likedPosts.filter((id: number) => id !== postId) : [...likedPosts, postId]);
      
      // 실제 피드 데이터의 좋아요 수와 isLiked 상태 업데이트
      setFeedPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { 
            ...post, 
            likeCount: likeResult.likeCount,
            isLiked: likeResult.liked 
          } : post
        )
      );
      
      // selectedPost도 업데이트 (모달에서 좋아요 클릭 시)
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          likeCount: likeResult.likeCount,
          isLiked: likeResult.liked
        });
      }
      
    } catch (error: any) {
      console.error('좋아요 실패:', error);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else if (error.response?.status === 404) {
        alert("피드를 찾을 수 없습니다.");
      } else {
        alert(error.response?.data?.message || "좋아요 처리에 실패했습니다.");
      }
    }
  };

  // 피드 삭제
  const handleDelete = async (postId: number) => {
    if (!window.confirm("정말로 이 피드를 삭제하시겠습니까?")) return;
    
    try {
      await FeedService.deleteFeed(postId);
      
      // ✅ API 성공 후 로컬 상태 업데이트
      setFeedPosts((prev) => prev.filter((post) => post.id !== postId));
      
      // 모달 닫기
      setSelectedPost(null);
      setShowComments(false);
      
      alert("피드가 삭제되었습니다.");
      
    } catch (error: any) {
      console.error('피드 삭제 실패:', error);
      
      // 에러 타입별 처리
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("피드를 찾을 수 없습니다.");
      } else {
        alert(error.response?.data?.message || "피드 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 댓글 등록
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && selectedPost) {
      const newCommentObj = {
        id: comments.length + 1,
                 username: user?.nickname || "나",
         level: 2, // 기본값 사용
         profileImg: "https://readdy.ai/api/search-image?query=casual%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=40&height=40&seq=myprofile&orientation=squarish",
        content: newComment,
        createdAt: new Date().toLocaleString(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  // 상세 모달 닫기
  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowComments(false);
  };

  // 투표 처리 (백엔드 API 연동)
  const handleVote = async (postId: number) => {
    if (!postId || votedPosts.includes(postId)) return;
    
    try {
      // 해당 피드 찾기
      const targetFeed = feedPosts.find(post => post.id === postId);
      if (!targetFeed || targetFeed.feedType !== 'EVENT') {
        alert("투표할 수 있는 이벤트 피드가 아닙니다.");
        return;
      }
      
      // 임시로 eventId를 1로 설정 (실제로는 피드에서 eventId를 가져와야 함)
      const voteRequest: FeedVoteRequest = { eventId: targetFeed.event?.id || 1 };
      const voteResult = await FeedService.voteFeed(postId, voteRequest);
      
      setVotedPosts([...votedPosts, postId]);

        // 실제 피드 데이터의 투표 수 업데이트
        setFeedPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, participantVoteCount: voteResult.voteCount } : post
          )
        );
      
    } catch (error: any) {
      console.error('투표 실패:', error);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else if (error.response?.status === 409) {
        alert("이미 투표하셨습니다.");
      } else {
        alert(error.response?.data?.message || "투표 처리에 실패했습니다.");
      }
    }
  };

  // 투표 모달 닫기
  const handleVoteModalClose = () => {
    setShowVoteModal(false);
  };

  // 투표 모달 확인
  const handleVoteConfirm = () => {
    // 투표 처리 로직 구현
    setShowVoteModal(false);
  };

  // 투표 모달 표시
  const handleShowVoteModal = (post: FeedPost) => {
    setSelectedPost(post);
    setShowVoteModal(true);
  };

  // 투표 모달 표시 여부
  const showVoteButton = selectedPost?.feedType === "EVENT";

  // 투표 모달 수정 버튼 여부
  const showEditButton = !!(
    user?.nickname &&
    selectedPost &&
    selectedPost.user.nickname === user.nickname
  );

  // 좋아요 사용자 목록 조회 (모달에서 사용)
  const handleShowLikeUsers = async () => {
    if (!selectedPost) return;
    
    try {
      const users = await FeedService.getFeedLikes(selectedPost.id);
      setLikedUsers(users.map(user => ({
        id: user.userId || 0,
        nickname: user.nickname,
        profileImg: user.profileImg
      })));
      setShowLikedUsersModal(true);
    } catch (error: any) {
      console.error('좋아요 사용자 목록 조회 실패:', error);
      alert('좋아요한 사용자 목록을 불러오지 못했습니다.');
    }
  };

  // 좋아요 수 클릭 시 좋아요한 사용자 목록 표시
  const handleLikeCountClick = async (feed: FeedPost) => {
    try {
      const users = await FeedService.getFeedLikes(feed.id);
      const mappedUsers = users.map(user => ({
        id: user.userId || 0,
        nickname: user.nickname,
        profileImg: user.profileImg
      }));
      setLikedUsers(mappedUsers);
      setShowLikedUsersModal(true);
    } catch (error) {
      console.error('좋아요한 사용자 목록 조회 실패:', error);
      alert("좋아요한 사용자 목록을 불러오는데 실패했습니다.");
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#87CEEB]"></div>
          <span className="ml-3 text-gray-600">피드를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
            <p className="text-lg font-medium">오류가 발생했습니다</p>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadMyFeeds}
            className="bg-[#87CEEB] text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={"https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=120&height=120&seq=myprofile"}
              alt="My Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="ml-6">
              <h2 className="text-3xl font-bold mb-2">나의 스타일 피드</h2>
              <div className="flex items-center mb-3">
                <div className="bg-[#87CEEB] text-white px-3 py-1 rounded-full flex items-center">
                  <i className="fas fa-crown text-yellow-300 mr-1"></i>
                  <span>Lv.4 스타일리스트</span>
                </div>
                <button className="ml-3 text-[#87CEEB] hover:text-blue-400 flex items-center">
                  <i className="fas fa-edit mr-1"></i>
                  <span>프로필 수정</span>
                </button>
              </div>
              <p className="text-gray-600">
                나만의 스타일을 공유하고 다른 사람들과 소통해보세요!
              </p>
            </div>
          </div>
          <button
            className="bg-[#87CEEB] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200 flex items-center cursor-pointer"
            onClick={() => navigate("/feed-create")}
          >
            <i className="fas fa-plus-circle mr-2"></i>
            착용샷 올리기
          </button>
        </div>

        {/* 내 피드 모아보기 탭/정렬 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex gap-2 mb-2 md:mb-0">
            {[
              { key: "all", label: "전체" },
              { key: "DAILY", label: "일상" },
              { key: "EVENT", label: "이벤트" },
              { key: "RANKING", label: "랭킹" }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  activeTab === tab.key
                    ? "bg-[#87CEEB] text-white border-[#87CEEB]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#87CEEB]"
                }`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2"
              onClick={() =>
                setSortBy(sortBy === "latest" ? "popular" : "latest")
              }
            >
              <span>{sortBy === "latest" ? "최신순" : "인기순"}</span>
              <i className="fas fa-chevron-down text-sm"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">{feedCount}</h3>
            <p className="text-gray-600">게시물</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">
              {followerCount}
            </h3>
            <p className="text-gray-600">팔로워</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">
              {followingCount}
            </h3>
            <p className="text-gray-600">팔로잉</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">{totalLikes}</h3>
            <p className="text-gray-600">총 좋아요</p>
          </div>
        </div>
      </div>

      {/* 피드 리스트 렌더링 */}
      {feedPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-camera text-6xl mb-4"></i>
            <p className="text-xl font-medium">아직 피드가 없습니다</p>
            <p className="text-gray-500 mt-2">첫 번째 피드를 올려보세요!</p>
          </div>
          <button
            onClick={() => navigate("/feed-create")}
            className="bg-[#87CEEB] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            피드 올리기
          </button>
        </div>
      ) : (
        <FeedList 
          feeds={filteredFeeds} 
          onFeedClick={handleFeedClick}
          onLikeClick={(feed) => handleLike(feed.id)}
          onLikeCountClick={handleLikeCountClick}
          likedPosts={likedPosts}
        />
      )}

      {/* 상세 모달 */}
      <FeedDetailModal
        open={!!selectedPost}
        onClose={handleCloseModal}
        feed={selectedPost}
        comments={comments}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
        onLike={() => selectedPost && handleLike(selectedPost.id)}
        liked={selectedPost ? isLiked(selectedPost.id) : false}
        onVote={() => setShowVoteModal(true)}
        voted={selectedPost ? votedPosts.includes(selectedPost.id) : false}
        onEdit={(() => {
          const isOwner = !!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname);
          if (!isOwner) return undefined;
          return () => {
            handleCloseModal();
            navigate(`/feed-edit?id=${selectedPost?.id}`);
          };
        })()}
        onDelete={(() => {
          const isOwner = !!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname);
          if (!isOwner || !selectedPost) return undefined;
          return () => handleDelete(selectedPost.id);
        })()}
        showVoteButton={selectedPost?.feedType === "EVENT"}
        showEditButton={!!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname)}
        showVoteModal={showVoteModal}
        onVoteModalClose={() => setShowVoteModal(false)}
        onVoteConfirm={() => selectedPost && handleVote(selectedPost.id)}
        showToast={showVoteToast}
        toastMessage={"투표가 완료되었습니다!"}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onCommentSubmit={handleCommentSubmit}
        onShowLikeUsers={handleShowLikeUsers}
      />

      {/* 좋아요 사용자 모달 */}
      {showLikedUsersModal && (
        <LikedUsersModal
          users={likedUsers}
          onClose={() => setShowLikedUsersModal(false)}
        />
      )}
    </div>
  );
};

export default MyFeedPage;
