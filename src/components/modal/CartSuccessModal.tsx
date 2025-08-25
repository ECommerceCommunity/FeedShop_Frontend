import React from "react";
import styled, { keyframes } from "styled-components";

// 애니메이션 효과
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.18);
  padding: 40px 32px 32px 32px;
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
  position: relative;
  animation: ${slideUp} 0.3s ease-out;

  @media (max-width: 480px) {
    padding: 32px 24px 24px 24px;
    min-width: 280px;
  }
`;

const SuccessIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
  position: relative;

  &::after {
    content: "✨";
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    animation: ${fadeIn} 0.5s ease-out 0.3s both;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
`;

const Message = styled.p`
  font-size: 1.05rem;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  background: ${(props) =>
    props.$primary ? "linear-gradient(135deg, #667eea, #4f8a8b)" : "#f3f4f6"};
  color: ${(props) => (props.$primary ? "#fff" : "#374151")};
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
  box-shadow: ${(props) =>
    props.$primary
      ? "0 2px 8px rgba(102, 126, 234, 0.12)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$primary ? "linear-gradient(135deg, #4f8a8b, #667eea)" : "#e5e7eb"};
    transform: translateY(-2px) scale(1.03);
    box-shadow: ${(props) =>
      props.$primary
        ? "0 4px 16px rgba(102, 126, 234, 0.2)"
        : "0 4px 8px rgba(0, 0, 0, 0.15)"};
  }

  @media (max-width: 480px) {
    min-width: unset;
    width: 100%;
  }
`;

interface CartSuccessModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onGoToCart: () => void;
}

const CartSuccessModal: React.FC<CartSuccessModalProps> = ({
  open,
  title = "장바구니 추가 완료",
  message,
  onClose,
  onGoToCart,
}) => {
  if (!open) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <SuccessIcon>🛒</SuccessIcon>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button onClick={onClose}>쇼핑 계속하기</Button>
          <Button $primary onClick={onGoToCart}>
            장바구니로 이동
          </Button>
        </ButtonContainer>
      </ModalBox>
    </ModalOverlay>
  );
};

export default CartSuccessModal;
