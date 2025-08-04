import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
`;

export const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
`;

export const ThumbnailImage = styled.img<{ $active?: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$active ? "#3b82f6" : "#e5e7eb")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StoreName = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

export const ProductName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.3;
`;

export const PriceSection = styled.div`
  margin-bottom: 24px;
`;

export const DiscountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const DiscountBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const OriginalPrice = styled.span`
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 1.1rem;
`;

export const CurrentPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
`;

export const OptionSection = styled.div`
  margin-bottom: 24px;
`;

export const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

export const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

export const SizeButton = styled.button<{
  $selected?: boolean;
  $outOfStock?: boolean;
}>`
  padding: 12px 8px;
  border: 1px solid ${(props) => (props.$selected ? "#3b82f6" : "#d1d5db")};
  background: ${(props) =>
    props.$outOfStock ? "#f3f4f6" : props.$selected ? "#3b82f6" : "white"};
  color: ${(props) =>
    props.$outOfStock ? "#9ca3af" : props.$selected ? "white" : "#374151"};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: ${(props) => (props.$outOfStock ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 16px;
  border: 1px solid
    ${(props) => (props.$variant === "primary" ? "#3b82f6" : "#d1d5db")};
  background: ${(props) =>
    props.$variant === "primary" ? "#3b82f6" : "white"};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#374151")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === "primary" ? "#2563eb" : "#f3f4f6"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DescriptionSection = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e5e7eb;
`;

export const DescriptionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

export const DescriptionText = styled.div`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const DetailImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
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

export const SelectedOptionsContainer = styled.div`
  margin: 24px 0;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
`;

export const SelectedOptionsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
`;

export const SelectedOptionItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const OptionInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SizeText = styled.span`
  font-weight: 600;
  color: #374151;
  min-width: 60px;
`;

export const StockInfo = styled.span<{ $lowStock?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$lowStock ? "#ea580c" : "#6b7280")};
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #374151;
`;

export const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #fef2f2;
  }
`;

export const TotalSummary = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  border: 1px solid #3b82f6;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e40af;
  }
`;