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
        if (activeFilter !== "all") params.status = activeFilter.toUpperCase();
        if (searchKeyword) params.keyword = searchKeyword;

        // API 경로 분기: 검색어 또는 필터가 있으면 /search, 아니면 /all
        let url = "/api/events/all";
        if (searchKeyword || activeFilter !== "all" || sortType !== "latest") {
          url = "/api/events/search";
        }
        
        console.log('정렬 타입:', sortType);
        console.log('정렬 파라미터:', params.sort);
        console.log('요청 URL:', url);
        console.log('전체 파라미터:', params);
        const res = await axiosInstance.get(url, { params });
        console.log('API Response:', res.data);
        console.log('API Response structure:', JSON.stringify(res.data, null, 2));
        
        // 백엔드 응답 구조에 따라 데이터 추출
        let eventsData = [];
        
        if (res.data && res.data.content) {
          // Spring Boot Page 형태의 응답
          eventsData = res.data.content;
          setTotalPages(res.data.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          // 배열 형태의 응답
          eventsData = res.data;
          setTotalPages(1);
        } else if (res.data && Array.isArray(res.data.events)) {
          // events 필드에 배열이 있는 경우
          eventsData = res.data.events;
          setTotalPages(res.data.totalPages || 1);
        } else {
          console.log('예상하지 못한 API 응답 구조:', res.data);
          setTotalPages(1);
        }
        
        // 데이터 구조 변환 (백엔드 필드명에 맞춰 조정)
        const transformedEvents = eventsData.map((event: any) => {
          console.log('Processing event:', event);
          
          // 백엔드 필드명에 따라 매핑
          return {
            id: event.id || event.eventId,
            type: event.type || event.eventType,
            status: event.status || event.eventStatus,
            maxParticipants: event.maxParticipants || event.maxParticipantCount,
            participantCount: event.participantCount || event.currentParticipantCount,
            deletedAt: event.deletedAt, // 추가: 소프트 딜리트 필드
            eventDetail: {
              title: event.title || event.eventTitle || event.eventDetail?.title,
              description: event.description || event.eventDescription || event.eventDetail?.description,
              purchaseStartDate: event.purchaseStartDate || event.eventDetail?.purchaseStartDate,
              purchaseEndDate: event.purchaseEndDate || event.eventDetail?.purchaseEndDate,
              eventStartDate: event.eventStartDate || event.startDate || event.eventDetail?.eventStartDate,
              eventEndDate: event.eventEndDate || event.endDate || event.eventDetail?.eventEndDate,
              imageUrl: event.imageUrl || event.image || event.eventDetail?.imageUrl || '/img/products/3392006/main/3392006_1.jpg'
            }
          };
        });
        // 소프트 딜리트된 이벤트는 제외
        const filteredEvents = transformedEvents.filter((e: any) => !e.deletedAt);
        setEvents(filteredEvents);
      } catch (err) {
        console.error("이벤트 목록 조회 실패:", err);
        setError("이벤트 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchKeyword, activeFilter, sortType, page]);

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case "UPCOMING":
        return "진행 예정";
      case "ONGOING":
        return "진행중";
      case "ENDED":
        return "종료";
      default:
        return "";
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE":
        return "배틀 (스타일 경쟁)";
      case "MISSION":
        return "미션 (착용 미션)";  
      case "MULTIPLE":
        return "다수 (일반 참여)";
      default:
        return "";
    }
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        <Link to="/event-list" className="text-[#87CEEB] hover:underline font-semibold text-lg">이벤트 메인</Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">이벤트 목록</h1>
        <div className="flex gap-2">
          {user?.userType === "admin" && (
            <button
              className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400"
              onClick={() => navigate("/events/create")}
            >
              이벤트 생성
            </button>
          )}
          {user?.userType === "admin" && (
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              onClick={() => navigate("/events/result")}
            >
              결과 관리
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => { setActiveFilter("all"); setPage(1); }}
        >
          전체
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeFilter === "ongoing" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => { setActiveFilter("ongoing"); setPage(1); }}
        >
          진행중
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeFilter === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => { setActiveFilter("upcoming"); setPage(1); }}
        >
          예정
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeFilter === "ended" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => { setActiveFilter("ended"); setPage(1); }}
        >
          종료
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="이벤트명 검색"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                setSearchKeyword(searchTerm);
                setPage(1);
              }
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              setSearchKeyword(searchTerm);
              setPage(1);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            검색
          </button>
        </div>
        <select
          value={sortType}
          onChange={e => setSortType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="participants">참여자순</option>
          <option value="ending">종료임박순</option>
        </select>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md relative"
            onClick={() => handleEventClick(event)}
          >
            <img 
              src={event.eventDetail?.imageUrl || '/placeholder-image.jpg'} 
              alt={event.eventDetail?.title || '이벤트 이미지'} 
              className="w-full h-40 object-cover rounded mb-4" 
            />
            <h2 className="text-lg font-bold mb-2">{event.eventDetail?.title || '제목 없음'}</h2>
            <p className="text-gray-500 mb-2">{event.eventDetail?.description || '설명 없음'}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-blue-500 font-medium">{getStatusText(event.status)}</span>
              {(event.status === "UPCOMING" || event.status === "ONGOING") && event.eventDetail?.eventEndDate && (
                <span className="ml-2 text-xs text-red-500 font-semibold">{getDday(event.eventDetail.eventEndDate)}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              참여자: {event.participantCount || event.maxParticipants}명
            </div>
            <div className="text-xs text-blue-400 mt-1">
              유형: {getTypeText(event.type)}
            </div>
          </div>
        ))}
      </div>

      <EventDetailModal open={modalOpen} onClose={() => setModalOpen(false)} event={selectedEvent} />

      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventListPage;
