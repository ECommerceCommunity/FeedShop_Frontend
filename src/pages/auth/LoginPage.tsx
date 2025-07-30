import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { login, validateEmail } from "../../utils/auth";
import axios from "axios";

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
  color: #e74c3c;
  text-align: center;
  margin-bottom: 16px;
  font-size: 0.95rem;
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
      const response = await axios.post(`${baseURL}/api/auth/login`, { email, password });
  
      console.log("API Response:", response); // 서버 응답 전체를 먼저 확인
  
      const apiResponseData = response.data; // { success: true, message: "...", data: { ... } }
  
      if (apiResponseData && apiResponseData.success && apiResponseData.data) {
        const userData = apiResponseData.data; // { loginId, role, email, userId, username, phone, createdAt, token }
  
        authLogin(userData.nickname , userData.role, userData.token); // authLogin 함수에 맞게 필드 이름 수정
        navigate("/");
      } else {
        // 서버에서 성공은 아니지만 응답은 있는 경우 (예: success: false)
        setError(apiResponseData.message || "로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err: any) {
      // Axios 에러 처리 (네트워크 오류, 4xx/5xx 응답 등)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "로그인에 실패했습니다. 서버 응답 오류.");
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

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Link to="/find-account" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
              계정 찾기
            </Link>
            <Link to="/find-password" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
              비밀번호 찾기
            </Link>
          </div>

          <SignUpLink to="/signup">
            <i className="fas fa-user-plus" style={{ marginRight: "8px" }}></i>
            계정이 없으신가요? 회원가입
          </SignUpLink>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}
