import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EventDto, EventReward } from '../../api/eventService';
import EventService from '../../api/eventService';

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
  setEditingEvent?: (event: EventDto) => void;
  setShowEditModal?: (show: boolean) => void;
  setEventToDelete?: (id: number) => void;
  setShowDeleteModal?: (show: boolean) => void;
}

// 날짜 포맷 함수 추가 (컴포넌트 상단)
function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d as any)) return '-';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  open,
  onClose,
  event,
  setEditingEvent,
  setShowEditModal,
  setEventToDelete,
  setShowDeleteModal,
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
        console.log('EventDetailModal - event 데이터:', event);
        console.log('EventDetailModal - announcementDate:', event.announcementDate);
        setDetail(event);
        setLoading(false);
      } else {
        EventService.getEventById(event.eventId)
          .then(eventData => {
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
      alert('이벤트가 삭제되었습니다.');
      onClose(); // 모달 닫기
      navigate('/events', { replace: true }); // 올바른 경로로 수정
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '이벤트 삭제에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING': return '예정';
      case 'ONGOING': return '진행중';
      case 'ENDED': return '종료';
      case 'CANCELLED': return '취소';
      default: return '알 수 없음';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'BATTLE': return '배틀';
      case 'MISSION': return '미션';
      case 'MULTIPLE': return '랭킹';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-600 text-white';
      case 'ONGOING': return 'bg-green-600 text-white';
      case 'ENDED': return 'bg-gray-600 text-white';
      case 'CANCELLED': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BATTLE': return 'bg-purple-600 text-white';
      case 'MISSION': return 'bg-orange-600 text-white';
      case 'MULTIPLE': return 'bg-pink-600 text-white';
      default: return 'bg-gray-600 text-white';
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
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm ${getStatusColor(detail.status)}`}>
              {getStatusText(detail.status)}
            </span>
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm ${getTypeColor(detail.type)}`}>
              {getTypeText(detail.type)}
            </span>
          </div>

          {/* 관리자 아이콘 - 오른쪽 상단 */}
          {isAdmin && (
            <div className="absolute top-6 right-20 flex gap-3">
              <button
                onClick={() => {
                  console.log('Edit button clicked for event ID:', detail.eventId);
                  console.log('Navigating to:', `/events/edit/${detail.eventId}`);
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
            {detail.rewards && Array.isArray(detail.rewards) && detail.rewards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">이벤트 혜택</h3>
                <div className="space-y-3">
                  {detail.rewards.map((reward: EventReward, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 px-6 py-4 rounded-2xl text-base font-semibold border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">{reward.rank || index + 1}등</span>
                        <span className="text-orange-600">{reward.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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