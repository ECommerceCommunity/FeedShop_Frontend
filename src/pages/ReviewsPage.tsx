import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트
const PageContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textSecondary};
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "white"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.text)};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ReviewList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReviewCard = styled.div`
  background: white;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
`;

const ReviewDate = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ReviewContent = styled.p`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: ${(props) => props.theme.colors.error};
  }
`;

const ReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // 임시 리뷰 데이터
  const reviews = [
    {
      id: 1,
      userName: "김지연",
      userImage:
        "https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20Korean%20woman%20with%20friendly%20expression%2C%20high%20quality%20portrait%20photo%2C%20professional%20lighting%2C%20soft%20background%2C%20casual%20attire&width=100&height=100&seq=2&orientation=squarish",
      date: "2025-06-07",
      content:
        "친구들과 함께 방문했는데 분위기도 좋고 음식도 정말 맛있었어요. 특히 파스타가 일품이었습니다. 다음에 또 방문할 예정입니다.",
      rating: 5,
      images: [
        "https://readdy.ai/api/search-image?query=delicious%20pasta%20dish%20on%20a%20restaurant%20table%2C%20high%20quality%20food%20photography%2C%20professional%20lighting%2C%20appetizing%20presentation%2C%20Italian%20cuisine&width=150&height=100&seq=3&orientation=landscape",
        "https://readdy.ai/api/search-image?query=cozy%20restaurant%20interior%20with%20ambient%20lighting%2C%20modern%20design%2C%20comfortable%20seating%2C%20elegant%20table%20setting%2C%20warm%20atmosphere&width=150&height=100&seq=4&orientation=landscape",
      ],
    },
    // ... 더 많은 리뷰 데이터
  ];

  const handleDelete = (reviewId: number) => {
    // TODO: 리뷰 삭제 로직 구현
    console.log(`리뷰 ${reviewId} 삭제`);
  };

  const handleEdit = (reviewId: number) => {
    // TODO: 리뷰 수정 로직 구현
    console.log(`리뷰 ${reviewId} 수정`);
  };

  return (
    <PageContainer>
      <Header>
        <Title>리뷰 관리</Title>
      </Header>

      <SearchBar>
        <SearchIcon className="fas fa-search" />
        <SearchInput
          type="text"
          placeholder="리뷰 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <FilterSection>
        <FilterButton
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          전체
        </FilterButton>
        <FilterButton
          active={activeFilter === "positive"}
          onClick={() => setActiveFilter("positive")}
        >
          긍정적
        </FilterButton>
        <FilterButton
          active={activeFilter === "negative"}
          onClick={() => setActiveFilter("negative")}
        >
          부정적
        </FilterButton>
        <FilterButton
          active={activeFilter === "reported"}
          onClick={() => setActiveFilter("reported")}
        >
          신고된 리뷰
        </FilterButton>
      </FilterSection>

      <ReviewList>
        {reviews.map((review) => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <UserInfo>
                <UserAvatar src={review.userImage} alt={review.userName} />
                <div>
                  <UserName>{review.userName}</UserName>
                  <ReviewDate>{review.date}</ReviewDate>
                </div>
              </UserInfo>
              <ReviewActions>
                <ActionButton onClick={() => handleEdit(review.id)}>
                  <i className="fas fa-edit" />
                </ActionButton>
                <DeleteButton onClick={() => handleDelete(review.id)}>
                  <i className="fas fa-trash" />
                </DeleteButton>
              </ReviewActions>
            </ReviewHeader>
            <ReviewContent>{review.content}</ReviewContent>
          </ReviewCard>
        ))}
      </ReviewList>
    </PageContainer>
  );
};

export default ReviewsPage;
