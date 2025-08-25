import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EventStatus, EventDto } from "../../types/types";
import EventDetailModal from "./EventDetailModal";

const PAGE_SIZE = 4;



const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // 실제 검색에 사용될 키워드
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortType, setSortType] = useState("latest");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 디버깅을 위한 사용자 정보 출력
  // console.log('Current user:', user);
  // console.log('User nickname:', nickname);
  // console.log('User type:', user?.userType);

  const handleEventClick = (event: EventDto) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // API 경로 분기: 검색어 또는 필터가 있으면 /search, 아니면 /all
        let url = "/api/events/all";
        let params: any = {
          page: page, // 백엔드는 1-based pagination 사용 (서비스에서 0-based로 변환)
          size: PAGE_SIZE,
        };
        
        if (searchKeyword || activeFilter !== "all" || sortType !== "latest") {
          url = "/api/events/search";
        }
        
        // 정렬 파라미터 설정
        switch (sortType) {
          case "latest":
              params.sort = "createdAt,desc"; // 최신순
            break;
            case "upcoming":
              params.sort = "eventStartDate,asc"; // 예정순
            break;
            case "past":
              params.sort = "eventEndDate,desc"; // 지난순
            break;
          default:
            params.sort = "createdAt,desc"; // 기본값
        }
        
        // 필터 파라미터 설정 (백엔드 상태값으로 변환)
        if (activeFilter !== "all") {
          switch (activeFilter) {
            case "UPCOMING":
              params.status = "UPCOMING";
              break;
            case "ONGOING":
              params.status = "ONGOING";
              break;
            case "ENDED":
              params.status = "ENDED";
              break;
            default:
              params.status = activeFilter;
          }
        }
        
        // 검색 파라미터 설정
        if (searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }
        
        const response = await axiosInstance.get(url, { params });
        const data = response.data;
        
        console.log('이벤트 목록 응답:', data);
        
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

  // 검색어 변경 시 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);



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
      case "UPCOMING":
        return "예정";
      case "ONGOING":
        return "진행중";
      case "ENDED":
        return "완료";
      default:
        return status;
    }
  };



  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-600 text-white';
      case 'ONGOING': return 'bg-green-600 text-white';
      case 'ENDED': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };



  // 이벤트 상태를 동적으로 계산하는 함수
  const calculateEventStatus = (event: EventDto): EventStatus => {
    // 백엔드에서 isParticipatable 필드를 제공하는 경우 해당 정보 활용
    if (event.isParticipatable !== undefined) {
      if (event.isParticipatable) {
        return 'ONGOING'; // 참여 가능한 이벤트는 진행중
      } else {
        // 종료일이 지났거나 시작일이 아직인 경우 판단
        const now = new Date();
        const eventStart = event.eventStartDate ? new Date(event.eventStartDate) : null;
        
        if (eventStart && now < eventStart) {
          return 'UPCOMING'; // 시작일 이전
        } else {
          return 'ENDED'; // 종료됨
        }
      }
    }
    
    // 백엔드에서 isParticipatable 필드를 제공하지 않는 경우 기존 로직 사용
    const now = new Date();
    const eventStart = event.eventStartDate ? new Date(event.eventStartDate) : null;
    const eventEnd = event.eventEndDate ? new Date(event.eventEndDate) : null;

    if (!eventStart || !eventEnd) {
      return 'UPCOMING'; // 날짜 정보가 없으면 예정으로 처리
    }

    if (now < eventStart) {
      return 'UPCOMING'; // 이벤트 시작일 이전
    } else if (now >= eventStart && now <= eventEnd) {
      return 'ONGOING'; // 이벤트 진행 중
    } else {
      return 'ENDED'; // 이벤트 종료
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">이벤트 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">이벤트</h1>
              <p className="mt-3 text-base text-gray-600">
                다양한 이벤트에 참여하고 특별한 혜택을 받아보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 검색 및 정렬 */}
              <div className="flex gap-3">
                <div className="w-72">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 정렬 */}
                <select
                  value={sortType}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-200 min-w-[120px]"
                >
                  <option value="latest">최신순</option>
                  <option value="upcoming">예정순</option>
                  <option value="past">지난순</option>
                </select>

                {/* 이벤트 생성 버튼 */}
                {user?.userType === 'admin' && (
                  <Link
                    to="/events/create"
                    className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="relative">
              이벤트 생성
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                )}

                {/* 결과 관리 버튼 */}
                {user?.userType === 'admin' && (
                  <Link
                    to="/events/result"
                    className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="relative">
                      결과 관리
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                )}
      </div>

              {/* 필터 */}
              <div className="flex gap-3">
        <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeFilter === "all"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
                  }`}
        >
          전체
        </button>
        <button
                  onClick={() => handleFilterChange("UPCOMING")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeFilter === "UPCOMING"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
                  }`}
                >

                  예정
                </button>
                <button
                  onClick={() => handleFilterChange("ONGOING")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeFilter === "ONGOING"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
                  }`}
        >
          진행중
        </button>
        <button
                  onClick={() => handleFilterChange("ENDED")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeFilter === "ENDED"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
                  }`}
                >
                  완료
        </button>
      </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
      </div>
        )}

        {/* 이벤트 목록 */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">이벤트가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchKeyword || activeFilter !== "all" ? "검색 조건을 변경해보세요." : "새로운 이벤트를 기다려주세요."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
        {events.map((event) => (
          <div
                            key={event.eventId}
            onClick={() => handleEventClick(event)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="flex">
                  {/* 이미지 섹션 */}
                  <div className="relative w-96 bg-gray-200 flex-shrink-0">
                    <img
                      src={event.imageUrl || '/placeholder-image.jpg'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* 상태 배지 - 이미지 왼쪽 상단 */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm ${getStatusColor((event.status as EventStatus) || calculateEventStatus(event))}`}>
                        {getStatusText((event.status as EventStatus) || calculateEventStatus(event))}
                      </span>
                    </div>
                  </div>

                  {/* 내용 섹션 */}
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                        {event.description}
                      </p>

                      {/* 기간 정보 */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200/50">
                          <div className="text-sm font-semibold text-blue-600 mb-2">구매 기간</div>
                          <div className="text-sm font-medium text-gray-900">
                            {event.purchasePeriod || '기간 정보 없음'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200/50">
                          <div className="text-sm font-semibold text-green-600 mb-2">참여 기간</div>
                          <div className="text-sm font-medium text-gray-900">
                            {event.votePeriod || '기간 정보 없음'}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200/50">
                          <div className="text-sm font-semibold text-purple-600 mb-2">발표일</div>
                          <div className="text-sm font-medium text-gray-900">
                            {event.announcementDate ? new Date(event.announcementDate).toLocaleDateString() : '발표일 미정'}
                          </div>
                        </div>
                      </div>

                      {/* 보상 정보 */}
                      <div className="mb-8">
                        <div className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                          <span className="text-2xl mr-2">🏆</span>
                          보상
                        </div>
                        {event.rewards && Array.isArray(event.rewards) && event.rewards.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {event.rewards.slice(0, 3).map((reward, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 px-4 py-3 rounded-xl text-sm font-semibold border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <span className="font-bold text-lg">{reward.rank || index + 1}등</span>
                                <span className="ml-2">{reward.reward}</span>
                              </div>
                            ))}
                            {event.rewards.length > 3 && (
                              <div className="text-gray-500 text-sm px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                +{event.rewards.length - 3}개 더
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">보상 정보가 없습니다.</div>
                        )}
            </div>
                    </div>

                    {/* 하단 액션 영역 */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                      <div className="flex items-center gap-4">
                        {/* 참여자 수 표시 제거 */}
                      </div>
                      <div className="flex gap-3">
                        {(event.status || calculateEventStatus(event)) === 'ONGOING' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/feed-create', {
                                state: {
                                  selectedEventId: event.eventId,
                                  fromEventList: true
                                }
                              });
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            참여하기
                          </button>
                        ) : (event.status || calculateEventStatus(event)) === 'ENDED' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            결과 보기
                          </button>
                        ) : null}
                      </div>
                    </div>
            </div>
            </div>
          </div>
        ))}
      </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && totalPages > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </nav>
          </div>
        )}


      </div>

      {/* 이벤트 상세 모달 */}
      {modalOpen && selectedEvent && (
        <EventDetailModal
           open={modalOpen}
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventListPage;
