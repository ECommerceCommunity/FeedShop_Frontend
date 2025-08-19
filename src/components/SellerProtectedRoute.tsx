import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";

interface SellerProtectedRouteProps {
  children?: React.ReactNode; // 렌더링할 자식 컴포넌트 (선택 사항, Outlet과 함께 사용)
  allowedUserType: "user" | "admin" | "seller"; // 이 경로에 허용되는 userType
  redirectPath?: string; // 권한 없을 시 리디렉션될 경로
}

const SellerProtectedRoute: React.FC<SellerProtectedRouteProps> = ({
  children,
  allowedUserType,
  redirectPath = "/", // 기본 리디렉션 경로를 메인 페이지로 설정
}) => {
  const { user, handleUnauthorized } = useAuth(); // AuthContext에서 user 정보 가져오기

  // 컴포넌트 마운트 시 실시간 토큰 유효성 검증
  React.useEffect(() => {
    const verifyTokenOnAccess = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && user) {
        console.log("🔍 판매자 페이지 접근 시 서버 연결 상태 확인...");
        try {
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

    if (user) {
      verifyTokenOnAccess();
    }
  }, [user, handleUnauthorized]);

  // 1. 로그인 자체가 안 되어 있는 경우
  if (!user) {
    return <Navigate to="/login" replace />; // 로그인 페이지로 리디렉션 (로그인 후 다시 시도하게)
  }

  // 2. 로그인되어 있지만 userType이 허용된 타입이 아닌 경우
  // admin이 seller 페이지에 접근하려 할 때, user가 seller 페이지에 접근하려 할 때
  if (user.userType !== allowedUserType) {
    // console.log(`Access Denied: User type is ${user.userType}, but ${allowedUserType} is required.`);
    return <Navigate to={redirectPath} replace />; // 메인 페이지로 리디렉션
  }

  // 3. userType이 허용된 타입인 경우 (seller)
  // children이 있으면 children을 렌더링하고, 없으면 Outlet (중첩 라우트 사용 시)
  return children ? <>{children}</> : <Outlet />;
};

export default SellerProtectedRoute;
