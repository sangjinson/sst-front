import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Search } from 'lucide-react';
import { useAuth } from '@hooks/useAuth'; 
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값

import '@assets/css/header.css';

const FORBIDDEN_REGIONS = ['showcase', 'plan', 'user', 'search', 'login', 'customersupport', 'admin'];
const authButtonClass = 'group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-lg font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-white hover:text-black! active:scale-[0.97] cursor-pointer';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-4 h-4 text-white! transition-all duration-200 group-hover:text-black!';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { user, logout } = useAuth();
  const { region }       = useParams();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();
  const headerRef        = useRef(null);

  useEffect(() => {
    if (region && !FORBIDDEN_REGIONS.includes(region)) {
      localStorage.setItem('lastVisitedRegion', region);
    }
  }, [region]);

  const currentRegion = (region && !FORBIDDEN_REGIONS.includes(region))
    ? region
    : localStorage.getItem('lastVisitedRegion') || '수원시';

  // console.log(currentRegion);

  const navItems = [
    { name: '볼거리', path: `/${currentRegion}/see/list` },
    { name: '먹거리', path: `/${currentRegion}/food/list` },
    { name: '잘거리', path: `/${currentRegion}/sleep/list` },
    { name: '놀거리', path: `/${currentRegion}/play/list` },
    {
      name: '뽐낼거리',
      path: `/showcase/hotplace`,
      subMenu: [
        { name: '핫플거리', path: '/showcase/hotplace' },
        { name: '인생거리', path: '/showcase/life' },
      ]
    },
    { name: '내거리', path: '/plan' },
  ];

  const isActiveNavItem = (item) => {
    if (item.subMenu) return item.subMenu.some((sub) => pathname.startsWith(sub.path));
    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) return true;
    const sectionPath = item.path.replace(/\/list$/, '');
    return sectionPath !== item.path && pathname.startsWith(`${sectionPath}/`);
  };

  const toggleMenu   = () => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); };
  const closeMenu    = () => setIsMenuOpen(false);
  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); setIsProfileOpen(false); };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(`/search/${searchKeyword}`);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };
  const handleTagClick = (tag) => { setSearchKeyword(tag.replace('#', '').trim()); };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={headerRef} className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000] relative">
      <div className="container mx-auto flex justify-between items-end pt-7 pb-4">

        {/* 로고 */}
        <div className="header-logo text-black no-underline fs-up-6">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex gap-4 lg:gap-[30px] mb-2">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item);
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => { if (item.subMenu) setIsMenuOpen(true); }}
                onMouseLeave={() => { if (item.subMenu) setIsMenuOpen(false); }}
              >
                <Link
                  to={item.path}
                  onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }}
                  className={`relative fs-up-3 font-medium py-1 px-1 transition-all duration-300 hover:text-[#0F9B73] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#0F9B73] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[1px] ${
                    isActive ? 'text-[#0F9B73] -translate-y-[1px] after:w-full' : 'text-black after:w-0'
                  }`}
                >
                  {item.name}
                </Link>

                {item.subMenu && isMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ease-in-out z-[1001]">
                    <div className="absolute -top-2 left-0 w-full h-2" />
                    <div className="w-32 bg-white border border-gray-100 shadow-xl rounded-md py-1">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }}
                          className={`block px-4 py-2 text-[14px] hover:bg-gray-50 hover:text-primary transition-colors whitespace-nowrap text-center ${
                            pathname.startsWith(sub.path) ? 'text-primary font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-4 md:gap-5 mb-2">
          <button
            onClick={toggleSearch}
            className={`inline-flex items-center justify-center bg-transparent px-2.5 text-[24px] border-none cursor-pointer transition-transform duration-200 ${
              isSearchOpen ? 'scale-110' : 'hover:scale-110'
            }`}
            aria-label="검색"
          >
            <Search className="w-8 h-8 text-gray-600" />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* 프로필 + 아코디언 */}
              <div className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <img
                  src="https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png"
                  alt="프로필"
                  className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-full object-cover border-2 border-gray-100 hover:border-[#0F9B73] transition-colors cursor-pointer"
                />
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-0 w-44 bg-white border border-gray-100 shadow-xl rounded-md py-1 z-[1001]">
                    {/* 프로필과 드롭다운 사이 마우스 이탈 방지 투명 레이어 */}
                    <div className="absolute -top-2 left-0 w-full h-2" />
                    <Link
                      to="/user/mypage"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-5 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0F9B73] transition-colors"
                    >
                      👤 마이페이지
                    </Link>
                    <Link
                      to="/customersupport/notice"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-5 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0F9B73] transition-colors"
                    >
                      📢 공지사항
                    </Link>
                  </div>
                )}
              </div>

              {/* 로그아웃 버튼 */}
              <button className={authButtonClass} onClick={logout}>
                <span className={authButtonTextClass}>Logout</span>
                <LogOut className={`${authButtonIconClass} group-hover:translate-x-0.5`} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link to="/login" className={authButtonClass}>
              <span className={authButtonTextClass}>Login</span>
              <LogIn className={`${authButtonIconClass} rotate-180 group-hover:-translate-x-0.5`} aria-hidden="true" />
            </Link>
          )}

          <button
            className="block md:hidden w-9 h-9 flex items-center justify-center fs-up-3 text-gray-800 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* 검색창 오버레이 */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] pt-[50px] pb-[40px] px-5 flex justify-center z-[999] border-t border-gray-100 animate-slidedown">
          <div className="w-full max-w-[800px] flex flex-col">
            <div className="flex items-center border-b-2 border-gray-800 pb-[15px] mb-[15px]">
              <input
                type="text"
                placeholder="어디로 여행을 떠나실 건가요?"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-[18px] md:text-[24px] font-medium px-2.5 text-gray-900 placeholder-gray-400"
              />
              <button onClick={handleSearch} className="text-[24px] px-2.5 bg-transparent border-none cursor-pointer hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-gray-600" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5 md:gap-5 px-2.5 text-[13px] md:text-[14px] text-gray-500">
              {['#마술의 거리', '#낭만의 거리', '#숲속의 거리', '#필수 관광명소'].map(tag => (
                <span key={tag} onClick={() => handleTagClick(tag)} className="cursor-pointer hover:text-primary hover:underline transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 드롭다운 메뉴 */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col md:hidden z-[998]">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item);
            return (
              <React.Fragment key={item.name}>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className={`text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline font-bold ${
                    isActive ? 'text-[#0F9B73]' : 'text-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
                {item.subMenu && item.subMenu.map(sub => (
                  <Link
                    key={sub.name}
                    to={sub.path}
                    onClick={closeMenu}
                    className={`text-[14px] py-[10px] px-8 border-b border-gray-50 hover:bg-gray-50 no-underline ${
                      pathname.startsWith(sub.path) ? 'text-[#0F9B73] font-semibold' : 'text-gray-500'
                    }`}
                  >
                    - {sub.name}
                  </Link>
                ))}
              </React.Fragment>
            );
          })}
          {/* 모바일에서 마이페이지/공지사항 */}
          {user && (
            <>
              <Link
                to="/user/mypage"
                onClick={closeMenu}
                className="text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline font-bold text-gray-800"
              >
                👤 마이페이지
              </Link>
              <Link
                to="/customersupport/notice"
                onClick={closeMenu}
                className="text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline font-bold text-gray-800"
              >
                📢 공지사항
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;