import styled from "styled-components";

export const Container = styled.div`
  max-width: 960px;
  margin: 60px auto;
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
`;

export const SuccessIcon = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 4rem;
`;

export const SuccessTitle = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 8px;
`;

export const SuccessSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 32px;
`;

export const OrderNumber = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #3b82f6;
`;

export const OrderNumberLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

export const OrderNumberValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 32px;
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 8px;
`;

export const InfoRow = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
`;

export const Bold = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

export const ProductInfo = styled.div`
  flex: 1;
`;

export const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 4px;
`;

export const ProductDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ProductPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
  font-size: 1rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const FinalTotalRow = styled(TotalRow)`
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  margin-top: 12px;
`;

export const PointsEarned = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid #f59e0b;
`;

export const PointsLabel = styled.div`
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 4px;
`;

export const PointsValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #b45309;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PrimaryButton = styled(Button)<{ disabled?: boolean }>`
  background: ${({ disabled }) =>
    disabled ? "#a5b4fc" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  color: white;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  width: 100%;
  margin-bottom: 12px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

export const SecondaryButton = styled(Button)`
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
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

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;

export const ThankYou = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
`;

export const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  gap: 8px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
  }
`;

export const Notice = styled.div`
  background: #f3f6fa;
  padding: 14px;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
`;