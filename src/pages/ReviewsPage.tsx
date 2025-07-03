import { FC, useState } from "react";
import styled from "styled-components";
import reviews from "../pages/data/reviews/reviews.json";

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

  

const ReviewsPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
