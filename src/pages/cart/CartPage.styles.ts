import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const CartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

export const CartTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

export const SelectAllLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #374151;
  cursor: pointer;
`;

export const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CartItemCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const ItemCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

export const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemDetails = styled.div``;

export const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

export const ItemOption = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

export const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const DiscountPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #3b82f6;
`;

export const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

export const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #374151;
  background: white;

  &:focus {
    outline: none;
  }
`;

export const RemoveButton = styled.button`
  padding: 6px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #ef4444;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

export const SummaryCard = styled(Card)`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

export const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SummaryLabel = styled.span`
  color: #6b7280;
`;

export const SummaryValue = styled.span`
  font-weight: 600;
  color: #374151;
`;

export const TotalRow = styled(SummaryRow)`
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
  margin-bottom: 20px;
`;

export const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
`;

export const TotalValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #3b82f6;
`;

export const CheckoutButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) =>
    props.disabled
      ? "#9ca3af"
      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #6b7280;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
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
  margin-bottom: 24px;
`;

export const ShoppingButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;