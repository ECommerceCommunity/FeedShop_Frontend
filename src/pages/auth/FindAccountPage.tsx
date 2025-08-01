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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(249,115,22,0.08)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
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

export default function FindAccountPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 11자리 초과 시 자르기
    if (numbers.length > 11) {
      return phone; // 기존 값 유지
    }

    // 010-XXXX-XXXX 형식으로 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    }
  };

  // 휴대폰 번호 유효성 검사
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  // 이름 유효성 검사
  const validateName = (name: string) => {
    const nameRegex = /^[가-힣]{2,10}$/;
    return nameRegex.test(name);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 입력 유효성 검사
    if (!validateName(name)) {
      setIsSuccess(false);
      setMessage("이름은 2-10자의 한글만 입력 가능합니다.");
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setIsSuccess(false);
      setMessage("휴대폰 번호는 010-XXXX-XXXX 형식으로 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      // API 연동 - /find-account 엔드포인트 호출 (axios 사용)
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await axios.get(`${baseURL}/api/auth/find-account`, {
        params: {
          username: name,
          phoneNumber: phone,
        },
      });
      console.log(response);

      // 성공 응답 처리
      setIsSuccess(true);
      const apiResponse = response.data;
      const userData = apiResponse.data;

      setMessage(
        `입력하신 정보로 가입된 이메일 주소는 '${
          userData.email || userData.maskedEmail
        }' 입니다.`
      );
    } catch (error: any) {
      setIsSuccess(false);

      // axios 에러 처리
      if (error.response) {
        // 서버에서 응답을 받았지만 에러 상태코드
        const errorMessage =
          error.response.data?.message ||
          "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.";
        setMessage(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        setMessage("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        // 요청 설정 중 에러 발생
        setMessage("요청 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>계정 찾기</Title>
        <Subtitle>가입 시 입력한 정보를 입력해주세요</Subtitle>

        <Form onSubmit={handleSubmit}>
          {message &&
            (isSuccess ? (
              <SuccessMessage>{message}</SuccessMessage>
            ) : (
              <ErrorMessage>{message}</ErrorMessage>
            ))}

          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="실명을 입력해주세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">휴대폰 번호</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                찾는 중...
              </>
            ) : (
              <>
                <i className="fas fa-search"></i>
                계정 찾기
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
