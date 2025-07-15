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
  margin-top: 32px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 140px;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  `
      : `
    background: white;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
  `}
`;

const Alert = styled.div<{ type: "success" | "error" }>`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;

  ${({ type }) =>
    type === "success"
      ? `
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `
      : `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;

const BecomeSellerPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    storeName: "",
    businessNumber: "",
    phoneNumber: "",
    address: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
    setMessage(null);

    try {
      // 여기에 판매자 전환 API 호출 로직 추가
      // const response = await api.post('/user/become-seller', formData);

      // 임시로 성공 메시지 표시
      setMessage({
        type: "success",
        text: "판매자 전환 신청이 성공적으로 제출되었습니다!",
      });

      setTimeout(() => {
        navigate("/seller-mypage");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "판매자 전환 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <Container>
        <Card>
          <Header>
            <Title>판매자 전환</Title>
            <Subtitle>
              FeedShop에서 상품을 판매하고 비즈니스를 성장시켜보세요!
            </Subtitle>
          </Header>

          <BenefitsSection>
            <BenefitsTitle>판매자가 되면 얻을 수 있는 혜택</BenefitsTitle>
            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-store"></i>
                </BenefitIcon>
                <BenefitTitle>상품 등록 및 관리</BenefitTitle>
                <BenefitDescription>
                  다양한 상품을 등록하고 효율적으로 관리할 수 있습니다.
                </BenefitDescription>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-chart-line"></i>
                </BenefitIcon>
                <BenefitTitle>매출 분석</BenefitTitle>
                <BenefitDescription>
                  실시간 매출 현황과 판매 통계를 확인할 수 있습니다.
                </BenefitDescription>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-users"></i>
                </BenefitIcon>
                <BenefitTitle>고객 관리</BenefitTitle>
                <BenefitDescription>
                  주문 관리, 리뷰 관리, 고객 문의를 체계적으로 처리할 수
                  있습니다.
                </BenefitDescription>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>
                  <i className="fas fa-truck"></i>
                </BenefitIcon>
                <BenefitTitle>배송 관리</BenefitTitle>
                <BenefitDescription>
                  주문 상태 추적과 배송 관리를 효율적으로 할 수 있습니다.
                </BenefitDescription>
              </BenefitCard>
            </BenefitsGrid>
          </BenefitsSection>

          <FormSection>
            <FormTitle>판매자 정보 입력</FormTitle>
            {message && <Alert type={message.type}>{message.text}</Alert>}
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="storeName">상점명 *</Label>
                <Input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="상점명을 입력하세요"
                  required
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
                <Label htmlFor="phoneNumber">연락처 *</Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">주소 *</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="상점 주소를 입력하세요"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">상점 소개</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="상점에 대한 소개를 작성해주세요"
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "처리중..." : "판매자 전환 신청"}
                </Button>
              </ButtonGroup>
            </form>
          </FormSection>
        </Card>
      </Container>
    </PageContainer>
  );
};

export default BecomeSellerPage;
