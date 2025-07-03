import { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";

interface AuthContextType {
  nickname: string | null;
  login: (nickname: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // localStorage에서 nickname 가져오기
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");

    // 토큰이 있으면 nickname도 있어야 함
    if (storedToken && storedNickname) {
      setNickname(storedNickname);
    } else {
      // 토큰이 없으면 로그인 상태가 아니므로 localStorage 정리
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      setNickname(null);
    }

    setIsInitialized(true);
  }, []);

  const login = (nickname: string) => {
    setNickname(nickname);
    localStorage.setItem("nickname", nickname);
  };

  const logout = () => {
    setNickname(null);
    localStorage.removeItem("nickname");
    localStorage.removeItem("token");
  };

  // 초기화가 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return <div>로딩중...</div>;
  }

  return (
    <AuthContext.Provider value={{ nickname, login, logout }}>
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
