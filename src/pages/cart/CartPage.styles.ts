import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  min-height: 100vh;
  background: #ffffff;
`;

export const CartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    margin-bottom: 32px;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
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
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
`;

export const SelectAllLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3b82f6;
  }
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
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

export const ItemCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;
  transform: scale(1.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

export const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 96px;
  padding: 4px 0;
`;

export const ItemDetails = styled.div`
  margin-bottom: 12px;
`;

export const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.25;
`;

export const ItemOption = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

export const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const DiscountPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #3b82f6;
`;

export const OriginalPrice = styled.span`
  font-size: 0.95rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
  opacity: 0.8;
`;

export const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
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
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
`;

export const SummaryLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
  font-size: 1rem;
`;

export const SummaryValue = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
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
      : "#3b82f6"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  text-align: center;
  color: #6b7280;
  background: #f8fafc;
  border-radius: 20px;
  padding: 48px;
  border: 2px dashed #cbd5e1;
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  color: #94a3b8;
  opacity: 0.8;
  
  i {
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, #374151 0%, #64748b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

export const EmptyMessage = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 32px;
  font-weight: 500;
`;

export const ShoppingButton = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  letter-spacing: -0.01em;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #64748b;
  background: #f8fafc;
  border-radius: 20px;
  gap: 16px;
  
  i {
    font-size: 2rem;
    color: #3b82f6;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }
`;