import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";

const CallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.h2`
  text-align: center;
  margin-bottom: 10px;
`;

const SubMessage = styled.p`
  text-align: center;
  opacity: 0.8;
`;

export default function SocialCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const handleSocialLoginCallback = async () => {
      try {
        // React Router의 useSearchParams 사용
        // 일반적인 OAuth2 콜백 파라미터들
        let token =
          searchParams.get("token") ||
          searchParams.get("access_token") ||
          searchParams.get("jwt");
        let email = searchParams.get("email") || searchParams.get("username");
        let name = searchParams.get("name") || searchParams.get("displayName");
        let nickname =
          searchParams.get("nickname") ||
          searchParams.get("name") ||
          searchParams.get("given_name");
        let provider =
          searchParams.get("provider") || searchParams.get("social_provider");
        let role =
          searchParams.get("role") || searchParams.get("userType") || "user";

        // 에러 처리를 위한 파라미터
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // 에러가 있는 경우 처리
        if (error) {
          throw new Error(
            `소셜 로그인 실패: ${error} ${
              errorDescription ? `- ${errorDescription}` : ""
            }`
          );
        }

        // Authorization Code가 있는 경우 (OAuth2 표준 플로우)
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (code && !token) {
          throw new Error(
            "Authorization Code 방식은 아직 구현되지 않았습니다. 백엔드에서 직접 JWT 토큰을 전달해주세요."
          );
        }

        if (!token || !email) {
          throw new Error(
            `필수 로그인 정보가 누락되었습니다. token: ${!!token}, email: ${!!email}`
          );
        }

        // AuthContext의 login 함수 호출
        authLogin(
          nickname || email, // nickname이 없으면 email 사용
          name || nickname || email, // name이 없으면 nickname 또는 email 사용
          role as "user" | "admin" | "seller",
          token
        );

        // 홈페이지로 리다이렉트
        navigate("/", { replace: true });
      } catch (error: any) {
        // 에러 발생 시 로그인 페이지로 리다이렉트 (에러 메시지와 함께)
        navigate("/login", {
          replace: true,
          state: {
            error: error.message || "소셜 로그인 처리 중 오류가 발생했습니다.",
          },
        });
      }
    };

    handleSocialLoginCallback();
  }, [navigate, authLogin, searchParams]);

  return (
    <CallbackContainer>
      <LoadingSpinner />
      <Message>소셜 로그인 처리 중...</Message>
      <SubMessage>잠시만 기다려 주세요.</SubMessage>
    </CallbackContainer>
  );
}
