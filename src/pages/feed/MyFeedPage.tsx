import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedList from "../../components/feed/FeedList";

// 임시 피드 데이터 (기존 목록페이지 (1).tsx 참고)
const initialFeedPosts = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  username: '나',
  level: 4,
  profileImg: `https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=60&height=60&seq=myprofile${index + 1}&orientation=squarish`,
  images: [
    `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20trendy%20outfit&width=400&height=500&seq=mypost${index + 1}&orientation=portrait`,
    `https://readdy.ai/api/search-image?query=fashionable%20young%20asian%20person%20wearing%20casual%20outfit&width=400&height=500&seq=mypost${index + 1}a&orientation=portrait`
  ],
  productName: ['트렌디 데님 자켓', '캐주얼 니트 원피스', '베이직 코튼 티셔츠', '스트라이프 셔츠', '미니멀 블레이저', '린넨 와이드 팬츠'][index],
  size: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300][getSecureRandomInt(0, 17)],
  gender: '여성',
  height: 165,
  description: [
    '데일리로 입기 좋은 데님 자켓이에요. 다양한 스타일링이 가능해요.',
    '편안하면서도 스타일리시한 니트 원피스예요.',
    '베이직한 디자인으로 활용도가 높은 티셔츠입니다.',
    '세련된 스트라이프 패턴의 셔츠로 포인트 주기 좋아요.',
    '깔끔한 핏의 블레이저로 포멀한 스타일링이 가능해요.',
    '시원한 린넨 소재의 와이드 팬츠입니다.'
  ][index],
  likes: getSecureRandomInt(50, 250),
  votes: getSecureRandomInt(10, 60),
  comments: getSecureRandomInt(5, 25),
  instagramId: 'my_fashion',
  createdAt: new Date(2025, 5, 30 - index).toISOString().split('T')[0],
  isLiked: false,
  type: ['일상', '이벤트', '랭킹'][getSecureRandomInt(0, 3)]
}));

type FeedPost = typeof initialFeedPosts[0];
type Comment = {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  content: string;
  createdAt: string;
};

function getSecureRandomInt(min: number, max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return min + (array[0] % (max - min));
}

const MyFeedPage = () => {
  const [feedPosts, setFeedPosts] = useState(initialFeedPosts);
  
  // 게시물/좋아요 수는 feedPosts에서 계산
  const feedCount = feedPosts.length;
  const totalLikes = feedPosts.reduce((sum: number, post: FeedPost) => sum + post.likes, 0);
  const followerCount = 324;
  const followingCount = 156;
  const navigate = useNavigate();

  // 상세 모달 상태
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
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
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // 탭/정렬 상태
  const [activeTab, setActiveTab] = useState<'all' | '일상' | '이벤트' | '랭킹'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // filteredFeeds: 탭/정렬에 따라 feedPosts를 필터링/정렬
  const filteredFeeds = feedPosts
    .filter((post: FeedPost) => activeTab === 'all' ? true : post.type === activeTab)
    .sort((a: FeedPost, b: FeedPost) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.likes - a.likes;
      }
    });

  // handleFeedClick: 상세 모달 오픈
  const handleFeedClick = (post: FeedPost) => {
    setSelectedPost(post);
    setShowComments(false);
  };

  // 좋아요
  const handleLike = (postId: number) => {
    if (!postId || likedPosts.includes(postId)) return;
    setLikedPosts([...likedPosts, postId]);
    
    // 실제 피드 데이터의 좋아요 수도 증가
    setFeedPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // 피드 삭제
  const handleDelete = (postId: number) => {
    if (window.confirm('정말로 이 피드를 삭제하시겠습니까?')) {
      // 피드 목록에서 해당 피드 제거
      setFeedPosts(prev => prev.filter(post => post.id !== postId));
      
      // 모달 닫기
      setSelectedPost(null);
      setShowComments(false);
      
      alert('피드가 삭제되었습니다.');
    }
  };

  // 댓글 등록
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
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

  return (
    <div className="p-5">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="https://readdy.ai/api/search-image?query=stylish%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=120&height=120&seq=myprofile"
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
              <p className="text-gray-600">나만의 스타일을 공유하고 다른 사람들과 소통해보세요!</p>
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
            {['all', '일상', '이벤트', '랭킹'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeTab === tab ? 'bg-[#87CEEB] text-white border-[#87CEEB]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#87CEEB]'}`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === 'all' ? '전체' : tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2"
              onClick={() => setSortBy(sortBy === 'latest' ? 'popular' : 'latest')}
            >
              <span>{sortBy === 'latest' ? '최신순' : '인기순'}</span>
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
            <h3 className="text-2xl font-bold text-[#87CEEB]">{followerCount}</h3>
            <p className="text-gray-600">팔로워</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">{followingCount}</h3>
            <p className="text-gray-600">팔로잉</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-[#87CEEB]">{totalLikes}</h3>
            <p className="text-gray-600">총 좋아요</p>
          </div>
        </div>
      </div>

      {/* 피드 리스트 렌더링 부분을 아래처럼 대체 */}
      <FeedList feeds={filteredFeeds} onFeedClick={handleFeedClick} />

      {/* 상세 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
              onClick={() => { setSelectedPost(null); setShowComments(false); }}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img src={selectedPost.images[0]} alt={selectedPost.productName} className="w-full h-80 object-cover object-top rounded-l-lg" />
              </div>
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
                    <button className="flex items-center text-gray-500 hover:text-[#87CEEB] cursor-pointer"
                      onClick={() => handleLike(selectedPost.id)}
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
                  {/* 본인 피드일 때만 수정/삭제 버튼 노출 */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-medium"
                      onClick={() => { setSelectedPost(null); navigate(`/feed-edit?id=${selectedPost.id}`); }}
                    >
                      수정
                    </button>
                    <button 
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                      onClick={() => handleDelete(selectedPost.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
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

export default MyFeedPage;
