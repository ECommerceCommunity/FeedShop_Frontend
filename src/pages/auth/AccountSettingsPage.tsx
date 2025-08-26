import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  min-height: 100vh;
  padding: 2rem;
  font-family: "Pretendard", sans-serif;
`;

const SettingsCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 3rem;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SettingsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(249, 115, 22, 0.3);
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f97316;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SettingsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(249, 115, 22, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
`;

const ItemDescription = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const ActionButton = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: linear-gradient(135deg, #f97316, #ef4444);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
          }
        `;
      case "danger":
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          &:hover {
            background: rgba(239, 68, 68, 0.2);
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
        `;
    }
  }}
`;

const WarningSection = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
`;

const WarningTitle = styled.h4`
  color: #ef4444;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WarningText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  padding: 1rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

function AccountSettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/mypage");
  };

  const handleProfileManagement = () => {
    navigate("/profile-view");
  };

  const handleWithdraw = () => {
    navigate("/withdraw");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container>
      <SettingsCard>
        <Header>
          <Title>계정 설정</Title>
          <Subtitle>계정 정보와 보안을 관리하세요</Subtitle>
        </Header>

        <SettingsGrid>
          {/* 프로필 관리 섹션 */}
          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-user-circle"></i>
              프로필 관리
            </SectionTitle>
            <SectionDescription>
              프로필 정보, 닉네임, 프로필 이미지 등을 관리할 수 있습니다.
            </SectionDescription>
            <SettingsItem>
              <ItemInfo>
                <ItemTitle>프로필 정보</ItemTitle>
                <ItemDescription>
                  이름, 닉네임, 연락처, 신체 정보 등
                </ItemDescription>
              </ItemInfo>
              <ActionButton variant="primary" onClick={handleProfileManagement}>
                관리하기
              </ActionButton>
            </SettingsItem>
          </SettingsSection>
        </SettingsGrid>

        {/* 회원 탈퇴 섹션 */}
        <WarningSection>
          <WarningTitle>
            <i className="fas fa-exclamation-triangle"></i>
            회원 탈퇴
          </WarningTitle>
          <WarningText>
            회원 탈퇴 시 모든 개인정보와 서비스 이용 기록이 영구적으로 삭제되며,
            복구할 수 없습니다. 신중하게 결정해주세요.
          </WarningText>
          <SettingsItem>
            <ItemInfo>
              <ItemTitle>계정 삭제</ItemTitle>
              <ItemDescription>
                모든 데이터와 함께 계정을 영구적으로 삭제합니다
              </ItemDescription>
            </ItemInfo>
            <ActionButton variant="danger" onClick={handleWithdraw}>
              탈퇴하기
            </ActionButton>
          </SettingsItem>
        </WarningSection>

        <ButtonGroup>
          <BackButton onClick={handleBack}>
            <i
              className="fas fa-arrow-left"
              style={{ marginRight: "0.5rem" }}
            ></i>
            마이페이지로 돌아가기
          </BackButton>
        </ButtonGroup>
      </SettingsCard>
    </Container>
  );
}

export default AccountSettingsPage;
