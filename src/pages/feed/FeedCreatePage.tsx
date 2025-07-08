// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Add global styles for animation
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
0% { opacity: 0; transform: translateY(-10px); }
10% { opacity: 1; transform: translateY(0); }
90% { opacity: 1; transform: translateY(0); }
100% { opacity: 0; transform: translateY(-10px); }
}
.animate-fade-in-out {
animation: fadeInOut 3s ease-in-out forwards;
}
`;
document.head.appendChild(style);

// 피드 데이터 타입 정의 (FeedListPage와 동일하게 맞춰줌)
interface FeedPost {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  images: string[];
  productName: string;
  size: string;
  gender: string;
  height: number;
  description: string;
  likes: number;
  votes: number;
  comments: number;
  instagramId: string;
  createdAt: string;
  isLiked?: boolean;
  feedType: 'event' | 'all';
  eventId?: string;
}

// 임시 구매 상품 데이터
const purchasedProducts = [
  { id: 1, name: '나이키 에어맥스 97', brand: 'Nike', image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/air-max-97-shoe.jpg' },
  { id: 2, name: '아디다스 울트라부스트 21', brand: 'Adidas', image: 'https://assets.adidas.com/images/ultraboost-21.jpg' },
  { id: 3, name: '뉴발란스 990v5', brand: 'New Balance', image: 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&wid=440&hei=440' },
];

const App: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('id');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [wearingFeel, setWearingFeel] = useState('');
  const [heightInfo, setHeightInfo] = useState('');
  const [weightInfo, setWeightInfo] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [instagramLinked, setInstagramLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [instagramId, setInstagramId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;
  const navigate = useNavigate();

  // 수정 모드: id가 있으면 localFeeds에서 해당 피드 불러오기
  useEffect(() => {
    if (editId) {
      const localFeeds = JSON.parse(localStorage.getItem('localFeeds') || '[]');
      const feed = localFeeds.find((f: any) => String(f.id) === String(editId));
      if (feed) {
        setUploadedImages(feed.images || []);
        setSelectedProductId(feed.productName || '');
        setSelectedSize(feed.size || '');
        setWearingFeel(feed.description || '');
        setHeightInfo(feed.height ? String(feed.height) : '');
        setWeightInfo(feed.weight ? String(feed.weight) : '');
        setHashtags(feed.hashtags || []);
        setInstagramLinked(!!feed.instagramId);
        setInstagramId(feed.instagramId || '');
        setSelectedEventId(feed.feedType === 'event' ? (feed.eventId || 'summer') : null);
      }
    }
  }, [editId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = [];
      Array.from(e.target.files).forEach(file => {
        if (uploadedImages.length + newImages.length < MAX_IMAGES) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
              if (newImages.length === Math.min(e.target.files!.length, MAX_IMAGES - uploadedImages.length)) {
                setUploadedImages([...uploadedImages, ...newImages]);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addRecommendedHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const recommendedHashtags = ['캐주얼', '미니멀', '오피스룩', '데일리룩', '여름코디', '가을코디'];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 mr-4 cursor-pointer bg-transparent border-none p-0"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <h1 className="text-xl font-bold">착용샷 업로드</h1>
        </div>
      </header>
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* 사진 업로드 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">사진 업로드 <span className="text-red-500">*</span></h2>
          <div className="mb-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#87CEEB] transition duration-200 ${uploadedImages.length === 0 ? 'h-64' : 'h-auto'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImages.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-camera text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 mb-2">사진을 업로드해주세요</p>
                  <p className="text-gray-400 text-sm">최대 5장까지 업로드 가능합니다</p>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`업로드 이미지 ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="flex justify-between items-center mt-3">
              <button
                className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg flex items-center !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-plus mr-2"></i>
                사진 추가하기
              </button>
              <p className="text-gray-500 text-sm">
                {uploadedImages.length}/{MAX_IMAGES} 장
              </p>
            </div>
          </div>
        </section>
        {/* 상품 정보 입력 폼 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">상품 정보</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">구매한 상품 선택 <span className="text-red-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
            >
              <option value="">구매한 상품을 선택하세요</option>
              {purchasedProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
              ))}
            </select>
            {selectedProductId && (
              <div className="flex items-center mt-2">
                <img src={purchasedProducts.find(p => String(p.id) === selectedProductId)?.image} alt="상품 이미지" className="w-16 h-16 object-cover rounded mr-3" />
                <span className="font-medium">{purchasedProducts.find(p => String(p.id) === selectedProductId)?.name}</span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">신발 사이즈 <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
              >
                <option value="">신발 사이즈를 선택하세요</option>
                {Array.from({ length: 17 }, (_, i) => 220 + i * 5).map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">착용 느낌</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent h-24 resize-none"
              placeholder={`예시)
발볼/발등: 넓음, 보통, 좁음
착화감: 쿠셔닝, 경량감, 안정감 등
스타일링: 어떤 옷/스타일에 잘 어울렸는지
추천/비추천 상황: 러닝, 데일리, 출근 등

자유롭게 신발 착용 경험과 스타일링 팁을 남겨주세요!`}
              value={wearingFeel}
              onChange={e => setWearingFeel(e.target.value)}
            ></textarea>
          </div>
        </section>
        {/* 해시태그 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">해시태그</h2>
          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                placeholder="해시태그를 입력해주세요 (예: 캐주얼)"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
              />
              <button
                className="bg-[#87CEEB] text-white px-4 py-2 rounded-r-lg !rounded-button whitespace-nowrap cursor-pointer"
                onClick={handleAddHashtag}
              >
                추가
              </button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">추천 해시태그</p>
            <div className="flex flex-wrap gap-2">
              {recommendedHashtags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm !rounded-button whitespace-nowrap cursor-pointer ${
                    hashtags.includes(tag)
                      ? 'bg-[#87CEEB] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#87CEEB]'
                  }`}
                  onClick={() => addRecommendedHashtag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          {hashtags.length > 0 && (
            <div>
              <p className="text-gray-700 mb-2">선택한 해시태그</p>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      className="ml-2 text-[#87CEEB] hover:text-red-500 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        {/* 소셜 연동 옵션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">인스타그램 연동</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={instagramLinked}
                onChange={() => setInstagramLinked(!instagramLinked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#87CEEB]"></div>
            </label>
          </div>
          {instagramLinked && (
            <div className="mb-2">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">@</span>
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  placeholder="인스타그램 아이디를 입력해주세요"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                인스타그램 계정을 연동하면 게시물에 인스타그램 아이디가 표시됩니다.
              </p>
            </div>
          )}
        </section>
        {/* 이벤트 참여 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">이벤트 참여</h2>
              <p className="text-gray-500 text-sm mt-1">현재 진행중인 이벤트 중 참여하고 싶은 이벤트를 선택해주세요.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#87CEEB] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-[#87CEEB] rounded-full p-2 text-white mr-3">
                    <i className="fas fa-gift"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">여름 스타일 챌린지</h3>
                    <p className="text-gray-600 text-sm">2025.06.25 - 2025.07.07</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedEventId === 'summer'}
                    onChange={() => setSelectedEventId(selectedEventId === 'summer' ? null : 'summer')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#87CEEB]"></div>
                </label>
              </div>
              {selectedEventId === 'summer' && (
                <div className="bg-blue-50 rounded-lg p-4 mt-2">
                  <p className="text-gray-600 text-sm mb-3">여름 시즌 베스트 코디를 공유하고 투표에 참여하세요!</p>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="bg-[#87CEEB] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 mx-auto">1</div>
                      <p className="text-xs">전액 환급</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-[#87CEEB] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 mx-auto">2</div>
                      <p className="text-xs">50,000원 쿠폰</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-[#87CEEB] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 mx-auto">3</div>
                      <p className="text-xs">30,000원 쿠폰</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#87CEEB] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-[#87CEEB] rounded-full p-2 text-white mr-3">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">신상품 리뷰 이벤트</h3>
                    <p className="text-gray-600 text-sm">2025.06.20 - 2025.07.10</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedEventId === 'review'}
                    onChange={() => setSelectedEventId(selectedEventId === 'review' ? null : 'review')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#87CEEB]"></div>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#87CEEB] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-[#87CEEB] rounded-full p-2 text-white mr-3">
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">베스트 리뷰어 선발대회</h3>
                    <p className="text-gray-600 text-sm">2025.06.15 - 2025.07.15</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedEventId === 'best'}
                    onChange={() => setSelectedEventId(selectedEventId === 'best' ? null : 'best')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#87CEEB]"></div>
                </label>
              </div>
            </div>

          </div>
        </section>
        {showToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              업로드가 완료되었습니다
            </div>
          </div>
        )}
        {/* 하단 버튼 영역 */}
        <div className="flex flex-col space-y-3 mb-10">
          <button
            id="uploadButton"
            className={`relative bg-[#87CEEB] text-white py-3 rounded-lg font-medium hover:bg-blue-400 transition duration-200 !rounded-button whitespace-nowrap ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            onClick={async () => {
              if (isLoading) return;
              // Validation
              if (uploadedImages.length === 0) {
                const toastDiv = document.createElement('div');
                toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toastDiv.innerHTML = '<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i>사진을 업로드해주세요</div>';
                document.body.appendChild(toastDiv);
                setTimeout(() => toastDiv.remove(), 3000);
                return;
              }
              if (!selectedProductId) {
                const toastDiv = document.createElement('div');
                toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toastDiv.innerHTML = '<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i>상품을 선택해주세요</div>';
                document.body.appendChild(toastDiv);
                setTimeout(() => toastDiv.remove(), 3000);
                return;
              }
              if (!selectedSize) {
                const toastDiv = document.createElement('div');
                toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toastDiv.innerHTML = '<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i>사이즈를 선택해주세요</div>';
                document.body.appendChild(toastDiv);
                setTimeout(() => toastDiv.remove(), 3000);
                return;
              }
              setIsLoading(true);
              try {
                // Simulate upload process
                await new Promise(resolve => setTimeout(resolve, 2000));
                setShowToast(true);
                // 피드 데이터 생성
                const selectedProduct = purchasedProducts.find(p => String(p.id) === selectedProductId);
                const newFeed: FeedPost = {
                  id: Date.now(),
                  username: '나',
                  level: 1,
                  profileImg: 'https://readdy.ai/api/search-image?query=casual%20young%20asian%20person%20portrait%20with%20minimalist%20background&width=60&height=60&seq=myprofile&orientation=squarish',
                  images: uploadedImages,
                  productName: selectedProduct ? selectedProduct.name : '',
                  size: selectedSize,
                  gender: '여성', // 임시
                  height: 165, // 임시
                  description: wearingFeel,
                  likes: 0,
                  votes: 0,
                  comments: 0,
                  instagramId: instagramId,
                  createdAt: new Date().toISOString(),
                  isLiked: false,
                  feedType: selectedEventId ? 'event' : 'all',
                  eventId: selectedEventId ?? undefined,
                };
                // localStorage에 저장
                const localFeeds = JSON.parse(localStorage.getItem('localFeeds') || '[]');
                localFeeds.push(newFeed);
                localStorage.setItem('localFeeds', JSON.stringify(localFeeds));
                setTimeout(() => {
                  setShowToast(false);
                  navigate('/feed-list');
                }, 1500);
              } catch (error) {
                const toastDiv = document.createElement('div');
                toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toastDiv.innerHTML = '<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i>업로드 중 오류가 발생했습니다</div>';
                document.body.appendChild(toastDiv);
                setTimeout(() => toastDiv.remove(), 3000);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                업로드 중...
              </div>
            ) : (
              '업로드 완료'
            )}
          </button>
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium text-center hover:bg-gray-50 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer"
            onClick={() => navigate('/feed-list')}
          >
            취소
          </button>
        </div>
      </main>
      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopChat</h3>
              <p className="text-gray-400 text-sm">
                착용샷 기반 커뮤니티로 더 나은 쇼핑 경험을 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">서비스</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">쇼핑몰</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">커뮤니티</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">이벤트</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">랭킹</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">고객지원</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">자주 묻는 질문</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">문의하기</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">이용약관</button></li>
                <li><button type="button" className="hover:text-[#87CEEB] cursor-pointer bg-transparent border-none p-0">개인정보처리방침</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">팔로우</h4>
              <div className="flex space-x-3 mb-4">
                <button type="button" className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#87CEEB] transition duration-200 cursor-pointer">
                  <i className="fab fa-instagram"></i>
                </button>
                <button type="button" className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#87CEEB] transition duration-200 cursor-pointer">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#87CEEB] transition duration-200 cursor-pointer">
                  <i className="fab fa-twitter"></i>
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                © 2025 ShopChat. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App