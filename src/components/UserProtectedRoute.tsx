import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";
import styled from "styled-components";

const NoticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  margin: 20px;
`;

const NoticeIcon = styled.div`
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 20px;
`;

const NoticeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
`;

const NoticeMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 400px;
  margin-bottom: 24px;
`;

const LoginButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

interface UserProtectedRouteProps {
  children?: React.ReactNode;
  requireLogin?: boolean; // 로그인만 필요한지
  requireUserRole?: boolean; // USER 권한이 필요한지
  showNotice?: boolean; // 권한 없을 때 알림을 보여줄지 여부
}

/**
 * 사용자 권한이 필요한 페이지를 보호하는 컴포넌트
 * - requireLogin: true일 때는 로그인만 확인
 * - requireUserRole: true일 때는 USER 권한까지 확인
 * - showNotice: true일 때는 권한 없으면 알림 표시, false일 때는 로그인 페이지로 리다이렉트
 */
const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({
  children,
  requireLogin = false,
  requireUserRole = false,
  showNotice = true,
}) => {
  const { user, handleUnauthorized } = useAuth();

  // 컴포넌트 마운트 시 실시간 토큰 유효성 검증
  React.useEffect(() => {
    const verifyTokenOnAccess = async () => {
      // user가 있고 토큰이 있는 경우 서버 연결 상태 확인
      const storedToken = localStorage.getItem("token");
      if (storedToken && user) {
        console.log("🔍 보호된 페이지 접근 시 서버 연결 상태 확인...");
        try {
          // 서버 연결 상태를 확인하기 위해 간단한 API 호출 (개발환경 임시데이터 우회)
          await axios.get("/api/users/me/profile");
          console.log("✅ 서버 연결 정상");
        } catch (error: any) {
          console.log("🚨 서버 연결 실패: 자동 로그아웃 처리");
          console.error("Error details:", error);
          handleUnauthorized();
          return;
        }
      }
    };

    if ((requireLogin || requireUserRole) && user) {
      verifyTokenOnAccess();
    }
  }, [user, requireLogin, requireUserRole, handleUnauthorized]);

  // 1. 로그인이 필요한데 로그인하지 않은 경우
  if (requireLogin && !user) {
    if (showNotice) {
      return (
        <NoticeContainer>
          <NoticeIcon>🔒</NoticeIcon>
          <NoticeTitle>로그인이 필요합니다</NoticeTitle>
          <NoticeMessage>
            이 페이지에 접근하려면 로그인이 필요합니다.
            <br />
            로그인 후 다시 시도해주세요.
          </NoticeMessage>
          <LoginButton onClick={() => (window.location.href = "/login")}>
            로그인하기
          </LoginButton>
        </NoticeContainer>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // 2. USER 권한이 필요한 경우
  if (requireUserRole) {
    // 로그인하지 않은 경우
    if (!user) {
      if (showNotice) {
        return (
          <NoticeContainer>
            <NoticeIcon>🔒</NoticeIcon>
            <NoticeTitle>로그인이 필요합니다</NoticeTitle>
            <NoticeMessage>
              이 페이지에 접근하려면 로그인이 필요합니다.
              <br />
              로그인 후 다시 시도해주세요.
            </NoticeMessage>
            <LoginButton onClick={() => (window.location.href = "/login")}>
              로그인하기
            </LoginButton>
          </NoticeContainer>
        );
      }
      return <Navigate to="/login" replace />;
    }

    // 로그인했지만 USER 권한이 아닌 경우
    if (user.userType !== "user") {
      if (showNotice) {
        return (
          <NoticeContainer>
            <NoticeIcon>⚠️</NoticeIcon>
            <NoticeTitle>접근 권한이 없습니다</NoticeTitle>
            <NoticeMessage>
              이 페이지는 일반 사용자 권한이 필요합니다.
              <br />
              권한이 없는 계정입니다.
            </NoticeMessage>
          </NoticeContainer>
        );
      }
      return <Navigate to="/" replace />;
    }
  }

  // 권한이 있는 경우 자식 컴포넌트나 Outlet 렌더링
  return children ? <>{children}</> : <Outlet />;
};

export default UserProtectedRoute;
