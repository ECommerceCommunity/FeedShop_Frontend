import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { badgeService, BadgeResponse } from "../../api/badgeService";

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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.5rem;
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

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const BadgeCard = styled.div<{ isDisplayed: boolean }>`
  background: ${(props) =>
    props.isDisplayed
      ? "linear-gradient(135deg, #4a5568, #2d3748)"
      : "rgba(0, 0, 0, 0.3)"};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: ${(props) => (props.isDisplayed ? 1 : 0.6)};
  border: 2px solid ${(props) => (props.isDisplayed ? "#f97316" : "rgba(255, 255, 255, 0.2)")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  }
`;

const BadgeImage = styled.img<{ isDisplayed?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  border: 3px solid ${(props) => (props.isDisplayed ? "#f97316" : "rgba(255, 255, 255, 0.2)")};
`;

const BadgeName = styled.h3<{ isDisplayed?: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${(props) => (props.isDisplayed ? "white" : "rgba(255, 255, 255, 0.7)")};
`;

const BadgeDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const BadgeDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button<{ isDisplayed: boolean }>`
  background: ${(props) => (props.isDisplayed ? "#f97316" : "rgba(255, 255, 255, 0.2)")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.isDisplayed ? "#ea580c" : "rgba(255, 255, 255, 0.3)")};
  }
`;

const NoBadgesMessage = styled.div`
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
  });
};

const BadgesPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "displayed">("all");
  const [badges, setBadges] = useState<BadgeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCount: 0,
    displayedCount: 0,
  });

  // 뱃지 데이터 로드
  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await badgeService.getMyBadges();
      setBadges(response.badges);
      setStats({
        totalCount: response.totalCount,
        displayedCount: response.displayedCount,
      });
    } catch (err: any) {
      console.error("뱃지 로드 실패:", err);
      setError(
        "뱃지 정보를 불러오는데 실패했습니다. 에러: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // 뱃지 표시/숨김 토글
  const handleToggleBadge = async (badgeId: number) => {
    try {
      await badgeService.toggleBadgeDisplay({ badgeId });
      // 토글 후 뱃지 목록 다시 로드
      await loadBadges();
    } catch (err: any) {
      console.error("뱃지 토글 실패:", err);
      alert("뱃지 상태 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  // 탭에 따른 뱃지 필터링
  const getFilteredBadges = (): BadgeResponse[] => {
    if (activeTab === "displayed") {
      return badges.filter((badge) => badge.isDisplayed);
    }
    return badges;
  };

  const filteredBadges = getFilteredBadges();

  // 로딩 상태
  if (loading) {
    return (
      <Container>
        <Title>내 뱃지</Title>
        <LoadingMessage>
          <p>뱃지 정보를 불러오는 중...</p>
        </LoadingMessage>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container>
        <Title>내 뱃지</Title>
        <ErrorMessage>
          <p>{error}</p>
          <button
            onClick={loadBadges}
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
      <Title>내 뱃지</Title>
      
      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.totalCount}</StatNumber>
          <StatLabel>총 뱃지</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.displayedCount}</StatNumber>
          <StatLabel>표시 중</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totalCount - stats.displayedCount}</StatNumber>
          <StatLabel>숨김</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* 탭 */}
      <TabContainer>
        <TabButton
          isActive={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          모든 뱃지 ({stats.totalCount})
        </TabButton>
        <TabButton
          isActive={activeTab === "displayed"}
          onClick={() => setActiveTab("displayed")}
        >
          표시 중 ({stats.displayedCount})
        </TabButton>
      </TabContainer>

      {/* 뱃지 그리드 */}
      {filteredBadges.length > 0 ? (
        <BadgeGrid>
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              isDisplayed={badge.isDisplayed}
              onClick={() => handleToggleBadge(badge.id)}
            >
              <BadgeImage
                src={badge.badgeImageUrl || "/images/default-badge.png"}
                alt={badge.badgeName}
                onError={(e) => {
                  e.currentTarget.src = "/images/default-badge.png";
                }}
              />
              <BadgeName isDisplayed={badge.isDisplayed}>
                {badge.badgeName}
              </BadgeName>
              <BadgeDescription>{badge.badgeDescription}</BadgeDescription>
              <BadgeDate>획득일: {formatDate(badge.awardedAt)}</BadgeDate>
              <ToggleButton isDisplayed={badge.isDisplayed}>
                {badge.isDisplayed ? "숨기기" : "표시하기"}
              </ToggleButton>
            </BadgeCard>
          ))}
        </BadgeGrid>
      ) : (
        <NoBadgesMessage>
          <p>
            {activeTab === "all"
              ? "획득한 뱃지가 없습니다. 다양한 활동을 통해 뱃지를 획득해보세요!"
              : "표시 중인 뱃지가 없습니다."}
          </p>
        </NoBadgesMessage>
      )}
    </Container>
  );
};

export default BadgesPage;
