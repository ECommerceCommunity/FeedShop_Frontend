import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";

interface EventForm {
  title: string;
  type: EventType;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  description: string;
  participationMethod: string;
  rewards: string;
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  image: string;
  imageFile: File | null;
  imagePreview: string;
}

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

const EventCreatePage = () => {
  const navigate = useNavigate();
  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    type: "BATTLE",
    purchaseStartDate: "",
    purchaseEndDate: "",
    eventStartDate: "",
    eventEndDate: "",
    announcement: "",
    description: "",
    participationMethod: "",
    rewards: "",
    selectionCriteria: "",
    precautions: "",
    maxParticipants: 100,
    image: "",
    imageFile: null,
    imagePreview: ""
  });

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // 현재 날짜를 기본값으로 설정 (날짜만)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(now);
    nextMonth.setDate(nextMonth.getDate() + 30);
    
    // 날짜 형식을 YYYY-MM-DD로 변경
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    setEventForm(prev => ({
      ...prev,
      purchaseStartDate: formatDate(now),
      purchaseEndDate: formatDate(nextWeek),
      eventStartDate: formatDate(tomorrow),
      eventEndDate: formatDate(nextMonth),
      announcement: formatDate(nextMonth)
    }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: EventType) => {
    setEventForm(prev => ({ ...prev, type }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleImageRemove = () => {
    setEventForm(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: ""
    }));
    // 파일 입력 필드 초기화
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!eventForm.title) {
      setToastMessage('이벤트 제목을 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.description) {
      setToastMessage('이벤트 설명을 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.purchaseStartDate || !eventForm.purchaseEndDate || !eventForm.eventStartDate || !eventForm.eventEndDate || !eventForm.announcement) {
      setToastMessage('모든 날짜를 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.participationMethod) {
      setToastMessage('참여 방법을 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.rewards) {
      setToastMessage('상품 정보를 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.selectionCriteria) {
      setToastMessage('선정 기준을 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!eventForm.precautions) {
      setToastMessage('주의사항을 입력해주세요');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", eventForm.title);
      formData.append("type", eventForm.type);
      formData.append("purchaseStartDate", eventForm.purchaseStartDate);
      formData.append("purchaseEndDate", eventForm.purchaseEndDate);
      formData.append("eventStartDate", eventForm.eventStartDate);
      formData.append("eventEndDate", eventForm.eventEndDate);
      formData.append("announcement", eventForm.announcement);
      formData.append("description", eventForm.description);
      formData.append("participationMethod", eventForm.participationMethod);
      formData.append("rewards", eventForm.rewards);
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      if (eventForm.imageFile) {
        formData.append("image", eventForm.imageFile);
      }

      const response = await axiosInstance.post("/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('API Response:', response.data);
      setToastMessage('이벤트가 성공적으로 생성되었습니다!');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        navigate("/event-list");
      }, 1500);
      
    } catch (error: any) {
      console.error("이벤트 생성 실패:", error);
      
      if (error.response?.status === 401) {
        setToastMessage('로그인이 필요합니다.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 400) {
        setToastMessage(error.response.data?.message || '입력 정보를 확인해주세요.');
      } else if (error.response?.status >= 500) {
        setToastMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setToastMessage('이벤트 생성에 실패했습니다.');
      }
      
      setToastType('error');
      setShowToast(true);
      
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE": return "배틀 (스타일 경쟁)";
      case "MISSION": return "미션 (착용 미션)";
      case "MULTIPLE": return "다수 (일반 참여)";
      default: return "";
    }
  };

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
          <h1 className="text-xl font-bold">이벤트 생성</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 가이드 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">👟 신발 피드 이벤트 작성 가이드</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>이벤트 제목:</strong> 신발과 관련된 매력적인 제목으로 작성</p>
            <p>• <strong>이벤트 유형:</strong> 배틀(스타일 경쟁), 미션(착용 미션), 다수(일반 참여)</p>
            <p>• <strong>일정:</strong> 신발 구매 기간과 피드 업로드 기간 설정</p>
            <p>• <strong>상품 정보:</strong> 신발 관련 혜택을 구체적으로 명시</p>
            <p>• <strong>선정 기준:</strong> 스타일링, 사진 퀄리티, 창의성 등</p>
          </div>
        </section>

        <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">이벤트 제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  placeholder="예: 2024 스니커즈 스타일링 챌린지"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">신발과 관련된 매력적이고 참여하고 싶은 제목으로 작성해주세요</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">이벤트 유형 <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        eventForm.type === type 
                          ? "bg-[#87CEEB] text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getTypeText(type)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">최대 참여자 수 <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="maxParticipants"
                value={eventForm.maxParticipants}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                placeholder="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">신발 스타일링 이벤트에 참여할 수 있는 최대 인원수를 설정해주세요</p>
            </div>
          </section>

          {/* 일정 섹션 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">이벤트 일정</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">구매 시작일 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="purchaseStartDate"
                  value={eventForm.purchaseStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">구매 종료일 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="purchaseEndDate"
                  value={eventForm.purchaseEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 mb-2">이벤트 시작일 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={eventForm.eventStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">이벤트 종료일 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={eventForm.eventEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">발표일 <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="announcement"
                value={eventForm.announcement}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
                required
              />
            </div>
          </section>

          {/* 이벤트 내용 섹션 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">이벤트 내용</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">이벤트 설명 <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent resize-none"
                  placeholder="신발 이벤트에 대한 자세한 설명을 입력하세요. 예시: 이번 이벤트는 구매한 신발을 착용하고 스타일링한 모습을 피드에 올리는 챌린지입니다. 참여자들은 신발과 어울리는 코디를 완성하고, 가장 스타일리시하고 창의적인 스타일링을 선보인 분들에게 특별한 신발 혜택을 제공합니다."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">참여 방법 <span className="text-red-500">*</span></label>
                <textarea
                  name="participationMethod"
                  value={eventForm.participationMethod}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent resize-none"
                  placeholder="신발 이벤트 참여 방법을 자세히 설명하세요. 예시: 1) 이벤트 페이지에서 원하는 신발을 선택하고 구매합니다. 2) 구매한 신발을 착용하고 스타일링한 모습을 촬영합니다. 3) 신발과 어울리는 코디와 함께 피드에 업로드합니다. 4) 다른 참여자들의 스타일링에 좋아요를 눌러주세요. 5) 해시태그 #신발스타일링 #스니커즈챌린지 를 추가해주세요."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">상품 정보 <span className="text-red-500">*</span></label>
                <textarea
                  name="rewards"
                  value={eventForm.rewards}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent resize-none"
                  placeholder="신발 이벤트에서 제공할 혜택을 자세히 입력하세요. 예시: 🥇 1등: 프리미엄 스니커즈 (가치 30만원) - 브랜드: Nike, 상품: Air Jordan 1, 색상: Chicago, 사이즈: 선택가능 🥈 2등: 트렌디한 운동화 (가치 15만원) - 브랜드: Adidas, 상품: Stan Smith, 색상: 화이트, 사이즈: 선택가능 🥉 3등: 스타일리시한 슈즈 (가치 8만원) - 브랜드: Converse, 상품: Chuck Taylor, 색상: 선택가능, 사이즈: 선택가능"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">선정 기준 <span className="text-red-500">*</span></label>
                <textarea
                  name="selectionCriteria"
                  value={eventForm.selectionCriteria}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent resize-none"
                  placeholder="신발 스타일링 선정 기준을 명확히 설명하세요. 예시: 1) 스타일링 퀄리티 (40%): 신발과 어울리는 완벽한 코디 2) 사진 퀄리티 (30%): 신발이 잘 보이는 고화질 사진 3) 창의성 (20%): 독창적이고 참신한 스타일링 4) 참여도 (10%): 다른 참여자들과의 상호작용 및 좋아요 수"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">주의사항 <span className="text-red-500">*</span></label>
                <textarea
                  name="precautions"
                  value={eventForm.precautions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent resize-none"
                  placeholder="신발 이벤트 참여 시 주의사항을 명시하세요. 예시: ⚠️ 이벤트 참여 시 반드시 구매한 신발만 착용해주세요. ⚠️ 신발이 잘 보이도록 촬영해주세요. ⚠️ 타인의 저작권을 침해하는 콘텐츠는 제외됩니다. ⚠️ 부정한 방법으로 참여한 경우 당첨이 취소될 수 있습니다. ⚠️ 이벤트 종료 후 7일 이내에 당첨자 발표가 진행됩니다."
                  required
                />
              </div>
            </div>
          </section>

          {/* 이미지 업로드 섹션 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">이벤트 이미지</h2>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent"
              />
              {eventForm.imagePreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img 
                      src={eventForm.imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300" 
                    />
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="이미지 제거"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">이미지를 제거하려면 X 버튼을 클릭하세요</p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">권장 크기: 1200x600px, 최대 5MB (JPG, PNG, GIF)</p>
            </div>
          </section>
        </form>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col space-y-3 mb-10">
          <button
            type="submit"
            form="event-form"
            className={`relative bg-[#87CEEB] text-white py-3 rounded-lg font-medium transition duration-200 !rounded-button whitespace-nowrap ${
              isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-blue-400'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                생성 중...
              </div>
            ) : (
              '이벤트 생성'
            )}
          </button>
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium text-center hover:bg-gray-50 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer"
            onClick={() => navigate('/event-list')}
          >
            취소
          </button>
        </div>
      </main>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <i className={`mr-2 ${toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;

