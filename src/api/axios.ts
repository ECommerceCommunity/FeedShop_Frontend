import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 타임아웃을 10초로 증가
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API 요청:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    });
    
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {} as import("axios").AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
      console.log('토큰 추가됨:', token.substring(0, 20) + '...');
    } else {
      console.log('토큰 없음');
    }
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      code: error.code
    });
    
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
