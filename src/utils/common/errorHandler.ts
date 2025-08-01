import { ApiError } from "../../types/feed";

/**
 * API 에러 응답을 분석하여 사용자 친화적인 메시지를 반환합니다
 */
export const getErrorMessage = (error: any): string => {
  // 네트워크 에러
  if (!error.response) {
    if (error.code === "NETWORK_ERROR") {
      return "네트워크 연결을 확인해주세요.";
    }
    if (error.code === "ECONNABORTED") {
      return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }
    return "네트워크 오류가 발생했습니다.";
  }

  const status = error.response.status;
  const data = error.response.data as ApiError;

  // 백엔드에서 전송한 에러 메시지 우선 사용
  if (data?.message) {
    return data.message;
  }

  // HTTP 상태 코드별 기본 메시지
  switch (status) {
    case 400:
      return "잘못된 요청입니다. 입력 정보를 확인해주세요.";
    case 401:
      return "로그인이 필요합니다.";
    case 403:
      return "권한이 없습니다.";
    case 404:
      return "요청한 정보를 찾을 수 없습니다.";
    case 409:
      return "이미 처리된 요청입니다.";
    case 422:
      return "입력 데이터가 유효하지 않습니다.";
    case 429:
      return "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
    case 500:
      return "서버 오류가 발생했습니다. 관리자에게 문의해주세요.";
    case 502:
    case 503:
    case 504:
      return "서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
    default:
      return "알 수 없는 오류가 발생했습니다.";
  }
};

/**
 * 인증 관련 에러인지 확인합니다
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

/**
 * 네트워크 에러인지 확인합니다
 */
export const isNetworkError = (error: any): boolean => {
  return (
    !error.response ||
    error.code === "NETWORK_ERROR" ||
    error.code === "ECONNABORTED"
  );
};

/**
 * 서버 에러인지 확인합니다
 */
export const isServerError = (error: any): boolean => {
  return error.response?.status >= 500;
};

/**
 * 클라이언트 에러인지 확인합니다
 */
export const isClientError = (error: any): boolean => {
  return error.response?.status >= 400 && error.response?.status < 500;
};

/**
 * 재시도 가능한 에러인지 확인합니다
 */
export const isRetryableError = (error: any): boolean => {
  return (
    isNetworkError(error) ||
    isServerError(error) ||
    error.response?.status === 429
  );
};

/**
 * API 에러를 로깅합니다
 */
export const logError = (error: any, context?: string) => {
  const errorInfo = {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error("API Error:", errorInfo);

  // 프로덕션 환경에서는 에러 모니터링 서비스로 전송
  if (process.env.NODE_ENV === "production") {
    // 예: Sentry, LogRocket 등으로 전송
    // Sentry.captureException(error, { extra: errorInfo });
  }
};

/**
 * 에러를 처리하고 적절한 액션을 수행합니다
 */
export const handleApiError = (
  error: any,
  options: {
    context?: string;
    showToast?: boolean;
    redirectOnAuth?: boolean;
    onToast?: (message: string, type: "error" | "warning") => void;
    onRedirect?: (path: string) => void;
  } = {}
) => {
  const {
    context,
    showToast = true,
    redirectOnAuth = true,
    onToast,
    onRedirect,
  } = options;

  // 에러 로깅
  logError(error, context);

  // 에러 메시지 생성
  const message = getErrorMessage(error);

  // 토스트 메시지 표시
  if (showToast && onToast) {
    const type = isClientError(error) ? "warning" : "error";
    onToast(message, type);
  }

  // 인증 에러 시 로그인 페이지로 리다이렉트
  if (isAuthError(error) && redirectOnAuth && onRedirect) {
    localStorage.removeItem("token");
    setTimeout(() => {
      onRedirect("/login");
    }, 1500);
  }

  return message;
};

/**
 * 비동기 함수를 실행하고 에러를 처리합니다
 */
export const executeWithErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorOptions?: Parameters<typeof handleApiError>[1]
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await asyncFn();
    return { data };
  } catch (error: any) {
    const errorMessage = handleApiError(error, errorOptions);
    return { error: errorMessage };
  }
};

/**
 * 재시도 로직이 포함된 API 호출 함수
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: boolean;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = isRetryableError,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;

      // 마지막 시도이거나 재시도할 수 없는 에러인 경우
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // 재시도 전 대기
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * 에러 바운더리용 에러 정보 생성
 */
export const createErrorInfo = (error: any, errorInfo?: any) => {
  return {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    errorInfo,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
};
