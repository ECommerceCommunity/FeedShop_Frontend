// 인증 관련 공통 유틸리티 함수들

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    loginId: string;
    role: "admin" | "user" | "seller";
    token: string;
    nickname: string;
  };
  token: string;
  nickname: string;
  userType: "admin" | "user" | "seller";
  message?: string;
}

export interface DeleteAccountData {
  password: string;
  reason?: string;
}

// API 기본 URL
const getBaseURL = () =>
  process.env.REACT_APP_API_URL || "https://localhost:8080";

// 공통 에러 처리
const handleAuthError = (error: any): string => {
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    if (message.includes("인증이 필요") || message.includes("재인증")) {
      return "재인증 메일이 발송되었습니다. 이메일을 확인해주세요.";
    }
    if (message.includes("이메일 인증") || message.includes("PENDING")) {
      return "이메일 인증이 필요합니다. 인증 메일을 확인해주세요.";
    }
    return message;
  }
  return error.message || "요청 중 오류가 발생했습니다. 다시 시도해주세요.";
};

// 회원가입
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${getBaseURL()}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// 로그인
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${getBaseURL()}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// 회원 탈퇴 (논리적 삭제)
export const deleteAccount = async (data: DeleteAccountData): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(`${getBaseURL()}/api/auth/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원 탈퇴에 실패했습니다.");
    }
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// 비밀번호 확인 검사
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && validatePassword(password);
};

// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 전화번호 유효성 검사
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};
