import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FeedList from "../../components/feed/FeedList";
import FeedDetailModal from "../../components/feed/FeedDetailModal";
import LikedUsersModal from "../../components/feed/LikedUsersModal";
import FeedUserProfile from "../../components/feed/FeedUserProfile";
import { useAuth } from "../../contexts/AuthContext";
import FeedService from "../../api/feedService";
import { UserProfileService, UserProfileData } from "../../api/userProfileService";
import { FeedPost, FeedComment } from "../../types/feed";
import { useLikedPosts } from "../../hooks/useLikedPosts";

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
    return dateString; // 파싱 실패 시 원본 반환
  }
};

const MyFeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserNickname = searchParams.get('userNickname');
  
  // 현재 로그인한 사용자인지 확인
  const isCurrentUser = !targetUserNickname || targetUserNickname === user?.nickname;

  // 상태 관리
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  
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

      let response;
      
      if (targetUserNickname && !isCurrentUser) {
        // 특정 사용자의 피드를 가져오는 경우
        const params: any = {
          page: 0,
          size: 100, // 더 많은 데이터를 가져와서 필터링
          sort: sortBy
        };

        if (activeTab !== "all") {
          params.feedType = activeTab;
        }

        // 전체 피드를 가져온 후 특정 사용자 필터링
        const allFeedsResponse = await FeedService.getFeeds(params);
        const userFeeds = allFeedsResponse.content.filter(feed => 
          feed.user?.nickname === targetUserNickname
        );
        
        response = {
          content: userFeeds,
          totalElements: userFeeds.length,
          totalPages: Math.ceil(userFeeds.length / 50)
        };
      } else {
        // 현재 로그인한 사용자의 피드를 가져오는 경우
        const params: any = {
          page: 0,
          size: 50,
          sort: sortBy
        };

        if (activeTab !== "all") {
          params.feedType = activeTab;
        }

        response = await FeedService.getMyFeeds(params);
      }

      setFeedPosts(response.content || []);
      
      // 백엔드에서 받은 isLiked 상태만 사용
      const backendLikedIds = response.content
        .filter((feed: FeedPost) => feed.isLiked)
        .map((feed: FeedPost) => feed.id);
      
      // 전역 상태 업데이트
      updateLikedPosts(backendLikedIds);
      
    } catch (error: any) {
      console.error('피드 로드 실패:', error);
      
      if (error.response?.status === 401) {
        setError("로그인이 필요합니다.");
        navigate('/login');
      } else if (error.response?.status === 404) {
        setError("사용자를 찾을 수 없습니다.");
      } else {
        setError(error.response?.data?.message || "피드 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자 프로필 정보 로드
  const loadUserProfile = async () => {
    if (!isCurrentUser || !user) return;
    
    try {
      const profile = await UserProfileService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("사용자 프로필 로드 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (user) {
      loadMyFeeds();
      loadUserProfile(); // 사용자 프로필 로드
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
  const handleFeedClick = async (post: FeedPost) => {
    setSelectedPost(post);
    setShowComments(false);
    
    // 댓글 로드
    try {
      const commentsData = await FeedService.getComments(post.id);
      const commentsWithFormattedTime = (commentsData.pagination.content || []).map(comment => ({
        ...comment,
        createdAt: formatKoreanTime(comment.createdAt)
      }));
      setComments(commentsWithFormattedTime);
    } catch (error: any) {
      console.error('댓글 로드 실패:', error);
      setComments([]);
    }
  };

  // 좋아요 토글 (백엔드 API 연동)
  const handleLike = async (postId: number) => {
    if (!postId) return;
    
    try {
      const likeResult = await FeedService.likeFeed(postId);
      
      // 백엔드 응답에 따라 좋아요 상태 업데이트
      const isCurrentlyLiked = isLiked(postId);
      const updatedLikedPosts = isCurrentlyLiked 
        ? likedPosts.filter((id: number) => id !== postId)
        : [...likedPosts, postId];
      updateLikedPosts(updatedLikedPosts);
      
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
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    try {
      // 백엔드 API 연동
      const newCommentObj = await FeedService.createComment(selectedPost.id, {
        content: newComment
      });
      
      // 한국 시간으로 포맷팅
      const commentWithFormattedTime = {
        ...newCommentObj,
        createdAt: formatKoreanTime(newCommentObj.createdAt)
      };
      
      setComments([commentWithFormattedTime, ...comments]);
      setNewComment("");
      
      // 피드의 댓글 수 업데이트
      setFeedPosts(prev => 
        prev.map(post => 
          post.id === selectedPost.id 
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      );
      
    } catch (error: any) {
      console.error('댓글 등록 실패:', error);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "댓글 등록에 실패했습니다.");
      }
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!selectedPost || !window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    
    try {
      await FeedService.deleteComment(selectedPost.id, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      
      // 피드의 댓글 수 업데이트
      setFeedPosts(prev => 
        prev.map(post => 
          post.id === selectedPost.id 
            ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
            : post
        )
      );
      
    } catch (error: any) {
      console.error('댓글 삭제 실패:', error);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else if (error.response?.status === 403) {
        alert("본인 댓글만 삭제할 수 있습니다.");
      } else if (error.response?.status === 404) {
        alert("댓글을 찾을 수 없습니다.");
      } else {
        alert(error.response?.data?.message || "댓글 삭제에 실패했습니다.");
      }
    }
  };

  // 상세 모달 닫기
  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowComments(false);
  };



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
              <h2 className="text-3xl font-bold mb-2">
                {isCurrentUser ? "나의 스타일 피드" : `${targetUserNickname}님의 스타일 피드`}
              </h2>
              <div className="flex items-center mb-3">
                <div className="bg-[#87CEEB] text-white px-3 py-1 rounded-full flex items-center">
                  <i className="fas fa-crown text-yellow-300 mr-1"></i>
                  <span>Lv.4 스타일리스트</span>
                </div>
                {isCurrentUser && (
                  <button className="ml-3 text-[#87CEEB] hover:text-blue-400 flex items-center">
                    <i className="fas fa-edit mr-1"></i>
                    <span>프로필 수정</span>
                  </button>
                )}
              </div>
              <p className="text-gray-600 mb-3">
                {isCurrentUser 
                  ? "나만의 스타일을 공유하고 다른 사람들과 소통해보세요!"
                  : `${targetUserNickname}님의 스타일을 확인해보세요!`
                }
              </p>
              
              {/* 사용자 신체 정보 표시 */}
              {isCurrentUser && userProfile && (
                <div className="mt-3">
                  <FeedUserProfile
                    userId={userProfile.userId || 0}
                    nickname={userProfile.nickname}
                    profileImageUrl={userProfile.profileImageUrl}
                    showBodyInfo={true}
                    size="medium"
                    onClick={() => {
                      // 프로필 수정 페이지로 이동
                      navigate("/profile-settings");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {isCurrentUser && (
            <button
              className="bg-[#87CEEB] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200 flex items-center cursor-pointer"
              onClick={() => navigate("/feed-create")}
            >
              <i className="fas fa-plus-circle mr-2"></i>
              착용샷 올리기
            </button>
          )}
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
            <p className="text-xl font-medium">
              아직 피드가 없습니다
            </p>
            <p className="text-gray-500 mt-2">
              {isCurrentUser 
                ? "첫 번째 피드를 올려보세요!" 
                : `${targetUserNickname}님은 아직 피드를 올리지 않았습니다.`
              }
            </p>
          </div>
          {isCurrentUser && (
            <button
              onClick={() => navigate("/feed-create")}
              className="bg-[#87CEEB] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              피드 올리기
            </button>
          )}
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
        onEdit={(() => {
          const isOwner = !!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname);
          if (!isOwner || !isCurrentUser) return undefined;
          return () => {
            handleCloseModal();
            navigate(`/feed-edit?id=${selectedPost?.id}`);
          };
        })()}
        onDelete={(() => {
          const isOwner = !!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname);
          if (!isOwner || !selectedPost || !isCurrentUser) return undefined;
          return () => handleDelete(selectedPost.id);
        })()}
        showEditButton={!!(user?.nickname && selectedPost && selectedPost.user.nickname === user.nickname && isCurrentUser)}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onCommentSubmit={handleCommentSubmit}
        onShowLikeUsers={handleShowLikeUsers}
        onDeleteComment={handleDeleteComment}
        currentUser={user ? { nickname: user.nickname } : undefined}
        onUserClick={(userId) => {
          handleCloseModal();
          // userId 대신 nickname을 사용하여 필터링
          const selectedUserNickname = selectedPost?.user?.nickname;
          if (selectedUserNickname) {
            navigate(`/my-feeds?userNickname=${selectedUserNickname}`);
          }
        }}
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
