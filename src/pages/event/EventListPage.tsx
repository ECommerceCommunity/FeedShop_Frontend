import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EventStatus, EventType } from "../../types/types";
import { EventDto } from "../../types/event";
import EventDetailModal from "./EventDetailModal";

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
  const [events, setEvents] = useState<EventDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

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
          
          // 정렬 파라미터 설정
          switch (sortType) {
            case "latest":
              params.sort = "latest"; // 최신순
              break;
            case "upcoming":
              params.sort = "upcoming"; // 예정순
              break;
            case "past":
              params.sort = "past"; // 지난순
              break;
            default:
              params.sort = "latest"; // 기본값
          }
          
          if (activeFilter !== "all") {
            params.status = activeFilter;
          }
          
          if (searchKeyword) {
            params.keyword = searchKeyword;
          }
        }

        const response = await axiosInstance.get(url, { params });
        
        // 백엔드 응답 구조에 맞게 데이터 추출
        const responseData = response.data;
        const eventsData = responseData.content || [];
        
        // EventDto 형식으로 변환
        const transformedEvents = eventsData.map((event: any) => {
          // 구매 기간 파싱
          let purchaseStartDate = '';
          let purchaseEndDate = '';
          if (event.purchasePeriod) {
            const purchaseParts = event.purchasePeriod.split(' ~ ');
            if (purchaseParts.length === 2) {
              purchaseStartDate = purchaseParts[0].trim();
              purchaseEndDate = purchaseParts[1].trim();
            }
          }

          // 참여 기간 파싱
          let eventStartDate = '';
          let eventEndDate = '';
          if (event.votePeriod) {
            const voteParts = event.votePeriod.split(' ~ ');
            if (voteParts.length === 2) {
              eventStartDate = voteParts[0].trim();
              eventEndDate = voteParts[1].trim();
            }
          }

          return {
            id: event.eventId,
            type: event.type || 'BATTLE',
            status: event.status || 'UPCOMING',
            maxParticipants: event.maxParticipants || 0,

            title: event.title || '',
            description: event.description || '',
            purchaseStartDate: purchaseStartDate,
            purchaseEndDate: purchaseEndDate,
            eventStartDate: eventStartDate,
            eventEndDate: eventEndDate,
            announcement: event.announcementDate || '',
            participationMethod: event.participationMethod || '',
            selectionCriteria: event.selectionCriteria || '',
            precautions: event.precautions || '',
            imageUrl: event.imageUrl || '/placeholder-image.jpg',
            rewards: event.rewards ? event.rewards.map((reward: any) => ({
              conditionValue: reward.rank || 1,
              rewardValue: reward.reward || ''
            })) : [],
            createdAt: event.createdAt || '',
            updatedAt: event.updatedAt || ''
          };
        });

        setEvents(transformedEvents);
        setTotalPages(responseData.totalPages || 1);
      } catch (error: any) {
        console.error('이벤트 목록 조회 실패:', error);
        setError('이벤트 목록을 불러오지 못했습니다.');
        
        // 에러 발생 시 더미 데이터 사용
        const dummyEvents: EventDto[] = [
          {
            id: 1,
            type: 'BATTLE',
            status: 'ONGOING',
            maxParticipants: 100,

            title: '여름 스타일 챌린지',
            description: '여름에 어울리는 스타일을 공유해보세요!',
            purchaseStartDate: '2025-07-20',
            purchaseEndDate: '2025-08-07',
            eventStartDate: '2025-07-20',
            eventEndDate: '2025-08-07',
            announcement: '2025-08-10',
            participationMethod: '인스타그램에 해시태그와 함께 업로드',
            selectionCriteria: '좋아요 수와 댓글 참여도',
            precautions: '부적절한 콘텐츠는 제외됩니다.',
            imageUrl: '/placeholder-image.jpg',
            rewards: [
              { conditionValue: 1, rewardValue: '1등: 10만원 상품권' },
              { conditionValue: 2, rewardValue: '2등: 5만원 상품권' },
              { conditionValue: 3, rewardValue: '3등: 3만원 상품권' }
            ],

            createdAt: '2025-07-15',
            updatedAt: '2025-07-15'
          }
        ];
        setEvents(dummyEvents);
        setTotalPages(1);
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
      case 'UPCOMING': return '예정';
      case 'ONGOING': return '진행중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return '알 수 없음';
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case 'BATTLE': return '배틀';
      case 'MISSION': return '미션';
      case 'MULTIPLE': return '다중';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'BATTLE': return 'bg-purple-100 text-purple-800';
      case 'MISSION': return 'bg-orange-100 text-orange-800';
      case 'MULTIPLE': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 이벤트 상태를 동적으로 계산하는 함수
  const calculateEventStatus = (event: EventDto): EventStatus => {
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
      return 'COMPLETED'; // 이벤트 종료
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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">이벤트</h1>
              <p className="mt-2 text-sm text-gray-600">
                다양한 이벤트에 참여하고 특별한 혜택을 받아보세요
              </p>
            </div>
            {user?.userType === 'admin' && (
              <Link
                to="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                이벤트 생성
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="이벤트 제목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => handleFilterChange("upcoming")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeFilter === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                예정된 이벤트
              </button>
              <button
                onClick={() => handleFilterChange("ongoing")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeFilter === "ongoing"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                진행 중인 이벤트
              </button>
              <button
                onClick={() => handleFilterChange("completed")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeFilter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                종료된 이벤트
              </button>
            </div>

            {/* 정렬 */}
            <select
              value={sortType}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="latest">최신순</option>
              <option value="upcoming">예정순</option>
              <option value="past">지난순</option>
            </select>
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
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="flex">
                  {/* 이미지 섹션 */}
                  <div className="relative w-96 bg-gray-200 flex-shrink-0">
                    <img
                      src={event.imageUrl || '/placeholder-image.jpg'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* 상태 배지 */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status || calculateEventStatus(event))}`}>
                        {getStatusText(event.status || calculateEventStatus(event))}
                      </span>
                    </div>
                  </div>

                  {/* 내용 섹션 */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {event.description}
                      </p>

                      {/* 기간 정보 */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">구매 기간</div>
                          <div className="text-sm text-gray-900">
                            {event.purchaseStartDate && event.purchaseEndDate ? 
                              `${new Date(event.purchaseStartDate).toLocaleDateString()} - ${new Date(event.purchaseEndDate).toLocaleDateString()}` : 
                              '기간 정보 없음'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">참여 기간</div>
                          <div className="text-sm text-gray-900">
                            {event.eventStartDate && event.eventEndDate ? 
                              `${new Date(event.eventStartDate).toLocaleDateString()} - ${new Date(event.eventEndDate).toLocaleDateString()}` : 
                              '기간 정보 없음'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">발표일</div>
                          <div className="text-sm text-gray-900">
                            {event.announcement ? new Date(event.announcement).toLocaleDateString() : '발표일 미정'}
                          </div>
                        </div>
                      </div>

                      {/* 보상 정보 */}
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-500 mb-2">🏆 보상</div>
                        {event.rewards && event.rewards.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {event.rewards.slice(0, 3).map((reward, index) => (
                              <div
                                key={index}
                                className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200"
                              >
                                <span className="font-bold">{reward.conditionValue}등</span>
                                <span className="ml-1">{reward.rewardValue}</span>
                              </div>
                            ))}
                            {event.rewards.length > 3 && (
                              <div className="text-gray-500 text-sm px-2 py-2">
                                +{event.rewards.length - 3}개 더
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">보상 정보가 없습니다.</div>
                        )}
                      </div>
                    </div>

                    {/* 하단 액션 영역 */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* 참여자 수 표시 제거 */}
                      </div>
                      <div className="flex gap-2">
                        {(event.status || calculateEventStatus(event)) === 'ONGOING' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // 참여하기 로직

                            }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            참여하기
                          </button>
                        ) : (event.status || calculateEventStatus(event)) === 'COMPLETED' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
      <EventDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        setEditingEvent={(event) => {
          setModalOpen(false);
          navigate(`/event-edit/${event.id}`);
        }}
        setShowEditModal={() => {}}
        setEventToDelete={(id) => {
          setModalOpen(false);
          // 삭제 로직은 모달 내에서 처리
        }}
        setShowDeleteModal={() => {}}
      />
    </div>
  );
};

export default EventListPage;
