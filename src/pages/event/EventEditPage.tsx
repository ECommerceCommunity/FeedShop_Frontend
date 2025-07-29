import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";
import { EventDto, EventUpdateRequestDto, EventRewardDto } from "../../types/event";
import EventService from "../../api/eventService";

type FormState = {
  title: string;
  type: EventType;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcementDate: string;
  description: string;
  participationMethod: string;
  rewards: string; // UI에서는 문자열로 처리, API 호출 시 EventRewardDto[]로 변환
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  imageUrl: string;
  imageFile: File | null;
  imagePreview: string;
};

function toDateString(str: string | undefined) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d as any)) return '';
  return d.toISOString().split('T')[0];
}

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    title: "",
    type: "BATTLE",
    purchaseStartDate: "",
    purchaseEndDate: "",
    eventStartDate: "",
    eventEndDate: "",
    announcementDate: "",
    description: "",
    participationMethod: "",
    rewards: "",
    selectionCriteria: "",
    precautions: "",
    maxParticipants: 100,
    imageUrl: "",
    imageFile: null,
    imagePreview: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const event = await EventService.getEventById(parseInt(id));
        
        if (!event) {
          setError("이벤트를 찾을 수 없습니다.");
          return;
        }

        // EventDto를 FormState로 변환
        setForm({
          title: event.title || '',
          type: event.type || 'BATTLE',
          purchaseStartDate: toDateString(event.purchaseStartDate),
          purchaseEndDate: toDateString(event.purchaseEndDate),
          eventStartDate: toDateString(event.eventStartDate),
          eventEndDate: toDateString(event.eventEndDate),
          announcementDate: toDateString(event.announcement),
          description: event.description || '',
          participationMethod: event.participationMethod || '',
          rewards: EventService.stringifyRewards(event.rewards || []), // EventRewardDto[]를 문자열로 변환
          selectionCriteria: event.selectionCriteria || '',
          precautions: event.precautions || '',
          maxParticipants: event.maxParticipants || 100,
          imageUrl: event.imageUrl || '/placeholder-image.jpg',
          imageFile: null,
          imagePreview: event.imageUrl || '/placeholder-image.jpg',
        });
      } catch (err) {
        console.error("이벤트 정보 조회 실패:", err);
        setError("이벤트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: EventType) => {
    setForm(prev => ({ ...prev, type }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 날짜 검증
    const errors: string[] = [];
    
    if (!form.title || !form.description || !form.purchaseStartDate || !form.purchaseEndDate || !form.eventStartDate || !form.eventEndDate || !form.announcementDate || !form.participationMethod || !form.rewards || !form.selectionCriteria || !form.precautions) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 날짜 순서 검증
    if (new Date(form.purchaseStartDate) >= new Date(form.purchaseEndDate)) {
      errors.push("구매 시작일은 종료일보다 이전이어야 합니다.");
    }
    
    if (new Date(form.eventStartDate) >= new Date(form.eventEndDate)) {
      errors.push("이벤트 시작일은 종료일보다 이전이어야 합니다.");
    }

    // 새로운 날짜 규칙 검증
    if (new Date(form.purchaseEndDate) < new Date(form.eventStartDate)) {
      errors.push("구매 종료일은 이벤트 시작일보다 이전이어야 합니다.");
    }

    if (new Date(form.eventEndDate) <= new Date(form.purchaseEndDate)) {
      errors.push("이벤트 종료일은 구매 종료일 이후여야 합니다.");
    }

    if (new Date(form.eventEndDate) >= new Date(form.announcementDate)) {
      errors.push("결과 발표일은 이벤트 종료일 이후여야 합니다.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      setLoading(true);
      
      // rewards 문자열을 EventRewardDto[]로 변환
      const rewardsArray = EventService.parseRewardsString(form.rewards);
      
      // EventUpdateRequestDto 형식으로 전송
      const payload: EventUpdateRequestDto = {
        title: form.title,
        type: form.type,
        purchaseStartDate: form.purchaseStartDate,
        purchaseEndDate: form.purchaseEndDate,
        eventStartDate: form.eventStartDate,
        eventEndDate: form.eventEndDate,
        announcement: form.announcementDate,
        description: form.description,
        participationMethod: form.participationMethod,
        rewards: rewardsArray,
        selectionCriteria: form.selectionCriteria,
        precautions: form.precautions,
        maxParticipants: form.maxParticipants,
        imageUrl: form.imageUrl,
      };
      
      console.log('Sending update payload:', payload);
      await EventService.updateEvent(parseInt(id!), payload);
      alert("이벤트가 성공적으로 수정되었습니다.");
      navigate('/event-list');
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
        return "배틀 (스타일 경쟁)";
      case "MISSION":
        return "미션 (착용 미션)";
      case "MULTIPLE":
        return "다중 (일반 참여)";
      default:
        return "";
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
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => navigate('/event-list')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            이벤트 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">이벤트 수정</h1>
              <p className="mt-2 text-sm text-gray-600">
                이벤트 정보를 수정하고 업데이트하세요
              </p>
            </div>
            <button
              onClick={() => navigate('/event-list')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 제목 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 제목 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이벤트 제목을 입력하세요"
                  required
                />
              </div>

              {/* 이벤트 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 타입 *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                        form.type === type
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {getTypeText(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 최대 참여자 수 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 참여자 수 *
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={form.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">날짜 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 시작일 *
                </label>
                <input
                  type="date"
                  name="purchaseStartDate"
                  value={form.purchaseStartDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구매 종료일 *
                </label>
                <input
                  type="date"
                  name="purchaseEndDate"
                  value={form.purchaseEndDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 시작일 *
                </label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={form.eventStartDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 종료일 *
                </label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={form.eventEndDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발표일 *
                </label>
                <input
                  type="date"
                  name="announcementDate"
                  value={form.announcementDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">상세 정보</h2>
            
            <div className="space-y-6">
              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 설명 *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이벤트에 대한 상세한 설명을 입력하세요"
                  required
                />
              </div>

              {/* 참여 방법 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참여 방법 *
                </label>
                <textarea
                  name="participationMethod"
                  value={form.participationMethod}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이벤트 참여 방법을 상세히 설명하세요"
                  required
                />
              </div>

              {/* 선정 기준 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  선정 기준 *
                </label>
                <textarea
                  name="selectionCriteria"
                  value={form.selectionCriteria}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="당첨자 선정 기준을 입력하세요"
                  required
                />
              </div>

              {/* 주의사항 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주의사항 *
                </label>
                <textarea
                  name="precautions"
                  value={form.precautions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="참여 시 주의사항을 입력하세요"
                  required
                />
              </div>

              {/* 보상 정보 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보상 정보 *
                </label>
                <textarea
                  name="rewards"
                  value={form.rewards}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="각 줄에 하나씩 보상 정보를 입력하세요&#10;예시:&#10;1등: 10만원 상품권&#10;2등: 5만원 상품권&#10;3등: 3만원 상품권"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  각 줄에 하나씩 보상 정보를 입력하세요. 줄바꿈으로 구분됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">이미지</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이벤트 이미지
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {form.imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    미리보기
                  </label>
                  <img
                    src={form.imagePreview}
                    alt="이벤트 이미지 미리보기"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/event-list')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "수정 중..." : "이벤트 수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditPage;
