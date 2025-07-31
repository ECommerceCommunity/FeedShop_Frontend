import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";
import EventService from "../../api/eventService";

interface EventRewardRequestDto {
  conditionValue: string;  // 백엔드와 호환되도록 변경
  rewardValue: string;     // 백엔드와 호환되도록 변경
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

function toDateString(str: string | undefined) {
  if (!str) return '';
  const date = new Date(str);
  return date.toISOString().slice(0, 16);
}

function toDatetimeLocal(str: string | undefined) {
  if (!str) return '';
  const date = new Date(str);
  return date.toISOString().slice(0, 16);
}

// 날짜를 LocalDate 형식으로 변환 (YYYY-MM-DD)
function toLocalDateString(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
}

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        let mappedRewards: EventRewardRequestDto[] = [];
        if (detail.rewards && Array.isArray(detail.rewards)) {
          mappedRewards = detail.rewards.map((reward: any) => ({
            conditionValue: reward.rank ? reward.rank.toString() : "1",
            rewardValue: reward.reward || ''
          }));
        } else {
          // 기본 보상 설정
          mappedRewards = [
            { conditionValue: "1", rewardValue: "프리미엄 스니커즈" },
            { conditionValue: "2", rewardValue: "트렌디한 운동화" },
            { conditionValue: "3", rewardValue: "스타일리시한 슈즈" }
          ];
        }
        
        setEventForm({
          title: detail.title || event.title || '',
          type: (detail.type || event.type || 'BATTLE').toUpperCase() as EventType,
          purchaseStartDate: toDatetimeLocal(detail.purchaseStartDate),
          purchaseEndDate: toDatetimeLocal(detail.purchaseEndDate),
          eventStartDate: toDatetimeLocal(detail.eventStartDate),
          eventEndDate: toDatetimeLocal(detail.eventEndDate),
          announcement: toDatetimeLocal(detail.announcement || detail.announcementDate),
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

  const handleRewardChange = (index: number, field: keyof EventRewardRequestDto, value: string) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
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
        conditionValue: (prev.rewards.length + 1).toString(), 
        rewardValue: ""
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

  const validateForm = () => {
    const errors: string[] = [];

    if (!eventForm.title.trim()) errors.push("이벤트 제목을 입력해주세요.");
    if (!eventForm.description.trim()) errors.push("이벤트 설명을 입력해주세요.");
    if (!eventForm.participationMethod.trim()) errors.push("참여 방법을 입력해주세요.");
    if (!eventForm.selectionCriteria.trim()) errors.push("선정 기준을 입력해주세요.");
    if (!eventForm.precautions.trim()) errors.push("주의사항을 입력해주세요.");
    if (!eventForm.purchaseStartDate) errors.push("구매 시작일을 입력해주세요.");
    if (!eventForm.purchaseEndDate) errors.push("구매 종료일을 입력해주세요.");
    if (!eventForm.eventStartDate) errors.push("이벤트 시작일을 입력해주세요.");
    if (!eventForm.eventEndDate) errors.push("이벤트 종료일을 입력해주세요.");
    if (!eventForm.announcement) errors.push("발표일을 입력해주세요.");
    if (eventForm.maxParticipants < 1) errors.push("최대 참여자 수는 1명 이상이어야 합니다.");
    
    // 보상 검증
    if (eventForm.rewards.length === 0) {
      errors.push("최소 1개의 보상을 입력해주세요.");
    } else {
      eventForm.rewards.forEach((reward, index) => {
        if (!reward.rewardValue.trim()) {
          errors.push(`${index + 1}등 보상 내용을 입력해주세요.`);
        }
      });
    }

    // 날짜 순서 검증
    if (eventForm.purchaseStartDate && eventForm.purchaseEndDate) {
      if (new Date(eventForm.purchaseStartDate) >= new Date(eventForm.purchaseEndDate)) {
        errors.push("구매 시작일은 종료일보다 이전이어야 합니다.");
      }
    }
    
    if (eventForm.eventStartDate && eventForm.eventEndDate) {
      if (new Date(eventForm.eventStartDate) >= new Date(eventForm.eventEndDate)) {
        errors.push("이벤트 시작일은 종료일보다 이전이어야 합니다.");
      }
    }

    // 새로운 날짜 규칙 검증
    if (eventForm.purchaseEndDate && eventForm.eventStartDate) {
      if (new Date(eventForm.purchaseEndDate) < new Date(eventForm.eventStartDate)) {
        errors.push("구매 종료일은 이벤트 시작일보다 이전이어야 합니다.");
      }
    }

    if (eventForm.purchaseEndDate && eventForm.eventEndDate) {
      if (new Date(eventForm.eventEndDate) <= new Date(eventForm.purchaseEndDate)) {
        errors.push("이벤트 종료일은 구매 종료일 이후여야 합니다.");
      }
    }

    if (eventForm.eventEndDate && eventForm.announcement) {
      if (new Date(eventForm.eventEndDate) >= new Date(eventForm.announcement)) {
        errors.push("결과 발표일은 이벤트 종료일 이후여야 합니다.");
      }
    }

    return errors;
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
      formData.append("purchaseStartDate", eventForm.purchaseStartDate.split('T')[0]);
      formData.append("purchaseEndDate", eventForm.purchaseEndDate.split('T')[0]);
      formData.append("eventStartDate", eventForm.eventStartDate.split('T')[0]);
      formData.append("eventEndDate", eventForm.eventEndDate.split('T')[0]);
      formData.append("announcement", eventForm.announcement.split('T')[0]);
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

      const response = await axiosInstance.put(`/api/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log('API Response:', response.data);
      alert("이벤트가 성공적으로 수정되었습니다.");
      navigate("/events");
    } catch (error: any) {
      console.error("이벤트 수정 실패:", error);
      alert("이벤트 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE":
        return "배틀";
      case "MISSION":
        return "미션";
      case "MULTIPLE":
        return "다수";
      default:
        return type;
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            이벤트 수정
          </h1>
          <p className="text-gray-600">
            이벤트 정보를 수정해주세요.
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
                이벤트 타입 *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      eventForm.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{getTypeText(type)}</div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                  type="datetime-local"
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
                  type="datetime-local"
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
                  type="datetime-local"
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
                  type="datetime-local"
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
                  type="datetime-local"
                  name="announcement"
                  value={eventForm.announcement}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                      placeholder="예: 1, 2, 3"
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
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '수정 중...' : '이벤트 수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditPage;
