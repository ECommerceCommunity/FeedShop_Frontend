import axiosInstance from "./axios";

// 소셜 로그인 관련 API 서비스

export interface SocialProvider {
  provider: string;
  connected: boolean;
  email?: string;
  connectedAt?: string;
}

export interface SocialLoginResponse {
  providers: SocialProvider[];
  totalConnected: number;
}

export class SocialAuthService {
  /**
   * 현재 사용자의 소셜 로그인 연동 정보 조회
   */
  static async getUserSocialProviders(): Promise<SocialLoginResponse> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: SocialLoginResponse;
    }>("/api/social/providers");
    
    return response.data.data;
  }

  /**
   * 특정 소셜 제공자 연동 해제
   */
  static async unlinkProvider(provider: string): Promise<string> {
    const response = await axiosInstance.delete<{
      success: boolean;
      data: string;
    }>(`/api/social/providers/${provider}`);
    
    return response.data.data;
  }

  /**
   * 소셜 로그인 지원 제공자 목록 조회
   */
  static async getSupportedProviders(): Promise<string[]> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: string[];
    }>("/api/social/supported-providers");
    
    return response.data.data;
  }

  /**
   * 소셜 로그인 URL 생성 (개발/테스트용)
   */
  static async getSocialLoginUrls(): Promise<{ [key: string]: string }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: { [key: string]: string };
    }>("/api/auth/test/social-login-urls");
    
    return response.data.data;
  }

  /**
   * 현재 인증 상태 확인 (개발/테스트용)
   */
  static async getAuthStatus(): Promise<{
    authenticated: boolean;
    username?: string;
    message: string;
  }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: {
        authenticated: boolean;
        username?: string;
        message: string;
      };
    }>("/api/auth/test/auth-status");
    
    return response.data.data;
  }

  /**
   * OAuth2 콜백 정보 조회 (개발/테스트용)
   */
  static async getCallbackInfo(): Promise<{
    frontendCallbackUrl: string;
    description: string;
    parameters: string;
  }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: {
        frontendCallbackUrl: string;
        description: string;
        parameters: string;
      };
    }>("/api/auth/test/callback-info");
    
    return response.data.data;
  }
}

export default SocialAuthService;
