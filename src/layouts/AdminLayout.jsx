import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    member: true,
    area: true,
    showcase: true,
    report: true,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;
  const isActiveStart = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      key: 'member',
      label: '회원 관리',
      children: [{ label: '회원 목록', path: '/admin1/members' }],
    },
    {
      key: 'area',
      label: '사거리 관리',
      children: [
        { label: '볼거리 관리', path: '/admin1/area/see' },
        { label: '먹거리 관리', path: '/admin1/area/food' },
        { label: '잘거리 관리', path: '/admin1/area/sleep' },
        { label: '놀거리 관리', path: '/admin1/area/play' },
      ],
    },
    {
      key: 'showcase',
      label: '뽐낼거리 관리',
      children: [{ label: '게시글 목록', path: '/admin1/showcase' }],
    },
    {
      key: 'report',
      label: '신고 관리',
      children: [{ label: '신고 관리', path: '/admin1/report' }],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 사이드바 */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0">

        {/* 로고 */}
        <div
          className="px-6 py-6 cursor-pointer border-b border-gray-100"
          onClick={() => navigate('/admin1')}
        >
          <span className="font-griun text-3xl text-gray-900">거리에섯</span>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col flex-1 px-4 py-4 gap-2">
          {menuItems.map((menu) => (
            <div key={menu.key}>
              {/* 상위 메뉴 */}
              <button
                onClick={() => toggleMenu(menu.key)}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                <span>▶ {menu.label}</span>
                <span className="text-sm text-gray-400">
                  {openMenus[menu.key] ? '▲' : '▼'}
                </span>
              </button>

              {/* 하위 메뉴 */}
              {openMenus[menu.key] && (
                <div className="flex flex-col gap-1 ml-4 mt-1">
                  {menu.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`px-4 py-2 text-sm rounded-lg transition ${
                        isActive(child.path) || isActiveStart(child.path)
                          ? 'text-[#0F9B73] font-semibold bg-green-50'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      • {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 하단 메인으로 버튼 */}
        <div className="px-4 py-5 border-t border-gray-100">
          <Link
            to="/"
            className="block text-center text-sm text-gray-400 hover:text-gray-600 transition"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">

        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {location.pathname}
          </p>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="검색"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#0F9B73] transition w-56"
            />
            <button className="text-gray-400 hover:text-gray-600 transition text-lg">🔍</button>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=admin" alt="admin" />
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 transition text-xl"
              title="로그아웃"
            >
              ↪
            </button>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;