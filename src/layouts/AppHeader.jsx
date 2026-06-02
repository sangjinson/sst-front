import { useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "@context/SidebarContext";
import { ThemeToggleButton } from "@components/admin/ThemeToggleButton";
//  1. 전역 인증 상태와 로그아웃 함수를 가져오기 위해 useAuth 훅 추가
import { useAuth } from "@hooks/useAuth"; 
//  2. 직관적인 UI를 위해 lucide-react에서 아이콘 임포트
import { LogOut, UserCircle } from "lucide-react"; 

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  
  //  3. useAuth에서 user 정보와 logout 로직 추출
  const { user, logout } = useAuth(); 

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

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        
        {/* --- 왼쪽 영역 (토글, 로고) --- */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? ( 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> 
            ) : ( 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg> 
            )}
          </button>

          <Link to="/admin" className="flex items-center gap-2 no-underline lg:hidden">
            <img
              src="/admin-logo.png"
              alt="거리에섯 관리자 로고"
              className="h-12 w-12 shrink-0 rounded-2xl object-cover"
            />
            <span className="text-2xl font-extrabold tracking-[-0.02em] text-gray-900 dark:text-white">
              거리에섯
            </span>
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        {/* --- 오른쪽 영역 (다크모드 테마, 유저/로그아웃) --- */}
        <div className={`
          ${isApplicationMenuOpen ? "flex" : "hidden"} 
          flex-col items-center justify-between w-full gap-4 px-5 py-4 
          lg:flex lg:flex-row lg:justify-end lg:px-0 lg:py-0 lg:shadow-none
          bg-white dark:bg-gray-900 border-b lg:border-b-0 border-gray-200 dark:border-gray-800
        `}>
          
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            
            {/*  4. 분리하지 않고 헤더 내부에 직접 구현한 관리자 인증 섹션 */}
            <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <UserCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-semibold">
                  {user?.mbrNickname || '최고관리자'} 님
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};

export default AppHeader;