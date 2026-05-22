import React, { createContext, useContext, useState, useEffect } from "react";

// 1. 컨텍스트 생성 (초기값은 null로 설정)
const SidebarContext = createContext(null);

// 2. Custom Hook: 컨텍스트를 쉽게 꺼내 쓰기 위한 함수
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// 3. Provider 컴포넌트
export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // 화면 크기에 따른 모바일 상태 감지
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 사이드바 확장/축소 토글
  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  // 모바일 사이드바 열기/닫기 토글
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // 서브메뉴 열기/닫기 토글
  const toggleSubmenu = (item) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};