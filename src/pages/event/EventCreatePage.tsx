import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleRewardChange = (index: number, field: keyof EventRewardRequestDto, value: string) => {
    setEventForm(prev => {
      const newRewards = prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
      );
      
      // conditionValue가 변경된 경우 순서 재조정
      if (field === 'conditionValue') {
        return {
          ...prev,
          rewards: newRewards.map((reward, i) => ({
            ...reward,
            conditionValue: String(i + 1)
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
      rewards: [...prev.rewards, { conditionValue: String(prev.rewards.length + 1), rewardValue: "" }]
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
          conditionValue: String(i + 1)
        }))
      };
    });
  };

  // 필수 필드 검증 함수
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
    
    // 폼 검증
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const formData = new FormData();
      
      // 기본 필드들 추가 (백엔드 DTO 필드명과 정확히 일치)
      formData.append("type", eventForm.type);
      formData.append("title", eventForm.title);
      formData.append("description", eventForm.description);
      formData.append("participationMethod", eventForm.participationMethod);
      formData.append("selectionCriteria", eventForm.selectionCriteria);
      formData.append("precautions", eventForm.precautions);
      formData.append("purchaseStartDate", eventForm.purchaseStartDate);
      formData.append("purchaseEndDate", eventForm.purchaseEndDate);
      formData.append("eventStartDate", eventForm.eventStartDate);
      formData.append("eventEndDate", eventForm.eventEndDate);
      formData.append("announcement", eventForm.announcement);
      formData.append("maxParticipants", eventForm.maxParticipants.toString());
      
      // 보상 정보를 JSON 문자열로 전송
      const rewardsJson = JSON.stringify(eventForm.rewards);
      formData.append("rewards", rewardsJson);
      
      // 이미지 파일 추가 (@RequestPart로 처리됨, required=false이므로 선택사항)
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
      
      // 에러 메시지 개선
      let errorMessage = "이벤트 생성에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage += `\n${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage += `\n${error.response.data.error}`;
      } else if (error.response?.data?.data?.message) {
        errorMessage += `\n${error.response.data.data.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE": return "배틀 (스타일 경쟁)";
      case "MISSION": return "미션 (착용 미션)";
      case "MULTIPLE": return "랭킹 (일반 참여)";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">새 이벤트 생성</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트명 *</label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="같은 신발, 다른 룩!"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 유형 *</label>
              <div className="grid grid-cols-3 gap-4">
                {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                      eventForm.type === type 
                        ? "bg-blue-50 border-blue-200 shadow-md" 
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      {type === "BATTLE" && (
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      )}
                      {type === "MISSION" && (
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                      )}
                      {type === "MULTIPLE" && (
                        <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {type === "BATTLE" ? "배틀" : type === "MISSION" ? "미션" : "다수"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {type === "BATTLE" ? "1:1 스타일 대결" : type === "MISSION" ? "주어진 미션 수행" : "다수 참여 이벤트"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">구매 시작일 *</label>
                <input
                  type="date"
                  name="purchaseStartDate"
                  value={eventForm.purchaseStartDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">구매 종료일 *</label>
                <input
                  type="date"
                  name="purchaseEndDate"
                  value={eventForm.purchaseEndDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 시작일 *</label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={eventForm.eventStartDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 종료일 *</label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={eventForm.eventEndDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">발표일 *</label>
              <input
                type="date"
                name="announcement"
                value={eventForm.announcement}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 설명 *</label>
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="동일 상품(예: 아디다스 운동화)을 각자 다르게 스타일링해서 올림 서로 다른 룩 비교 + 유저 투표로 베스트 코디상 선정"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">참여 방법 *</label>
              <textarea
                name="participationMethod"
                value={eventForm.participationMethod}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• '이번 주의 아이템' (예: 아디다스 슈퍼스타)을 착용한 코디 업로드&#10;• 다양한 스타일로 개성 표현&#10;• 유저 투표 및 좋아요로 우승자 선정"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 혜택 *</label>
              <div className="space-y-3">
                {eventForm.rewards.map((reward, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 border border-gray-200 rounded-xl">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">혜택 {index + 1}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">혜택 기준</label>
                          <select
                            value={reward.conditionValue}
                            onChange={(e) => handleRewardChange(index, 'conditionValue', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="1">1등</option>
                            <option value="2">2등</option>
                            <option value="3">3등</option>
                            <option value="participation">참여자</option>
                            <option value="voters">투표자수 TOP</option>
                            <option value="views">조회수 TOP</option>
                            <option value="likes">좋아요 TOP</option>
                            <option value="random">랜덤 추첨</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">혜택 수량</label>
                          <input
                            type="number"
                            value={reward.conditionValue === 'participation' || reward.conditionValue === 'voters' || reward.conditionValue === 'views' || reward.conditionValue === 'likes' || reward.conditionValue === 'random' ? '' : reward.conditionValue}
                            onChange={(e) => handleRewardChange(index, 'conditionValue', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="수량"
                            min="1"
                          />
                        </div>
                      </div>
                      <textarea
                        value={reward.rewardValue}
                        onChange={(e) => handleRewardChange(index, 'rewardValue', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="혜택 내용을 입력하세요 (예: 프리미엄 스니커즈, 상품권, 할인쿠폰 등)"
                        rows={2}
                        required
                      />
                    </div>
                    <button
                  type="button"
                  onClick={() => removeReward(index)}
                  className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  disabled={eventForm.rewards.length <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReward}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 border border-blue-200"
                  disabled={eventForm.rewards.length >= 5}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  혜택 추가 ({eventForm.rewards.length}/5)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">선정 기준 *</label>
              <textarea
                name="selectionCriteria"
                value={eventForm.selectionCriteria}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• 스타일 창의성&#10;• 유저 투표&#10;• 운영진 평가"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">주의사항 *</label>
              <textarea
                name="precautions"
                value={eventForm.precautions}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• 동일한 아이템이 명확히 확인되지 않으면 제외될 수 있음"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">이벤트 이미지</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">클릭하여 이미지 업로드</p>
                    <p className="text-xs text-gray-500 mt-1">또는 이미지를 여기로 드래그하세요</p>
                  </div>
                </label>
              </div>
              {eventForm.imagePreview && (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={eventForm.imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200" 
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
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">권장 크기: 1200 x 600px, 최대 5MB</p>
            </div>

            <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/event-list")}
                className="flex items-center gap-2 px-6 py-3 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                뒤로가기
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                이벤트 생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage;

