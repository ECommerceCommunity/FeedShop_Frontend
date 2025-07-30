import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EventStatus, EventType } from "../../types/types";
import EventDetailModal from "./EventDetailModal";

interface EventListItem {
  id: number; // event_id
  type: EventType;
  status: EventStatus;
  maxParticipants: number;
  eventDetail: {
    title: string;
    description: string;
    purchaseStartDate: string;
    purchaseEndDate: string;
    eventStartDate: string;
    eventEndDate: string;
    imageUrl: string;
  };
  participantCount?: number;
  deletedAt?: string; // 추가: 소프트 딜리트 필드
}

const PAGE_SIZE = 4;

const getDday = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return null;
};

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // 실제 검색에 사용될 키워드
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortType, setSortType] = useState("latest");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventListItem | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const nickname = user?.nickname;
  
  // 디버깅을 위한 사용자 정보 출력
  console.log('Current user:', user);
  console.log('User nickname:', nickname);
  console.log('User type:', user?.userType);

  const handleEventClick = (event: EventListItem) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page,
          size: PAGE_SIZE,
        };
        
        // 정렬 파라미터 설정
        switch (sortType) {
          case "latest":
            params.sort = "createdAt,desc"; // 최신순
            break;
          case "participants":
            params.sort = "participantCount,desc"; // 참여자순
            break;
          case "ending":
            params.sort = "eventEndDate,asc"; // 종료임박순
            break;
          default:
            params.sort = "createdAt,desc"; // 기본값
        }
        
        // 필터 파라미터 설정
        if (activeFilter !== "all") {
          params.status = activeFilter;
        }
        
        // 검색 파라미터 설정
        if (searchKeyword.trim()) {
          params.search = searchKeyword.trim();
        }
        
        const response = await axiosInstance.get("/api/events", { params });
        const data = response.data;
        
        setEvents(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error: any) {
        console.error("이벤트 목록 조회 실패:", error);
        setError("이벤트 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, sortType, activeFilter, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchTerm);
    setPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortType(sort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case "RECRUITING":
        return "모집중";
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE":
        return "배틀";
      case "REVIEW":
        return "리뷰";
      case "CHALLENGE":
        return "챌린지";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">이벤트 목록</h1>
          <p className="text-gray-600">다양한 이벤트에 참여해보세요!</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="이벤트 제목으로 검색..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                >
                  검색
                </button>
              </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => handleFilterChange("RECRUITING")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === "RECRUITING"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                모집중
              </button>
              <button
                onClick={() => handleFilterChange("IN_PROGRESS")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === "IN_PROGRESS"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                진행중
              </button>
            </div>

            {/* 정렬 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange("latest")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortType === "latest"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => handleSortChange("participants")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortType === "participants"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                참여자순
              </button>
              <button
                onClick={() => handleSortChange("ending")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortType === "ending"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                종료임박순
              </button>
            </div>
          </div>
        </div>

        {/* 이벤트 목록 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">이벤트 목록을 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={event.eventDetail.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={event.eventDetail.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "RECRUITING"
                        ? "bg-green-500 text-white"
                        : event.status === "IN_PROGRESS"
                        ? "bg-blue-500 text-white"
                        : event.status === "COMPLETED"
                        ? "bg-gray-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  {getDday(event.eventDetail.eventEndDate) && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {getDday(event.eventDetail.eventEndDate)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {getTypeText(event.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.participantCount || 0}/{event.maxParticipants}명
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.eventDetail.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {event.eventDetail.description}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    <div>구매기간: {new Date(event.eventDetail.purchaseStartDate).toLocaleDateString()} ~ {new Date(event.eventDetail.purchaseEndDate).toLocaleDateString()}</div>
                    <div>이벤트기간: {new Date(event.eventDetail.eventStartDate).toLocaleDateString()} ~ {new Date(event.eventDetail.eventEndDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 관리자용 이벤트 생성 버튼 */}
        {user?.userType === "ADMIN" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/events/create")}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              새 이벤트 생성
            </button>
          </div>
        )}
      </div>

      {/* 이벤트 상세 모달 */}
      {modalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventListPage;
