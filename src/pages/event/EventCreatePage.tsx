import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";

interface EventRewardRequestDto {
  conditionValue: string;
  rewardValue: string;
}

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
  rewards: EventRewardRequestDto[];
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
  const { user } = useAuth();
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
    rewards: [
      { conditionValue: "1", rewardValue: "프리미엄 스니커즈" },
      { conditionValue: "2", rewardValue: "트렌디한 운동화" },
      { conditionValue: "3", rewardValue: "스타일리시한 슈즈" }
    ],
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

  // 도움말 표시 상태
  const [showHelp, setShowHelp] = useState({
    participationMethod: false,
    selectionCriteria: false,
    precautions: false
  });

  // 날짜 변환 헬퍼 함수
  const toLocalDateString = (dateTimeStr: string): string => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  // 권한 체크
  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (user.userType !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      navigate('/events');
      return;
    }
  }, [user, navigate]);

  // 현재 날짜를 기본값으로 설정 (한국 시간대 적용)
  useEffect(() => {
    // 한국 시간대 (UTC+9) 적용
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    const tomorrow = new Date(koreaTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(koreaTime);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(koreaTime);
    nextMonth.setDate(nextMonth.getDate() + 30);
    
    const formatDate = (date: Date) => {
      return date.toISOString().slice(0, 16);
    };

    setEventForm(prev => ({
      ...prev,
      purchaseStartDate: formatDate(tomorrow),
      purchaseEndDate: formatDate(nextWeek),
      eventStartDate: formatDate(nextWeek),
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
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRewardChange = (index: number, field: keyof EventRewardRequestDto, value: string) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const addReward = () => {
    setEventForm(prev => ({
      ...prev,
      rewards: [...prev.rewards, { 
        conditionValue: `${prev.rewards.length + 1}`, 
        rewardValue: "" 
      }]
    }));
  };

  const removeReward = (index: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!eventForm.title.trim()) {
      errors.push("이벤트 제목을 입력해주세요.");
    }

    if (!eventForm.description.trim()) {
      errors.push("이벤트 설명을 입력해주세요.");
    }

    if (!eventForm.purchaseStartDate) {
      errors.push("구매 시작일을 설정해주세요.");
    }

    if (!eventForm.purchaseEndDate) {
      errors.push("구매 종료일을 설정해주세요.");
    }

    if (!eventForm.eventStartDate) {
      errors.push("이벤트 시작일을 설정해주세요.");
    }

    if (!eventForm.eventEndDate) {
      errors.push("이벤트 종료일을 설정해주세요.");
    }

    if (!eventForm.announcement) {
      errors.push("발표일을 설정해주세요.");
    }

    if (!eventForm.participationMethod.trim()) {
      errors.push("참여 방법을 입력해주세요.");
    }

    if (!eventForm.selectionCriteria.trim()) {
      errors.push("선정 기준을 입력해주세요.");
    }

    if (!eventForm.precautions.trim()) {
      errors.push("주의사항을 입력해주세요.");
    }

    if (eventForm.maxParticipants < 1) {
      errors.push("최대 참가자 수는 1명 이상이어야 합니다.");
    }

    // 날짜 유효성 검사
    const purchaseStart = new Date(eventForm.purchaseStartDate);
    const purchaseEnd = new Date(eventForm.purchaseEndDate);
    const eventStart = new Date(eventForm.eventStartDate);
    const eventEnd = new Date(eventForm.eventEndDate);
    const announcement = new Date(eventForm.announcement);

    if (purchaseEnd <= purchaseStart) {
      errors.push("구매 종료일은 시작일보다 늦어야 합니다.");
    }

    if (eventEnd <= eventStart) {
      errors.push("이벤트 종료일은 시작일보다 늦어야 합니다.");
    }

    if (eventStart < purchaseEnd) {
      errors.push("이벤트 시작일은 구매 종료일 이후여야 합니다.");
    }

    if (announcement < eventEnd) {
      errors.push("발표일은 이벤트 종료일 이후여야 합니다.");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showToastMessage(errors.join('\n'), 'error');
      return;
    }

    try {
      setIsLoading(true);

      // FormData로 전송 (백엔드가 multipart/form-data를 지원하므로)
      const formData = new FormData();
      formData.append("title", eventForm.title);
      formData.append("type", eventForm.type);
      formData.append("purchaseStartDate", toLocalDateString(eventForm.purchaseStartDate));
      formData.append("purchaseEndDate", toLocalDateString(eventForm.purchaseEndDate));
      formData.append("eventStartDate", toLocalDateString(eventForm.eventStartDate));
      formData.append("eventEndDate", toLocalDateString(eventForm.eventEndDate));
      formData.append("announcement", toLocalDateString(eventForm.announcement));
      formData.append("description", eventForm.description);
      formData.append("participationMethod", eventForm.participationMethod);
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      // rewards를 JSON 문자열로 변환
      formData.append("rewards", JSON.stringify(eventForm.rewards));
      
      if (eventForm.imageFile) {
        formData.append("image", eventForm.imageFile);
      }

      const response = await axiosInstance.post("/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToastMessage("이벤트가 성공적으로 생성되었습니다!", 'success');
      
      // 성공 후 이벤트 목록 페이지로 이동
      setTimeout(() => {
        navigate("/events");
      }, 1500);

    } catch (error: any) {
      console.error("이벤트 생성 실패:", error);
      const errorMessage = error.response?.data?.message || "이벤트 생성에 실패했습니다.";
      showToastMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE":
        return "배틀";
      case "MISSION":
        return "미션";
      case "MULTIPLE":
        return "랭킹";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            이벤트 생성
          </h1>
          <p className="text-gray-600">
            새로운 이벤트를 생성해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            {/* 이벤트 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 제목 *
              </label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                placeholder="이벤트 제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* 이벤트 타입 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 유형 *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-6 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-md ${
                      eventForm.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="mb-3">
                      {type === "BATTLE" && (
                        <svg className="w-12 h-12 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {type === "MISSION" && (
                        <svg className="w-12 h-12 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      )}
                      {type === "MULTIPLE" && (
                        <svg className="w-12 h-12 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="font-bold text-lg mb-2">{getTypeText(type)}</div>
                    <div className="text-sm text-gray-600">
                      {type === "BATTLE" && "1:1 스타일 대결"}
                      {type === "MISSION" && "주어진 미션 수행"}
                      {type === "MULTIPLE" && "다수 참여 이벤트"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 이벤트 설명 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 설명 *
              </label>
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                placeholder="이벤트에 대한 상세한 설명을 입력하세요"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {eventForm.description.length}/1000
              </div>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">날짜 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 구매 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 시작일 *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="purchaseStartDate"
                    value={eventForm.purchaseStartDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 종료일 *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="purchaseEndDate"
                    value={eventForm.purchaseEndDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* 이벤트 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 시작일 *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="eventStartDate"
                    value={eventForm.eventStartDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 종료일 *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="eventEndDate"
                    value={eventForm.eventEndDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* 발표일 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발표일 *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="announcement"
                    value={eventForm.announcement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">상세 정보</h2>
            
            {/* 참여 방법 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  참여 방법 *
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelp(prev => ({ ...prev, participationMethod: !prev.participationMethod }))}
                  className="text-blue-500 text-sm hover:text-blue-700"
                >
                  도움말
                </button>
              </div>
              {showHelp.participationMethod && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  이벤트 참여 방법을 상세히 설명해주세요. 예: "상품을 구매하고 리뷰를 작성하면 참여 완료"
                </div>
              )}
              <textarea
                name="participationMethod"
                value={eventForm.participationMethod}
                onChange={handleChange}
                placeholder="이벤트 참여 방법을 상세히 설명하세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            </div>

            {/* 선정 기준 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  선정 기준 *
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelp(prev => ({ ...prev, selectionCriteria: !prev.selectionCriteria }))}
                  className="text-blue-500 text-sm hover:text-blue-700"
                >
                  도움말
                </button>
              </div>
              {showHelp.selectionCriteria && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  당선자 선정 기준을 명확히 설명해주세요. 예: "리뷰 품질, 사진 퀄리티, 창의성 등을 종합 평가"
                </div>
              )}
              <textarea
                name="selectionCriteria"
                value={eventForm.selectionCriteria}
                onChange={handleChange}
                placeholder="당선자 선정 기준을 설명하세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            </div>

            {/* 주의사항 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  주의사항 *
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelp(prev => ({ ...prev, precautions: !prev.precautions }))}
                  className="text-blue-500 text-sm hover:text-blue-700"
                >
                  도움말
                </button>
              </div>
              {showHelp.precautions && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  이벤트 참여 시 주의사항을 안내해주세요. 예: "중복 참여 불가, 부정 참여 시 제재"
                </div>
              )}
              <textarea
                name="precautions"
                value={eventForm.precautions}
                onChange={handleChange}
                placeholder="이벤트 참여 시 주의사항을 입력하세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            </div>

            {/* 최대 참가자 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 참가자 수 *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={eventForm.maxParticipants}
                onChange={handleChange}
                min="1"
                max="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 보상 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">보상 정보</h2>
            
            {eventForm.rewards.map((reward, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {index + 1}등 보상
                  </h3>
                  {eventForm.rewards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReward(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      선정 조건
                    </label>
                    <input
                      type="text"
                      value={reward.conditionValue}
                      onChange={(e) => handleRewardChange(index, 'conditionValue', e.target.value)}
                      placeholder="예: 1등, 최우수상"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      보상 내용
                    </label>
                    <input
                      type="text"
                      value={reward.rewardValue}
                      onChange={(e) => handleRewardChange(index, 'rewardValue', e.target.value)}
                      placeholder="예: 프리미엄 스니커즈"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addReward}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + 보상 추가
            </button>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">이벤트 이미지</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="event-image"
              />
              <label
                htmlFor="event-image"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                이미지 선택
              </label>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF 파일만 업로드 가능합니다.
              </p>
            </div>
            
            {/* 이미지 미리보기 */}
            {eventForm.imagePreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={eventForm.imagePreview}
                    alt="이벤트 이미지 미리보기"
                    className="w-64 h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '생성 중...' : '이벤트 생성'}
            </button>
          </div>
        </form>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in-out ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;

