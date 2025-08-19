/**
 * 리뷰 필터링 및 정렬 컴포넌트
 *
 * 리뷰 목록을 정렬하고 필터링할 수 있는 컨트롤을 제공합니다.
 * 정렬 옵션, 별점 필터, 리뷰 개수 표시 등의 기능을 포함합니다.
 */

import React from "react";
import styled from "styled-components";
import { formatNumber } from "../../utils/review/reviewHelpers";
import { ReviewSortOption, ReviewFilterState } from "../../types/review";

// =============== 타입 정의 ===============

interface ReviewFilterProps {
    totalCount: number;                                    // 전체 리뷰 개수
    currentFilter: ReviewFilterState;                      // 현재 필터 상태
    onFilterChange: (filter: ReviewFilterState) => void;   // 필터 변경 콜백
    isLoading?: boolean;                                   // 로딩 상태
}

// =============== 상수 정의 ===============

// 정렬 옵션 목록
const SORT_OPTIONS: Array<{ value: ReviewSortOption; label: string }> = [
    { value: 'latest', label: '최신순' },
    { value: 'rating_high', label: '별점 높은순' },
    { value: 'rating_low', label: '별점 낮은순' },
];

// 별점 필터 옵션
const RATING_OPTIONS = [
    { value: 0, label: '전체', exactLabel: '전체' },
    { value: 5, label: '5점 이상', exactLabel: '5점' },
    { value: 4, label: '4점 이상', exactLabel: '4점' },
    { value: 3, label: '3점 이상', exactLabel: '3점' },
    { value: 2, label: '2점 이상', exactLabel: '2점' },
    { value: 1, label: '1점 이상', exactLabel: '1점' },
] as const;

// 3요소 필터 옵션
const SIZE_FIT_OPTIONS = [
    { value: 0, label: '전체' },
    { value: 1, label: '작음' },
    { value: 2, label: '적당함' },
    { value: 3, label: '큼' },
] as const;

const CUSHION_OPTIONS = [
    { value: 0, label: '전체' },
    { value: 1, label: '부드러움' },
    { value: 2, label: '적당함' },
    { value: 3, label: '딱딱함' },
] as const;

const STABILITY_OPTIONS = [
    { value: 0, label: '전체' },
    { value: 1, label: '낮음' },
    { value: 2, label: '보통' },
    { value: 3, label: '높음' },
] as const;

// =============== 스타일 컴포넌트 ===============

const FilterContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ReviewCount = styled.div`
  flex: 1;
`;

