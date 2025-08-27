import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  background: #ffffff;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SummarySection = styled.div`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

export const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
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

export const DeliveryRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RequestOptionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

export const RequestOptionButton = styled.button<{ selected: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.selected ? "#3b82f6" : "#d1d5db")};
  border-radius: 6px;
  background: ${(props) => (props.selected ? "#f0f9ff" : "white")};
  color: ${(props) => (props.selected ? "#3b82f6" : "#374151")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CustomRequestContainer = styled.div<{ show: boolean }>`
  margin-top: ${(props) => (props.show ? "8px" : "0")};
  max-height: ${(props) => (props.show ? "200px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentMethodContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const PaymentMethodButton = styled.button<{ selected: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.selected ? "#3b82f6" : "#d1d5db")};
  border-radius: 6px;
  background: ${(props) => (props.selected ? "#f0f9ff" : "white")};
  color: ${(props) => (props.selected ? "#3b82f6" : "#374151")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

export const PointContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  background: white;
`;

export const PointHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const PointToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

export const ToggleSlider = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #3b82f6;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

export const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const PointInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
`;

export const PointBalance = styled.span`
  font-weight: 600;
  color: #3b82f6;
`;

export const PointInputContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  transition: all 0.2s ease;
`;

export const UseAllButton = styled.button`
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
  min-width: 70px;

  &:hover {
    background: #e5e7eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SummaryCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
`;

export const TotalPrice = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #3b82f6;
  text-align: right;
  margin-bottom: 18px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const PrimaryButton = styled(Button)<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? "#9ca3af" : "#3b82f6")};
  color: white;
  margin-bottom: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: #2563eb;
  }
`;

export const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;

  &:hover {
    background: #e5e7eb;
  }
`;

export const Notice = styled.div`
  background: #f9fafb;
  padding: 14px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
`;

export const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  gap: 8px;
`;

export const ProductHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const ProductPreview = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #374151;
  background: white;
`;

export const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

export const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const ProductPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
  text-align: right;
  flex-shrink: 0;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const LoadingSpinner = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &::after {
    content: "";
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;