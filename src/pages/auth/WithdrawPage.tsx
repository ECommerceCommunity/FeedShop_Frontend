import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { UserService, UserWithdrawRequest } from "../../api/userService";
import { useAuth } from "../../contexts/AuthContext";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Pretendard", sans-serif;
`;

const WithdrawCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #f97316;
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const WarningBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const WarningTitle = styled.h3`
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WarningList = styled.ul`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }
      `
      : `
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
      `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

function WithdrawPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserWithdrawRequest>({
    email: user?.email || "",
    password: "",
  });
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmWithdraw) {
      setError("회원 탈퇴 동의를 확인해주세요.");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await UserService.withdrawUser(formData);
      setSuccess(
        "회원 탈퇴가 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다."
      );

      // 3초 후 로그아웃 및 로그인 페이지로 이동
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("회원 탈퇴 오류:", error);
      
      // 에러 메시지에 따른 구분된 처리
      const errorMessage = error.message || "회원 탈퇴에 실패했습니다.";
      
      if (errorMessage.includes("권한") || errorMessage.includes("permission") || errorMessage.includes("403")) {
        setError("회원 탈퇴 권한이 없습니다. 관리자에게 문의해주세요.");
      } else if (errorMessage.includes("비밀번호") || errorMessage.includes("password")) {
        setError("비밀번호가 올바르지 않습니다.");
      } else if (errorMessage.includes("이메일") || errorMessage.includes("email")) {
        setError("이메일이 올바르지 않습니다.");
      } else if (errorMessage.includes("로그인") || errorMessage.includes("401")) {
        setError("로그인이 필요합니다. 다시 로그인해주세요.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  if (!user) {
    return (
      <Container>
        <WithdrawCard>
          <Title>로그인이 필요합니다</Title>
          <Subtitle>회원 탈퇴를 위해서는 로그인이 필요합니다.</Subtitle>
          <Button onClick={() => navigate("/login")}>로그인하기</Button>
        </WithdrawCard>
      </Container>
    );
  }

  return (
    <Container>
      <WithdrawCard>
        <Title>회원 탈퇴</Title>
        <Subtitle>
          정말로 회원 탈퇴를 하시겠습니까?
          <br />이 작업은 되돌릴 수 없습니다.
        </Subtitle>

        <WarningBox>
          <WarningTitle>
            <i className="fas fa-exclamation-triangle"></i>
            회원 탈퇴 시 주의사항
          </WarningTitle>
          <WarningList>
            <li>모든 개인정보가 영구적으로 삭제됩니다</li>
            <li>주문 내역, 리뷰, 댓글 등 모든 활동 기록이 삭제됩니다</li>
            <li>보유한 쿠폰과 포인트가 모두 소멸됩니다</li>
            <li>이 작업은 되돌릴 수 없습니다</li>
          </WarningList>
        </WarningBox>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
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
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </FormGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="confirmWithdraw"
              checked={confirmWithdraw}
              onChange={(e) => setConfirmWithdraw(e.target.checked)}
            />
            <CheckboxLabel htmlFor="confirmWithdraw">
              위의 주의사항을 모두 확인했으며, 회원 탈퇴에 동의합니다.
            </CheckboxLabel>
          </CheckboxGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !confirmWithdraw}
            >
              {loading ? "처리 중..." : "회원 탈퇴"}
            </Button>
          </ButtonGroup>
        </Form>
      </WithdrawCard>
    </Container>
  );
}

export default WithdrawPage;
