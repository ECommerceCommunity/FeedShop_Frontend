import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/auth";
import axios from "axios";
import {
  AuthCard,
  AuthForm as BaseAuthForm,
  AuthFormGroup as BaseAuthFormGroup,
  AuthLabel,
  AuthInput,
  AuthButton,
  AuthLink,
  ErrorMessage,
} from "../../components/auth/AuthCard";

const AuthForm = styled(BaseAuthForm)`
  gap: 0;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(249,115,22,0.08)" points="0,1000 1000,0 1000,1000"/></svg>');
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
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  animation: ${float} 3s ease-in-out infinite;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

const AuthFormGroup = styled(BaseAuthFormGroup)`
  margin-bottom: 24px;
`;

const InputWrapper = styled.div`
  position: relative;
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
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }
  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
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

const SignUpLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    color: #ea580c;
    transform: translateY(-1px);
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEmailValid = validateEmail(email);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!isEmailValid) throw new Error("올바른 이메일 형식을 입력해주세요.");

      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password,
      });

      const apiResponseData = response.data; // { success: true, message: "...", data: { ... } }

      if (apiResponseData && apiResponseData.success && apiResponseData.data) {
        const userData = apiResponseData.data; // { loginId, role, email, userId, username, phone, createdAt, token }

        authLogin(userData.nickname, userData.role, userData.token); // authLogin 함수에 맞게 필드 이름 수정
        navigate("/");
      } else {
        // 서버에서 성공은 아니지만 응답은 있는 경우 (예: success: false)
        setError(
          apiResponseData.message ||
            "로그인에 실패했습니다. 다시 시도해 주세요."
        );
      }
    } catch (err: any) {
      // Axios 에러 처리 (네트워크 오류, 4xx/5xx 응답 등)
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message || "로그인에 실패했습니다. 서버 응답 오류."
        );
        console.error("Login Error Response:", err.response); // 에러 응답 디버깅
      } else {
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
        console.error("Login Error:", err); // 기타 에러 디버깅
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="FeedShop" subtitle="스마트한 쇼핑 경험을 위한 최고의 선택">
      <AuthForm onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <AuthFormGroup>
          <AuthLabel htmlFor="email">이메일</AuthLabel>
          <InputWrapper>
            <AuthInput
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
        </AuthFormGroup>
        <AuthFormGroup>
          <AuthLabel htmlFor="password">비밀번호</AuthLabel>
          <InputWrapper>
            <AuthInput
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
        </AuthFormGroup>
        <AuthButton type="submit" disabled={loading}>
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
        </AuthButton>

        <Divider>또는</Divider>

        <SocialLoginButton
          type="button"
          onClick={() => alert("구글 로그인 연동 필요")}
        >
          <i className="fab fa-google" style={{ color: "#DB4437" }}></i>
          구글로 로그인
        </SocialLoginButton>

        <SocialLoginButton
          type="button"
          onClick={() => alert("카카오 로그인 연동 필요")}
        >
          <i className="fas fa-comment" style={{ color: "#FEE500" }}></i>
          카카오로 로그인
        </SocialLoginButton>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <AuthLink to="/find-account">
            계정 찾기
          </AuthLink>
          <AuthLink to="/find-password">
            비밀번호 찾기
          </AuthLink>
        </div>

        <SignUpLink to="/signup">
          <i className="fas fa-user-plus" style={{ marginRight: "8px" }}></i>
          계정이 없으신가요? 회원가입
        </SignUpLink>
      </AuthForm>
    </AuthCard>
  );
}
