import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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
  animation: ${fadeIn} 0.2s;
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
  animation: ${fadeIn} 0.3s;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: #4f8a8b;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
`;

const Message = styled.p`
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 28px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea, #4f8a8b);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.12);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(135deg, #4f8a8b, #667eea);
    transform: translateY(-2px) scale(1.03);
  }
`;

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  title = "성공",
  message,
  onClose,
}) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <SuccessIcon>
          <i className="fas fa-check-circle"></i>
        </SuccessIcon>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Button onClick={onClose}>확인</Button>
      </ModalBox>
    </ModalOverlay>
  );
};

export default SuccessModal;
