// src/components/AdminProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string; // 권한 없을 시 리디렉션될 경로
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  redirectPath = "/", // 기본 리디렉션 경로를 메인 페이지로 설정
}) => {
  const { user, handleUnauthorized } = useAuth(); // AuthContext에서 user 정보 가져오기

  // 컴포넌트 마운트 시 실시간 토큰 유효성 검증
  React.useEffect(() => {
    const verifyTokenOnAccess = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && user) {
        console.log("🔍 관리자 페이지 접근 시 서버 연결 상태 확인...");
        try {
          await axios.get("/api/users/me/profile");
          console.log("✅ 서버 연결 정상");
        } catch (error: any) {
          console.log("🚨 서버 연결 실패: 자동 로그아웃 처리");
          if (error?.response?.status === 401) {
            console.log("인증 토큰 만료");
          } else {
            console.error("서버 연결 오류:", error?.message || error);
          }
          handleUnauthorized();
          return;
        }
      }
    };

    if (user) {
      verifyTokenOnAccess();
    }
  }, [user, handleUnauthorized]);

  // 1. 로그인 자체가 안 되어 있는 경우
  if (!user) {
    return <Navigate to="/login" replace />; // 로그인 페이지로 리디렉션
  }

  // 2. 로그인되어 있지만 userType이 'admin'이 아닌 경우
  // user 또는 seller가 admin 페이지에 접근하려 할 때
  if (user.userType !== "admin") {
    // console.log(`Access Denied: User type is ${user.userType}, but 'admin' is required.`);
    return <Navigate to={redirectPath} replace />; // 메인 페이지로 리디렉션
  }

  // 3. userType이 'admin'인 경우
  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
