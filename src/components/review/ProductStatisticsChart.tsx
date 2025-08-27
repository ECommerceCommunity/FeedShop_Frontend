import React, { useState } from 'react';
import styled from 'styled-components';
import { ProductStatistics as ProductStatisticsType, ElementStatistics, ELEMENT_LABELS, ELEMENT_OPTIONS } from '../../types/review';

const StatisticsContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;


const ChartContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ElementChart = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const ElementTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const AverageScore = styled.span`
  background-color: #007bff;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ChartArea = styled.div`
  height: 200px;
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 1rem 0.5rem 0.5rem;
  border-bottom: 2px solid #dee2e6;
  border-left: 2px solid #dee2e6;
  position: relative;
`;

const Bar = styled.div<{ height: number; isSelected: boolean; color: string; isEmpty: boolean }>`
  flex: 1;
  background: ${props => props.isEmpty 
    ? `linear-gradient(to top, ${props.color}22, ${props.color}11)` 
    : `linear-gradient(to top, ${props.color}, ${props.color}cc)`
  };
  height: ${props => props.height}%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
  border: ${props => props.isSelected ? '2px solid #ffc107' : '1px solid rgba(255,255,255,0.3)'};
  box-shadow: ${props => props.isSelected ? '0 4px 8px rgba(255,193,7,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
  opacity: ${props => props.isEmpty ? 0.4 : 1};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  background-color: rgba(255,255,255,0.9);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
`;

const BarLabels = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 0.5rem;
`;

const BarLabel = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  color: #666;
  line-height: 1.2;
  word-break: keep-all;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

const Summary = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const SummaryValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

interface Props {
  statistics: ProductStatisticsType;
  loading?: boolean;
}

const ProductStatisticsChart: React.FC<Props> = ({ statistics, loading = false }) => {

  if (process.env.NODE_ENV === 'development') {
    console.log('📈 ProductStatisticsChart 받은 데이터:', {
      totalReviews: statistics.totalReviews,
      cushion: {
        averageScore: statistics.cushionStatistics?.averageScore,
        distribution: statistics.cushionStatistics?.distribution,
        mostSelected: statistics.cushionStatistics?.mostSelected
      },
      sizeFit: {
        averageScore: statistics.sizeFitStatistics?.averageScore,
        distribution: statistics.sizeFitStatistics?.distribution,
        mostSelected: statistics.sizeFitStatistics?.mostSelected
      },
      stability: {
        averageScore: statistics.stabilityStatistics?.averageScore,
        distribution: statistics.stabilityStatistics?.distribution,
        mostSelected: statistics.stabilityStatistics?.mostSelected
      }
    });
  }

  if (loading) {
    return (
      <StatisticsContainer>
        <Header>
          <Title>3요소 평가 통계</Title>
        </Header>
        <EmptyState>통계를 불러오는 중...</EmptyState>
      </StatisticsContainer>
    );
  }

  if (statistics.totalReviews === 0) {
    return (
      <StatisticsContainer>
        <Header>
          <Title>3요소 평가 통계</Title>
        </Header>
        <EmptyState>아직 리뷰가 없어 통계를 표시할 수 없습니다.</EmptyState>
      </StatisticsContainer>
    );
  }

  const getColorForElement = (elementType: string, index: number, isSelected: boolean) => {
    const colors = {
      cushion: ['#ff6b6b', '#ff8e8e', '#ffb1b1', '#ffd4d4', '#ffe7e7'],
      sizeFit: ['#4ecdc4', '#6ed4cc', '#8edcd4', '#aee4dc', '#ceece4'],
      stability: ['#45b7d1', '#66c5d9', '#87d3e1', '#a8e1e9', '#c9eff1']
    };
    
    const elementColors = colors[elementType as keyof typeof colors] || colors.cushion;
    return isSelected ? '#ffc107' : elementColors[index % elementColors.length];
  };

  const renderBarChart = (
    title: string,
    elementType: string,
    elementStats: ElementStatistics,
    labelMap: Record<string, string>
  ) => {
    // 5가지 평가를 모두 표시 (데이터가 없어도 0으로 표시)
    const entries = ELEMENT_OPTIONS[elementType as keyof typeof ELEMENT_OPTIONS]
      .map(option => [option.enum, elementStats.distribution[option.enum] || 0] as [string, number]);

    const maxCount = Math.max(...entries.map(([_, count]) => count), 1); // 최소값 1로 설정해서 빈 차트 방지

    return (
      <ElementChart key={title}>
        <ElementTitle>
          {title}
          <AverageScore>{elementStats.averageScore.toFixed(1)}점</AverageScore>
        </ElementTitle>
        
        <ChartArea>
          {entries.map(([level, count], index) => {
            const percentage = elementStats.percentage[level] || 0;
            const height = Math.max((count / maxCount) * 100, 2); // 최소 2% 높이 보장
            const isSelected = level === elementStats.mostSelected;
            const color = getColorForElement(elementType, index, false);
            
            return (
              <Bar 
                key={level}
                height={height}
                isSelected={isSelected}
                color={color}
                isEmpty={count === 0}
              >
                <BarValue>
                  {count > 0 ? `${count}개 (${percentage.toFixed(1)}%)` : '0개'}
                </BarValue>
              </Bar>
            );
          })}
        </ChartArea>
        
        <BarLabels>
          {entries.map(([level]) => (
            <BarLabel key={level}>
              {labelMap[level] || level}
            </BarLabel>
          ))}
        </BarLabels>
      </ElementChart>
    );
  };


  return (
    <StatisticsContainer>
      <Header>
        <Title>3요소 평가 통계 (총 {statistics.totalReviews}개 리뷰 기준)</Title>
      </Header>

      <ChartContainer>
        {renderBarChart('쿠션감', 'cushion', statistics.cushionStatistics, ELEMENT_LABELS.cushion)}
        {renderBarChart('착용감', 'sizeFit', statistics.sizeFitStatistics, ELEMENT_LABELS.sizeFit)}
        {renderBarChart('안정성', 'stability', statistics.stabilityStatistics, ELEMENT_LABELS.stability)}
      </ChartContainer>

      <Summary>
        <SummaryItem>
          <SummaryLabel>쿠션감 평균</SummaryLabel>
          <SummaryValue>{statistics.cushionStatistics.averageScore.toFixed(1)}점</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>착용감 평균</SummaryLabel>
          <SummaryValue>{statistics.sizeFitStatistics.averageScore.toFixed(1)}점</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>안정성 평균</SummaryLabel>
          <SummaryValue>{statistics.stabilityStatistics.averageScore.toFixed(1)}점</SummaryValue>
        </SummaryItem>
      </Summary>
    </StatisticsContainer>
  );
};

export default ProductStatisticsChart;