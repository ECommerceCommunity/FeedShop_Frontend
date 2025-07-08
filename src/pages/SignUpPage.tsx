import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import SuccessModal from "../components/modal/SuccessModal";

const SignUpContainer = styled.div`
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
`;

const SignUpForm = styled.form`
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

const PasswordHint = styled.div`
  color: #666;
  font-size: 0.8rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PasswordStrength = styled.div<{ isValid: boolean }>`
  color: ${(props) => (props.isValid ? "#10b981" : "#666")};
  font-size: 0.8rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
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
`;

const SignUpButton = styled.button`
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

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #666;
  text-decoration: none;

  &:hover {
    color: #87ceeb;
  }
`;

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // 비밀번호 유효성 검사
  const isPasswordValid = formData.password.length >= 8;
  const isPasswordMatch = formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 비밀번호 유효성 검사
    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      // 회원가입 API 호출 (fetch 사용)
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("회원가입 성공:", data);
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        if (
          errorData.message?.includes("인증이 필요") ||
          errorData.message?.includes("재인증")
        ) {
          setError("재인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
        } else {
          setError(errorData.message || "회원가입에 실패했습니다.");
        }
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setError(
        err.message || "회원가입 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <SignUpContainer>
      <SignUpForm onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <PasswordHint>
            <i className="fas fa-info-circle"></i>
            비밀번호는 8자 이상이어야 합니다
          </PasswordHint>
          {formData.password && (
            <PasswordStrength isValid={isPasswordValid}>
              <i
                className={`fas fa-${
                  isPasswordValid ? "check-circle" : "times-circle"
                }`}
              ></i>
              {isPasswordValid
                ? "비밀번호 조건을 만족합니다"
                : "비밀번호가 너무 짧습니다"}
            </PasswordStrength>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          {formData.confirmPassword && (
            <PasswordStrength
              isValid={isPasswordMatch && formData.confirmPassword.length >= 8}
            >
              <i
                className={`fas fa-${
                  isPasswordMatch && formData.confirmPassword.length >= 8
                    ? "check-circle"
                    : "times-circle"
                }`}
              ></i>
              {isPasswordMatch && formData.confirmPassword.length >= 8
                ? "비밀번호가 일치합니다"
                : "비밀번호가 일치하지 않습니다"}
            </PasswordStrength>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone">전화번호</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <SignUpButton type="submit" disabled={loading}>
          {loading ? "회원가입 중..." : "회원가입"}
        </SignUpButton>
        <LoginLink to="/login">이미 계정이 있으신가요? 로그인</LoginLink>
      </SignUpForm>
      <SuccessModal
        open={showSuccess}
        title="회원가입 완료"
        message="회원가입이 성공적으로 완료되었습니다! 로그인 후 서비스를 이용해 주세요."
        onClose={handleSuccessClose}
      />
    </SignUpContainer>
  );
};

export default SignUpPage;
