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
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
`;

const LoginForm = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0 0 30px 0;
  text-align: center;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #87ceeb;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #87ceeb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5fb4d9;
  }
`;

const SignUpLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #666;
  text-decoration: none;

  &:hover {
    color: #87ceeb;
  }
`;

const ErrorMsg = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-bottom: 16px;
  font-size: 0.95rem;
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
      <LoginForm onSubmit={handleSubmit}>
        <Title>로그인</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}

        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            autoComplete="username"
          />
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
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            autoComplete="current-password"
          />
        </FormGroup>

        <LoginButton type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
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

        <SignUpLink to="/signup">계정이 없으신가요? 회원가입</SignUpLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
