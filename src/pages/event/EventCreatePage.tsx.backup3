import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../api/axios";
import { EventType, EventRewardGroup, EventRewardItem, EventCreateRequestDto } from "../../types/event";
import { EventForm } from "../../types/event";
import { 
  getEventTypeText, 
  toLocalDateString, 
  toStartDateTime,
  toEndDateTime,
  validateEventForm, 
  getErrorMessage 
} from "../../utils/eventUtils";

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
          announcementDate: "",
    description: "",
    participationMethod: "",
    rewards: [
      { 
        conditionValue: "1", 
        rewards: [
          { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
          { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
          { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
        ]
      },
      { 
        conditionValue: "2", 
        rewards: [
          { rewardType: "POINTS", rewardValue: 1500, rewardDescription: "1500 포인트" },
          { rewardType: "BADGE_POINTS", rewardValue: 50, rewardDescription: "50 뱃지점수" }
        ]
      },
      { 
        conditionValue: "3", 
        rewards: [
          { rewardType: "POINTS", rewardValue: 1000, rewardDescription: "1000 포인트" }
        ]
      }
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 도움말 표시 상태
  const [showHelp, setShowHelp] = useState({
    participationMethod: false,
    selectionCriteria: false,
    precautions: false
  });



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
      return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    };

    setEventForm(prev => ({
      ...prev,
      purchaseStartDate: formatDate(tomorrow),
      purchaseEndDate: formatDate(nextWeek),
      eventStartDate: formatDate(nextWeek),
      eventEndDate: formatDate(nextMonth),
      announcementDate: formatDate(nextMonth)
    }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: EventType) => {
    setEventForm(prev => {
      const updatedForm = { ...prev, type };
      
      // 이벤트 유형이 변경되면 보상 구조도 업데이트
      if (type !== prev.type) {
        if (type === 'BATTLE') {
          // 배틀 이벤트로 변경 시 보상 구조 변경
          updatedForm.rewards = [
            { 
              conditionValue: "1", 
              rewards: [
                { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
                { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
                { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
              ]
            },
            { 
              conditionValue: "participation", 
              rewards: [
                { rewardType: "POINTS", rewardValue: 100, rewardDescription: "100 포인트" }
              ]
            }
          ];
        } else if (type === 'RANKING') {
          // 랭킹 이벤트로 변경 시 보상 구조 변경
          updatedForm.rewards = [
            { 
              conditionValue: "1", 
              rewards: [
                { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
                { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
                { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
              ]
            },
            { 
              conditionValue: "2", 
              rewards: [
                { rewardType: "POINTS", rewardValue: 1500, rewardDescription: "1500 포인트" },
                { rewardType: "BADGE_POINTS", rewardValue: 50, rewardDescription: "50 뱃지점수" }
              ]
            },
            { 
              conditionValue: "3", 
              rewards: [
                { rewardType: "POINTS", rewardValue: 1000, rewardDescription: "1000 포인트" }
              ]
            }
          ];
        }
      }
      
      return updatedForm;
    });
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
    // 기존 토스트를 먼저 숨기고 새로운 메시지 설정
    setShowToast(false);
    setToastMessage(message);
    setToastType(type);
    
    // 약간의 지연 후 새로운 토스트 표시 (기존 토스트가 완전히 사라진 후)
    setTimeout(() => {
      setShowToast(true);
      // 에러 메시지는 더 오래 표시 (4초)
      const displayTime = type === 'error' ? 4000 : 3000;
      setTimeout(() => setShowToast(false), displayTime);
    }, 100);
  };

  const handleRewardChange = (groupIndex: number, rewardIndex: number, field: keyof EventRewardItem, value: string) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((rewardGroup, i) => 
        i === groupIndex ? {
          ...rewardGroup,
          rewards: rewardGroup.rewards.map((reward, j) => 
            j === rewardIndex ? { ...reward, [field]: value } : reward
          )
        } : rewardGroup
      )
    }));
  };

  const handleRewardGroupChange = (groupIndex: number, field: keyof EventRewardGroup, value: string) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((rewardGroup, i) => 
        i === groupIndex ? { ...rewardGroup, [field]: value } : rewardGroup
      )
    }));
  };

  const addRewardToGroup = (groupIndex: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((rewardGroup, i) => 
        i === groupIndex ? {
          ...rewardGroup,
          rewards: [...rewardGroup.rewards, {
            rewardType: "POINTS" as const,
            rewardValue: 100,
            rewardDescription: "100 포인트"
          }]
        } : rewardGroup
      )
    }));
  };

  const removeRewardFromGroup = (groupIndex: number, rewardIndex: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((rewardGroup, i) => 
        i === groupIndex ? {
          ...rewardGroup,
          rewards: rewardGroup.rewards.filter((_, j) => j !== rewardIndex)
        } : rewardGroup
      )
    }));
  };

  // 배틀 이벤트 보상 제목 변환 함수
  const getBattleRewardTitle = (conditionValue: string) => {
    switch (conditionValue) {
      case '1':
        return '우승자';
      case 'participation':
        return '참여자';
      default:
        return conditionValue;
    }
  };

  const addReward = () => {
    setEventForm(prev => ({
      ...prev,
      rewards: [...prev.rewards, { 
        conditionValue: eventForm.type === 'RANKING' ? `${prev.rewards.length + 1}` : '1', 
        rewards: [
          { rewardType: "POINTS", rewardValue: 500, rewardDescription: "500 포인트" }
        ]
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
    return validateEventForm(eventForm);
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
      formData.append("purchaseStartDate", toStartDateTime(eventForm.purchaseStartDate));
      formData.append("purchaseEndDate", toEndDateTime(eventForm.purchaseEndDate));
      formData.append("eventStartDate", toStartDateTime(eventForm.eventStartDate));
      formData.append("eventEndDate", toEndDateTime(eventForm.eventEndDate));
      formData.append("announcement", toStartDateTime(eventForm.announcementDate));
      formData.append("description", eventForm.description);
      formData.append("participationMethod", eventForm.participationMethod);
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      // rewards를 백엔드 형식에 맞게 변환 (EventRewardRequestDto 형식)
      const rewardsForBackend = eventForm.rewards.map(rewardGroup => {
        // 각 보상 그룹의 모든 보상을 하나의 rewardValue로 결합
        const combinedRewardValue = rewardGroup.rewards.map(reward => {
          const value = reward.rewardType === 'DISCOUNT_COUPON' ? `${reward.rewardValue}%` : reward.rewardValue;
          return `${reward.rewardType}: ${value}`;
        }).join(', ');
        
        return {
          conditionValue: rewardGroup.conditionValue,
          rewardValue: combinedRewardValue
        };
      });
      formData.append("rewards", JSON.stringify(rewardsForBackend));
      
      if (eventForm.imageFile) {
        formData.append("image", eventForm.imageFile);
      }

      await axiosInstance.post("/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/events");
      }, 2000);

    } catch (error: any) {
      console.error("이벤트 생성 실패:", error);
      
      let errorMessage = "이벤트 생성에 실패했습니다.";
      
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("Duplicate entry")) {
          errorMessage = "이미 존재하는 이벤트입니다. 다른 제목이나 설정으로 다시 시도해주세요.";
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 400) {
        errorMessage = "입력 데이터가 올바르지 않습니다. 모든 필수 항목을 확인해주세요.";
      } else if (error.response?.status === 401) {
        errorMessage = "로그인이 필요하거나 권한이 없습니다.";
      } else if (error.response?.status === 403) {
        errorMessage = "관리자 권한이 필요합니다.";
      } else if (error.response?.status >= 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent mb-4 animate-bounce">
            이벤트 생성
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            새로운 이벤트를 생성하여 사용자들과 특별한 경험을 만들어보세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                기본 정보
              </h2>
            </div>
            
            {/* 이벤트 제목 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                이벤트 제목 *
              </label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                placeholder="매력적인 이벤트 제목을 입력하세요"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                maxLength={100}
              />
            </div>

            {/* 이벤트 타입 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                이벤트 유형 *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["RANKING", "BATTLE"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`group relative p-8 border-2 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
                      eventForm.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg ring-4 ring-blue-500/20'
                        : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="mb-4">
                      {type === "RANKING" && (
                        <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      )}
                      {type === "BATTLE" && (
                        <div className="w-16 h-16 mx-auto bg-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xl mb-3">{getEventTypeText(type)}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {type === "RANKING" && "순위별로 보상을 받는 랭킹 이벤트"}
                      {type === "BATTLE" && "1:1 스타일 대결로 승부를 가려요"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 이벤트 설명 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                이벤트 설명 *
              </label>
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                placeholder="이벤트의 매력과 참여 방법을 상세히 설명해주세요"
                rows={5}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">참여자들이 이벤트에 관심을 가질 수 있도록 매력적으로 작성해주세요</span>
                <span className="text-sm font-medium text-gray-600">
                  {eventForm.description.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                날짜 정보
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 구매 기간 */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  구매 시작일 *
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    name="purchaseStartDate"
                    value={eventForm.purchaseStartDate}
                    onChange={handleChange}
                    className="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white group-hover:border-green-300"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    type="date"
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
                    type="date"
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
                    type="date"
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
                    type="date"
                    name="announcementDate"
                    value={eventForm.announcementDate}
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
                   className="text-blue-500 text-sm hover:text-blue-700 active:text-blue-800 transition-colors duration-200 active:scale-95 transform"
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
                   className="text-blue-500 text-sm hover:text-blue-700 active:text-blue-800 transition-colors duration-200 active:scale-95 transform"
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
                   className="text-blue-500 text-sm hover:text-blue-700 active:text-blue-800 transition-colors duration-200 active:scale-95 transform"
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
            
            {/* 이벤트 유형별 보상 조건 설명 */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {eventForm.type === 'RANKING' ? '랭킹 이벤트 보상 조건' : '배틀 이벤트 보상 조건'}
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                {eventForm.type === 'RANKING' ? (
                  <>
                    <p>• <strong>1등:</strong> 투표수가 가장 많은 참여자</p>
                    <p>• <strong>2등:</strong> 투표수가 두 번째로 많은 참여자</p>
                    <p>• <strong>3등:</strong> 투표수가 세 번째로 많은 참여자</p>
                    <p className="text-xs text-blue-600 mt-2">투표수 기준으로 순위가 결정되며, 동점 시 먼저 등록한 피드가 우선순위를 가집니다.</p>
                    <p className="text-xs text-blue-600">각 순위별로 여러 보상(포인트, 뱃지점수, 할인쿠폰)을 동시에 받을 수 있습니다.</p>
                  </>
                ) : (
                  <>
                    <p>• <strong>우승자:</strong> 배틀에서 승리한 참여자</p>
                    <p>• <strong>참여자:</strong> 배틀에 참여한 모든 사용자</p>
                    <p className="text-xs text-blue-600 mt-2">랜덤 매칭으로 2명씩 대결하여 투표수가 많은 쪽이 승리하며, 승자는 보상을 받습니다.</p>
                    <p className="text-xs text-blue-600">각 보상 유형별로 여러 보상(포인트, 뱃지점수, 할인쿠폰)을 동시에 받을 수 있습니다.</p>
                  </>
                )}
              </div>
            </div>
            
            {eventForm.rewards.map((rewardGroup, groupIndex) => (
              <div key={groupIndex} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {eventForm.type === 'RANKING' 
                      ? `${rewardGroup.conditionValue}등 보상 (${rewardGroup.rewards.length}개 보상)`
                      : `${getBattleRewardTitle(rewardGroup.conditionValue)} 보상 (${rewardGroup.rewards.length}개 보상)`
                    }
                  </h3>
                  {eventForm.rewards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReward(groupIndex)}
                      className="text-red-500 hover:text-red-700 active:text-red-800 transition-colors duration-200 active:scale-95 transform"
                    >
                      삭제
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    선정 조건
                  </label>
                  {eventForm.type === 'RANKING' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={rewardGroup.conditionValue}
                        onChange={(e) => handleRewardGroupChange(groupIndex, 'conditionValue', e.target.value)}
                        placeholder="1"
                        className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">등 (투표수 기준)</span>
                    </div>
                  ) : (
                    <select
                      value={rewardGroup.conditionValue}
                      onChange={(e) => handleRewardGroupChange(groupIndex, 'conditionValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">우승자</option>
                      <option value="participation">참여자</option>
                    </select>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {eventForm.type === 'RANKING' 
                      ? '투표수가 많은 순서대로 1등, 2등, 3등... 순위가 결정됩니다.'
                      : '배틀 결과에 따라 최종 우승자, 준우승자, 3위, 참여자 보상이 지급됩니다.'
                    }
                  </p>
                </div>
                
                {rewardGroup.rewards.map((reward, rewardIndex) => (
                  <div key={rewardIndex} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-gray-800">
                        보상 {rewardIndex + 1}
                      </h4>
                      {rewardGroup.rewards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRewardFromGroup(groupIndex, rewardIndex)}
                          className="text-red-500 hover:text-red-700 active:text-red-800 transition-colors duration-200 active:scale-95 transform"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          보상 유형
                        </label>
                        <select
                          value={reward.rewardType}
                          onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="POINTS">포인트</option>
                          <option value="BADGE_POINTS">뱃지점수</option>
                          <option value="DISCOUNT_COUPON">할인쿠폰</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          보상 수량
                        </label>
                        <input
                          type="number"
                          value={reward.rewardValue}
                          onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardValue', e.target.value)}
                          placeholder="예: 1000"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          보상 설명 (선택사항)
                        </label>
                        <input
                          type="text"
                          value={reward.rewardDescription}
                          onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardDescription', e.target.value)}
                          placeholder="예: 1000 포인트 지급"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          보상 설명은 백엔드에서 자동으로 생성되므로 선택사항입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addRewardToGroup(groupIndex)}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  보상 추가
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addReward}
              className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              보상 그룹 추가
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
                 className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer transform"
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
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 transform"
                   >
                     ×
                   </button>
                </div>
              </div>
            )}
          </div>

                     {/* 제출 버튼 */}
           <div className="flex justify-center gap-4 pt-8">
             <button
               type="button"
               onClick={() => navigate('/events')}
               className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 font-medium active:scale-95 transform hover:shadow-md rounded-lg border border-gray-300 hover:border-gray-400 active:bg-gray-100"
             >
               취소
             </button>
             <button
               type="submit"
               disabled={isLoading}
               className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium active:scale-95 transform hover:shadow-lg active:shadow-xl"
             >
               {isLoading ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   생성 중...
                 </>
               ) : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   이벤트 생성
                 </>
               )}
             </button>
           </div>
        </form>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl animate-fade-in-out ${
          toastType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {toastType === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-semibold">{toastMessage}</span>
          </div>
                 </div>
       )}

       {/* 플로팅 액션 버튼 */}
       <div className="fixed bottom-8 right-8 z-40">
         <button
           onClick={() => navigate('/events')}
           className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 transform group cursor-pointer flex items-center justify-center"
           title="이벤트 목록으로 이동"
         >
           <svg className="w-8 h-8 text-white group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 12H5m7 7l-7-7 7-7" />
           </svg>
         </button>
       </div>

       {/* 성공 팝업창 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">이벤트 생성 완료!</h3>
              <p className="text-gray-600 mb-6">
                새로운 이벤트가 성공적으로 생성되었습니다.
              </p>
              <div className="flex justify-center">
                                 <button
                   onClick={() => {
                     setShowSuccessModal(false);
                     navigate('/events');
                   }}
                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 font-medium transform"
                 >
                   이벤트 목록으로 이동
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreatePage;

