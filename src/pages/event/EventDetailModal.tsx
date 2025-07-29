import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EventDto } from '../../types/event';
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
    if (open && event?.id) {
      setLoading(true);
      setError(null);
      
      // 이미 event 객체가 있으면 그대로 사용, 없으면 API 호출
      if (event && Object.keys(event).length > 0) {
        setDetail(event);
        setLoading(false);
      } else {
        EventService.getEventById(event.id)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10 text-lg font-semibold">
        로딩 중...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10 text-red-500 text-lg font-semibold">
        {error}
      </div>
    </div>
  );
  
  if (!detail) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10 text-gray-700 text-lg font-semibold">
          상세 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const isAdmin = user?.userType === 'admin';

  const handleDelete = async () => {
    const eventId = detail?.id;
    if (!eventId) return;
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) return;
    try {
      await EventService.deleteEvent(eventId);
      alert('이벤트가 삭제되었습니다.');
      navigate('/event-list', { replace: true });
      window.location.reload(); // 강제 새로고침 추가
    } catch (err) {
      alert('이벤트 삭제에 실패했습니다.');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING': return '예정';
      case 'ONGOING': return '진행중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return '알 수 없음';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'BATTLE': return '배틀';
      case 'MISSION': return '미션';
      case 'MULTIPLE': return '다중';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BATTLE': return 'bg-purple-100 text-purple-800';
      case 'MISSION': return 'bg-orange-100 text-orange-800';
      case 'MULTIPLE': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col relative transition-all duration-300 overflow-hidden">
        {/* 이미지 + 버튼 */}
        <div className="relative">
          <img
            src={detail.imageUrl || '/placeholder-image.jpg'}
            alt={detail.title || '이벤트 이미지'}
            className="w-full h-72 object-cover rounded-t-2xl shadow-sm"
          />
          
          {/* 상태 및 타입 배지 */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detail.status)}`}>
              {getStatusText(detail.status)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(detail.type)}`}>
              {getTypeText(detail.type)}
            </span>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{detail.title}</h2>
          
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">최대 참여자</h3>
                <p className="text-lg font-semibold text-gray-900">{detail.maxParticipants}명</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">현재 참여자</h3>
                <p className="text-lg font-semibold text-gray-900">{detail.participantCount || 0}명</p>
              </div>
            </div>

            {/* 진행률 */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>참여율</span>
                <span>{Math.round(((detail.participantCount || 0) / detail.maxParticipants) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((detail.participantCount || 0) / detail.maxParticipants) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">이벤트 설명</h3>
              <p className="text-gray-700 leading-relaxed">{detail.description}</p>
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">구매 기간</h3>
                <p className="text-gray-700">
                  {formatDate(detail.purchaseStartDate)} ~ {formatDate(detail.purchaseEndDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">이벤트 기간</h3>
                <p className="text-gray-700">
                  {formatDate(detail.eventStartDate)} ~ {formatDate(detail.eventEndDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">발표일</h3>
                <p className="text-gray-700">{formatDate(detail.announcement)}</p>
              </div>
            </div>

            {/* 참여 방법 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">참여 방법</h3>
              <p className="text-gray-700 leading-relaxed">{detail.participationMethod}</p>
            </div>

            {/* 선정 기준 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">선정 기준</h3>
              <p className="text-gray-700 leading-relaxed">{detail.selectionCriteria}</p>
            </div>

            {/* 보상 정보 */}
            {detail.rewards && detail.rewards.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">보상 정보</h3>
                <div className="space-y-2">
                  {detail.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">{reward.conditionValue}등:</span>
                      <span className="text-gray-700">{reward.rewardValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">주의사항</h3>
              <p className="text-gray-700 leading-relaxed">{detail.precautions}</p>
            </div>
          </div>
        </div>

        {/* 관리자 버튼 */}
        {isAdmin && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (setEditingEvent) setEditingEvent(detail);
                  onClose();
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailModal; 