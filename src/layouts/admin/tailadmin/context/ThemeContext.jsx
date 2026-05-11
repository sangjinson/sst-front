import React, { createContext, useState, useContext, useEffect } from "react";

// 1. 컨텍스트 생성
const ThemeContext = createContext(undefined);

// 2. 테마 공급자 (ThemeProvider)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기화: 로컬 스토리지에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "light"; // 기본값은 light

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  // 테마가 변경될 때마다 로컬 스토리지 저장 및 DOM 클래스 적용
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 테마 사용을 위한 커스텀 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};