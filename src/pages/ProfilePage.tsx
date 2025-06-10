import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const SectionDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ImageUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
  }
`;

const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.variant === "primary" ? props.theme.colors.primary : "white"};
  color: ${(props) =>
    props.variant === "primary" ? "white" : props.theme.colors.text};
  border: 1px solid
    ${(props) =>
      props.variant === "primary" ? "transparent" : props.theme.colors.border};

  &:hover {
    background: ${(props) =>
      props.variant === "primary"
        ? props.theme.colors.secondary
        : props.theme.colors.background};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.background};
    cursor: not-allowed;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const InfoLabel = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
`;

const NotificationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const NotificationGroup = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 1rem;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const NotificationInfo = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const NotificationDescription = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0.25rem 0 0;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-left: 1rem;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${(props) => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.border};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ProfilePage: React.FC = () => {
  const [profileInfo, setProfileInfo] = useState({
    name: "김관리자",
    email: "admin@example.com",
    phone: "010-1234-5678",
    profileImage: "https://via.placeholder.com/120",
    userId: "admin2025",
    role: "최고 관리자",
    lastLogin: "2025-06-07 08:45:32",
    createdAt: "2024-01-15",
  });

  const [notifications, setNotifications] = useState({
    email: {
      notice: true,
      security: true,
      marketing: false,
    },
    push: {
      chat: true,
      comment: true,
      like: false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChanged, setIsChanged] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsChanged(true);
  };

  const handleNotificationChange = (
    category: "email" | "push",
    type: string
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type as keyof (typeof prev)[typeof category]],
      },
    }));
    setIsChanged(true);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileInfo((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
        setIsChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileInfo((prev) => ({
      ...prev,
      profileImage: "https://via.placeholder.com/120",
    }));
    setIsChanged(true);
  };

  const handleSave = () => {
    // TODO: API 호출로 저장
    alert("변경사항이 저장되었습니다.");
    setIsChanged(false);
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <Container>
      <ProfileSection>
        <SectionHeader>
          <SectionTitle>프로필 정보</SectionTitle>
          <SectionDescription>
            관리자 계정의 기본 정보를 관리합니다.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <ProfileImageContainer>
            <ProfileImage
              src={profileInfo.profileImage}
              alt="프로필 이미지"
              onClick={handleProfileImageClick}
            />
            <ImageUploadButton onClick={handleProfileImageClick}>
              <i className="fas fa-camera"></i>
            </ImageUploadButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </ProfileImageContainer>
          <ImageActions>
            <ActionButton onClick={handleProfileImageClick}>
              이미지 변경
            </ActionButton>
            <ActionButton onClick={handleRemoveProfileImage}>삭제</ActionButton>
          </ImageActions>

          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={profileInfo.name}
              onChange={handleProfileChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={profileInfo.email}
              disabled
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#666",
                marginTop: "0.25rem",
              }}
            >
              이메일은 변경할 수 없습니다.
            </p>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">연락처</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={profileInfo.phone}
              onChange={handleProfileChange}
            />
          </FormGroup>
        </SectionContent>
      </ProfileSection>

      <ProfileSection>
        <SectionHeader>
          <SectionTitle>계정 정보</SectionTitle>
          <SectionDescription>
            관리자 계정의 상세 정보입니다.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>아이디</InfoLabel>
              <InfoValue>{profileInfo.userId}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>권한 수준</InfoLabel>
              <InfoValue style={{ color: "#3b82f6" }}>
                {profileInfo.role}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>마지막 로그인</InfoLabel>
              <InfoValue>{profileInfo.lastLogin}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>계정 생성일</InfoLabel>
              <InfoValue>{profileInfo.createdAt}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </SectionContent>
      </ProfileSection>

      <ProfileSection>
        <SectionHeader>
          <SectionTitle>알림 설정</SectionTitle>
          <SectionDescription>알림 수신 방법을 설정합니다.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <NotificationSection>
            <NotificationGroup>
              <h3>이메일 알림</h3>
              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>공지사항 알림</NotificationTitle>
                  <NotificationDescription>
                    새로운 공지사항이 등록되면 알림을 받습니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.email.notice}
                    onChange={() => handleNotificationChange("email", "notice")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>

              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>보안 알림</NotificationTitle>
                  <NotificationDescription>
                    계정 보안 관련 변경사항을 알립니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.email.security}
                    onChange={() =>
                      handleNotificationChange("email", "security")
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>

              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>마케팅 알림</NotificationTitle>
                  <NotificationDescription>
                    새로운 기능 및 이벤트 정보를 받습니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.email.marketing}
                    onChange={() =>
                      handleNotificationChange("email", "marketing")
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>
            </NotificationGroup>

            <NotificationGroup>
              <h3>푸시 알림</h3>
              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>채팅 메시지 알림</NotificationTitle>
                  <NotificationDescription>
                    새로운 채팅 메시지를 받으면 알립니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.push.chat}
                    onChange={() => handleNotificationChange("push", "chat")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>

              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>댓글 알림</NotificationTitle>
                  <NotificationDescription>
                    내 게시글에 새 댓글이 달리면 알립니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.push.comment}
                    onChange={() => handleNotificationChange("push", "comment")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>

              <NotificationItem>
                <NotificationInfo>
                  <NotificationTitle>좋아요 알림</NotificationTitle>
                  <NotificationDescription>
                    내 게시글에 좋아요를 받으면 알립니다.
                  </NotificationDescription>
                </NotificationInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={notifications.push.like}
                    onChange={() => handleNotificationChange("push", "like")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </NotificationItem>
            </NotificationGroup>
          </NotificationSection>
        </SectionContent>
      </ProfileSection>

      <ButtonGroup>
        <ActionButton onClick={handleCancel}>취소</ActionButton>
        <ActionButton
          variant="primary"
          onClick={handleSave}
          disabled={!isChanged}
          style={{
            opacity: isChanged ? 1 : 0.5,
            cursor: isChanged ? "pointer" : "not-allowed",
          }}
        >
          변경사항 저장
        </ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default ProfilePage;
