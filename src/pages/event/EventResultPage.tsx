import { useState } from "react";

interface Event {
  id: number;
  title: string;
  type: "battle" | "mission" | "multiple";
  status: "upcoming" | "ongoing" | "ended";
  purchasePeriod: string;
  votePeriod: string;
  announcementDate: string;
  participantCount: number;
  rewards: { rank: number; reward: string }[];
  image: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: "여름 스타일 챌린지",
    type: "battle",
    status: "ongoing",
    purchasePeriod: "2025.06.25 - 2025.07.07",
    votePeriod: "2025.07.08 - 2025.07.14",
    announcementDate: "2025.07.15",
    participantCount: 150,
    rewards: [
      { rank: 1, reward: "100만원 상당의 브랜드 상품권" },
      { rank: 2, reward: "50만원 상당의 브랜드 상품권" },
      { rank: 3, reward: "30만원 상당의 브랜드 상품권" }
    ],
    image: "https://readdy.ai/api/search-image?query=summer%20fashion%20collection%20display%20with%20bright%20colors%20and%20modern%20aesthetic&width=800&height=400&seq=event1&orientation=landscape",
  },
  {
    id: 2,
    title: "봄 패션 위크",
    type: "mission",
    status: "ended",
    purchasePeriod: "2025.05.01 - 2025.05.15",
    votePeriod: "2025.05.16 - 2025.05.22",
    announcementDate: "2025.05.23",
    participantCount: 300,
    rewards: [
      { rank: 1, reward: "럭셔리 브랜드 가방" },
      { rank: 2, reward: "디자이너 의류 세트" },
      { rank: 3, reward: "뷰티 제품 세트" }
    ],
    image: "https://readdy.ai/api/search-image?query=spring%20fashion%20collection%20display%20with%20soft%20pastel%20colors%20and%20modern%20aesthetic&width=800&height=400&seq=event3&orientation=landscape",
  },
  {
    id: 3,
    title: "가을 트렌드 페스티벌",
    type: "multiple",
    status: "upcoming",
    purchasePeriod: "2025.08.01 - 2025.08.15",
    votePeriod: "2025.08.16 - 2025.08.22",
    announcementDate: "2025.08.23",
    participantCount: 0,
    rewards: [
      { rank: 1, reward: "100만원 상당 브랜드 상품권" },
      { rank: 2, reward: "30만원 상당 브랜드 상품권" },
      { rank: 3, reward: "10만원 상당 브랜드 상품권" }
    ],
    image: "https://readdy.ai/api/search-image?query=autumn%20fashion%20event%20promotional%20image%20with%20warm%20colors%20showing%20cozy%20outfits%20and%20fall%20vibes&width=800&height=400&seq=event2&orientation=landscape",
  },
  {
    id: 4,
    title: "겨울 패딩 페스타",
    type: "battle",
    status: "ended",
    purchasePeriod: "2024.12.01 - 2024.12.15",
    votePeriod: "2024.12.16 - 2024.12.22",
    announcementDate: "2024.12.23",
    participantCount: 210,
    rewards: [
      { rank: 1, reward: "프리미엄 패딩" },
      { rank: 2, reward: "10만원 상품권" },
      { rank: 3, reward: "5만원 상품권" }
    ],
    image: "https://readdy.ai/api/search-image?query=winter%20fashion%20event%20promotional%20image%20with%20cozy%20outfits%20and%20snowy%20background&width=800&height=400&seq=event4&orientation=landscape",
  },
];

const sampleRanking = [
  { rank: 1, username: "패션러버1", votes: 234, status: "승인대기" },
  { rank: 2, username: "스타일킹", votes: 189, status: "승인완료" },
  { rank: 3, username: "미니멀리스트", votes: 156, status: "승인대기" },
  { rank: 4, username: "트렌드세터", votes: 120, status: "승인대기" },
  { rank: 5, username: "코디장인", votes: 98, status: "승인완료" },
];

const EventResultPage = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "upcoming" | "ended">("all");
  const [sortType, setSortType] = useState("latest");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // 검색/필터/정렬
  let filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
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
      case "ongoing": return "진행중";
      case "upcoming": return "예정";
      case "ended": return "종료";
      default: return "";
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
          <button className="px-4 py-2 bg-[#87CEEB] text-white rounded hover:bg-blue-400">결과 내보내기</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">일괄 승인</button>
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
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ongoing" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("ongoing")}>진행중</button>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "upcoming" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("upcoming")}>예정</button>
        <button className={`px-4 py-2 rounded-lg font-medium ${statusFilter === "ended" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`} onClick={() => setStatusFilter("ended")}>종료</button>
      </div>

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
            {filteredEvents.filter(e => e.status === "ongoing" || e.status === "upcoming").map((event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium">{event.title}</span>
                </td>
                <td className="px-4 py-2">{event.type === "battle" ? "배틀" : event.type === "mission" ? "미션" : "다수"}</td>
                <td className="px-4 py-2">{event.purchasePeriod}</td>
                <td className="px-4 py-2">{event.participantCount}명</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === "ongoing"
                      ? "bg-green-100 text-green-700"
                      : event.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {getStatusText(event.status)}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-[#87CEEB] hover:underline" onClick={() => { setSelectedEvent(event); setShowResultModal(true); }}>결과 보기</button>
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
        {filteredEvents.filter(e => e.status === "ended").map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">종료</span>
              </div>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <p>기간: {event.purchasePeriod}</p>
                <p>참여자: {event.participantCount}명</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="text-[#87CEEB] hover:text-blue-400 text-sm" onClick={() => { setSelectedEvent(event); setShowResultModal(true); }}>결과 보기</button>
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
              <h3 className="font-medium mb-2">이벤트명: {selectedEvent.title}</h3>
              <p className="text-sm text-gray-500 mb-1">기간: {selectedEvent.purchasePeriod}</p>
              <p className="text-sm text-gray-500 mb-1">참여자: {selectedEvent.participantCount}명</p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">순위표</h3>
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">순위</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">참여자</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">득표수</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">상태</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sampleRanking.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{entry.rank}위</td>
                      <td className="px-4 py-2">{entry.username}</td>
                      <td className="px-4 py-2">{entry.votes}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${entry.status === "승인완료" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{entry.status}</span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-[#87CEEB] hover:text-blue-400 mr-2">승인</button>
                        <button className="text-red-500 hover:text-red-600">반려</button>
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
