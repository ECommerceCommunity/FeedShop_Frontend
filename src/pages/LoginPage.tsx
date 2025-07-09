import { FC, FormEvent, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login, validateEmail } from "../utils/auth";

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

const LoginContainer = styled.div`
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

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
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

const LoginButton = styled.button`
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

const SignUpLink = styled(Link)`
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

const ErrorMsg = styled.div`
  color: #ef4444;
  text-align: center;
  margin-bottom: 16px;
  font-size: 0.95rem;
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

const SocialLoginButton = styled.button`
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

const PasswordStrength = styled.div<{ isValid: boolean }>`
  margin-top: 8px;
  font-size: 0.8rem;
  color: ${(props) => (props.isValid ? "#4CAF50" : "#EF5350")};
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 0.9rem;
  }
`;

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const isEmailValid = validateEmail(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isEmailValid) {
        setError("올바른 이메일 형식을 입력해주세요.");
        setLoading(false);
        return;
      }

      // 공통 유틸리티 함수 사용
      const result = await login({ email, password });

      if (result && result.token) {
        // AuthContext의 login 함수 사용
        authLogin(result.nickname, result.userType || "customer", result.token);
        navigate("/");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // 소셜 로그인 구현
    console.log(`${provider} 로그인 시도`);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <Logo>FeedShop</Logo>
          <Subtitle>스마트한 쇼핑 경험을 위한 최고의 선택</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <InputWrapper>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="username"
              />
              <InputIcon>
                <i className="fas fa-envelope"></i>
              </InputIcon>
            </InputWrapper>
            {email && (
              <PasswordStrength isValid={isEmailValid}>
                <i
                  className={`fas fa-${
                    isEmailValid ? "check-circle" : "times-circle"
                  }`}
                ></i>
                {isEmailValid
                  ? "올바른 이메일 형식입니다"
                  : "올바른 이메일 형식을 입력해주세요"}
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <InputWrapper>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                autoComplete="current-password"
              />
              <InputIcon>
                <i className="fas fa-lock"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: "8px" }}
                ></i>
                로그인 중...
              </>
            ) : (
              <>
                <i
                  className="fas fa-sign-in-alt"
                  style={{ marginRight: "8px" }}
                ></i>
                로그인
              </>
            )}
          </LoginButton>

          <Divider>또는</Divider>

          <SocialLoginButton
            type="button"
            onClick={() => handleSocialLogin("google")}
          >
            <i className="fab fa-google" style={{ color: "#DB4437" }}></i>
            Google로 로그인
          </SocialLoginButton>

          <SocialLoginButton
            type="button"
            onClick={() => handleSocialLogin("kakao")}
          >
            <i className="fas fa-comment" style={{ color: "#FEE500" }}></i>
            카카오로 로그인
          </SocialLoginButton>

          <SignUpLink to="/signup">
            <i className="fas fa-user-plus" style={{ marginRight: "8px" }}></i>
            계정이 없으신가요? 회원가입
          </SignUpLink>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
