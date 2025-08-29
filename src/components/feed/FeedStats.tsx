import React from 'react';
import styled from 'styled-components';
import { FeedPost } from '../../types/feed';
import { calculateFeedStats } from '../../utils/feedUtils';

interface FeedStatsProps {
  feeds: FeedPost[];
  className?: string;
}

const StatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(249, 115, 22, 0.3);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const TypeStats = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TypeStatsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.9);
`;

const TypeStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const TypeStatCard = styled.div<{ feedType: string }>`
  background: ${props => {
    switch (props.feedType) {
      case 'DAILY': return 'rgba(59, 130, 246, 0.2)';
      case 'EVENT': return 'rgba(139, 92, 246, 0.2)';
      case 'RANKING': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.feedType) {
      case 'DAILY': return 'rgba(59, 130, 246, 0.3)';
      case 'EVENT': return 'rgba(139, 92, 246, 0.3)';
      case 'RANKING': return 'rgba(245, 158, 11, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
`;

const TypeStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const TypeStatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
`;

const getFeedTypeText = (feedType: string): string => {
  switch (feedType) {
    case 'DAILY': return '일상';
    case 'EVENT': return '이벤트';
    case 'RANKING': return '랭킹';
    default: return '기타';
  }
};

const FeedStats: React.FC<FeedStatsProps> = ({ feeds, className }) => {
  const stats = calculateFeedStats(feeds);

  return (
    <StatsContainer className={className}>
      <StatsTitle>피드 통계</StatsTitle>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalFeeds}</StatValue>
          <StatLabel>전체 피드</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.totalLikes}</StatValue>
          <StatLabel>총 좋아요</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.totalComments}</StatValue>
          <StatLabel>총 댓글</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.averageLikes}</StatValue>
          <StatLabel>평균 좋아요</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.averageComments}</StatValue>
          <StatLabel>평균 댓글</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <TypeStats>
        <TypeStatsTitle>피드 타입별 통계</TypeStatsTitle>
        <TypeStatsGrid>
          {Object.entries(stats.feedTypeCounts).map(([feedType, count]) => (
            <TypeStatCard key={feedType} feedType={feedType}>
              <TypeStatValue>{count}</TypeStatValue>
              <TypeStatLabel>{getFeedTypeText(feedType)}</TypeStatLabel>
            </TypeStatCard>
          ))}
        </TypeStatsGrid>
      </TypeStats>
    </StatsContainer>
  );
};

export default FeedStats;
