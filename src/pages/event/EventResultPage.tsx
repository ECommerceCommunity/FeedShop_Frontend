import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  EventDto, 
  EventResultResponseDto, 
  EventResultDetailResponseDto,
  RewardProcessResult,
  EventStatus,
  EventType
} from "../../types/event";
import { formatDate, getEventTypeText, getEventStatusText } from "../../utils/eventUtils";
import EventService from "../../api/eventService";

const EventResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventResults, setEventResults] = useState<EventResultResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
  const [selectedResult, setSelectedResult] = useState<EventResultResponseDto | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [processingReward, setProcessingReward] = useState(false);
  const [rewardResult, setRewardResult] = useState<RewardProcessResult | null>(null);

  // 종료된 이벤트 목록 조회
  useEffect(() => {
    const fetchEndedEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await EventService.getAllEvents({
          page: 0,
          size: 100,
          status: "ENDED"
        });
        
        const endedEvents = response.content || [];
        setEvents(endedEvents);
        
        // 각 이벤트의 결과 존재 여부 확인
        const resultsWithData: EventResultResponseDto[] = [];
        for (const event of endedEvents) {
          try {
            const hasResult = await EventService.hasEventResult(event.eventId);
            if (hasResult) {
              const result = await EventService.getEventResult(event.eventId);
              resultsWithData.push(result);
            }
          } catch (err) {
            
          }
        }
        setEventResults(resultsWithData);
        
      } catch (err) {
        console.error("종료된 이벤트 조회 실패:", err);
        // 에러가 발생해도 빈 배열로 설정하여 페이지 형태는 유지
        setEvents([]);
        setEventResults([]);
        setError(null); // 에러 메시지 숨김
      } finally {
        setLoading(false);
      }
    };

    fetchEndedEvents();
  }, []);

  // 이벤트 결과 생성
  const handleCreateResult = async (eventId: number) => {
    try {
      setLoading(true);
      await EventService.announceEventResult(eventId);
      alert("이벤트 결과가 성공적으로 생성되었습니다.");
      
      // 결과 목록 새로고침
      const result = await EventService.getEventResult(eventId);
      setEventResults(prev => [...prev, result]);
      
    } catch (err: any) {
      console.error("이벤트 결과 생성 실패:", err);
      alert(err.response?.data?.message || "이벤트 결과 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 이벤트 결과 재계산
  const handleRecalculateResult = async (eventId: number) => {
    try {
      setLoading(true);
      await EventService.recalculateEventResult(eventId);
      alert("이벤트 결과가 성공적으로 재계산되었습니다.");
      
      // 결과 목록 새로고침
      const result = await EventService.getEventResult(eventId);
      setEventResults(prev => prev.map(r => r.eventId === eventId ? result : r));
      
    } catch (err: any) {
      console.error("이벤트 결과 재계산 실패:", err);
      alert(err.response?.data?.message || "이벤트 결과 재계산에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 보상 지급 처리
  const handleProcessRewards = async (eventId: number) => {
    try {
      setProcessingReward(true);
      const result = await EventService.processEventRewards(eventId);
      setRewardResult(result);
      setShowRewardModal(true);
      
      // 결과 목록 새로고침
      const updatedResult = await EventService.getEventResult(eventId);
      setEventResults(prev => prev.map(r => r.eventId === eventId ? updatedResult : r));
      
    } catch (err: any) {
      console.error("보상 지급 실패:", err);
      alert(err.response?.data?.message || "보상 지급에 실패했습니다.");
    } finally {
      setProcessingReward(false);
    }
  };

  // 특정 참여자 보상 재지급
  const handleReprocessParticipantReward = async (eventId: number, userId: number) => {
    try {
      await EventService.reprocessParticipantReward(eventId, userId);
      alert("참여자 보상이 성공적으로 재지급되었습니다.");
      
      // 결과 목록 새로고침
      const updatedResult = await EventService.getEventResult(eventId);
      setEventResults(prev => prev.map(r => r.eventId === eventId ? updatedResult : r));
      
    } catch (err: any) {
      console.error("참여자 보상 재지급 실패:", err);
      alert(err.response?.data?.message || "참여자 보상 재지급에 실패했습니다.");
    }
  };

  // 이벤트 결과 상세 보기
  const handleViewResult = async (event: EventDto) => {
    try {
      const result = await EventService.getEventResult(event.eventId);
      setSelectedEvent(event);
      setSelectedResult(result);
      setShowResultModal(true);
    } catch (err) {
      console.error("이벤트 결과 조회 실패:", err);
      alert("이벤트 결과를 불러오지 못했습니다.");
    }
  };

  // 이벤트에 결과가 있는지 확인
  const hasResult = (eventId: number) => {
    return eventResults.some(result => result.eventId === eventId);
  };

  // 이벤트 결과 가져오기
  const getEventResult = (eventId: number) => {
    return eventResults.find(result => result.eventId === eventId);
  };

  if (!user || user.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 이벤트 결과를 관리할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent mb-4 animate-bounce">
            이벤트 결과 관리
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            종료된 이벤트의 결과를 확인하고 보상을 지급하세요
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-white text-lg">로딩 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 이벤트 목록 */}
        {!loading && !error && (
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">종료된 이벤트가 없습니다</h3>
                    <p className="text-gray-600">현재 관리할 수 있는 종료된 이벤트가 없습니다.</p>
                  </div>
                  
                  {/* 기능 안내 섹션 */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">이벤트 결과 관리 기능</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">결과 생성</h5>
                          <p className="text-gray-600 text-xs">이벤트 종료 후 결과를 생성합니다</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">결과 보기</h5>
                          <p className="text-gray-600 text-xs">생성된 결과를 상세히 확인합니다</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">재계산</h5>
                          <p className="text-gray-600 text-xs">결과를 다시 계산합니다</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">보상 지급</h5>
                          <p className="text-gray-600 text-xs">참여자에게 보상을 지급합니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 새로고침 버튼 */}
                  <div className="mt-6">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      새로고침
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              events.map((event) => {
                const result = getEventResult(event.eventId);
                return (
                  <div key={event.eventId} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.type === 'RANKING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {getEventTypeText(event.type as EventType)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              {getEventStatusText(event.status as EventStatus)}
                            </span>
                            <span>종료일: {formatDate(event.eventEndDate)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {!hasResult(event.eventId) ? (
                            <button
                              onClick={() => handleCreateResult(event.eventId)}
                              disabled={loading}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              결과 생성
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleViewResult(event)}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                              >
                                결과 보기
                              </button>
                              <button
                                onClick={() => handleRecalculateResult(event.eventId)}
                                disabled={loading}
                                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
                              >
                                재계산
                              </button>
                              <button
                                onClick={() => handleProcessRewards(event.eventId)}
                                disabled={processingReward}
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
                              >
                                {processingReward ? '처리중...' : '보상 지급'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {result && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">총 참여자:</span>
                              <span className="ml-2 text-gray-900">{result.totalParticipants}명</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">총 투표수:</span>
                              <span className="ml-2 text-gray-900">{result.totalVotes}표</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">발표일:</span>
                              <span className="ml-2 text-gray-900">{formatDate(result.announcedAt)}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">보상 지급:</span>
                              <span className={`ml-2 ${result.resultDetails.some(d => d.rewardProcessed) ? 'text-green-600' : 'text-orange-600'}`}>
                                {result.resultDetails.some(d => d.rewardProcessed) ? '완료' : '대기중'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 결과 상세 모달 */}
      {showResultModal && selectedEvent && selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title} - 결과 상세</h2>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 내용 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* 결과 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">총 참여자</h3>
                    <p className="text-2xl font-bold text-blue-700">{selectedResult.totalParticipants}명</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-900 mb-2">총 투표수</h3>
                    <p className="text-2xl font-bold text-green-700">{selectedResult.totalVotes}표</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-purple-900 mb-2">발표일</h3>
                    <p className="text-lg font-semibold text-purple-700">{formatDate(selectedResult.announcedAt)}</p>
                  </div>
                </div>

                {/* 참여자 결과 목록 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">참여자 결과</h3>
                  <div className="space-y-3">
                    {selectedResult.resultDetails.map((detail, index) => (
                      <div key={detail.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{detail.userName}</h4>
                              <p className="text-sm text-gray-600">{detail.feedTitle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{detail.voteCount}표</p>
                            <p className="text-sm text-gray-600">{detail.rankPosition}등</p>
                          </div>
                        </div>
                        
                        {/* 보상 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-white p-3 rounded-lg">
                            <span className="font-semibold text-gray-700">포인트:</span>
                            <span className="ml-2 text-gray-900">{detail.pointsEarned}점</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <span className="font-semibold text-gray-700">뱃지점수:</span>
                            <span className="ml-2 text-gray-900">{detail.badgePointsEarned}점</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <span className="font-semibold text-gray-700">쿠폰:</span>
                            <span className="ml-2 text-gray-900">{detail.couponDescription || '없음'}</span>
                          </div>
                        </div>
                        
                        {/* 보상 지급 상태 */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${
                              detail.rewardProcessed ? 'bg-green-500' : 'bg-orange-500'
                            }`}></span>
                            <span className={`text-sm font-semibold ${
                              detail.rewardProcessed ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {detail.rewardProcessed ? '보상 지급 완료' : '보상 지급 대기중'}
                            </span>
                          </div>
                          
                          {!detail.rewardProcessed && (
                            <button
                              onClick={() => handleReprocessParticipantReward(selectedResult.eventId, detail.userId)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              보상 재지급
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 보상 지급 결과 모달 */}
      {showRewardModal && rewardResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">보상 지급 결과</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-900 mb-2">성공</h3>
                    <p className="text-2xl font-bold text-green-700">{rewardResult.successfulRewards}건</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-red-900 mb-2">실패</h3>
                    <p className="text-2xl font-bold text-red-700">{rewardResult.failedRewards}건</p>
                  </div>
                </div>
                
                {rewardResult.failedRewards > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">실패한 보상</h3>
                    <div className="space-y-2">
                      {rewardResult.rewardDetails
                        .filter(detail => !detail.success)
                        .map((detail, index) => (
                          <div key={index} className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-700">
                              사용자 ID {detail.userId} ({detail.rankPosition}등): {detail.message}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRewardModal(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventResultPage;
