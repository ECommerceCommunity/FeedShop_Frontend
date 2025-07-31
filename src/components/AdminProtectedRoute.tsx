// src/components/AdminProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string; // 권한 없을 시 리디렉션될 경로
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  redirectPath = "/", // 기본 리디렉션 경로를 메인 페이지로 설정
}) => {
  const { user } = useAuth(); // AuthContext에서 user 정보 가져오기

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
