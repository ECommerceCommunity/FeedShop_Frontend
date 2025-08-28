import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { levelService, UserLevelInfo, UserActivity } from "../../api/levelService";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const LevelContainer = styled.div`
  background: linear-gradient(135deg, #4a5568, #2d3748);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const LevelDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LevelEmoji = styled.div`
  font-size: 3rem;
`;

const LevelInfo = styled.div`
  text-align: left;
`;

const LevelName = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.5rem;
`;

const LevelDescription = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  border-radius: 6px;
  transition: width 0.3s ease;
  width: ${(props) => Math.min(props.progress, 100)}%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive ? "#f97316" : "rgba(255, 255, 255, 0.7)"};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 0;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #f97316;
    transform: ${(props) => (props.isActive ? "scaleX(1)" : "scaleX(0)")};
    transition: transform 0.3s ease-out;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #f97316;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityDescription = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ActivityDate = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ActivityPoints = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #10b981;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? "rgba(255, 255, 255, 0.1)" : "#f97316")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const NoActivitiesMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #f87171;
`;

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 포인트 포맷팅 함수
const formatPoints = (points: number): string => {
  return points.toLocaleString();
};

const LevelPage = () => {
  const [activeTab, setActiveTab] = useState<"level" | "activities">("level");
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 레벨 정보 로드
  const loadLevelInfo = async () => {
    try {
      const levelData = await levelService.getUserLevelInfo();
      setLevelInfo(levelData);
    } catch (err: any) {
      console.error("레벨 정보 로드 실패:", err);
      setError("레벨 정보를 불러오는데 실패했습니다.");
    }
  };

  // 활동 내역 로드
  const loadActivities = async (page: number = 0) => {
    try {
      const activityData = await levelService.getUserActivities(page, 10);
      setActivities(activityData.content);
      setTotalPages(activityData.totalPages);
      setTotalElements(activityData.totalElements);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("활동 내역 로드 실패:", err);
      setError("활동 내역을 불러오는데 실패했습니다.");
    }
  };

  // 초기 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadLevelInfo(), loadActivities()]);
    } catch (err: any) {
      console.error("데이터 로드 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadActivities(newPage);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <Container>
        <Title>레벨 및 활동</Title>
        <LoadingMessage>
          <p>레벨 정보를 불러오는 중...</p>
        </LoadingMessage>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container>
        <Title>레벨 및 활동</Title>
        <ErrorMessage>
          <p>{error}</p>
          <button
            onClick={loadData}
            style={{
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>레벨 및 활동</Title>

      {/* 레벨 정보 섹션 */}
      {levelInfo && (
        <LevelContainer>
          <LevelDisplay>
            <LevelEmoji>{levelInfo.levelEmoji}</LevelEmoji>
            <LevelInfo>
              <LevelName>{levelInfo.levelDisplayName}</LevelName>
              <LevelDescription>{levelInfo.rewardDescription}</LevelDescription>
            </LevelInfo>
          </LevelDisplay>

          <ProgressContainer>
            <ProgressInfo>
              <span>다음 레벨까지</span>
              <span>{formatPoints(levelInfo.pointsToNextLevel)}점 필요</span>
            </ProgressInfo>
            <ProgressBar>
              <ProgressFill progress={levelInfo.levelProgress} />
            </ProgressBar>
          </ProgressContainer>

          <StatsGrid>
            <StatCard>
              <StatNumber>{formatPoints(levelInfo.totalPoints)}</StatNumber>
              <StatLabel>총 활동 점수</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{levelInfo.userRank}</StatNumber>
              <StatLabel>전체 랭킹</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{levelInfo.currentLevel.levelId}</StatNumber>
              <StatLabel>현재 레벨</StatLabel>
            </StatCard>
          </StatsGrid>
        </LevelContainer>
      )}

      {/* 탭 */}
      <TabContainer>
        <TabButton
          isActive={activeTab === "level"}
          onClick={() => setActiveTab("level")}
        >
          레벨 정보
        </TabButton>
        <TabButton
          isActive={activeTab === "activities"}
          onClick={() => setActiveTab("activities")}
        >
          활동 내역
        </TabButton>
      </TabContainer>

      {/* 활동 내역 섹션 */}
      {activeTab === "activities" && (
        <>
          {activities.length > 0 ? (
            <>
              <ActivityList>
                {activities.map((activity) => (
                  <ActivityCard key={activity.activityId}>
                    <ActivityInfo>
                      <ActivityDescription>
                        {activity.description}
                      </ActivityDescription>
                      <ActivityDate>
                        {formatDate(activity.createdAt)}
                      </ActivityDate>
                    </ActivityInfo>
                    <ActivityPoints>
                      +{formatPoints(activity.pointsEarned)}
                    </ActivityPoints>
                  </ActivityCard>
                ))}
              </ActivityList>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationButton
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    이전
                  </PaginationButton>
                  <PageInfo>
                    {currentPage + 1} / {totalPages} 페이지
                  </PageInfo>
                  <PaginationButton
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    다음
                  </PaginationButton>
                </PaginationContainer>
              )}
            </>
          ) : (
            <NoActivitiesMessage>
              <p>활동 내역이 없습니다.</p>
            </NoActivitiesMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default LevelPage;
