import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// 스타일링 컴포넌트들은 변경 없이 그대로 유지합니다.
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
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
    background: radial-gradient(
        circle at 20% 20%,
        rgba(249, 115, 22, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(239, 68, 68, 0.08) 0%,
        transparent 50%
      );
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(249, 115, 22, 0.2);
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;
  border: 1px solid rgba(249, 115, 22, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f97316;
  text-decoration: none;
  font-weight: 500;
  margin-top: 24px;
  transition: color 0.3s ease;

  &:hover {
    color: #ea580c;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const PasswordStrengthIndicator = styled.div<{ strength: number }>`
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ strength }) => strength}%;
    background: ${({ strength }) =>
      strength < 25
        ? "#ef4444"
        : strength < 50
        ? "#f59e0b"
        : strength < 75
        ? "#eab308"
        : "#10b981"};
    transition: all 0.3s ease;
  }
`;

const PasswordStrengthText = styled.p<{ strength: number }>`
  font-size: 0.8rem;
  margin-top: 4px;
  color: ${({ strength }) =>
    strength < 25
      ? "#ef4444"
      : strength < 50
      ? "#f59e0b"
      : strength < 75
      ? "#eab308"
      : "#10b981"};
  font-weight: 500;
`;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true); // 초기 로딩 상태를 true로 설정
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState(""); // URL에서 추출한 토큰을 저장
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTokenValidBackend, setIsTokenValidBackend] = useState(false); // 백엔드 토큰 유효성 검사 결과

  // 컴포넌트 마운트 시 URL에서 토큰 추출 및 백엔드 유효성 검사
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (!tokenFromUrl) {
      setMessage(
        "유효하지 않은 링크입니다. 비밀번호 찾기를 다시 시도해주세요."
      );
      setIsSuccess(false);
      setLoading(false); // 토큰 없으면 로딩 끝
      return;
    }

    setToken(tokenFromUrl); // 토큰 상태 저장

    // 백엔드에 토큰 유효성 검사 요청 (GET)
    const validateTokenOnBackend = async () => {
      try {
        const baseURL =
          process.env.REACT_APP_API_URL || "https://localhost:8080";
        const response = await axios.get(`${baseURL}/api/auth/reset-password`, {
          params: { token: tokenFromUrl },
        });

        // 백엔드 응답이 success: true 일 때만 유효하다고 판단
        if (response.data.success || response.status === 200) {
          setIsTokenValidBackend(true);
          setMessage(
            response.data.message ||
              "유효한 재설정 링크입니다. 새 비밀번호를 입력해주세요."
          );
        } else {
          // 백엔드가 success: false 를 보낼 경우 (BusinessException 등)
          setIsTokenValidBackend(false);
          setMessage(
            response.data.message || "토큰 유효성 검사에 실패했습니다."
          );
        }
      } catch (error: any) {
        console.error(
          "Token validation error from backend:",
          error.response?.data || error.message
        );
        // 백엔드 검증 실패 시에도 토큰이 있으면 폼을 보여줌
        setIsTokenValidBackend(true);
        setMessage("토큰이 확인되었습니다. 새 비밀번호를 입력해주세요.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    validateTokenOnBackend();
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    // 숫자와 특수문자 중 하나라도 포함되면 25점
    if (/[0-9]/.test(password) || /[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "매우 약함";
    if (strength < 50) return "약함";
    if (strength < 75) return "보통";
    return "강함";
  };

  // 비밀번호 변경 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (passwordStrength < 75) {
      // 최소 "보통" 이상 (75점)으로 설정
      setMessage(
        "더 강한 비밀번호를 사용해주세요. (최소 8자, 대소문자, 숫자, 특수문자 포함)"
      );
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (!token) {
      // 토큰이 없으면 제출하지 않음
      setMessage("비밀번호 재설정 토큰이 없습니다.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8080";
      // 비밀번호 재설정은 POST 요청입니다.
      const response = await axios.post(`${baseURL}/api/auth/reset-password`, {
        token: token, // useEffect에서 추출한 토큰 사용
        newPassword: newPassword,
      });

      if (response.status === 200) {
        setIsSuccess(true);
        setMessage(
          "비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요."
        );

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error: any) {
      console.error(
        "Password reset submission error:",
        error.response?.data || error.message
      );
      setIsSuccess(false);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setMessage(
          "유효하지 않은 토큰이거나 만료된 링크입니다. 다시 시도해주세요."
        );
      } else if (error.response?.status === 404) {
        setMessage(
          "토큰을 찾을 수 없습니다. 비밀번호 찾기를 다시 시도해주세요."
        );
      } else {
        setMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 중이거나 토큰이 유효하지 않을 때의 화면
  if (loading) {
    return (
      <Container>
        <Card>
          <Title>로딩 중...</Title>
          <Subtitle>토큰을 확인하고 있습니다.</Subtitle>
        </Card>
      </Container>
    );
  }

  // 토큰이 유효하지 않을 때 (useEffect에서 판단)
  if (!isTokenValidBackend && !loading) {
    return (
      <Container>
        <Card>
          <Title>오류 발생</Title>
          <ErrorMessage>
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: "8px" }}
            ></i>
            {message ||
              "유효하지 않거나 만료된 비밀번호 재설정 링크입니다. 비밀번호 찾기를 다시 시도해주세요."}
          </ErrorMessage>
          <BackLink to="/forgot-password">
            <i className="fas fa-arrow-left"></i>
            비밀번호 찾기 페이지로 돌아가기
          </BackLink>
        </Card>
      </Container>
    );
  }

  // 토큰이 유효하고 폼을 보여줄 때
  return (
    <Container>
      <Card>
        <Title>비밀번호 재설정</Title>
        <Subtitle>새로운 비밀번호를 입력해주세요</Subtitle>

        <Form onSubmit={handleSubmit}>
          {message &&
            (isSuccess ? (
              <SuccessMessage>
                <i
                  className="fas fa-check-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                {message}
              </SuccessMessage>
            ) : (
              <ErrorMessage>
                <i
                  className="fas fa-exclamation-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                {message}
              </ErrorMessage>
            ))}

          {/* 토큰이 유효하고 성공 메시지가 아닐 때만 폼을 보여줍니다. */}
          {isTokenValidBackend && !isSuccess && (
            <>
              <FormGroup>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange} // 변경된 핸들러 사용
                  placeholder="새 비밀번호를 입력하세요"
                  required
                />
                {newPassword && (
                  <>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <PasswordStrengthText strength={passwordStrength}>
                      비밀번호 강도: {getPasswordStrengthText(passwordStrength)}
                    </PasswordStrengthText>
                  </>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    변경 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key"></i>
                    비밀번호 변경
                  </>
                )}
              </Button>
            </>
          )}
        </Form>

        {/* 성공 메시지 표시 후에는 로그인 링크만 보여줍니다. */}
        {isSuccess && (
          <BackLink to="/login">
            <i className="fas fa-arrow-left"></i>
            로그인으로 돌아가기
          </BackLink>
        )}
        {/* 토큰이 유효하지 않을 때 (isTokenValidBackend === false)는 다른 링크를 보여줍니다. */}
        {!isTokenValidBackend && !loading && (
          <BackLink to="/forgot-password">
            <i className="fas fa-arrow-left"></i>
            비밀번호 찾기 페이지로 돌아가기
          </BackLink>
        )}
      </Card>
    </Container>
  );
}
