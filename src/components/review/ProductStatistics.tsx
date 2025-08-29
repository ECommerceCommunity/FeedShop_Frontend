import React from 'react';
import styled from 'styled-components';
import { ProductStatistics as ProductStatisticsType, ElementStatistics, ELEMENT_LABELS, ELEMENT_OPTIONS } from '../../types/review';

const StatisticsContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

const ElementContainer = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ElementTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AverageScore = styled.span`
  background-color: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DistributionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Label = styled.span`
  min-width: 100px;
  font-size: 0.9rem;
  color: #666;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 24px;
  background-color: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const Bar = styled.div<{ percentage: number; isSelected: boolean }>`
  height: 100%;
  background-color: ${props => props.isSelected ? '#28a745' : '#007bff'};
  width: ${props => props.percentage}%;
  border-radius: 12px;
  transition: all 0.3s ease;
`;

const Percentage = styled.span`
  min-width: 45px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  text-align: right;
`;

const Count = styled.span`
  min-width: 35px;
  font-size: 0.8rem;
  color: #666;
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

interface Props {
  statistics: ProductStatisticsType;
  loading?: boolean;
}

const ProductStatistics: React.FC<Props> = ({ statistics, loading = false }) => {
  if (loading) {
    return (
      <StatisticsContainer>
        <Title>3요소 평가 통계</Title>
        <EmptyState>통계를 불러오는 중...</EmptyState>
      </StatisticsContainer>
    );
  }

  if (statistics.totalReviews === 0) {
    return (
      <StatisticsContainer>
        <Title>3요소 평가 통계</Title>
        <EmptyState>아직 리뷰가 없어 통계를 표시할 수 없습니다.</EmptyState>
      </StatisticsContainer>
    );
  }

  const renderElementStatistics = (
    title: string,
    elementStats: ElementStatistics,
    labelMap: Record<string, string>
  ) => {
    // 요소 타입 식별
    const elementType = elementStats === statistics.cushionStatistics ? 'cushion' :
                       elementStats === statistics.sizeFitStatistics ? 'sizeFit' : 'stability';
    
    // 우리가 정의한 순서대로 정렬
    const entries = ELEMENT_OPTIONS[elementType as keyof typeof ELEMENT_OPTIONS]
      .map(option => [option.enum, elementStats.distribution[option.enum] || 0] as [string, number])
      .filter(([_, count]) => count > 0);

    if (entries.length === 0) {
      return null;
    }

    return (
      <ElementContainer key={title}>
        <ElementTitle>
          {title}
          <AverageScore>{elementStats.averageScore.toFixed(1)}점</AverageScore>
        </ElementTitle>
        <DistributionContainer>
          {entries.map(([level, count]) => {
            const percentage = elementStats.percentage[level] || 0;
            const isSelected = level === elementStats.mostSelected;
            
            return (
              <DistributionItem key={level}>
                <Label>{labelMap[level] || level}</Label>
                <BarContainer>
                  <Bar percentage={percentage} isSelected={isSelected} />
                </BarContainer>
                <Percentage>{percentage.toFixed(1)}%</Percentage>
                <Count>({count})</Count>
              </DistributionItem>
            );
          })}
        </DistributionContainer>
      </ElementContainer>
    );
  };

  return (
    <StatisticsContainer>
      <Title>3요소 평가 통계 (총 {statistics.totalReviews}개 리뷰 기준)</Title>
      
      {renderElementStatistics(
        '쿠션감',
        statistics.cushionStatistics,
        ELEMENT_LABELS.cushion
      )}
      
      {renderElementStatistics(
        '착용감',
        statistics.sizeFitStatistics,
        ELEMENT_LABELS.sizeFit
      )}
      
      {renderElementStatistics(
        '안정성',
        statistics.stabilityStatistics,
        ELEMENT_LABELS.stability
      )}
    </StatisticsContainer>
  );
};

export default ProductStatistics;