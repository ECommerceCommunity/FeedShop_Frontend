import React from "react";
import styled from "styled-components";

const NoticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  margin: 20px;
`;

const NoticeIcon = styled.div`
  font-size: 4rem;
  color: #fbbf24;
  margin-bottom: 24px;
`;

const NoticeTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 16px;
`;

const NoticeMessage = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 20px;
`;

const NoticeSubMessage = styled.p`
  font-size: 0.95rem;
  color: #9ca3af;
  line-height: 1.5;
  max-width: 400px;
`;

interface PreparationNoticeProps {
  title?: string;
  message?: string;
  subMessage?: string;
}

/**
 * 준비중인 기능에 대한 알림을 표시하는 컴포넌트
 * 카테고리, 신상품, 인기상품 등 아직 API가 구현되지 않은 기능에 사용
 */
const PreparationNotice: React.FC<PreparationNoticeProps> = ({
  title = "준비중입니다",
  message = "현재 해당 기능을 준비 중입니다.",
  subMessage = "빠른 시일 내에 더 나은 서비스로 찾아뵙겠습니다."
}) => {
  return (
    <NoticeContainer>
      <NoticeIcon>🚧</NoticeIcon>
      <NoticeTitle>{title}</NoticeTitle>
      <NoticeMessage>{message}</NoticeMessage>
      <NoticeSubMessage>{subMessage}</NoticeSubMessage>
    </NoticeContainer>
  );
};

export default PreparationNotice;