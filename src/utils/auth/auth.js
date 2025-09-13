// 인증 관련 공통 유틸리티 함수들 (JS 버전)

// API 기본 URL
function getBaseURL() {
  return process.env.REACT_APP_API_URL || "https://localhost:8080";
}

// 회원가입
export async function signUp(data) {
  const response = await fetch(`${getBaseURL()}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "회원가입에 실패했습니다.");
  }
  return await response.json();
}

// 로그인
export async function login(data) {
  const response = await fetch(`${getBaseURL()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "로그인에 실패했습니다.");
  }
  return await response.json();
}

// 비밀번호 유효성 검사
export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

// 비밀번호 확인 검사
export function validatePasswordConfirm(password, confirmPassword) {
  return password === confirmPassword && validatePassword(password);
}

// 이메일 유효성 검사
export function validateEmail(email) {
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// 전화번호 유효성 검사
export function validatePhone(phone) {
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone) && phone.length >= 10;
}
