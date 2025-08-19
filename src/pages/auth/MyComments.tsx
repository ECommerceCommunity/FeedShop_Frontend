import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import FeedService from "../../api/feedService";
import { formatKoreanDate } from "../../utils/dateUtils";

// 타입 정의
interface MyCommentItem {
  id: number;
  content: string;
  createdAt: string;
  feed: {
    id: number;
    title: string;
    feedType: string;
    user: {
      nickname: string;
      profileImg?: string;
    };
  };
}

interface MyCommentListResponse {
  content: MyCommentItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// 스타일드 컴포넌트
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const FeedInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const FeedTypeBadge = styled.span<{ feedType: string }>`
  background: ${({ feedType }) => {
    switch (feedType) {
      case 'EVENT': return '#3b82f6';
      case 'RANKING': return '#f59e0b';
      default: return '#10b981';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.75rem;
`;

const FeedTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const FeedAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const AuthorProfile = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentContent = styled.div`
  margin-bottom: 1rem;
`;

const CommentText = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentDate = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  background: ${({ isActive }) => isActive ? '#3b82f6' : 'white'};
  color: ${({ isActive }) => isActive ? 'white' : '#374151'};
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ isActive }) => isActive ? '#2563eb' : '#f3f4f6'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MyCommentsPage: React.FC = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<MyCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  const fetchMyComments = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await FeedService.getMyComments(page, 20);
      const data = response.data as MyCommentListResponse;
      
      setComments(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error: any) {
      console.error('내 댓글 조회 실패:', error);
      setError(error.response?.data?.message || '댓글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  const handleDeleteClick = (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      handleDeleteConfirm(commentId);
    }
  };

  const handleDeleteConfirm = async (commentId: number) => {
    try {
      setDeletingCommentId(commentId);
      
      // 댓글 삭제 API 호출
      await FeedService.deleteComment(commentId, commentId); // feedId와 commentId 모두 commentId로 전달
      
      // 삭제 성공 시 목록에서 제거
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // 현재 페이지가 비어있고 이전 페이지가 있다면 이전 페이지로 이동
      if (comments.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
        fetchMyComments(currentPage - 1);
      }
    } catch (error: any) {
      console.error('댓글 삭제 실패:', error);
      alert(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMyComments(page);
  };

  const getFeedTypeText = (feedType: string) => {
    switch (feedType) {
      case 'EVENT': return '이벤트';
      case 'RANKING': return '랭킹';
      default: return '일상';
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div>댓글 목록을 불러오는 중...</div>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <div>오류가 발생했습니다: {error}</div>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>내 댓글 목록</Title>
        <Subtitle>내가 작성한 댓글들을 확인하고 관리할 수 있습니다.</Subtitle>
      </Header>

      {comments.length === 0 ? (
        <EmptyState>
          <div>아직 작성한 댓글이 없습니다.</div>
        </EmptyState>
      ) : (
        <>
          <CommentList>
            {comments.map((comment) => (
              <CommentCard key={comment.id}>
                <FeedInfo>
                  <FeedTypeBadge feedType={comment.feed.feedType}>
                    {getFeedTypeText(comment.feed.feedType)}
                  </FeedTypeBadge>
                  <FeedTitle>{comment.feed.title}</FeedTitle>
                  <FeedAuthor>
                    {comment.feed.user.profileImg && (
                      <AuthorProfile src={comment.feed.user.profileImg} alt="프로필" />
                    )}
                    <span>{comment.feed.user.nickname}</span>
                  </FeedAuthor>
                </FeedInfo>

                <CommentContent>
                  <CommentText>{comment.content}</CommentText>
                </CommentContent>

                <CommentMeta>
                  <CommentDate>{formatKoreanDate(comment.createdAt)}</CommentDate>
                  <DeleteButton
                    onClick={() => handleDeleteClick(comment.id)}
                    disabled={deletingCommentId === comment.id}
                  >
                    {deletingCommentId === comment.id ? '삭제 중...' : '삭제'}
                  </DeleteButton>
                </CommentMeta>
              </CommentCard>
            ))}
          </CommentList>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationButton
                  key={i}
                  isActive={i === currentPage}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default MyCommentsPage;
