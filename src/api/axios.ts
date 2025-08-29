import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8080";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {} as import("axios").AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      console.log("401 에러 감지: 토큰 제거 및 로그인 페이지 리다이렉트");
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      localStorage.removeItem("name");
      localStorage.removeItem("userType");

      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