const CountText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  
  .count {
    color: #2563eb;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Select = styled.select<{ $isLoading?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isLoading ? 0.6 : 1};
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const RatingFilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AdvancedFiltersContainer = styled.div`
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
  margin-top: 16px;
`;

const FilterRowContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ThreeElementFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const RatingModeToggle = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  border-radius: 4px;
  background: ${props => props.$active ? '#2563eb' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#1d4ed8' : '#f9fafb'};
    border-color: ${props => props.$active ? '#1d4ed8' : '#9ca3af'};
  }
`;

const RatingButton = styled.button<{ $active: boolean; $isLoading?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  border-radius: 20px;
  background: ${props => props.$active ? '#2563eb' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  font-size: 13px;
  font-weight: 500;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isLoading ? 0.6 : 1};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#1d4ed8' : '#f9fafb'};
    border-color: ${props => props.$active ? '#1d4ed8' : '#9ca3af'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: 80px;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// =============== 메인 컴포넌트 ===============

export const ReviewFilter: React.FC<ReviewFilterProps> = ({
                                                              totalCount,
                                                              currentFilter,
                                                              onFilterChange,
                                                              isLoading = false,
                                                          }) => {

    /**
     * 정렬 옵션 변경 처리
     */
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = event.target.value as ReviewSortOption;
        onFilterChange({
            ...currentFilter,
            sort: newSort,
        });
    };

    /**
     * 별점 필터 변경 처리
     */
    const handleRatingChange = (rating: number) => {
        onFilterChange({
            ...currentFilter,
            rating,
        });
    };

    /**
     * 평점 모드 변경 처리 (이상 vs 정확)
     */
    const handleRatingModeChange = (exactRating: boolean) => {
        onFilterChange({
            ...currentFilter,
            exactRating,
        });
    };

    /**
     * 착용감 필터 변경 처리
     */
    const handleSizeFitChange = (sizeFit: number) => {
        onFilterChange({
            ...currentFilter,
            sizeFit,
        });
    };

    /**
     * 쿠션감 필터 변경 처리
     */
    const handleCushionChange = (cushion: number) => {
        onFilterChange({
            ...currentFilter,
            cushion,
        });
    };

    /**
     * 안정성 필터 변경 처리
     */
    const handleStabilityChange = (stability: number) => {
        onFilterChange({
            ...currentFilter,
            stability,
        });
    };

    /**
     * 정렬 옵션의 라벨을 가져오는 함수
     */
    const getSortLabel = (value: ReviewSortOption): string => {
        const option = SORT_OPTIONS.find(opt => opt.value === value);
        return option?.label || '최신순';
    };

    return (
        <FilterContainer>
            <FilterHeader>
                {/* 리뷰 개수 표시 */}
                <ReviewCount>
                    <CountText>
                        리뷰 <span className="count">{formatNumber(totalCount)}</span>개
                        {isLoading && (
                            <>
                                <LoadingSpinner />
                                불러오는 중...
                            </>
                        )}
                    </CountText>
                </ReviewCount>

                {/* 필터 컨트롤들 */}
                <FilterControls>
                    {/* 정렬 옵션 */}
                    <FilterGroup>
                        <FilterLabel htmlFor="sort-select">정렬</FilterLabel>
                        <Select
                            id="sort-select"
                            value={currentFilter.sort}
                            onChange={handleSortChange}
                            disabled={isLoading}
                            $isLoading={isLoading}
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </FilterGroup>

                    {/* 별점 필터 */}
                    <FilterGroup>
                        <FilterLabel>별점 필터</FilterLabel>
                        
                        {/* 평점 모드 토글 */}
                        {currentFilter.rating > 0 && (
                            <RatingModeToggle>
                                <ModeButton
                                    type="button"
                                    $active={!currentFilter.exactRating}
                                    onClick={() => handleRatingModeChange(false)}
                                    disabled={isLoading}
                                >
                                    이상
                                </ModeButton>
                                <ModeButton
                                    type="button"
                                    $active={currentFilter.exactRating}
                                    onClick={() => handleRatingModeChange(true)}
                                    disabled={isLoading}
                                >
                                    정확히
                                </ModeButton>
                            </RatingModeToggle>
                        )}
                        
                        <RatingFilterContainer>
                            {RATING_OPTIONS.map(option => (
                                <RatingButton
                                    key={option.value}
                                    type="button"
                                    $active={currentFilter.rating === option.value}
                                    $isLoading={isLoading}
                                    onClick={() => handleRatingChange(option.value)}
                                    disabled={isLoading}
                                    title={`${currentFilter.exactRating && option.value > 0 ? option.exactLabel : option.label} 리뷰만 보기`}
                                >
                                    {currentFilter.exactRating && option.value > 0 ? option.exactLabel : option.label}
                                </RatingButton>
                            ))}
                        </RatingFilterContainer>
                    </FilterGroup>
                </FilterControls>
            </FilterHeader>

            {/* 3Element 필터 섹션 */}
            <AdvancedFiltersContainer>
                <FilterRowContainer>
                    {/* 사이즈 필터 */}
                    <ThreeElementFilterContainer>
                        <FilterLabel>사이즈</FilterLabel>
                        <FilterButtons>
                            {SIZE_FIT_OPTIONS.map(option => (
                                <RatingButton
                                    key={option.value}
                                    type="button"
                                    $active={currentFilter.sizeFit === option.value}
                                    $isLoading={isLoading}
                                    onClick={() => handleSizeFitChange(option.value)}
                                    disabled={isLoading}
                                    title={`사이즈가 ${option.label}인 리뷰만 보기`}
                                >
                                    {option.label}
                                </RatingButton>
                            ))}
                        </FilterButtons>
                    </ThreeElementFilterContainer>

                    {/* 쿠션감 필터 */}
                    <ThreeElementFilterContainer>
                        <FilterLabel>쿠션감</FilterLabel>
                        <FilterButtons>
                            {CUSHION_OPTIONS.map(option => (
                                <RatingButton
                                    key={option.value}
                                    type="button"
                                    $active={currentFilter.cushion === option.value}
                                    $isLoading={isLoading}
                                    onClick={() => handleCushionChange(option.value)}
                                    disabled={isLoading}
                                    title={`쿠션감이 ${option.label}인 리뷰만 보기`}
                                >
                                    {option.label}
                                </RatingButton>
                            ))}
                        </FilterButtons>
                    </ThreeElementFilterContainer>

                    {/* 안정성 필터 */}
                    <ThreeElementFilterContainer>
                        <FilterLabel>안정성</FilterLabel>
                        <FilterButtons>
                            {STABILITY_OPTIONS.map(option => (
                                <RatingButton
                                    key={option.value}
                                    type="button"
                                    $active={currentFilter.stability === option.value}
                                    $isLoading={isLoading}
                                    onClick={() => handleStabilityChange(option.value)}
                                    disabled={isLoading}
                                    title={`안정성이 ${option.label}인 리뷰만 보기`}
                                >
                                    {option.label}
                                </RatingButton>
                            ))}
                        </FilterButtons>
                    </ThreeElementFilterContainer>
                </FilterRowContainer>
            </AdvancedFiltersContainer>

            {/* 현재 적용된 필터 정보 (선택적 표시) */}
            {(currentFilter.rating > 0 || 
              currentFilter.sort !== 'latest' || 
              currentFilter.sizeFit > 0 || 
              currentFilter.cushion > 0 || 
              currentFilter.stability > 0) && (
                <FilterSummary>
                    <SummaryText>
                        {currentFilter.rating > 0 && (
                            <span>
                                {currentFilter.exactRating 
                                    ? `${currentFilter.rating}점` 
                                    : `${currentFilter.rating}점 이상`} 리뷰
                            </span>
                        )}
                        {currentFilter.rating > 0 && (currentFilter.sort !== 'latest' || currentFilter.sizeFit > 0 || currentFilter.cushion > 0 || currentFilter.stability > 0) && ' • '}
                        {currentFilter.sort !== 'latest' && (
                            <span>{getSortLabel(currentFilter.sort)}</span>
                        )}
                        {currentFilter.sort !== 'latest' && (currentFilter.sizeFit > 0 || currentFilter.cushion > 0 || currentFilter.stability > 0) && ' • '}
                        {currentFilter.sizeFit > 0 && (
                            <span>사이즈: {SIZE_FIT_OPTIONS.find(opt => opt.value === currentFilter.sizeFit)?.label}</span>
                        )}
                        {currentFilter.sizeFit > 0 && (currentFilter.cushion > 0 || currentFilter.stability > 0) && ' • '}
                        {currentFilter.cushion > 0 && (
                            <span>쿠션감: {CUSHION_OPTIONS.find(opt => opt.value === currentFilter.cushion)?.label}</span>
                        )}
                        {currentFilter.cushion > 0 && currentFilter.stability > 0 && ' • '}
                        {currentFilter.stability > 0 && (
                            <span>안정성: {STABILITY_OPTIONS.find(opt => opt.value === currentFilter.stability)?.label}</span>
                        )}
                        {' 적용됨'}
                    </SummaryText>

                    <ResetButton
                        type="button"
                        onClick={() => onFilterChange({ 
                            sort: 'latest', 
                            rating: 0, 
                            exactRating: false, 
                            sizeFit: 0, 
                            cushion: 0, 
                            stability: 0 
                        })}
                        disabled={isLoading}
                    >
                        필터 초기화
                    </ResetButton>
                </FilterSummary>
            )}
        </FilterContainer>
    );
};

// =============== 추가 스타일 컴포넌트 ===============

const FilterSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  margin-top: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

const SummaryText = styled.div`
  font-size: 13px;
  color: #6b7280;
  
  span {
    font-weight: 500;
    color: #2563eb;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// =============== 사용 예시 (개발 참고용) ===============

/**
 * 사용 예시:
 *
 * const [filter, setFilter] = useState<ReviewFilterState>({
 *   sort: 'latest',
 *   rating: 0
 * });
 *
 * <ReviewFilter
 *   totalCount={reviews.length}
 *   currentFilter={filter}
 *   onFilterChange={setFilter}
 *   isLoading={isLoading}
 * />
 */