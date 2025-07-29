import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Event, EventRanking, EventParticipant } from "../../types/types";

interface EventWithRanking extends Event {
  participantCount: number;
  rankings?: EventRanking[];
}

const EventResultPage = () => {
  const [events, setEvents] = useState<EventWithRanking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "UPCOMING" | "ONGOING" | "ENDED">("all");
  const [sortType, setSortType] = useState("latest");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithRanking | null>(null);
  const [selectedEventRankings, setSelectedEventRankings] = useState<EventRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이벤트 목록 조회
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          sort: sortType,
        };
        if (statusFilter !== "all") params.status = statusFilter;
        if (searchTerm) params.keyword = searchTerm;

        const res = await axiosInstance.get("/api/events/admin/results", { params });
        setEvents(res.data.content || res.data);
      } catch (err) {
        console.error("이벤트 결과 목록 조회 실패:", err);
        setError("이벤트 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchTerm, statusFilter, sortType]);

  // 특정 이벤트의 랭킹 조회
  const fetchEventRankings = async (eventId: number) => {
    try {
      const res = await axiosInstance.get(`/api/events/${eventId}/rankings`);
      setSelectedEventRankings(res.data);
    } catch (err) {
      console.error("이벤트 랭킹 조회 실패:", err);
      setSelectedEventRankings([]);
    }
  };

  // 결과 승인/반려 처리
  const handleRankingApproval = async (participantId: number, action: "approve" | "reject") => {
    try {
      await axiosInstance.put(`/api/events/participants/${participantId}/${action}`);
      if (selectedEvent) {
        await fetchEventRankings(selectedEvent.id);
      }
      alert(`${action === "approve" ? "승인" : "반려"}이 완료되었습니다.`);
    } catch (err) {
      console.error(`랭킹 ${action} 실패:`, err);
      alert(`${action === "approve" ? "승인" : "반려"} 처리에 실패했습니다.`);
    }
  };

  // 검색/필터/정렬
  let filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventDetail.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  filteredEvents = [...filteredEvents].sort((a, b) => {
    if (sortType === "latest") return b.id - a.id;
    if (sortType === "participants") return b.participantCount - a.participantCount;
    return 0;
  });

  const getStatusText = (status: Event["status"]) => {
    switch (status) {
      case "ONGOING": return "진행중";
      case "UPCOMING": return "예정";
      case "COMPLETED": return "완료";
      case "CANCELLED": return "취소";
      default: return "";
    }
  };

  const getTypeText = (type: Event["type"]) => {
    switch (type) {
      case "BATTLE": return "배틀";
      case "MISSION": return "미션";
      case "MULTIPLE": return "다수";
      default: return "";
    }
  };

  const openResultModal = async (event: EventWithRanking) => {
    setSelectedEvent(event);
    setShowResultModal(true);
    await fetchEventRankings(event.id);
  };

  const exportResults = async () => {
    try {
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

  const bulkApproval = async () => {
    if (!selectedEvent) return;
    try {
      await axiosInstance.put(`/api/events/${selectedEvent.id}/bulk-approval`);
      await fetchEventRankings(selectedEvent.id);
      alert("일괄 승인이 완료되었습니다.");
    } catch (err) {
      console.error("일괄 승인 실패:", err);
      alert("일괄 승인에 실패했습니다.");
    }
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
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={bulkApproval}
            disabled={!selectedEvent}
          >
            일괄 승인
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
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ENDED" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("ENDED")}>종료</button>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* 진행중/예정 이벤트 테이블 */}
      <h2 className="text-xl font-bold mb-4 mt-8">진행중/예정 이벤트</h2>
      <div className="bg-white shadow rounded-lg overflow-x-auto mb-8">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">이벤트명</th>
              <th className="px-4 py-2">유형</th>
              <th className="px-4 py-2">기간</th>
              <th className="px-4 py-2">참여자 수</th>
              <th className="px-4 py-2">상태</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.filter(e => e.status === "ONGOING" || e.status === "UPCOMING").map((event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={event.eventDetail.imageUrl} alt={event.eventDetail.title} className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium">{event.eventDetail.title}</span>
                </td>
                <td className="px-4 py-2">{getTypeText(event.type)}</td>
                <td className="px-4 py-2">{event.eventDetail.purchaseStartDate} ~ {event.eventDetail.purchaseEndDate}</td>
                <td className="px-4 py-2">{event.participantCount}명</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : event.status === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {getStatusText(event.status)}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-[#87CEEB] hover:underline" onClick={() => openResultModal(event)}>결과 보기</button>
                  <button className="text-red-500 hover:underline" onClick={() => setEvents(events.filter(e => e.id !== event.id))}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 종료된 이벤트 카드 */}
      <h2 className="text-xl font-bold mb-4 mt-8">종료된 이벤트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.filter(e => e.status === "COMPLETED").map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{event.eventDetail.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">종료</span>
              </div>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <p>기간: {event.eventDetail.purchaseStartDate} ~ {event.eventDetail.purchaseEndDate}</p>
                <p>참여자: {event.participantCount}명</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="text-[#87CEEB] hover:text-blue-400 text-sm" onClick={() => openResultModal(event)}>결과 보기</button>
            </div>
          </div>
        ))}
      </div>

      {/* 결과 모달 */}
      {showResultModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-8">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowResultModal(false)}>
              <i className="fas fa-times text-xl"></i>
            </button>
            <h2 className="text-2xl font-bold mb-4">이벤트 결과</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2">이벤트명: {selectedEvent.eventDetail.title}</h3>
              <p className="text-sm text-gray-500 mb-1">기간: {selectedEvent.eventDetail.purchaseStartDate} ~ {selectedEvent.eventDetail.purchaseEndDate}</p>
              <p className="text-sm text-gray-500 mb-1">참여자: {selectedEvent.participantCount}명</p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">순위표</h3>
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">순위</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">참여자 ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">득표수</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedEventRankings.map((ranking) => (
                    <tr key={ranking.rankingId} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{ranking.rankPosition}위</td>
                      <td className="px-4 py-2">참여자 #{ranking.participantId}</td>
                      <td className="px-4 py-2">{ranking.voteCount}</td>
                      <td className="px-4 py-2">
                        <button 
                          className="text-[#87CEEB] hover:text-blue-400 mr-2"
                          onClick={() => handleRankingApproval(ranking.participantId, "approve")}
                        >
                          승인
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRankingApproval(ranking.participantId, "reject")}
                        >
                          반려
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">관리자 메모</h3>
              <textarea className="w-full border border-gray-300 rounded p-2" rows={3} placeholder="이벤트 결과에 대한 메모를 입력하세요..." />
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-[#87CEEB] text-white rounded hover:bg-blue-400">결과 저장</button>
              <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50" onClick={() => setShowResultModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventResultPage;
