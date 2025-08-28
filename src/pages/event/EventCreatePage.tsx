import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  EventType, 
  EventStatus, 
  EventRewardGroup, 
  EventRewardDto 
} from "../../types/event";
import { getEventTypeText } from "../../utils/eventUtils";
import EventService from "../../api/eventService";

const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 이벤트 폼 상태
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'BATTLE' as EventType,
    purchaseStartDate: '',
    purchaseEndDate: '',
    eventStartDate: '',
    eventEndDate: '',
    announcementDate: '',
    description: '',
    participationMethod: '',
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
    ] as EventRewardGroup[],
    selectionCriteria: '',
    precautions: '',
    maxParticipants: 100,
    image: '',
    imageFile: null as File | null,
    imagePreview: ''
  });

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  // 이벤트 타입 선택 핸들러
  const handleTypeSelect = (type: EventType) => {
    setEventForm(prev => ({ ...prev, type }));
    
    // 이벤트 타입에 따라 기본 보상 설정
    if (type === 'RANKING') {
      setEventForm(prev => ({
        ...prev,
        type,
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
        ]
      }));
    } else if (type === 'BATTLE') {
      setEventForm(prev => ({
        ...prev,
        type,
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
            conditionValue: "participation",
            rewards: [
              { rewardType: "POINTS", rewardValue: 500, rewardDescription: "500 포인트" },
              { rewardType: "BADGE_POINTS", rewardValue: 20, rewardDescription: "20 뱃지점수" }
            ]
          }
        ]
      }));
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventForm(prev => ({ 
        ...prev, 
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // 보상 추가 핸들러
  const handleAddReward = (groupIndex: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((group, i) => 
        i === groupIndex 
          ? {
              ...group,
              rewards: [...group.rewards, {
                rewardType: "POINTS",
                rewardValue: 100,
                rewardDescription: "100 포인트"
              }]
            }
          : group
      )
    }));
  };

  // 보상 제거 핸들러
  const handleRemoveReward = (groupIndex: number, rewardIndex: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((group, i) => 
        i === groupIndex 
          ? {
              ...group,
              rewards: group.rewards.filter((_, j) => j !== rewardIndex)
            }
          : group
      )
    }));
  };

  // 보상 그룹 추가 핸들러
  const handleAddRewardGroup = () => {
    const newConditionValue = eventForm.type === 'RANKING' 
      ? (eventForm.rewards.length + 1).toString()
      : eventForm.rewards.length === 0 ? "1" : "participation";
    
    setEventForm(prev => ({
      ...prev,
      rewards: [...prev.rewards, {
        conditionValue: newConditionValue,
        rewards: [
          { rewardType: "POINTS", rewardValue: 100, rewardDescription: "100 포인트" }
        ]
      }]
    }));
  };

  // 보상 그룹 제거 핸들러
  const handleRemoveRewardGroup = (groupIndex: number) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== groupIndex)
    }));
  };

  // 보상 변경 핸들러
  const handleRewardChange = (groupIndex: number, rewardIndex: number, field: keyof EventRewardDto, value: any) => {
    setEventForm(prev => ({
      ...prev,
      rewards: prev.rewards.map((group, i) => 
        i === groupIndex 
          ? {
              ...group,
              rewards: group.rewards.map((reward, j) => 
                j === rewardIndex 
                  ? { ...reward, [field]: value }
                  : reward
              )
            }
          : group
      )
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.userType !== 'admin') {
      setError('관리자만 이벤트를 생성할 수 있습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('type', eventForm.type);
      formData.append('purchaseStartDate', eventForm.purchaseStartDate);
      formData.append('purchaseEndDate', eventForm.purchaseEndDate);
      formData.append('eventStartDate', eventForm.eventStartDate);
      formData.append('eventEndDate', eventForm.eventEndDate);
      formData.append('announcementDate', eventForm.announcementDate);
      formData.append('description', eventForm.description);
      formData.append('participationMethod', eventForm.participationMethod);
      formData.append('selectionCriteria', eventForm.selectionCriteria);
      formData.append('precautions', eventForm.precautions);
      formData.append('maxParticipants', eventForm.maxParticipants.toString());
      
      // 보상 데이터를 평면화하여 전송
      const flattenedRewards = eventForm.rewards.flatMap(group => 
        group.rewards.map(reward => ({
          conditionValue: group.conditionValue,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          rewardDescription: reward.rewardDescription
        }))
      );
      
      console.log('전송할 보상 데이터:', flattenedRewards);
      console.log('보상 데이터 JSON:', JSON.stringify(flattenedRewards));
      
      formData.append('rewards', JSON.stringify(flattenedRewards));

      if (eventForm.imageFile) {
        formData.append('image', eventForm.imageFile);
      }

      await EventService.createEvent(formData);
      
      setSuccess('이벤트가 성공적으로 생성되었습니다!');
      
      // 3초 후 이벤트 목록 페이지로 이동
      setTimeout(() => {
        navigate('/events');
      }, 3000);
      
    } catch (err: any) {
      console.error('이벤트 생성 실패:', err);
      setError(err.response?.data?.message || '이벤트 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 이벤트를 생성할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-4 animate-bounce">
            이벤트 생성
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            새로운 이벤트를 생성하고 참여자들에게 특별한 경험을 제공하세요
          </p>
        </div>

        {/* 성공/에러 메시지 */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 이벤트 생성 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* 기본 정보 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">기본 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 이벤트 제목 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이벤트 제목 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이벤트 제목을 입력하세요"
                  />
                </div>

                {/* 이벤트 타입 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이벤트 타입 *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('RANKING')}
                      className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                        eventForm.type === 'RANKING'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      랭킹
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('BATTLE')}
                      className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                        eventForm.type === 'BATTLE'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      배틀
                    </button>
                  </div>
                </div>

                {/* 최대 참여자 수 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    최대 참여자 수
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={eventForm.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 날짜 정보 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">날짜 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 구매 시작일 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    구매 시작일 *
                  </label>
                  <input
                    type="date"
                    name="purchaseStartDate"
                    value={eventForm.purchaseStartDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 구매 종료일 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    구매 종료일 *
                  </label>
                  <input
                    type="date"
                    name="purchaseEndDate"
                    value={eventForm.purchaseEndDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 이벤트 시작일 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이벤트 시작일 *
                  </label>
                  <input
                    type="date"
                    name="eventStartDate"
                    value={eventForm.eventStartDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 이벤트 종료일 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이벤트 종료일 *
                  </label>
                  <input
                    type="date"
                    name="eventEndDate"
                    value={eventForm.eventEndDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 발표일 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    발표일 *
                  </label>
                  <input
                    type="date"
                    name="announcementDate"
                    value={eventForm.announcementDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 정보</h2>
              
              <div className="space-y-6">
                {/* 이벤트 설명 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이벤트 설명 *
                  </label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이벤트에 대한 상세한 설명을 입력하세요"
                  />
                </div>

                {/* 참여 방법 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    참여 방법 *
                  </label>
                  <textarea
                    name="participationMethod"
                    value={eventForm.participationMethod}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이벤트 참여 방법을 설명하세요"
                  />
                </div>

                {/* 선정 기준 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    선정 기준
                  </label>
                  <textarea
                    name="selectionCriteria"
                    value={eventForm.selectionCriteria}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="우승자 선정 기준을 입력하세요"
                  />
                </div>

                {/* 주의사항 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    주의사항
                  </label>
                  <textarea
                    name="precautions"
                    value={eventForm.precautions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="참여자들이 알아야 할 주의사항을 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* 보상 정보 섹션 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">보상 정보</h2>
                {eventForm.type === 'RANKING' && (
                  <button
                    type="button"
                    onClick={handleAddRewardGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    보상 그룹 추가
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {eventForm.rewards.map((rewardGroup, groupIndex) => (
                  <div key={groupIndex} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {eventForm.type === 'RANKING' 
                          ? `${rewardGroup.conditionValue}등 보상`
                          : rewardGroup.conditionValue === '1' 
                            ? '우승자 보상'
                            : '참여자 보상'
                        }
                      </h3>
                      {eventForm.type === 'RANKING' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRewardGroup(groupIndex)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {rewardGroup.rewards.map((reward, rewardIndex) => (
                        <div key={rewardIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* 보상 유형 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                보상 유형
                              </label>
                              <select
                                value={reward.rewardType}
                                onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="POINTS">포인트</option>
                                <option value="BADGE_POINTS">뱃지점수</option>
                                <option value="DISCOUNT_COUPON">할인쿠폰</option>
                              </select>
                            </div>

                            {/* 보상 값 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                보상 값
                              </label>
                              <input
                                type="number"
                                value={reward.rewardValue}
                                onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardValue', parseInt(e.target.value))}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            {/* 보상 설명 */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                보상 설명
                              </label>
                              <input
                                type="text"
                                value={reward.rewardDescription}
                                onChange={(e) => handleRewardChange(groupIndex, rewardIndex, 'rewardDescription', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="보상에 대한 설명을 입력하세요"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveReward(groupIndex, rewardIndex)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              보상 제거
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => handleAddReward(groupIndex)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                      >
                        + 보상 추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">이벤트 이미지</h2>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {eventForm.imagePreview && (
                  <div className="mt-4">
                    <img
                      src={eventForm.imagePreview}
                      alt="이벤트 이미지 미리보기"
                      className="max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '생성 중...' : '이벤트 생성'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreatePage;
