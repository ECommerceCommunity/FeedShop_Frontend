import { useState } from "react";
import axios from "axios";
import {
  AuthCard,
  AuthForm,
  AuthFormGroup,
  AuthLabel,
  AuthInput,
  AuthButton,
  AuthLink,
  SuccessMessage,
  ErrorMessage,
} from "../../components/auth/AuthCard";
import styled from "styled-components";

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
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8080";
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
    <AuthCard
      title="비밀번호 찾기"
      subtitle="가입하신 이메일 주소를 입력해주세요"
    >
      <InfoMessage>
        <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>
        입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
      </InfoMessage>

      <AuthForm onSubmit={handleSubmit}>
        {message &&
          (isSuccess ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <ErrorMessage>{message}</ErrorMessage>
          ))}

        <AuthFormGroup>
          <AuthLabel htmlFor="email">이메일 주소</AuthLabel>
          <AuthInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </AuthFormGroup>

        <AuthButton type="submit" disabled={loading}>
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
        </AuthButton>
      </AuthForm>

      <AuthLink to="/login">
        <i className="fas fa-arrow-left"></i>
        로그인으로 돌아가기
      </AuthLink>
    </AuthCard>
  );
}