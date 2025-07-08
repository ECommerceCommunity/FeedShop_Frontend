import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  nickname: string;
  userType: "customer" | "admin";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    nickname: string,
    userType: "customer" | "admin",
    token: string
  ) => void;
  logout: () => void;
  updateUserType: (userType: "customer" | "admin") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");

    // 모든 필수 정보가 있어야 로그인 상태로 인정
    if (storedToken && storedNickname && storedUserType) {
      setUser({
        nickname: storedNickname,
        userType: storedUserType as "customer" | "admin",
        token: storedToken,
      });
    } else {
      // 필수 정보가 없으면 로그인 상태가 아니므로 localStorage 정리
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      setUser(null);
    }

    setIsInitialized(true);
  }, []);

  const login = (
    nickname: string,
    userType: "customer" | "admin",
    token: string
  ) => {
    const userData = { nickname, userType, token };
    setUser(userData);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nickname");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  const updateUserType = (userType: "customer" | "admin") => {
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
    <AuthContext.Provider value={{ user, login, logout, updateUserType }}>
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
