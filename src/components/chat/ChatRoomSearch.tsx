import React, { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #87ceeb;
  }
`;

const SearchButton = styled.button`
  background-color: #87ceeb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #5fb4d9;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#87CEEB" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#5fb4d9" : "#e5e5e5")};
  }
`;

interface ChatRoomSearchProps {
  onSearch: (
    query: string,
    filters: {
      public: boolean;
      private: boolean;
      myRooms: boolean;
    }
  ) => void;
}

const ChatRoomSearch: React.FC<ChatRoomSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    public: true,
    private: true,
    myRooms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, filters);
  };

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="채팅방 검색..."
        />
        <SearchButton type="submit">
          <i className="fas fa-search"></i>
          검색
        </SearchButton>
      </SearchForm>
      <FilterContainer>
        <FilterButton
          active={filters.public}
          onClick={() => toggleFilter("public")}
        >
          공개 채팅방
        </FilterButton>
        <FilterButton
          active={filters.private}
          onClick={() => toggleFilter("private")}
        >
          비공개 채팅방
        </FilterButton>
        <FilterButton
          active={filters.myRooms}
          onClick={() => toggleFilter("myRooms")}
        >
          내 채팅방
        </FilterButton>
      </FilterContainer>
    </SearchContainer>
  );
};

export default ChatRoomSearch;
