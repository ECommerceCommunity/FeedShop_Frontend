import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType, EventRewardGroup, EventRewardItem, EventUpdateRequestDto } from "../../types/event";
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



const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
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
        conditionValue: "1등", 
        rewards: [
          { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
          { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
          { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
        ]
      },
      { 
        conditionValue: "2등", 
        rewards: [
          { rewardType: "POINTS", rewardValue: 1500, rewardDescription: "1500 포인트" },
          { rewardType: "BADGE_POINTS", rewardValue: 50, rewardDescription: "50 뱃지점수" }
        ]
      },
      { 
        conditionValue: "3등", 
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

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/events/${id}`);
        const event = res.data;
        // Flexible mapping for both eventDetail and direct event fields
        const detail = event.eventDetail || event;
        
        // rewards 데이터 매핑 수정
        let mappedRewards: EventRewardGroup[] = [];
        if (detail.rewards && Array.isArray(detail.rewards)) {
          mappedRewards = detail.rewards.map((rewardGroup: any) => ({
            conditionValue: rewardGroup.rank ? rewardGroup.rank.toString() : rewardGroup.conditionValue || "1등",
            rewards: Array.isArray(rewardGroup.rewards) ? rewardGroup.rewards : [
              {
                rewardType: rewardGroup.rewardType || "POINTS",
                rewardValue: rewardGroup.rewardValue || 100,
                rewardDescription: rewardGroup.rewardDescription || rewardGroup.rewardValue || ''
              }
            ]
          }));
        } else {
          // 기본 보상 설정
          mappedRewards = [
            { 
              conditionValue: "1등", 
              rewards: [
                { rewardType: "BADGE_POINTS", rewardValue: 100, rewardDescription: "100 뱃지점수" },
                { rewardType: "POINTS", rewardValue: 2000, rewardDescription: "2000 포인트" },
                { rewardType: "DISCOUNT_COUPON", rewardValue: 15, rewardDescription: "15% 할인쿠폰" }
              ]
            },
            { 
              conditionValue: "2등", 
              rewards: [
                { rewardType: "POINTS", rewardValue: 1500, rewardDescription: "1500 포인트" },
                { rewardType: "BADGE_POINTS", rewardValue: 50, rewardDescription: "50 뱃지점수" }
              ]
            },
            { 
              conditionValue: "3등", 
              rewards: [
                { rewardType: "POINTS", rewardValue: 1000, rewardDescription: "1000 포인트" }
              ]
            }
          ];
        }
        
        setEventForm({
          title: detail.title || event.title || '',
          type: (detail.type || event.type || 'BATTLE').toUpperCase() as EventType,
          purchaseStartDate: toLocalDateString(detail.purchaseStartDate),
          purchaseEndDate: toLocalDateString(detail.purchaseEndDate),
          eventStartDate: toLocalDateString(detail.eventStartDate),
          eventEndDate: toLocalDateString(detail.eventEndDate),
          announcementDate: toLocalDateString(detail.announcement || detail.announcementDate),
          description: detail.description || '',
          participationMethod: detail.participationMethod || '',
          rewards: mappedRewards,
          selectionCriteria: detail.selectionCriteria || '',
          precautions: detail.precautions || '',
          maxParticipants: detail.maxParticipants || event.maxParticipants || 100,
          image: detail.imageUrl || detail.image || '',
          imageFile: null,
          imagePreview: detail.imageUrl || detail.image || ''
        });
      } catch (error: any) {
        console.error("이벤트 조회 실패:", error);
        setError("이벤트 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

  const addReward = () => {
    if (eventForm.rewards.length >= 5) {
      alert("보상은 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    setEventForm(prev => ({
      ...prev,
      rewards: [...prev.rewards, { 
        conditionValue: `${prev.rewards.length + 1}등`,
        rewards: [
          { rewardType: "POINTS", rewardValue: 100, rewardDescription: "100 포인트" }
        ]
      }]
    }));
  };

  const removeReward = (index: number) => {
    setEventForm(prev => {
      const newRewards = prev.rewards.filter((_, i) => i !== index);
      // 순서 재조정
      return {
        ...prev,
        rewards: newRewards.map((reward, i) => ({
          ...reward,
          conditionValue: (i + 1).toString()
        }))
      };
    });
  };

  const getBattleRewardTitle = (conditionValue: string) => {
    switch (conditionValue) {
      case "1":
        return "우승자";
      case "participation":
        return "참여자";
      default:
        return conditionValue;
    }
  };

  const validateForm = () => {
    return validateEventForm(eventForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      setLoading(true);

      // FormData로 전송 (백엔드가 multipart/form-data를 지원하므로)
      const formData = new FormData();
      formData.append("title", eventForm.title);
      formData.append("type", eventForm.type);
      formData.append("purchaseStartDate", toLocalDateString(eventForm.purchaseStartDate));
      formData.append("purchaseEndDate", toLocalDateString(eventForm.purchaseEndDate));
      formData.append("eventStartDate", toLocalDateString(eventForm.eventStartDate));
      formData.append("eventEndDate", toLocalDateString(eventForm.eventEndDate));
      formData.append("announcement", toLocalDateString(eventForm.announcementDate));
      formData.append("description", eventForm.description);
      formData.append("participationMethod", eventForm.participationMethod);
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      // rewards를 평면화하여 전송 (EventCreatePage와 동일한 방식)
      const flattenedRewards = eventForm.rewards.flatMap((rewardGroup, groupIndex) =>
        rewardGroup.rewards.map((reward, rewardIndex) => ({
          conditionValue: rewardGroup.conditionValue,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          rewardDescription: reward.rewardDescription
        }))
      );
      
      formData.append("rewards", JSON.stringify(flattenedRewards));
      
      if (eventForm.imageFile) {
        formData.append("image", eventForm.imageFile);
      }

      await axiosInstance.put(`/api/events/${id}/multipart`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log('API Response:', response.data);
      showToastMessage("이벤트가 성공적으로 수정되었습니다! 이벤트 목록 페이지로 이동합니다.", 'success');
      
      // 성공 후 이벤트 목록 페이지로 이동 (토스트 메시지가 보인 후)
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error: any) {
      console.error("이벤트 수정 실패:", error);
      
      let errorMessage = "이벤트 수정에 실패했습니다.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "입력 데이터가 올바르지 않습니다. 모든 필수 항목을 확인해주세요.";
      } else if (error.response?.status === 401) {
        errorMessage = "로그인이 필요하거나 권한이 없습니다.";
      } else if (error.response?.status === 403) {
        errorMessage = "관리자 권한이 필요합니다.";
      } else if (error.response?.status >= 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }
      
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">이벤트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            이벤트 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent mb-4 animate-bounce">
            이벤트 수정
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            기존 이벤트 정보를 수정하여 더 나은 경험을 제공하세요
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["RANKING", "BATTLE"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-6 border-2 rounded-xl text-center transition-all duration-300 hover:shadow-lg ${
                      eventForm.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-lg">{getEventTypeText(type)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {type === "RANKING" && "순위별로 보상을 받는 랭킹 이벤트"}
                      {type === "BATTLE" && "1:1 스타일 대결로 승부를 가려요"}
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
                <input
                  type="date"
                  name="purchaseStartDate"
                  value={eventForm.purchaseStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 종료일 *
                </label>
                <input
                  type="date"
                  name="purchaseEndDate"
                  value={eventForm.purchaseEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* 이벤트 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 시작일 *
                </label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={eventForm.eventStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 종료일 *
                </label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={eventForm.eventEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* 발표일 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발표일 *
                </label>
                <input
                  type="date"
                  name="announcementDate"
                  value={eventForm.announcementDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">상세 정보</h2>
            
            {/* 참여 방법 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여 방법 *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선정 기준 *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주의사항 *
              </label>
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
            
            {/* 보상 안내 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">보상 설정 안내</h3>
              {eventForm.type === 'RANKING' ? (
                <>
                  <p>• <strong>1등:</strong> 투표수가 가장 많은 피드</p>
                  <p>• <strong>2등:</strong> 투표수가 두 번째로 많은 피드</p>
                  <p>• <strong>3등:</strong> 투표수가 세 번째로 많은 피드</p>
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
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  수정 중...
                </>
              ) : (
                '이벤트 수정'
              )}
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

export default EventEditPage;
