import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";
import { EventDto, EventUpdateRequestDto } from "../../types/event";
import EventService from "../../api/eventService";

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

function toDateString(str: string | undefined) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d as any)) return '';
  return d.toISOString().split('T')[0];
}

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
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

  // 도움말 표시 상태
  const [showHelp, setShowHelp] = useState({
    participationMethod: false,
    selectionCriteria: false,
    precautions: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
<<<<<<< HEAD
        console.log('Fetching event with ID:', id);
        const event = await EventService.getEventById(parseInt(id));
        
        console.log('Fetched event:', event);
        
        if (!event) {
          setError("이벤트를 찾을 수 없습니다.");
          return;
        }

        // EventDto를 EventForm으로 변환
        setEventForm({
          title: event.title || '',
          type: (event.type?.toUpperCase() as EventType) || 'BATTLE',
          purchaseStartDate: toDateString(event.purchaseStartDate),
          purchaseEndDate: toDateString(event.purchaseEndDate),
          eventStartDate: toDateString(event.eventStartDate),
          eventEndDate: toDateString(event.eventEndDate),
          announcement: toDateString(event.announcementDate),
          description: event.description || '',
          participationMethod: event.participationMethod || '',
          rewards: event.rewards ? event.rewards.map((reward: any) => ({
            conditionValue: reward.rank || reward.conditionType || "1",
            rewardValue: reward.reward || ''
          })) : [
            { conditionValue: "1", rewardValue: "프리미엄 스니커즈" },
            { conditionValue: "2", rewardValue: "트렌디한 운동화" },
            { conditionValue: "3", rewardValue: "스타일리시한 슈즈" }
          ],
          selectionCriteria: event.selectionCriteria || '',
          precautions: event.precautions || '',
          maxParticipants: event.maxParticipants || 100,
          image: event.imageUrl || '',
          imageFile: null,
          imagePreview: event.imageUrl || '/placeholder-image.jpg',
=======
        const res = await axiosInstance.get(`/api/events/${id}`);
        const event = res.data;
        // Flexible mapping for both eventDetail and direct event fields
        const detail = event.eventDetail || event;
        setForm({
          title: detail.title || event.title || '',
          type: (detail.type || event.type || 'BATTLE').toUpperCase(),
          purchaseStartDate: toDatetimeLocal(detail.purchaseStartDate),
          purchaseEndDate: toDatetimeLocal(detail.purchaseEndDate),
          eventStartDate: toDatetimeLocal(detail.eventStartDate),
          eventEndDate: toDatetimeLocal(detail.eventEndDate),
          announcement: toDatetimeLocal(detail.announcement || detail.announcementDate),
          description: detail.description || '',
          participationMethod: detail.participationMethod || '',
          rewards: detail.rewards || '',
          selectionCriteria: detail.selectionCriteria || '',
          precautions: detail.precautions || '',
          maxParticipants: detail.maxParticipants || event.maxParticipants || 100,
          image: detail.imageUrl || detail.image || '',
          imageFile: null,
          imagePreview: detail.imageUrl || detail.image || ''
>>>>>>> origin/develop
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
<<<<<<< HEAD
    setEventForm(prev => ({
=======
    setForm(prev => ({
>>>>>>> origin/develop
      ...prev,
      imageFile: null,
      imagePreview: ""
    }));
<<<<<<< HEAD
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
      rewards: [...prev.rewards, { conditionValue: "1", rewardValue: "" }]
    }));
  };

  const removeReward = (index: number) => {
    setEventForm(prev => {
      const newRewards = prev.rewards.filter((_, i) => i !== index);
      return {
        ...prev,
        rewards: newRewards
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
=======
>>>>>>> origin/develop
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
      setLoading(true);
<<<<<<< HEAD
      
      // 이미지 파일이 있는 경우와 없는 경우를 구분
      if (eventForm.imageFile) {
        // 이미지 파일이 있는 경우: multipart/form-data 사용
        const formData = new FormData();
        
        // 기본 필드들 추가
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
        
        // 이미지 파일 추가
        formData.append("image", eventForm.imageFile);

        console.log('Sending multipart update request to:', `/api/events/${id}/multipart`);
        
        const response = await axiosInstance.put(`/api/events/${id}/multipart`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log('API Response:', response.data);
        alert("이벤트가 성공적으로 수정되었습니다.");
        navigate("/event-list");
      } else {
        // 이미지 파일이 없는 경우: JSON 사용
        const eventData = {
          type: eventForm.type,
          title: eventForm.title,
          description: eventForm.description,
          participationMethod: eventForm.participationMethod,
          selectionCriteria: eventForm.selectionCriteria,
          precautions: eventForm.precautions,
          purchaseStartDate: eventForm.purchaseStartDate,
          purchaseEndDate: eventForm.purchaseEndDate,
          eventStartDate: eventForm.eventStartDate,
          eventEndDate: eventForm.eventEndDate,
          announcement: eventForm.announcement,
          maxParticipants: eventForm.maxParticipants,
          rewards: JSON.stringify(eventForm.rewards)  // 배열을 JSON 문자열로 직렬화
        };

        console.log('Sending JSON update request to:', `/api/events/${id}`);
        
        const response = await axiosInstance.put(`/api/events/${id}`, eventData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log('API Response:', response.data);
        alert("이벤트가 성공적으로 수정되었습니다.");
        navigate("/event-list");
      }
    } catch (error: any) {
      console.error("이벤트 수정 실패:", error);
      
      let errorMessage = "이벤트 수정에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage += `\n${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage += `\n${error.response.data.error}`;
      } else if (error.response?.data?.data?.message) {
        errorMessage += `\n${error.response.data.data.message}`;
      }
      
      alert(errorMessage);
=======
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("purchaseStartDate", form.purchaseStartDate);
      formData.append("purchaseEndDate", form.purchaseEndDate);
      formData.append("eventStartDate", form.eventStartDate);
      formData.append("eventEndDate", form.eventEndDate);
      formData.append("announcement", form.announcement);
      formData.append("description", form.description);
      formData.append("participationMethod", form.participationMethod);
      formData.append("rewards", form.rewards);
      formData.append("selectionCriteria", form.selectionCriteria);
      formData.append("precautions", form.precautions);
      formData.append("maxParticipants", form.maxParticipants.toString());
      
      if (form.imageFile) {
        formData.append("image", form.imageFile);
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
      alert(`이벤트 수정에 실패했습니다. ${error.response?.data?.message || ''}`);
>>>>>>> origin/develop
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">이벤트 정보를 불러오는 중...</p>
        </div>
=======
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">이벤트 정보를 불러오는 중...</span>
>>>>>>> origin/develop
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
<<<<<<< HEAD
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => navigate('/event-list')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
=======
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>>>>>>> origin/develop
          >
            이벤트 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
<<<<<<< HEAD
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이벤트 수정</h1>
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
=======
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
                value={form.title}
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
>>>>>>> origin/develop
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
<<<<<<< HEAD
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
                          {type === "BATTLE" ? "배틀" : type === "MISSION" ? "미션" : "랭킹"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {type === "BATTLE" ? "1:1 스타일 대결" : type === "MISSION" ? "주어진 미션 수행" : "최다 투표 랭킹 이벤트"}
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
=======
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      form.type === type
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
                value={form.description}
                onChange={handleChange}
                placeholder="이벤트에 대한 상세한 설명을 입력하세요"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {form.description.length}/1000
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
                  value={form.purchaseStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>>>>>>> origin/develop
                />
              </div>
              
              <div>
<<<<<<< HEAD
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
              
              {/* 도움말 버튼 */}
              <div className="mb-3">
                <button 
                  type="button" 
                  onClick={() => setShowHelp(prev => ({ ...prev, participationMethod: !prev.participationMethod }))}
                  className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  작성 팁 보기
                </button>
              </div>
              
              {/* 도움말 표시 */}
              {showHelp.participationMethod && (
                <div className="mb-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-200">
                  <p className="font-medium mb-2">📝 참여 방법 작성 팁:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 각 항목을 새로운 줄에 작성하세요</li>
                    <li>• 구체적이고 명확하게 작성하세요</li>
                    <li>• 단계별로 순서를 정해서 작성하세요</li>
                    <li>• 참여자가 쉽게 따라할 수 있도록 설명하세요</li>
                  </ul>
                </div>
              )}
              
              <textarea
                name="participationMethod"
                value={eventForm.participationMethod}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• 이벤트 페이지에서 신발을 선택하고 구매
• 구매한 신발을 착용하고 스타일링한 모습 촬영
• 피드에 업로드하고 해시태그 추가"
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
              
              {/* 도움말 버튼 */}
              <div className="mb-3">
                <button 
                  type="button" 
                  onClick={() => setShowHelp(prev => ({ ...prev, selectionCriteria: !prev.selectionCriteria }))}
                  className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  작성 팁 보기
                </button>
              </div>
              
              {/* 도움말 표시 */}
              {showHelp.selectionCriteria && (
                <div className="mb-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-200">
                  <p className="font-medium mb-2">📝 선정 기준 작성 팁:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 각 기준을 새로운 줄에 작성하세요</li>
                    <li>• 구체적인 평가 항목을 명시하세요</li>
                    <li>• 비율이나 가중치를 포함할 수 있습니다</li>
                    <li>• 공정하고 객관적인 기준으로 작성하세요</li>
                  </ul>
                </div>
              )}
              
              <textarea
                name="selectionCriteria"
                value={eventForm.selectionCriteria}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• 스타일링 퀄리티 (40%)
• 사진 퀄리티 (30%)
• 창의성 (20%)
• 참여도 (10%)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">주의사항 *</label>
              
              {/* 도움말 버튼 */}
              <div className="mb-3">
                <button 
                  type="button" 
                  onClick={() => setShowHelp(prev => ({ ...prev, precautions: !prev.precautions }))}
                  className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  작성 팁 보기
                </button>
              </div>
              
              {/* 도움말 표시 */}
              {showHelp.precautions && (
                <div className="mb-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-200">
                  <p className="font-medium mb-2">📝 주의사항 작성 팁:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 각 주의사항을 새로운 줄에 작성하세요</li>
                    <li>• 명확하고 구체적으로 작성하세요</li>
                    <li>• 참여자가 알아야 할 중요한 정보를 포함하세요</li>
                    <li>• 부정한 방법이나 제외 사항을 명시하세요</li>
                  </ul>
                </div>
              )}
              
              <textarea
                name="precautions"
                value={eventForm.precautions}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="• 동일한 아이템이 명확히 확인되지 않으면 제외
• 타인의 저작권을 침해하는 콘텐츠는 제외
• 부정한 방법으로 참여한 경우 당첨 취소"
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
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {loading ? "수정 중..." : "이벤트 수정"}
              </button>
            </div>
          </form>
        </div>
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 종료일 *
                </label>
                <input
                  type="datetime-local"
                  name="purchaseEndDate"
                  value={form.purchaseEndDate}
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
                  value={form.eventStartDate}
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
                  value={form.eventEndDate}
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
                  value={form.announcement}
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
                value={form.participationMethod}
                onChange={handleChange}
                placeholder="이벤트 참여 방법을 상세히 설명하세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 보상 정보 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보상 정보 *
              </label>
              <textarea
                name="rewards"
                value={form.rewards}
                onChange={handleChange}
                placeholder="이벤트 보상에 대해 설명하세요"
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
                value={form.selectionCriteria}
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
                value={form.precautions}
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
                value={form.maxParticipants}
                onChange={handleChange}
                min="1"
                max="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            {form.imagePreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={form.imagePreview}
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
>>>>>>> origin/develop
      </div>
    </div>
  );
};

export default EventEditPage;
