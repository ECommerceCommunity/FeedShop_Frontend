import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Event, EventRanking } from "../../types/types";
import { 
  EventResultDto, 
  EventResultDetailDto, 
  EventParticipantDto, 
  EventRankingDto, 
  BattleMatchDto 
} from "../../types/event";
import EventService from "../../api/eventService";

interface EventWithRanking extends Event {
  participantCount: number;
  rankings?: EventRanking[];
}

const EventResultPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventResultDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "UPCOMING" | "ONGOING" | "ENDED">("all");
  const [sortType, setSortType] = useState("latest");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResultDto | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<EventResultDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 이벤트 결과 목록 조회
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // 백엔드에서 이벤트 결과 목록 API가 없으므로 일반 이벤트 목록을 가져옴
        const params: any = {
          page: currentPage,
          size: 10,
          sort: sortType === "latest" ? "createdAt,desc" : "totalParticipants,desc",
        };
        if (statusFilter !== "all") params.status = statusFilter;
        if (searchTerm) params.keyword = searchTerm;

        // 일반 이벤트 목록을 가져와서 결과가 있는 이벤트만 필터링
        const response = await EventService.getAllEvents(params);
        const eventsWithResults: EventResultDto[] = [];
        
        // 각 이벤트에 대해 결과 존재 여부를 확인
        for (const event of response.content || []) {
          try {
            const resultDetail = await EventService.getEventResultDetail(event.eventId);
            if (resultDetail) {
              // EventDto를 EventResultDto로 변환
              const eventResult: EventResultDto = {
                eventId: event.eventId,
                eventTitle: event.title,
                eventType: event.type,
                eventStatus: event.status,
                eventStartDate: event.eventStartDate,
                eventEndDate: event.eventEndDate,
                totalParticipants: resultDetail.totalParticipants,
                totalFeeds: resultDetail.totalFeeds,
                isResultAnnounced: resultDetail.isResultAnnounced,
                announcementDate: resultDetail.announcementDate,
                createdAt: event.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              eventsWithResults.push(eventResult);
            }
          } catch (err) {
            // 결과가 없는 이벤트는 무시
            console.log(`이벤트 ${event.eventId}의 결과가 없습니다.`);
          }
        }
        
        setEvents(eventsWithResults);
        setTotalPages(Math.ceil(eventsWithResults.length / 10));
      } catch (err) {
        console.error("이벤트 결과 목록 조회 실패:", err);
        setError("이벤트 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchTerm, statusFilter, sortType, currentPage]);

  // 특정 이벤트의 결과 상세 조회
  const fetchEventResultDetail = async (eventId: number) => {
    try {
      const result = await EventService.getEventResultDetail(eventId);
      setSelectedEventDetail(result);
    } catch (err) {
      console.error("이벤트 결과 상세 조회 실패:", err);
      setSelectedEventDetail(null);
    }
  };

  // 이벤트 결과 발표
  const handleAnnounceResult = async (eventId: number) => {
    try {
      await EventService.announceEventResult(eventId);
      alert("이벤트 결과가 발표되었습니다.");
      // 목록 새로고침
      window.location.reload();
    } catch (err) {
      console.error("이벤트 결과 발표 실패:", err);
      alert("이벤트 결과 발표에 실패했습니다.");
    }
  };

  // 이벤트 결과 발표 취소
  const handleCancelAnnouncement = async (eventId: number) => {
    try {
      await EventService.cancelEventResultAnnouncement(eventId);
      alert("이벤트 결과 발표가 취소되었습니다.");
      // 목록 새로고침
      window.location.reload();
    } catch (err) {
      console.error("이벤트 결과 발표 취소 실패:", err);
      alert("이벤트 결과 발표 취소에 실패했습니다.");
    }
  };

  // 이벤트 결과 수동 마이그레이션
  const handleMigrateResult = async (eventId: number) => {
    try {
      await EventService.migrateEventResult(eventId);
      alert("이벤트 결과 마이그레이션이 완료되었습니다.");
      // 상세 정보 새로고침
      if (selectedEvent) {
        await fetchEventResultDetail(selectedEvent.eventId);
      }
    } catch (err) {
      console.error("이벤트 결과 마이그레이션 실패:", err);
      alert("이벤트 결과 마이그레이션에 실패했습니다.");
    }
  };

  // 검색/필터/정렬
  let filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || event.eventStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // 공통 유틸리티 함수로 분리 권장
  const getStatusText = (status: string) => {
    switch (status) {
      case "ONGOING": return "진행중";
      case "UPCOMING": return "예정";
      case "ENDED": return "완료";
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "BATTLE": return "배틀";
      case "MISSION": return "미션";
      case "MULTIPLE": return "랭킹";
      case "REVIEW": return "리뷰";
      case "CHALLENGE": return "챌린지";
      default: return type;
    }
  };

  const openResultModal = async (event: EventResultDto) => {
    setSelectedEvent(event);
    setShowResultModal(true);
    await fetchEventResultDetail(event.eventId);
  };

  const exportResults = async () => {
    try {
      // TODO: 백엔드 API 엔드포인트 확인 필요
      const res = await axiosInstance.get("/api/events/admin/export", {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("결과 내보내기 실패:", err);
      alert("결과 내보내기에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="p-5">
      {/* 상단 관리 버튼/필터 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">이벤트 결과 관리</h1>
          <p className="text-gray-500">이벤트 결과를 확인하고 관리할 수 있습니다</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-[#87CEEB] text-white rounded hover:bg-blue-400"
            onClick={exportResults}
          >
            결과 내보내기
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="이벤트명 검색"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <select
          value={sortType}
          onChange={e => setSortType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="participants">참여자순</option>
        </select>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("all")}>전체</button>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ONGOING" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("ONGOING")}>진행중</button>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "UPCOMING" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("UPCOMING")}>예정</button>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ENDED" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("ENDED")}>완료</button>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* 이벤트 결과 목록 테이블 */}
      <div className="bg-white shadow rounded-lg overflow-x-auto mb-8">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">이벤트명</th>
              <th className="px-4 py-2">유형</th>
              <th className="px-4 py-2">기간</th>
              <th className="px-4 py-2">참여자 수</th>
              <th className="px-4 py-2">피드 수</th>
              <th className="px-4 py-2">상태</th>
              <th className="px-4 py-2">결과 발표</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.eventId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <span className="font-medium">{event.eventTitle}</span>
                </td>
                <td className="px-4 py-2">{getTypeText(event.eventType)}</td>
                <td className="px-4 py-2">{formatDate(event.eventStartDate)} ~ {formatDate(event.eventEndDate)}</td>
                <td className="px-4 py-2">{event.totalParticipants}명</td>
                <td className="px-4 py-2">{event.totalFeeds}개</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.eventStatus === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : event.eventStatus === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {getStatusText(event.eventStatus)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {event.isResultAnnounced ? (
                    <span className="text-green-600 text-sm">발표됨</span>
                  ) : (
                    <span className="text-gray-500 text-sm">미발표</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-[#87CEEB] hover:underline" onClick={() => openResultModal(event)}>결과 보기</button>
                  {event.eventStatus === "ENDED" && !event.isResultAnnounced && (
                    <button 
                      className="text-green-600 hover:underline"
                      onClick={() => handleAnnounceResult(event.eventId)}
                    >
                      결과 발표
                    </button>
                  )}
                  {event.eventStatus === "ENDED" && event.isResultAnnounced && (
                    <button 
                      className="text-orange-600 hover:underline"
                      onClick={() => handleCancelAnnouncement(event.eventId)}
                    >
                      발표 취소
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-3 py-1">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}

      {/* 결과 모달 */}
      {showResultModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-8">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowResultModal(false)}>
              <i className="fas fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-bold mb-4">이벤트 결과 상세</h2>
            
            {/* 이벤트 기본 정보 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">이벤트 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>이벤트명:</strong> {selectedEvent.eventTitle}</p>
                  <p><strong>유형:</strong> {getTypeText(selectedEvent.eventType)}</p>
                  <p><strong>기간:</strong> {formatDate(selectedEvent.eventStartDate)} ~ {formatDate(selectedEvent.eventEndDate)}</p>
                </div>
                <div>
                  <p><strong>참여자 수:</strong> {selectedEvent.totalParticipants}명</p>
                  <p><strong>피드 수:</strong> {selectedEvent.totalFeeds}개</p>
                  <p><strong>결과 발표:</strong> {selectedEvent.isResultAnnounced ? "발표됨" : "미발표"}</p>
                </div>
              </div>
              
              {/* 관리 버튼들 */}
              <div className="mt-4 flex gap-2">
                {selectedEvent.eventStatus === "ENDED" && !selectedEvent.isResultAnnounced && (
                  <button 
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    onClick={() => handleAnnounceResult(selectedEvent.eventId)}
                  >
                    결과 발표
                  </button>
                )}
                {selectedEvent.eventStatus === "ENDED" && selectedEvent.isResultAnnounced && (
                  <button 
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                    onClick={() => handleCancelAnnouncement(selectedEvent.eventId)}
                  >
                    발표 취소
                  </button>
                )}
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  onClick={() => handleMigrateResult(selectedEvent.eventId)}
                >
                  결과 마이그레이션
                </button>
              </div>
            </div>

            {/* 참여자 목록 */}
            {selectedEventDetail && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">참여자 목록</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">사용자명</th>
                        <th className="px-3 py-2 text-left">참여 상태</th>
                        <th className="px-3 py-2 text-left">참여일</th>
                        <th className="px-3 py-2 text-left">피드 제목</th>
                        <th className="px-3 py-2 text-left">득표수</th>
                        <th className="px-3 py-2 text-left">순위</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedEventDetail.participants.map((participant) => (
                        <tr key={participant.participantId} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{participant.username}</td>
                          <td className="px-3 py-2">{participant.participationStatus}</td>
                          <td className="px-3 py-2">{formatDate(participant.participationDate)}</td>
                          <td className="px-3 py-2">{participant.feedTitle || "-"}</td>
                          <td className="px-3 py-2">{participant.voteCount || 0}</td>
                          <td className="px-3 py-2">{participant.rankPosition || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 배틀 매치 정보 (배틀 이벤트인 경우) */}
            {selectedEventDetail && selectedEventDetail.battleMatches && selectedEventDetail.battleMatches.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">배틀 매치 정보</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">참가자 1</th>
                        <th className="px-3 py-2 text-left">참가자 2</th>
                        <th className="px-3 py-2 text-left">승자</th>
                        <th className="px-3 py-2 text-left">매치 상태</th>
                        <th className="px-3 py-2 text-left">생성일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedEventDetail.battleMatches.map((match) => (
                        <tr key={match.battleMatchId} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{match.participant1Username}</td>
                          <td className="px-3 py-2">{match.participant2Username}</td>
                          <td className="px-3 py-2">{match.winnerUsername || "-"}</td>
                          <td className="px-3 py-2">{match.matchStatus}</td>
                          <td className="px-3 py-2">{formatDate(match.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50" onClick={() => setShowResultModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventResultPage;
