import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // react-router 대신 보통 react-router-dom을 사용합니다.
import { useSidebar } from "@themeadmin/context/SidebarContext";
import { ThemeToggleButton } from "@themeadmin/components/common/ThemeToggleButton";
import NotificationDropdown from "@themeadmin/components/header/NotificationDropdown";
import UserDropdown from "@themeadmin/components/header/UserDropdown";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null); // 타입 정의 삭제

  // 화면 크기에 따라 사이드바 토글 방식 결정
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // 단축키 (Ctrl/Cmd + K)로 검색창 포커스
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    // 🚀 수정: z-index를 99999에서 z-40으로 하향 조정. 모달(보통 z-50)이 이 헤더를 덮을 수 있게 함.
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        
        {/* --- 왼쪽 영역 (토글, 로고, 검색) --- */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
          {/* 사이드바 토글 버튼 */}
          <button
            // 🚀 수정: 내부 요소가 아닌 버튼 자체의 z-index는 제거(헤더의 z-index를 따름)
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {/* SVG 아이콘 로직 생략 (기존과 동일) */}
            {isMobileOpen ? ( /* ... X 아이콘 ... */ null ) : ( /* ... 햄버거 아이콘 ... */ null )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>

          <Link to="/" className="lg:hidden">
            <img className="dark:hidden" src="./images/logo/logo.svg" alt="Logo" />
            <img className="hidden dark:block" src="./images/logo/logo-dark.svg" alt="Logo" />
          </Link>

          {/* 모바일용 메뉴 버튼 (우측 상단 점 3개 메뉴 등) */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>

          {/* 데스크탑용 검색창 (Ctrl+K) */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* 검색 아이콘 및 Input 생략 (기존과 동일) */}
              <input ref={inputRef} type="text" className="..." placeholder="Search..." />
            </div>
          </div>
        </div>

        {/* --- 오른쪽 영역 (테마, 알림, 유저) --- */}
        {/* 🚀 보완: 모바일 메뉴 오픈 시의 배경 쉐도우와 배치 로직을 명확히 함 */}
        <div className={`
          ${isApplicationMenuOpen ? "flex" : "hidden"} 
          flex-col items-center justify-between w-full gap-4 px-5 py-4 
          lg:flex lg:flex-row lg:justify-end lg:px-0 lg:py-0 lg:shadow-none
          bg-white dark:bg-gray-900 border-b lg:border-b-0 border-gray-200 dark:border-gray-800
        `}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>

      </div>
    </header>
  );
};
export default AppHeader;