import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EventDto, EventStatus } from "../../types/event";
import EventDetailModal from "./EventDetailModal";
import EventCard from "../../components/event/EventCard";
import EventFilter from "../../components/event/EventFilter";
import eventService from "../../api/eventService";
import styled from "styled-components";

const PAGE_SIZE = 8;

const Container = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  padding: 2rem;
  min-height: 100vh;
  font-family: "Pretendard", sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CreateButton = styled(Link)`
  background: #f97316;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #ea580c;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  }
`;

const ResultManageButton = styled(Link)`
  background: #10b981;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }
`;

const EventGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: #f87171;
  text-align: center;
`;

const RetryButton = styled.button`
  background: #f97316;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #ea580c;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  background: ${props => (props.disabled ? "rgba(255, 255, 255, 0.1)" : "#f97316")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #ea580c;
  }
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventStatus | "ALL">("ALL");
  const [sortType, setSortType] = useState("latest");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  
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
          params.sort = "createdAt,desc";
            break;
            case "upcoming":
          params.sort = "eventStartDate,asc";
            break;
            case "past":
          params.sort = "eventEndDate,desc";
            break;
          default:
          params.sort = "createdAt,desc";
      }

      // 필터 파라미터 설정
      if (activeFilter !== "ALL") {
              params.status = activeFilter;
        }
        
        // 검색 파라미터 설정
      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      const response = await eventService.getAllEvents(params);
      setEvents(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      } catch (error: any) {
        console.error("이벤트 목록 조회 실패:", error);
        setError("이벤트 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, [page, sortType, activeFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchEvents();
  };

  const handleReset = () => {
    setSearchTerm("");
    setActiveFilter("ALL");
    setSortType("latest");
    setPage(1);
  };

  const handleEventClick = (event: EventDto) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleEditEvent = (event: EventDto) => {
    navigate(`/events/edit/${event.eventId}`);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
      try {
        await eventService.deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        console.error("이벤트 삭제 실패:", error);
        alert("이벤트 삭제에 실패했습니다.");
      }
    }
  };

  const handleManageResults = (event: EventDto) => {
    navigate(`/events/${event.eventId}/results`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading && events.length === 0) {
    return (
      <Container>
        <Header>
          <Title>이벤트 목록</Title>
          {user?.userType === "admin" && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ResultManageButton to="/events/result">
                <i className="fas fa-chart-bar"></i>
                결과 관리
              </ResultManageButton>
              <CreateButton to="/events/create">
                <i className="fas fa-plus"></i>
                이벤트 생성
              </CreateButton>
            </div>
          )}
        </Header>
        <LoadingContainer>
          <i className="fas fa-spinner fa-spin"></i>
          이벤트 목록을 불러오는 중...
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>이벤트 목록</Title>
          {user?.userType === "admin" && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ResultManageButton to="/events/result">
                <i className="fas fa-chart-bar"></i>
                결과 관리
              </ResultManageButton>
              <CreateButton to="/events/create">
                <i className="fas fa-plus"></i>
                이벤트 생성
              </CreateButton>
            </div>
          )}
        </Header>
        <ErrorContainer>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: "3rem", marginBottom: "1rem" }}></i>
          <p>{error}</p>
          <RetryButton onClick={fetchEvents}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>이벤트 목록</Title>
        {user?.userType === "admin" && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ResultManageButton to="/events/result">
              <i className="fas fa-chart-bar"></i>
              결과 관리
            </ResultManageButton>
            <CreateButton to="/events/create">
              <i className="fas fa-plus"></i>
              이벤트 생성
            </CreateButton>
          </div>
        )}
      </Header>

      <EventFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortType={sortType}
        onSortChange={setSortType}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {events.length > 0 ? (
        <>
          <EventGrid>
        {events.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onClick={handleEventClick}
                showActions={user?.userType === "admin"}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </EventGrid>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                이전
              </PaginationButton>
              <PageInfo>
                {page} / {totalPages} 페이지 (총 {totalElements}개)
              </PageInfo>
              <PaginationButton
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                다음
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      ) : (
        <EmptyContainer>
          <i className="fas fa-calendar-times" style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}></i>
          <h3>등록된 이벤트가 없습니다</h3>
          <p>새로운 이벤트를 생성하거나 검색 조건을 변경해보세요.</p>
          {user?.userType === "admin" && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: "1rem" }}>
              <ResultManageButton to="/events/result">
                <i className="fas fa-chart-bar"></i>
                결과 관리
              </ResultManageButton>
              <CreateButton to="/events/create">
                <i className="fas fa-plus"></i>
                첫 이벤트 생성하기
              </CreateButton>
            </div>
          )}
        </EmptyContainer>
      )}

      {modalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
                      open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default EventListPage;
