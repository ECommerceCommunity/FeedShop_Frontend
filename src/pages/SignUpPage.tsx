import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import SuccessModal from "../components/modal/SuccessModal";
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
  const isPasswordValid = validatePassword(formData.password);
  const isPasswordMatch = validatePasswordConfirm(
    formData.password,
    formData.confirmPassword
  );
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validatePhone(formData.phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 유효성 검사
      if (!isEmailValid) {
        setError("올바른 이메일 형식을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!isPasswordValid) {
        setError("비밀번호는 8자 이상이어야 합니다.");
        setLoading(false);
        return;
      }

      if (!isPasswordMatch) {
        setError("비밀번호가 일치하지 않습니다.");
        setLoading(false);
        return;
      }

      if (!isPhoneValid) {
        setError("올바른 전화번호 형식을 입력해주세요.");
        setLoading(false);
        return;
      }

      // 공통 유틸리티 함수 사용
      const result = await signUp(formData);
      console.log("회원가입 성공:", result);
      setShowSuccess(true);
    } catch (err: any) {
      console.error("회원가입 오류:", err);
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
          {formData.email && (
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
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
          {formData.confirmPassword && (
            <PasswordStrength isValid={isPasswordMatch}>
              <i
                className={`fas fa-${
                  isPasswordMatch ? "check-circle" : "times-circle"
                }`}
              ></i>
              {isPasswordMatch
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
          {formData.phone && (
            <PasswordStrength isValid={isPhoneValid}>
              <i
                className={`fas fa-${
                  isPhoneValid ? "check-circle" : "times-circle"
                }`}
              ></i>
              {isPhoneValid
                ? "올바른 전화번호 형식입니다"
                : "올바른 전화번호 형식을 입력해주세요"}
            </PasswordStrength>
          )}
        </FormGroup>

        <SignUpButton type="submit" disabled={loading}>
          {loading ? "회원가입 중..." : "회원가입"}
        </SignUpButton>
        <LoginLink to="/login">이미 계정이 있으신가요? 로그인</LoginLink>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUpPage;
