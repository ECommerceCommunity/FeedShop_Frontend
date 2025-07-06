import { FC, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

const BecomeSellerPage: FC = () => {
  const navigate = useNavigate();
  const { user, updateUserType } = useAuth();
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    businessNumber: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    navigate("/login");
    return null;
  }

  // 이미 판매자인 경우 스토어 홈으로 리다이렉트
  if (user.userType === "seller") {
    navigate("/store-home");
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
      // 실제로는 API 호출을 통해 판매자 전환 요청을 보냄
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션

      // 성공적으로 판매자로 전환
      updateUserType("seller");

      // 성공 메시지와 함께 스토어 홈으로 이동
      alert("판매자 전환이 완료되었습니다!");
      navigate("/store-home");
    } catch (error) {
      alert("판매자 전환 중 오류가 발생했습니다. 다시 시도해주세요.");
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
            <Title>판매자 전환</Title>
            <Subtitle>
              FeedShop에서 판매자가 되어 새로운 비즈니스 기회를 만들어보세요
            </Subtitle>
          </Header>

          <BenefitsSection>
            <BenefitsTitle>판매자가 되면 얻을 수 있는 혜택</BenefitsTitle>
            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-store"></i>
                </BenefitIcon>
                <BenefitTitle>전용 스토어</BenefitTitle>
                <BenefitDescription>
                  나만의 브랜드 스토어를 만들고 상품을 등록할 수 있습니다
                </BenefitDescription>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-chart-line"></i>
                </BenefitIcon>
                <BenefitTitle>매출 분석</BenefitTitle>
                <BenefitDescription>
                  실시간 매출 통계와 고객 분석 데이터를 확인할 수 있습니다
                </BenefitDescription>
              </BenefitCard>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-comments"></i>
                </BenefitIcon>
                <BenefitTitle>고객 소통</BenefitTitle>
                <BenefitDescription>
                  실시간 채팅으로 고객과 직접 소통하고 문의를 처리할 수 있습니다
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
              판매자 전환 시 제공하신 정보는 검토 후 승인됩니다. 허위 정보 제공
              시 서비스 이용이 제한될 수 있습니다.
            </WarningText>
          </WarningSection>

          <FormSection>
            <FormTitle>스토어 정보 입력</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="storeName">스토어명 *</Label>
                <Input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="스토어명을 입력해주세요"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="storeDescription">스토어 설명</Label>
                <TextArea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleInputChange}
                  placeholder="스토어에 대한 간단한 설명을 입력해주세요"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="businessNumber">사업자등록번호 *</Label>
                <Input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleInputChange}
                  placeholder="000-00-00000"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contactEmail">연락처 이메일 *</Label>
                <Input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contactPhone">연락처 전화번호 *</Label>
                <Input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  required
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
                        className="fas fa-store"
                        style={{ marginRight: "8px" }}
                      ></i>
                      판매자 전환하기
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

export default BecomeSellerPage;
