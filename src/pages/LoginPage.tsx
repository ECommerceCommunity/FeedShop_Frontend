import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      // LoginResponse: { token, user, ... }
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        // AuthContext의 login 함수 사용
        login(res.data.nickname);
        navigate("/");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setLoading(false);
    }
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
            required
            autoComplete="username"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </FormGroup>
        <LoginButton type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </LoginButton>
        <SignUpLink to="/signup">계정이 없으신가요? 회원가입</SignUpLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
