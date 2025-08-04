/**
 * 주문 및 결제 정보 유효성 검증 유틸리티
 * 
 * 주문 과정에서 필요한 사용자 입력 정보의 유효성을 검증합니다.
 * 전화번호, 우편번호, 카드 정보 등의 형식을 검사하는 기능을 제공합니다.
 */

/**
 * 한국 휴대폰 번호 형식을 검증하는 함수
 * 010, 011, 016, 017, 018, 019로 시작하는 11자리 또는 10자리 번호를 허용합니다.
 * @param phone 검증할 전화번호 (공백, 하이픈 포함 가능)
 * @returns 유효한 전화번호 형식이면 true, 아니면 false
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // 공백과 하이픈 제거하여 숫자만 추출
  const cleanPhone = phone.replace(/[\s-]/g, "");
  // 01로 시작하고 8~9자리 추가 숫자가 있는 패턴 (총 10~11자리)
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * 한국 우편번호 형식을 검증하는 함수
 * 5자리 숫자 형식을 검증합니다.
 * @param postalCode 검증할 우편번호
 * @returns 유효한 우편번호 형식이면 true, 아니면 false
 */
export const validatePostalCode = (postalCode: string): boolean => {
  // 5자리 숫자 패턴
  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
};

/**
 * 신용카드 번호 형식을 검증하는 함수
 * 13~19자리 숫자 형식을 검증합니다. (비자, 마스터카드, 아멕스 등 대부분 지원)
 * @param cardNumber 검증할 카드번호 (공백, 하이픈 포함 가능)
 * @returns 유효한 카드번호 형식이면 true, 아니면 false
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  // 공백과 하이픈 제거하여 숫자만 추출
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");
  // 13~19자리 숫자 패턴 (대부분의 신용카드 번호 길이)
  const cardRegex = /^[0-9]{13,19}$/;
  return cardRegex.test(cleanNumber);
};

/**
 * 신용카드 만료일 형식 및 유효성을 검증하는 함수
 * MM/YY 형식을 검증하고 현재 날짜 이후인지 확인합니다.
 * @param expiry 검증할 만료일 (MM/YY 형식)
 * @returns 유효한 만료일이면 true, 아니면 false
 */
export const validateCardExpiry = (expiry: string): boolean => {
  // MM/YY 형식 검증 (01~12월, 00~99년)
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiry)) return false;

  // 월과 연도 분리
  const [month, year] = expiry.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // 현재 연도의 마지막 2자리
  const currentMonth = currentDate.getMonth() + 1;     // 현재 월 (1~12)

  const cardYear = parseInt(year);   // 카드 만료 연도
  const cardMonth = parseInt(month); // 카드 만료 월

  // 만료일이 현재 날짜보다 이전인지 확인
  if (
    cardYear < currentYear ||
    (cardYear === currentYear && cardMonth < currentMonth)
  ) {
    return false;
  }

  return true;
};

/**
 * 신용카드 CVC 번호 형식을 검증하는 함수
 * 3자리 숫자 형식을 검증합니다.
 * @param cvc 검증할 CVC 번호
 * @returns 유효한 CVC 형식이면 true, 아니면 false
 */
export const validateCVC = (cvc: string): boolean => {
  // 3자리 숫자 패턴
  const cvcRegex = /^[0-9]{3}$/;
  return cvcRegex.test(cvc);
};