<<<<<<< HEAD
import { useState, useEffect } from "react";
import axios from "axios";
=======
import { useState } from "react";
>>>>>>> origin/develop
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Event {
  id: number;
  title: string;
  status: "upcoming" | "ongoing" | "ended";
  description: string;
  purchasePeriod: string;
  votePeriod: string;
  announcementDate: string;
  participantCount: number;
  rewards: { rank: number; reward: string }[];
  image: string;
  eventStartDate?: string;
  eventEndDate?: string;
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortType, setSortType] = useState("latest");
  const [page, setPage] = useState(1);
<<<<<<< HEAD
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { nickname } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page,
          size: PAGE_SIZE,
          sort: sortType,
        };
        if (activeFilter !== "all") params.status = activeFilter;
        if (searchTerm) params.keyword = searchTerm;

        const res = await axios.get("/api/events", { params });
        setEvents(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError("이벤트 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchTerm, activeFilter, sortType, page]);
=======
  const navigate = useNavigate();
  const { nickname } = useAuth();

  const events: Event[] = [
    {
      id: 1,
      title: "여름 스타일 챌린지",
      status: "upcoming",
      description: "다가오는 여름, 나만의 스타일로 시원하고 트렌디한 여름 패션을 선보여주세요. 베스트 스타일러에게는 풍성한 경품이 준비되어 있습니다.",
      purchasePeriod: "2025.06.25 - 2025.07.07",
      votePeriod: "2025.07.08 - 2025.07.14",
      announcementDate: "2025.07.15",
      participantCount: 0,
      rewards: [
        { rank: 1, reward: "100만원 상당의 브랜드 상품권" },
        { rank: 2, reward: "50만원 상당의 브랜드 상품권" },
        { rank: 3, reward: "30만원 상당의 브랜드 상품권" }
      ],
      image: "https://readdy.ai/api/search-image?query=summer%20fashion%20collection%20display%20with%20bright%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20summer%20vibes&width=800&height=400&seq=event1&orientation=landscape",
      eventStartDate: "2025-07-08",
      eventEndDate: "2025-07-14"
    },
    {
      id: 2,
      title: "데일리룩 스타일링 대전",
      status: "ongoing",
      description: "일상 속 나만의 스타일을 공유해주세요. 데일리룩으로 특별한 당신의 패션 감각을 보여주세요.",
      purchasePeriod: "2025.06.15 - 2025.06.30",
      votePeriod: "2025.07.01 - 2025.07.07",
      announcementDate: "2025.07.08",
      participantCount: 1234,
      rewards: [
        { rank: 1, reward: "최신 스마트폰" },
        { rank: 2, reward: "무선이어폰" },
        { rank: 3, reward: "패션 브랜드 기프트카드" }
      ],
      image: "https://readdy.ai/api/search-image?query=casual%20daily%20fashion%20collection%20display%20with%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20urban%20vibes&width=800&height=400&seq=event2&orientation=landscape",
      eventStartDate: "2025-07-01",
      eventEndDate: "2025-07-07"
    },
    {
      id: 3,
      title: "봄 패션 위크",
      status: "ended",
      description: "봄의 설렘을 담은 패션으로 특별한 순간을 만들어보세요. 다양한 스타일로 봄의 감성을 표현해주세요.",
      purchasePeriod: "2025.05.01 - 2025.05.15",
      votePeriod: "2025.05.16 - 2025.05.22",
      announcementDate: "2025.05.23",
      participantCount: 3456,
      rewards: [
        { rank: 1, reward: "럭셔리 브랜드 가방" },
        { rank: 2, reward: "디자이너 의류 세트" },
        { rank: 3, reward: "뷰티 제품 세트" }
      ],
      image: "https://readdy.ai/api/search-image?query=spring%20fashion%20collection%20display%20with%20soft%20pastel%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20spring%20vibes&width=800&height=400&seq=event3&orientation=landscape",
      eventStartDate: "2025-05-16",
      eventEndDate: "2025-05-22"
    }
  ];

  let filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || event.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  filteredEvents = [...filteredEvents].sort((a, b) => {
    if (sortType === "latest") {
      return b.id - a.id;
    } else if (sortType === "participants") {
      return b.participantCount - a.participantCount;
    } else if (sortType === "ending") {
      if (a.eventEndDate && b.eventEndDate) {
        return new Date(a.eventEndDate).getTime() - new Date(b.eventEndDate).getTime();
      }
      return 0;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const pagedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
>>>>>>> origin/develop

  const getStatusText = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "진행 예정";
      case "ongoing":
        return "진행중";
      case "ended":
        return "종료";
      default:
        return "";
    }
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        <Link to="/events" className="text-[#87CEEB] hover:underline font-semibold text-lg">이벤트 메인</Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">이벤트 목록</h1>
        <div className="flex gap-2">
          <button
            className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400"
            onClick={() => navigate("/events/create")}
          >
            이벤트 생성하기
          </button>
          {nickname === "admin" && (
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
        <input
          type="text"
          placeholder="이벤트명 검색"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
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

<<<<<<< HEAD
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pagedEvents.map((event) => (
>>>>>>> origin/develop
          <div
            key={event.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md relative"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-lg font-bold mb-2">{event.title}</h2>
            <p className="text-gray-500 mb-2">{event.description}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-blue-500 font-medium">{getStatusText(event.status)}</span>
              {(event.status === "upcoming" || event.status === "ongoing") && event.eventEndDate && (
                <span className="ml-2 text-xs text-red-500 font-semibold">{getDday(event.eventEndDate)}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">참여자: {event.participantCount.toLocaleString()}명</div>
          </div>
        ))}
      </div>

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
