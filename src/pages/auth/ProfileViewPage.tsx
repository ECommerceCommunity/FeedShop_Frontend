import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserProfileService,
  UserProfileData,
} from "../../api/userProfileService";
import { convertMockUrlToCdnUrl } from "../../utils/common/images";

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

const ProfileCard = styled.div`
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

const ProfileImage = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f97316;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #f97316;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background: linear-gradient(135deg, #f97316, #ef4444);
        color: white;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
        }
      `
      : `
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
      `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 2rem;
  font-size: 1.1rem;
`;

function ProfileViewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const profile = await UserProfileService.getUserProfile();
        setProfileData(profile);
      } catch (err: any) {
        console.error("프로필 로드 실패:", err);
        setError(err.message || "프로필 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleEdit = () => {
    navigate("/profile-edit");
  };

  const handleBack = () => {
    navigate("/mypage");
  };

  if (loading) {
    return (
      <Container>
        <ProfileCard>
          <LoadingSpinner>
            <i
              className="fas fa-spinner fa-spin"
              style={{ marginRight: "1rem" }}
            ></i>
            프로필 정보를 불러오는 중...
          </LoadingSpinner>
        </ProfileCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ProfileCard>
          <ErrorMessage>
            <i
              className="fas fa-exclamation-triangle"
              style={{ fontSize: "2rem", marginBottom: "1rem" }}
            ></i>
            <div>{error}</div>
            <Button
              onClick={() => window.location.reload()}
              style={{ marginTop: "1rem" }}
            >
              다시 시도
            </Button>
          </ErrorMessage>
        </ProfileCard>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container>
        <ProfileCard>
          <ErrorMessage>프로필 정보를 찾을 수 없습니다.</ErrorMessage>
        </ProfileCard>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <Header>
          <Title>프로필 정보</Title>
          <Subtitle>현재 등록된 프로필 정보를 확인하세요</Subtitle>
        </Header>

        <ProfileImage>
          <Image
            src={
              profileData.profileImageUrl
                ? convertMockUrlToCdnUrl(profileData.profileImageUrl)
                : "https://via.placeholder.com/150x150/374151/9CA3AF?text=프로필"
            }
            alt="프로필 이미지"
          />
        </ProfileImage>

        <InfoGrid>
          <InfoSection>
            <SectionTitle>
              <i className="fas fa-user"></i>
              기본 정보
            </SectionTitle>
            <InfoItem>
              <Label>이름</Label>
              <Value>{profileData.name || "미입력"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>닉네임</Label>
              <Value>{profileData.nickname || "미입력"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>이메일</Label>
              <Value>{profileData.email || "미입력"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>전화번호</Label>
              <Value>{profileData.phone || "미입력"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>성별</Label>
              <Value>
                {profileData.gender === "MALE"
                  ? "남성"
                  : profileData.gender === "FEMALE"
                  ? "여성"
                  : "미입력"}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>생년월일</Label>
              <Value>{profileData.birthDate || "미입력"}</Value>
            </InfoItem>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fas fa-ruler-combined"></i>
              신체 정보
            </SectionTitle>
            <InfoItem>
              <Label>키</Label>
              <Value>
                {profileData.height ? `${profileData.height}cm` : "미입력"}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>몸무게</Label>
              <Value>
                {profileData.weight ? `${profileData.weight}kg` : "미입력"}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>발 사이즈</Label>
              <Value>
                {profileData.footSize ? `${profileData.footSize}mm` : "미입력"}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>발 너비</Label>
              <Value>
                {profileData.footWidth === "NARROW"
                  ? "좁음"
                  : profileData.footWidth === "NORMAL"
                  ? "보통"
                  : profileData.footWidth === "WIDE"
                  ? "넓음"
                  : "미입력"}
              </Value>
            </InfoItem>
          </InfoSection>
        </InfoGrid>

        <ButtonGroup>
          <Button onClick={handleBack}>
            <i
              className="fas fa-arrow-left"
              style={{ marginRight: "0.5rem" }}
            ></i>
            뒤로가기
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            <i className="fas fa-edit" style={{ marginRight: "0.5rem" }}></i>
            수정하기
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/account-settings")}
          >
            <i className="fas fa-cog" style={{ marginRight: "0.5rem" }}></i>
            계정 설정
          </Button>
        </ButtonGroup>
      </ProfileCard>
    </Container>
  );
}

export default ProfileViewPage;
