import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  align-items: start; /* 카드들을 상단 정렬 */
`;

export const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%; /* 전체 높이 사용 */
  min-height: 400px; /* 최소 높이 지정 */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const ProductInfo = styled.div`
  padding: 16px;
  flex: 1; /* 남은 공간 모두 차지 */
  display: flex;
  flex-direction: column;
`;

export const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
  min-height: 2.8rem; /* 최소 2줄 높이 확보 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄로 제한 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductStore = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: auto; /* 자동 마진으로 가격 섹션을 아래로 푸시 */
  flex: 1; /* 남은 공간 차지 */
`;

export const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  margin-top: auto; /* 상단 자동 마진으로 하단에 고정 */
`;

export const DiscountPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ef4444;
`;

export const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

export const WishCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: #6b7280;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #ef4444;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

export const PaginationButton = styled.button<{
  $active?: boolean;
  $disabled?: boolean;
}>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 6px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

export const RetryButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;