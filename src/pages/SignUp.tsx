import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";

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

const SignUpContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
  }
`;

const SignUpCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 32px 24px;
    margin: 20px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${slideInLeft} 0.8s ease-out 0.2s both;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  animation: ${float} 3s ease-in-out infinite;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const Form = styled.form`
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #764ba2;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 8px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 24px 0;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
`;

const Checkbox = styled.input`
  margin-right: 12px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const PrivacyLink = styled.a`
  color: #667eea;
  text-decoration: underline;
  margin-left: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #764ba2;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: #9ca3af;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const SocialSignUpButton = styled.button`
  width: 100%;
  padding: 14px;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!privacyAgreed) {
      setError("개인정보처리방침에 동의해주세요.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      // TODO: API 연동
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션
      console.log("회원가입 시도:", formData);
      navigate("/login");
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyClick = () => {
    // TODO: 개인정보처리방침 모달 또는 페이지로 이동
    window.open("/privacy-policy", "_blank");
  };

  const handleSocialSignUp = (provider: string) => {
    // 소셜 회원가입 구현
    console.log(`${provider} 회원가입 시도`);
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <LogoSection>
          <Logo>FeedShop</Logo>
          <Subtitle>스마트한 쇼핑 경험을 위한 최고의 선택</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <InputWrapper>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
              />
              <InputIcon>
                <i className="fas fa-user"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <InputWrapper>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
              <InputIcon>
                <i className="fas fa-envelope"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <InputWrapper>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <InputIcon>
                <i className="fas fa-lock"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <InputWrapper>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <InputIcon>
                <i className="fas fa-lock"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              required
            />
            <span>
              개인정보처리방침에 동의합니다
              <PrivacyLink onClick={handlePrivacyClick}>
                (자세히 보기)
              </PrivacyLink>
            </span>
          </CheckboxContainer>

          <SignUpButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: "8px" }}
                ></i>
                회원가입 중...
              </>
            ) : (
              <>
                <i
                  className="fas fa-user-plus"
                  style={{ marginRight: "8px" }}
                ></i>
                회원가입
              </>
            )}
          </SignUpButton>

          <Divider>또는</Divider>

          <SocialSignUpButton
            type="button"
            onClick={() => handleSocialSignUp("google")}
          >
            <i className="fab fa-google" style={{ color: "#DB4437" }}></i>
            Google로 회원가입
          </SocialSignUpButton>

          <SocialSignUpButton
            type="button"
            onClick={() => handleSocialSignUp("kakao")}
          >
            <i className="fas fa-comment" style={{ color: "#FEE500" }}></i>
            카카오로 회원가입
          </SocialSignUpButton>

          <LoginLink to="/login">
            <i
              className="fas fa-sign-in-alt"
              style={{ marginRight: "8px" }}
            ></i>
            이미 계정이 있으신가요? 로그인
          </LoginLink>
        </Form>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;
