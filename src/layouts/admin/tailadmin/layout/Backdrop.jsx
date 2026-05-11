import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  // 모바일 사이드바가 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;