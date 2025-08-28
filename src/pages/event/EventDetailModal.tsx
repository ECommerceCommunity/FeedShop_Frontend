import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EventDto, EventModalProps, EventRewardDto, EventType, EventStatus } from '../../types/event';
import { formatDate, getEventTypeText, getEventStatusText, getEventTypeColor, getEventStatusColor } from '../../utils/eventUtils';
import EventService from '../../api/eventService';

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  open,
  onClose,
  event,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && event?.eventId) {
      setLoading(true);
      setError(null);
      
      // 이미 event 객체가 있으면 그대로 사용, 없으면 API 호출
      if (event && Object.keys(event).length > 0) {
        console.log('EventDetailModal - event data:', event);
        console.log('EventDetailModal - rewards:', event.rewards);
        setDetail(event);
        setLoading(false);
      } else {
        EventService.getEventById(event.eventId)
          .then(eventData => {
            console.log('EventDetailModal - API event data:', eventData);
            if (eventData) {
              console.log('EventDetailModal - API rewards:', eventData.rewards);
            }
            setDetail(eventData);
          })
          .catch(err => {
            setError('이벤트 상세 정보를 불러오지 못했습니다.');
          })
          .finally(() => setLoading(false));
      }
    } else {
      setDetail(null);
    }
  }, [open, event]);

  if (!open) return null;
  
  if (loading) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">로딩 중...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10">
        <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
  
  if (!detail) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10">
          <p className="text-gray-700 text-lg font-semibold">상세 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.userType === 'admin';

  const handleDelete = async () => {
    const eventId = detail?.eventId;
    if (!eventId) return;
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) return;
    try {
      await EventService.deleteEvent(eventId);
      alert('이벤트가 삭제되었습니다. 이벤트 목록 페이지로 이동합니다.');
      onClose(); // 모달 닫기
      
      // 삭제 성공 후 이벤트 목록 페이지로 이동 (메시지가 보인 후)
      setTimeout(() => {
        navigate('/events', { replace: true });
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '이벤트 삭제에 실패했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col relative transition-all duration-300 overflow-hidden">
        {/* 헤더 - 이미지 + 버튼 */}
        <div className="relative">
          <img
            src={detail.imageUrl || '/placeholder-image.jpg'}
            alt={detail.title || '이벤트 이미지'}
            className="w-full h-80 object-cover shadow-lg"
          />
          
          {/* 상태 및 타입 배지 */}
          <div className="absolute top-6 left-6 flex gap-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm ${getEventStatusColor(detail.status as EventStatus)}`}>
              {getEventStatusText(detail.status as EventStatus)}
            </span>
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm ${getEventTypeColor(detail.type as EventType)}`}>
              {getEventTypeText(detail.type as EventType)}
            </span>
          </div>

          {/* 관리자 아이콘 - 오른쪽 상단 */}
          {isAdmin && (
            <div className="absolute top-6 right-20 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/events/edit/${detail.eventId}`);
                }}
                className="p-3 text-white bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-all duration-200 shadow-lg"
                title="수정"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-3 text-white bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-all duration-200 shadow-lg"
                title="삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          {/* 닫기 버튼 - 오른쪽 상단 맨 끝 */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white bg-black/50 backdrop-blur-sm rounded-xl p-3 hover:bg-black/70 transition-all duration-200 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">{detail.title}</h2>
          
          <div className="space-y-8">
            {/* 설명 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">이벤트 설명</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{detail.description}</p>
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50">
                <h3 className="text-sm font-semibold text-blue-600 mb-2">구매 기간</h3>
                <p className="text-gray-900 font-medium">
                  {detail.purchaseStartDate && detail.purchaseEndDate 
                    ? `${formatDate(detail.purchaseStartDate)} ~ ${formatDate(detail.purchaseEndDate)}`
                    : detail.purchasePeriod || '기간 정보 없음'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50">
                <h3 className="text-sm font-semibold text-green-600 mb-2">이벤트 기간</h3>
                <p className="text-gray-900 font-medium">
                  {detail.eventStartDate && detail.eventEndDate 
                    ? `${formatDate(detail.eventStartDate)} ~ ${formatDate(detail.eventEndDate)}`
                    : detail.votePeriod || '기간 정보 없음'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50">
                <h3 className="text-sm font-semibold text-purple-600 mb-2">발표일</h3>
                <p className="text-gray-900 font-medium">
                  {detail.announcementDate ? formatDate(detail.announcementDate) : '발표일 미정'}
                </p>
              </div>
            </div>

            {/* 참여 방법 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">참여 방법</h3>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{detail.participationMethod}</p>
              </div>
            </div>

            {/* 이벤트 혜택 */}
            {(() => {
              // rewards 데이터 처리
              let rewardsData: EventRewardDto[] = [];
              
              if (detail.rewards) {
                if (Array.isArray(detail.rewards)) {
                  rewardsData = detail.rewards;
                } else if (typeof detail.rewards === 'string') {
                  try {
                    rewardsData = JSON.parse(detail.rewards);
                  } catch (e) {
                    console.error('Failed to parse rewards string:', e);
                  }
                }
              }
              
              console.log('Processed rewards data:', rewardsData);
              
              if (rewardsData && rewardsData.length > 0) {
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">이벤트 혜택</h3>
                    <div className="space-y-4">
                      {/* 보상을 조건별로 그룹화 */}
                      {(() => {
                        const groupedRewards: { [key: string]: EventRewardDto[] } = {};
                        rewardsData.forEach((reward: EventRewardDto) => {
                          const conditionValue = reward.conditionValue || '1';
                          if (!groupedRewards[conditionValue]) {
                            groupedRewards[conditionValue] = [];
                          }
                          groupedRewards[conditionValue].push(reward);
                        });

                        return Object.entries(groupedRewards).map(([conditionValue, rewards]) => (
                          <div key={conditionValue} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            {/* 조건 헤더 */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3">
                              <h4 className="text-white font-bold text-lg">
                                {detail.type === 'RANKING' 
                                  ? `${conditionValue}등 보상`
                                  : conditionValue === '1' 
                                    ? '우승자 보상'
                                    : conditionValue === 'participation'
                                      ? '참여자 보상'
                                      : `${conditionValue} 보상`
                                }
                              </h4>
                            </div>
                            
                            {/* 보상 목록 */}
                            <div className="p-6 space-y-3">
                              {rewards.map((reward: EventRewardDto, index: number) => (
                                <div key={index} className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-3 border border-orange-100">
                                  <div className="flex items-center gap-3">
                                    {/* 보상 유형 아이콘 */}
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                      {reward.rewardType === 'POINTS' && (
                                        <span className="text-orange-600 text-sm font-bold">💰</span>
                                      )}
                                      {reward.rewardType === 'BADGE_POINTS' && (
                                        <span className="text-orange-600 text-sm font-bold">🏆</span>
                                      )}
                                      {reward.rewardType === 'DISCOUNT_COUPON' && (
                                        <span className="text-orange-600 text-sm font-bold">🎫</span>
                                      )}
                                    </div>
                                    
                                    {/* 보상 정보 */}
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {reward.rewardType === 'POINTS' && `${reward.rewardValue} 포인트`}
                                        {reward.rewardType === 'BADGE_POINTS' && `${reward.rewardValue} 뱃지점수`}
                                        {reward.rewardType === 'DISCOUNT_COUPON' && `${reward.rewardValue}% 할인쿠폰`}
                                      </div>
                                      {reward.rewardDescription && (
                                        <div className="text-sm text-gray-600 mt-1">
                                          {reward.rewardDescription}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">이벤트 혜택</h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <p className="text-gray-600 text-center">보상 정보가 없습니다.</p>
                    </div>
                  </div>
                );
              }
            })()}

            {/* 선정 기준 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">선정 기준</h3>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{detail.selectionCriteria}</p>
              </div>
            </div>

            {/* 주의사항 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">주의사항</h3>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                <p className="text-red-700 leading-relaxed whitespace-pre-line text-base">{detail.precautions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 