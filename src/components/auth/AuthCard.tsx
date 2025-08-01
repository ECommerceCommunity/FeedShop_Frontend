
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AuthContainer = styled.div`
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

export const AuthCardWrapper = styled.div`
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

export const AuthTitle = styled.h1`
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

export const AuthSubtitle = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 32px;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AuthFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AuthLabel = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const AuthInput = styled.input`
  width: 100%;
  box-sizing: border-box;
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

export const AuthButton = styled.button`
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

export const AuthLink = styled(Link)`
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

export const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #c3e6cb;
  text-align: center;
  margin-bottom: 20px;
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  text-align: center;
  margin-bottom: 20px;
`;

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <AuthContainer>
      <AuthCardWrapper>
        <AuthTitle>{title}</AuthTitle>
        <AuthSubtitle>{subtitle}</AuthSubtitle>
        {children}
      </AuthCardWrapper>
    </AuthContainer>
  );
}
