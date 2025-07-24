import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: any | null;
  setEditingEvent?: (event: any) => void;
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
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && event?.id) {
      setLoading(true);
      setError(null);
      axiosInstance.get(`/api/events/${event.id}`)
        .then(res => {
          setDetail(res.data)
        })
        .catch(err => {
          setError('이벤트 상세 정보를 불러오지 못했습니다.');
        })
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [open, event]);

  if (!open) return null;
  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10 text-lg font-semibold">로딩 중...</div>
    </div>
  );
  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative items-center justify-center p-10 text-red-500 text-lg font-semibold">{error}</div>
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
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {/* (edit/delete/close icons remain unchanged) */}
            {isAdmin && (
              <>
                <button
                  className="text-gray-700 hover:text-[#87CEEB] transition-colors cursor-pointer"
                  onClick={() => {
                    const eventId = detail?.id || detail?.eventId;
                    if (eventId) {
                      navigate(`/events/edit/${eventId}`);
                    }
                  }}
                  aria-label="수정"
                >
                  <i className="fas fa-edit text-xl"></i>
                </button>
                <button
                  className="text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setEventToDelete && setEventToDelete(detail.id);
                    setShowDeleteModal && setShowDeleteModal(true);
                  }}
                  aria-label="삭제"
                >
                  <i className="fas fa-trash-alt text-xl"></i>
                </button>
              </>
            )}
            <button
              className="bg-white text-gray-500 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
              onClick={onClose}
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        </div>
        {/* 스크롤 가능한 내용 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-8 md:p-10">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-0 text-gray-900 truncate" style={{lineHeight:1.2}}>{detail.title || '제목 없음'}</h1>
            {detail.type && (
              <span className="text-[#87CEEB] text-sm font-semibold ml-1" style={{whiteSpace: 'nowrap', letterSpacing: '0.02em'}}>
                {detail.type === 'MULTIPLE' ? '다수' : detail.type === 'MISSION' ? '미션' : detail.type === 'BATTLE' ? '배틀' : detail.type}
              </span>
            )}
          </div>
          <p className="text-[#222] mb-6 text-base leading-relaxed line-clamp-3" style={{display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{detail.description || '설명 없음'}</p>
          {/* 기간 표시 영역 */}
          <div className="flex flex-row gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 flex-1 min-w-[180px] shadow border border-gray-100 flex flex-col justify-center">
              <div className="text-[#87CEEB] text-xs mb-1 font-semibold">참여 기간</div>
              <div className="text-sm font-bold text-gray-900 flex items-center">
                <span>{formatDate(detail.purchaseStartDate)}</span>
                <span className="mx-1 text-[#87CEEB] text-lg font-extrabold">~</span>
                <span>{formatDate(detail.purchaseEndDate)}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 flex-1 min-w-[180px] shadow border border-gray-100 flex flex-col justify-center">
              <div className="text-[#87CEEB] text-xs mb-1 font-semibold">투표 기간</div>
              <div className="text-sm font-bold text-gray-900 flex items-center">
                <span>{formatDate(detail.eventStartDate)}</span>
                <span className="mx-1 text-[#87CEEB] text-lg font-extrabold">~</span>
                <span>{formatDate(detail.eventEndDate)}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 flex-1 min-w-[180px] shadow border border-gray-100 flex flex-col justify-center">
              <div className="text-[#87CEEB] text-xs mb-1 font-semibold">발표일</div>
              <div className="text-sm font-bold text-gray-900 flex items-center">
                <span>{formatDate(detail.announcementDate)}</span>
              </div>
            </div>
          </div>
          {/* 혜택, 참여방법, 주의사항 카드형 섹션 */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#87CEEB]"><span className="text-xl">🎁</span>이벤트 혜택</h3>
            <div className="bg-white rounded-xl p-4 text-[#222] whitespace-pre-line shadow border border-gray-100">
              {Array.isArray(detail.rewards) && detail.rewards.length > 0 ? (
                detail.rewards.map((r: any, idx: number) => {
                  let medal = '';
                  if (r.rank === 1) medal = '🥇 ';
                  else if (r.rank === 2) medal = '🥈 ';
                  else if (r.rank === 3) medal = '🥉 ';
                  return (
                    <div key={idx} className="mb-1">
                      {medal}
                      {r.rank ? `${r.rank}등: ` : ''}
                      {r.reward}
                      {r.rewardType ? ` (${r.rewardType})` : ''}
                      {r.maxRecipients ? ` (최대 ${r.maxRecipients}명)` : ''}
                    </div>
                  );
                })
              ) : typeof detail.rewards === 'string' && detail.rewards.trim() ? (
                detail.rewards.split(/\n|,|\r/).map((line: string, idx: number) => {
                  let text = line.trim();
                  if (!text) return null;
                  if (text.includes('1등')) text = '🥇 ' + text;
                  else if (text.includes('2등')) text = '🥈 ' + text;
                  else if (text.includes('3등')) text = '🥉 ' + text;
                  return <div key={idx} className="mb-1">{text}</div>;
                })
              ) : (
                '혜택 정보 없음'
              )}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#87CEEB]"><span className="text-xl">📝</span>참여 방법</h3>
            <div className="bg-white rounded-xl p-4 text-[#222] whitespace-pre-line shadow border border-gray-100">{detail.participationMethod || '참여 방법 정보 없음'}</div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#87CEEB]"><span className="text-xl">⚠️</span>주의사항</h3>
            <div className="bg-white rounded-xl p-4 text-[#222] whitespace-pre-line shadow border border-gray-100">{detail.precautions || '주의사항 정보 없음'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 