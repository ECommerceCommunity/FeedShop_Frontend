import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  signUp,
  validatePassword,
  validatePasswordConfirm,
  validateEmail,
  validatePhone,
} from "../utils/auth";

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

export default function SignUpPage() {
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

  // 유효성 검사
  const isPasswordValid = validatePassword(formData.password);
  const isPasswordMatch = validatePasswordConfirm(
    formData.password,
    formData.confirmPassword
  );
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validatePhone(formData.phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!isEmailValid) throw new Error("올바른 이메일 형식을 입력해주세요.");
      if (!isPasswordValid)
        throw new Error("비밀번호는 8자 이상이어야 합니다.");
      if (!isPasswordMatch) throw new Error("비밀번호가 일치하지 않습니다.");
      if (!isPhoneValid)
        throw new Error("올바른 전화번호 형식을 입력해주세요.");
      await signUp(formData);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message);
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
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "16px", color: "#10b981" }}>
              회원가입 완료
            </h3>
            <p style={{ marginBottom: "24px", lineHeight: "1.6" }}>
              회원가입이 성공적으로 완료되었습니다! 로그인 후 서비스를 이용해
              주세요.
            </p>
            <button
              onClick={handleSuccessClose}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </SignUpContainer>
  );
}
