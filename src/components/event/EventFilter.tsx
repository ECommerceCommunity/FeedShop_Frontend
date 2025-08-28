import React from 'react';
import styled from 'styled-components';
import type { EventType, EventStatus } from '../../types/event';

interface EventFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: EventStatus | 'ALL';
  onFilterChange: (filter: EventStatus | 'ALL') => void;
  sortType: string;
  onSortChange: (sort: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const FilterContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: white;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #f97316;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f97316;
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #2d3748;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' 
    ? '#f97316' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  border: 1px solid ${props => props.variant === 'primary' 
    ? '#f97316' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'primary' 
      ? '#ea580c' 
      : 'rgba(255, 255, 255, 0.2)'
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EventFilter: React.FC<EventFilterProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortType,
  onSortChange,
  onSearch,
  onReset
}) => {
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <FilterContainer>
      <FilterTitle>이벤트 검색 및 필터</FilterTitle>
      
      <FilterGrid>
        <FilterGroup>
          <FilterLabel>검색어</FilterLabel>
          <SearchInput
            type="text"
            placeholder="이벤트 제목 또는 설명을 입력하세요"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>상태</FilterLabel>
          <Select
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value as EventStatus | 'ALL')}
          >
            <option value="all">전체</option>
            <option value="UPCOMING">예정</option>
            <option value="ONGOING">진행중</option>
            <option value="ENDED">종료</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>정렬</FilterLabel>
          <Select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="upcoming">예정순</option>
            <option value="past">지난순</option>
          </Select>
        </FilterGroup>
      </FilterGrid>

      <ButtonGroup>
        <Button variant="secondary" onClick={onReset}>
          초기화
        </Button>
        <Button variant="primary" onClick={onSearch}>
          검색
        </Button>
      </ButtonGroup>
    </FilterContainer>
  );
};

export default EventFilter;
