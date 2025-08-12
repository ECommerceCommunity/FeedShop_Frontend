import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

interface User {
  nickname: string;
  name: string;
  userType: "user" | "admin" | "seller";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    nickname: string,
    name: string,
    userType: "user" | "admin" | "seller",
    token: string
  ) => void;
  logout: () => void;
  updateUserType: (userType: "seller" | "admin" | "user") => void;
  handleUnauthorized: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedName = localStorage.getItem("name");
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");
    // 모든 필수 정보가 있어야 로그인 상태로 인정
    if (storedToken && storedNickname && storedUserType) {
      setUser({
        nickname: storedNickname,
        name: storedName || storedNickname, // name이 없으면 nickname 사용
        userType: storedUserType as "admin" | "seller" | "user",
        token: storedToken,
      });
    } else {
      // 필수 정보가 없으면 로그인 상태가 아니므로 localStorage 정리
      localStorage.removeItem("nickname");
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      setUser(null);
    }
    setIsInitialized(true);
  }, []);

  const login = (
    nickname: string,
    name: string,
    userType: "admin" | "seller" | "user",
    token: string
  ) => {
    const userTypeLower = userType.toLowerCase() as "admin" | "seller" | "user";
    const userData = { nickname, name, userType: userTypeLower, token };
    setUser(userData);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("name", name);
    localStorage.setItem("userType", userTypeLower);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nickname");
    localStorage.removeItem("name"); // name도 제거
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  // 401 에러 시 자동 로그아웃 처리
  const handleUnauthorized = () => {
    console.log("401 에러 감지: 자동 로그아웃 처리");
    logout();
    // 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  };

  const updateUserType = (userType: "admin" | "seller" | "user") => {
    if (user) {
      const updatedUser = { ...user, userType };
      setUser(updatedUser);
      localStorage.setItem("userType", userType);
    }
  };

  // 초기화가 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return <div>로딩중...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUserType, handleUnauthorized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
