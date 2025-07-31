// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FeedService from '../../api/feedService';
import OrderService from '../../api/orderService';
import EventService, { FeedEventDto } from '../../api/eventService';
import { CreateFeedRequest, FeedPost } from '../../types/feed';
import { OrderItem } from '../../api/orderService';
import { 
  uploadBase64Images, 
  validateImageFile, 
  createImagePreview, 
  compressImage 
} from '../../utils/imageUpload';

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

// 🔧 백엔드 연동 버전: 피드 생성 시 이미지 업로드 상태 타입
interface ImageUploadState {
  file: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
  url?: string;
}

// 임시 구매 상품 데이터 (백엔드 연결 실패시 fallback용)
const fallbackProducts = [
  { orderItemId: 1, productId: 1, productName: '나이키 에어맥스 97', productImageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/air-max-97-shoe.jpg', orderedAt: new Date().toISOString() },
  { orderItemId: 2, productId: 2, productName: '아디다스 울트라부스트 21', productImageUrl: 'https://assets.adidas.com/images/ultraboost-21.jpg', orderedAt: new Date().toISOString() },
  { orderItemId: 3, productId: 3, productName: '뉴발란스 990v5', productImageUrl: 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&wid=440&hei=440', orderedAt: new Date().toISOString() },
];

const FeedCreatePage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('id');
  const navigate = useNavigate();
  const { user } = useAuth();

  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [instagramLinked, setInstagramLinked] = useState(false);
  const [instagramId, setInstagramId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // 🔧 백엔드 연동: 구매 상품 목록
  const [purchasedProducts, setPurchasedProducts] = useState<OrderItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // 🔧 백엔드 연동: 이벤트 목록
  const [availableEvents, setAvailableEvents] = useState<FeedEventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  
  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  // 🔧 백엔드 연동: 사용자의 구매 상품 목록 가져오기
  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await OrderService.getPurchasedItems();
        setPurchasedProducts(response.items);
      } catch (error: any) {
        console.error('구매 상품 목록 조회 실패:', error);
        // 백엔드 연결 실패시 fallback 데이터 사용
        console.warn('백엔드 연결 실패 - fallback 데이터 사용');
        setPurchasedProducts(fallbackProducts as any);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, []);

  // 🔧 백엔드 연동: 이벤트 목록 가져오기
  useEffect(() => {
    const fetchAvailableEvents = async () => {
      try {
        setEventsLoading(true);
        const events = await EventService.getFeedAvailableEvents();
        setAvailableEvents(events);
      } catch (error: any) {
        console.error('이벤트 목록 조회 실패:', error);
        // 백엔드 연결 실패시 fallback 데이터 사용
        console.warn('백엔드 연결 실패 - fallback 이벤트 데이터 사용');
        setAvailableEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchAvailableEvents();
  }, []);

  // 수정 모드: id가 있으면 localFeeds에서 해당 피드 불러오기
  useEffect(() => {
    if (editId) {
      const localFeeds = JSON.parse(localStorage.getItem('localFeeds') || '[]');
      const feed = localFeeds.find((f: any) => String(f.id) === String(editId));
      if (feed) {
        setUploadedImages(feed.images || []);
        setSelectedProductId(feed.productName || '');
        setSelectedSize(feed.size || '');
        setHashtags(feed.hashtags || []);
        setInstagramId(feed.instagramId || '');
        setInstagramLinked(!!feed.instagramId);
        setTitle(feed.title || '');
        setContent(feed.content || '');
      }
    }
  }, [editId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (uploadedImages.length >= MAX_IMAGES) {
        showToastMessage('최대 5장까지만 업로드 가능합니다.', 'error');
        return;
      }

      if (!validateImageFile(file)) {
        showToastMessage('이미지 파일만 업로드 가능합니다.', 'error');
        return;
      }

      createImagePreview(file, (preview) => {
        setUploadedImages(prev => [...prev, preview]);
      });
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags(prev => [...prev, hashtagInput.trim()]);
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
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const addRecommendedHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag]);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToastMessage('제목을 입력해주세요.', 'error');
      return;
    }
    
    if (!content.trim()) {
      showToastMessage('내용을 입력해주세요.', 'error');
      return;
    }
    
    if (uploadedImages.length === 0) {
      showToastMessage('이미지를 최소 1장 업로드해주세요.', 'error');
      return;
    }

    if (!selectedProductId) {
      showToastMessage('상품을 선택해주세요.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 이미지 업로드
      const imageUrls = await uploadBase64Images(uploadedImages);
      
      // 피드 데이터 준비
      const feedData: CreateFeedRequest = {
        title: title.trim(),
        content: content.trim(),
        feedType: selectedEventId ? 'EVENT' : 'DAILY',
        orderItemId: parseInt(selectedProductId),
        eventId: selectedEventId ? parseInt(selectedEventId) : undefined,
        imageUrls,
        hashtags,
        instagramId: instagramLinked ? instagramId.trim() : undefined,
      };

      // 백엔드 API 호출
      const createdFeed = await FeedService.createFeed(feedData);
      
      showToastMessage('피드가 성공적으로 생성되었습니다!', 'success');
      
      // 성공 후 피드 목록 페이지로 이동
      setTimeout(() => {
        navigate('/feeds');
      }, 1500);
      
    } catch (error: any) {
      console.error('피드 생성 실패:', error);
      showToastMessage(
        error.response?.data?.message || '피드 생성에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedHashtags = [
    '#오늘의코디', '#데일리룩', '#패션', '#스타일링', '#코디', '#패션스타그램',
    '#데일리패션', '#스타일', '#패션코디', '#룩북', '#패션스타그램', '#스타일링',
    '#패션스타그램', '#패션코디', '#데일리룩', '#스타일링', '#패션', '#코디'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {editId ? '피드 수정' : '새 피드 작성'}
          </h1>
          <p className="text-gray-600">
            {editId ? '피드 내용을 수정해주세요.' : '새로운 피드를 작성해주세요.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 제목 입력 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="피드 제목을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="피드 내용을 자유롭게 작성해주세요"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={1000}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {content.length}/1000
            </div>
          </div>

          {/* 상품 선택 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품 선택 *
            </label>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">상품 목록을 불러오는 중...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchasedProducts.map((product) => (
                  <div
                    key={product.orderItemId}
                    onClick={() => setSelectedProductId(String(product.orderItemId))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProductId === String(product.orderItemId)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={product.productImageUrl}
                      alt={product.productName}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-gray-900 mb-1">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      구매일: {new Date(product.orderedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 이벤트 선택 (선택사항) */}
          {availableEvents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 참여 (선택사항)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(selectedEventId === String(event.id) ? null : String(event.id))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedEventId === String(event.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이미지 업로드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 업로드 * (최대 5장)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                이미지 선택
              </button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF 파일만 업로드 가능합니다.
              </p>
            </div>
            
            {/* 업로드된 이미지 미리보기 */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 해시태그 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              해시태그
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                placeholder="해시태그를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddHashtag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                추가
              </button>
            </div>
            
            {/* 선택된 해시태그들 */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* 추천 해시태그 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">추천 해시태그:</p>
              <div className="flex flex-wrap gap-2">
                {recommendedHashtags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addRecommendedHashtag(tag)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 인스타그램 연동 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="instagramLink"
                checked={instagramLinked}
                onChange={(e) => setInstagramLinked(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="instagramLink" className="ml-2 text-sm font-medium text-gray-700">
                인스타그램 연동
              </label>
            </div>
            
            {instagramLinked && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인스타그램 ID
                </label>
                <input
                  type="text"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/feeds')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '업로드 중...' : (editId ? '수정하기' : '피드 작성')}
            </button>
          </div>
        </form>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default FeedCreatePage;