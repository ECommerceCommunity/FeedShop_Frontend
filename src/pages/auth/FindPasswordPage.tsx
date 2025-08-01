import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(249,115,22,0.1)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(249, 115, 22, 0.2) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(239, 68, 68, 0.2) 0%,
        transparent 50%
      );
  }
`;

const Card = styled.div`
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
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 1s ease-out,
    ${keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  `} 3s ease-in-out infinite;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

const Subtitle = styled.p`
  text-align: center;
  color: #7f8c8d;
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
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
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
  font-weight: 600;
  margin-top: 24px;
  transition: color 0.3s ease;
  &:hover {
    color: #ea580c;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #c3e6cb;
  text-align: center;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  text-align: center;
  margin-bottom: 20px;
`;

const InfoMessage = styled.div`
  background: #d1ecf1;
  color: #0c5460;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #bee5eb;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await axios.post(`${baseURL}/api/auth/forgot-password`, {
        email: email,
      });

      if (response.status === 200) {
        setIsSuccess(true);
        setMessage(
          "비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요."
        );
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setIsSuccess(false);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 404) {
        setMessage("입력하신 이메일로 가입된 계정을 찾을 수 없습니다.");
      } else if (error.response?.status === 429) {
        setMessage("너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>비밀번호 찾기</Title>
        <Subtitle>가입하신 이메일 주소를 입력해주세요</Subtitle>

        <InfoMessage>
          <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>
          입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
        </InfoMessage>

        <Form onSubmit={handleSubmit}>
          {message &&
            (isSuccess ? (
              <SuccessMessage>{message}</SuccessMessage>
            ) : (
              <ErrorMessage>{message}</ErrorMessage>
            ))}

          <FormGroup>
            <Label htmlFor="email">이메일 주소</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                전송 중...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                재설정 링크 전송
              </>
            )}
          </Button>
        </Form>

        <BackLink to="/login">
          <i className="fas fa-arrow-left"></i>
          로그인으로 돌아가기
        </BackLink>
      </Card>
    </Container>
  );
}
