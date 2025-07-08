import { FC, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 20px 60px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
`;

const BenefitsSection = styled.div`
  margin-bottom: 40px;
`;

const BenefitsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const BenefitCard = styled.div`
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 24px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const BenefitTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const BenefitDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
`;

const FormSection = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
`;

const FormTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const WarningSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const WarningTitle = styled.h4`
  color: #92400e;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarningText = styled.p`
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BecomeAdminPage: FC = () => {
  const navigate = useNavigate();
  const { user, updateUserType } = useAuth();
  const [formData, setFormData] = useState({
    adminCode: "",
    reason: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    navigate("/login");
    return null;
  }

  // 이미 관리자인 경우 관리자 대시보드로 리다이렉트
  if (user.userType === "admin") {
    navigate("/admin-dashboard");
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 실제로는 API 호출을 통해 관리자 전환 요청을 보냄
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션

      // 성공적으로 관리자로 전환
      updateUserType("admin");

      // 성공 메시지와 함께 관리자 대시보드로 이동
      alert("관리자 전환이 완료되었습니다!");
      navigate("/admin-dashboard");
    } catch (error) {
      alert("관리자 전환 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <PageContainer>
      <Container>
        <Card>
          <Header>
            <Title>관리자 전환</Title>
            <Subtitle>
              FeedShop에서 관리자가 되어 시스템을 관리하고 모니터링하세요
            </Subtitle>
          </Header>

          <BenefitsSection>
            <BenefitsTitle>관리자가 되면 얻을 수 있는 혜택</BenefitsTitle>
            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-chart-line"></i>
                </BenefitIcon>
                <BenefitTitle>시스템 모니터링</BenefitTitle>
                <BenefitDescription>
                  전체 시스템의 상태와 성능을 실시간으로 모니터링하고 관리할 수
                  있습니다
                </BenefitDescription>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-users"></i>
                </BenefitIcon>
                <BenefitTitle>사용자 관리</BenefitTitle>
                <BenefitDescription>
                  모든 사용자의 정보를 관리하고 권한을 조정할 수 있습니다
                </BenefitDescription>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-shield-alt"></i>
                </BenefitIcon>
                <BenefitTitle>보안 관리</BenefitTitle>
                <BenefitDescription>
                  시스템 보안을 관리하고 신고된 콘텐츠를 처리할 수 있습니다
                </BenefitDescription>
              </BenefitCard>
            </BenefitsGrid>
          </BenefitsSection>

          <WarningSection>
            <WarningTitle>
              <i className="fas fa-exclamation-triangle"></i>
              주의사항
            </WarningTitle>
            <WarningText>
              관리자 전환은 신중하게 결정해야 합니다. 관리자 권한은 시스템
              전체에 영향을 미칠 수 있으며, 잘못된 사용 시 법적 책임이 따를 수
              있습니다.
            </WarningText>
          </WarningSection>

          <FormSection>
            <FormTitle>관리자 인증 정보 입력</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="adminCode">관리자 인증 코드 *</Label>
                <Input
                  type="password"
                  id="adminCode"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleInputChange}
                  placeholder="관리자 인증 코드를 입력하세요"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="reason">관리자 전환 사유</Label>
                <TextArea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="관리자로 전환하고자 하는 사유를 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="experience">관리 경험</Label>
                <TextArea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="이전 관리 경험이 있다면 간단히 설명해주세요"
                />
              </FormGroup>

              <ButtonGroup>
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i
                        className="fas fa-spinner fa-spin"
                        style={{ marginRight: "8px" }}
                      ></i>
                      처리중...
                    </>
                  ) : (
                    <>
                      <i
                        className="fas fa-user-shield"
                        style={{ marginRight: "8px" }}
                      ></i>
                      관리자 전환하기
                    </>
                  )}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={handleCancel}>
                  <i
                    className="fas fa-times"
                    style={{ marginRight: "8px" }}
                  ></i>
                  취소
                </SecondaryButton>
              </ButtonGroup>
            </form>
          </FormSection>
        </Card>
      </Container>
    </PageContainer>
  );
};

export default BecomeAdminPage;
