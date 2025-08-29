import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  background: #ffffff;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
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
    background: ${(props) => (props.$active ? "#2563eb" : "#f9fafb")};
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  align-items: start;
`;

export const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
  min-height: 400px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
  min-height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
  font-size: 1.1rem;
  font-weight: 600;
  color: #3b82f6;
`;

export const OriginalPrice = styled.span`
  font-size: 0.875rem;
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
  min-height: 300px;
  font-size: 1rem;
  color: #6b7280;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #ef4444;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
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
    background: ${(props) => (props.$active ? "#2563eb" : "#f9fafb")};
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
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

export const AIRecommendSection = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const AIRecommendTitle = styled.h2`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: "🤖";
    font-size: 1.25rem;
  }
`;

export const AIInfoMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: "👤";
    font-size: 1rem;
  }
`;

export const AIInputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const AIInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const AIButton = styled.button<{ $loading?: boolean }>`
  padding: 12px 20px;
  background: ${props => props.$loading ? '#9ca3af' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.$loading || props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$loading || props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const AIResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 6px;
  color: #0f172a;
`;

export const AIResultsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3b82f6;
  
  &::before {
    content: "✨";
  }
`;

export const AIResultsCount = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ClearAIButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;