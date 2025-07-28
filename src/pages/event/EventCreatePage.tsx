import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";

interface EventRewardRequestDto {
  conditionValue: number;
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
  rewards: EventRewardRequestDto[]; // 구조화된 보상 정보
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  image: string;
  imageFile: File | null;
  imagePreview: string;
}

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
    rewards: [
      { conditionValue: 1, rewardValue: "프리미엄 스니커즈 (가치 30만원)" },
      { conditionValue: 2, rewardValue: "트렌디한 운동화 (가치 15만원)" },
      { conditionValue: 3, rewardValue: "스타일리시한 슈즈 (가치 8만원)" }
    ],
    selectionCriteria: "",
    precautions: "",
    maxParticipants: 100,
    image: "",
    imageFile: null,
    imagePreview: ""
  });

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

  const handleRewardChange = (index: number, field: keyof EventRewardRequestDto, value: string | number) => {
    setEventForm(prev => {
      const newRewards = prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: field === 'conditionValue' ? Number(value) : value } : reward
      );
      
      // conditionValue가 변경된 경우 순서 재조정
      if (field === 'conditionValue') {
        return {
          ...prev,
          rewards: newRewards.map((reward, i) => ({
            ...reward,
            conditionValue: i + 1
          }))
        };
      }
      
      return {
        ...prev,
        rewards: newRewards
      };
    });
  };

  const addReward = () => {
    if (eventForm.rewards.length >= 5) {
      alert("보상은 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    setEventForm(prev => ({
      ...prev,
      rewards: [...prev.rewards, { conditionValue: prev.rewards.length + 1, rewardValue: "" }]
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
          conditionValue: i + 1
        }))
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.purchaseStartDate || !eventForm.purchaseEndDate || !eventForm.eventStartDate || !eventForm.eventEndDate || !eventForm.announcement || !eventForm.participationMethod || !eventForm.rewards || !eventForm.selectionCriteria || !eventForm.precautions) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

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
      // rewards를 개별 파라미터로 전송 (백엔드가 List<EventRewardRequestDto>를 기대함)
      eventForm.rewards.forEach((reward, index) => {
        formData.append(`rewards[${index}].conditionValue`, reward.conditionValue.toString());
        formData.append(`rewards[${index}].rewardValue`, reward.rewardValue);
      });
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      if (eventForm.imageFile) {
        formData.append("image", eventForm.imageFile);
      }

      // 디버깅을 위한 로그
      console.log('Form Data Contents:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      console.log('Sending request to:', "/api/events");
      
      const response = await axiosInstance.post("/api/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('API Response:', response.data);
      console.log('이벤트 생성 성공! 이벤트 목록 페이지로 이동합니다.');
      alert("이벤트가 성공적으로 생성되었습니다.");
      console.log('navigate("/event-list") 호출 전');
      navigate("/event-list");
      console.log('navigate("/event-list") 호출 후');
    } catch (error: any) {
      console.error("이벤트 생성 실패:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(`이벤트 생성에 실패했습니다. ${error.response?.data?.message || ''}`);
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
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">이벤트 생성</h1>
      
      {/* 가이드 섹션 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">👟 신발 피드 이벤트 작성 가이드</h2>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>이벤트 제목:</strong> 신발과 관련된 매력적인 제목으로 작성</p>
          <p>• <strong>이벤트 유형:</strong> 배틀(스타일 경쟁), 미션(착용 미션), 다수(일반 참여)</p>
          <p>• <strong>일정:</strong> 신발 구매 기간과 피드 업로드 기간 설정</p>
          <p>• <strong>상품 정보:</strong> 신발 관련 혜택을 구체적으로 명시</p>
          <p>• <strong>선정 기준:</strong> 스타일링, 사진 퀄리티, 창의성 등</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 제목 *</label>
            <input
              type="text"
              name="title"
              value={eventForm.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="예: 2024 스니커즈 스타일링 챌린지"
              required
            />
            <p className="text-xs text-gray-500 mt-1">신발과 관련된 매력적이고 참여하고 싶은 제목으로 작성해주세요</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 유형 *</label>
            <div className="flex gap-2">
              {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`px-4 py-2 rounded ${eventForm.type === type ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {getTypeText(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">최대 참여자 수 *</label>
          <input
            type="number"
            name="maxParticipants"
            value={eventForm.maxParticipants}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">신발 스타일링 이벤트에 참여할 수 있는 최대 인원수를 설정해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">구매 시작일 *</label>
            <input
              type="date"
              name="purchaseStartDate"
              value={eventForm.purchaseStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">구매 종료일 *</label>
            <input
              type="date"
              name="purchaseEndDate"
              value={eventForm.purchaseEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 시작일 *</label>
            <input
              type="date"
              name="eventStartDate"
              value={eventForm.eventStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 종료일 *</label>
            <input
              type="date"
              name="eventEndDate"
              value={eventForm.eventEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">발표일 *</label>
          <input
            type="date"
            name="announcement"
            value={eventForm.announcement}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">이벤트 설명 *</label>
          <textarea
            name="description"
            value={eventForm.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="신발 이벤트에 대한 자세한 설명을 입력하세요. 예시: 이번 이벤트는 구매한 신발을 착용하고 스타일링한 모습을 피드에 올리는 챌린지입니다. 참여자들은 신발과 어울리는 코디를 완성하고, 가장 스타일리시하고 창의적인 스타일링을 선보인 분들에게 특별한 신발 혜택을 제공합니다."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">참여 방법 *</label>
          <textarea
            name="participationMethod"
            value={eventForm.participationMethod}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="신발 이벤트 참여 방법을 자세히 설명하세요. 예시: 1) 이벤트 페이지에서 원하는 신발을 선택하고 구매합니다. 2) 구매한 신발을 착용하고 스타일링한 모습을 촬영합니다. 3) 신발과 어울리는 코디와 함께 피드에 업로드합니다. 4) 다른 참여자들의 스타일링에 좋아요를 눌러주세요. 5) 해시태그 #신발스타일링 #스니커즈챌린지 를 추가해주세요."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">상품 정보 *</label>
          <div className="space-y-3">
            {eventForm.rewards.map((reward, index) => (
              <div key={index} className="flex gap-3 items-start p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">{index + 1}등</span>
                    </div>
                  </div>
                  <textarea
                    value={reward.rewardValue}
                    onChange={(e) => handleRewardChange(index, 'rewardValue', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="보상 내용을 입력하세요 (예: 프리미엄 스니커즈 (가치 30만원) - 브랜드: Nike, 상품: Air Jordan 1)"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeReward(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                  disabled={eventForm.rewards.length <= 1}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addReward}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={eventForm.rewards.length >= 5}
            >
              <i className="fas fa-plus mr-2"></i>
              보상 추가 ({eventForm.rewards.length}/5)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">선정 기준 *</label>
          <textarea
            name="selectionCriteria"
            value={eventForm.selectionCriteria}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="신발 스타일링 선정 기준을 명확히 설명하세요. 예시: 1) 스타일링 퀄리티 (40%): 신발과 어울리는 완벽한 코디 2) 사진 퀄리티 (30%): 신발이 잘 보이는 고화질 사진 3) 창의성 (20%): 독창적이고 참신한 스타일링 4) 참여도 (10%): 다른 참여자들과의 상호작용 및 좋아요 수"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">주의사항 *</label>
          <textarea
            name="precautions"
            value={eventForm.precautions}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="신발 이벤트 참여 시 주의사항을 명시하세요. 예시: ⚠️ 이벤트 참여 시 반드시 구매한 신발만 착용해주세요. ⚠️ 신발이 잘 보이도록 촬영해주세요. ⚠️ 타인의 저작권을 침해하는 콘텐츠는 제외됩니다. ⚠️ 부정한 방법으로 참여한 경우 당첨이 취소될 수 있습니다. ⚠️ 이벤트 종료 후 7일 이내에 당첨자 발표가 진행됩니다."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">이벤트 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {eventForm.imagePreview && (
            <div className="mt-2">
              <div className="relative inline-block">
                <img 
                  src={eventForm.imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded border border-gray-300" 
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
              <p className="text-xs text-gray-500 mt-1">이미지를 제거하려면 X 버튼을 클릭하세요</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">권장 크기: 1200x600px, 최대 5MB (JPG, PNG, GIF)</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            이벤트 생성
          </button>
          <button
            type="button"
            onClick={() => navigate("/event-list")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreatePage;

