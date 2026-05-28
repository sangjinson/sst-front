import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, CircleHelp, LogIn, LogOut, Megaphone, Search, UserRound } from 'lucide-react';
import { useAuth } from '@hooks/useAuth'; 
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값
import { toKorRegion } from '@utils/regionMap';

{/** Components */}
import PCNavItem from '@components/common/Headers/PCNavItem'; // Header -> Menu Items

import ProfileImage from '@modules/member/ProfileImage'; // 프로필 아이콘

import '@assets/css/header.css';

const authButtonClass = 'group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-lg font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-white hover:text-black! active:scale-[0.97] cursor-pointer';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-4 h-4 text-white! transition-all duration-200 group-hover:text-black!';

const Header = () => {

  const {getConfig} = useConfig();   // Config 값 가져오기

  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openMobileSections, setOpenMobileSections] = useState({});

  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();
  const headerRef        = useRef(null);

  const curRegionEn = getConfig('curRegion.textEn');        // 지역 영문명
  const navItems = [
    { 
      name: '볼거리',
      path: `/${curRegionEn}/see/list`,
      sectionType: 'see',
      subMenu: []
    },
    { 
      name: '먹거리',
      path: `/${curRegionEn}/food/list`,
      sectionType: 'food',
      subMenu: []
    },
    { 
      name: '잘거리',
      path: `/${curRegionEn}/sleep/list`,
      sectionType: 'sleep',
      subMenu: []
    },
    {
      name: '놀거리',
      path: `/${curRegionEn}/play/list`,
      sectionType: 'play',
      subMenu: []
    },
    { name: '뽐낼거리', path: `/showcase/hotplace`,
      subMenu: [
        { name: '핫플거리', path: '/showcase/hotplace' },
        { name: '인생거리', path: '/showcase/life' },
      ]
    },
    { 
      name: '내거리',
      path: '/plan',
      subMenu: [] 
    },
  ];

  const customerSupportItem = {
    name: '고객지원',
    path: '/customersupport/notice',
    subMenu: [
      { name: '공지사항', path: '/customersupport/notice' },
      { name: '자주하는 질문', path: '/customersupport/faq' },
    ],
  };

  const isActiveNavItem = (item) => {
    if (item.sectionType) {
      const [, , currentType] = pathname.split('/');
      return currentType === item.sectionType;
    }

    if (item.subMenu && item.subMenu.length > 0) {
      return item.subMenu.some((sub) => pathname.startsWith(sub.path));
    }

    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) return true;
    const sectionPath = item.path.replace(/\/list$/, '');
    return sectionPath !== item.path && pathname.startsWith(`${sectionPath}/`);
  };

  const toggleMenu   = () => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); };
  const closeMenu    = () => setIsMenuOpen(false);
  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); setIsProfileOpen(false); };
  const toggleMobileSection = (name) => {
    setOpenMobileSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const isMobileSectionOpen = (item) => openMobileSections[item.name] ?? isActiveNavItem(item);

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    
    if (curRegionEn) {
        const regionKor = toKorRegion(curRegionEn);
        navigate(`/search/${searchKeyword}?region=${encodeURIComponent(regionKor)}`);
    } else {
        navigate(`/search/${searchKeyword}`);
    }
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
        <div>
          <nav className="hidden md:flex gap-4 lg:gap-[30px] mb-2">
            {navItems.map((item) => (
              <PCNavItem
                key={item.name}
                item={item}
                pathname={pathname}
                setIsMenuOpen={setIsMenuOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
            ))}
          </nav>
        </div>

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

          {getConfig('user.isAuth') ? (
            <div className="hidden items-center gap-3 md:flex">
              {/* 프로필 + 아코디언 */}
              <div className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* 프로필 이미지 */}
                <ProfileImage user={getConfig('profile')} size="sm"/>

                {isProfileOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-[1001] mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                    {/* 프로필과 드롭다운 사이 마우스 이탈 방지 투명 레이어 */}
                    <div className="absolute -top-2 left-0 h-2 w-full" />
                    <Link
                      to="/user/mypage"
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[15px] font-bold no-underline transition-all duration-200 active:scale-[0.98] ${
                        pathname.startsWith('/user/mypage')
                          ? 'text-[#0F9B73]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0F9B73]'
                      }`}
                    >
                      <UserRound className="h-5 w-5 shrink-0" aria-hidden="true" />
                      마이페이지
                    </Link>
                    <Link
                      to="/customersupport/notice"
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[15px] font-bold no-underline transition-all duration-200 active:scale-[0.98] ${
                        pathname.startsWith('/customersupport/notice')
                          ? 'text-[#0F9B73]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0F9B73]'
                      }`}
                    >
                      <Megaphone className="h-5 w-5 shrink-0" aria-hidden="true" />
                      공지사항
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
            <div className="hidden md:block">
              <Link to="/login" className={authButtonClass}>
                <span className={authButtonTextClass}>Login</span>
                <LogIn className={`${authButtonIconClass} rotate-180 group-hover:-translate-x-0.5`} aria-hidden="true" />
              </Link>
            </div>
          )}

          <button
            type="button"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.96] md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMenuOpen}
          >
            <span className={`absolute h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-300 ease-out ${
              isMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
            }`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-200 ease-out ${
              isMenuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
            }`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-300 ease-out ${
              isMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
            }`} />
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
              {['#힐링', '#맛집', '#커플', '#애견','#가족'].map(tag => (
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
        <nav className="absolute left-0 top-full z-[998] w-full border-t border-gray-100 bg-white px-4 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.10)] animate-slidedown md:hidden">
          <div className="mx-auto flex max-h-[calc(100vh-96px)] w-full max-w-md flex-col overflow-y-auto">
            <div className="mb-4 grid gap-3 border-b border-gray-100 pb-4">
              {user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/user/mypage"
                    onClick={closeMenu}
                    className={`flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border px-3 text-[15px] font-bold no-underline transition-all duration-200 active:scale-[0.98] ${
                      pathname.startsWith('/user/mypage')
                        ? 'border-[#0F9B73]/40 bg-white text-[#0F9B73]'
                        : 'border-gray-200 bg-white text-gray-800 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0F9B73] hover:shadow-sm'
                    }`}
                  >
                    <UserRound className="h-5 w-5 shrink-0" aria-hidden="true" />
                    마이페이지
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 text-[15px] font-bold text-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0F9B73] hover:shadow-sm active:scale-[0.98]"
                  >
                    <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-[15px] font-bold text-gray-800 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0F9B73] hover:shadow-sm active:scale-[0.98]"
                >
                  <LogIn className="h-5 w-5 shrink-0 rotate-180" aria-hidden="true" />
                  로그인
                </Link>
              )}
            </div>

            {navItems.map((item) => {
              const isActive = isActiveNavItem(item);
              const hasSubMenu = item.subMenu && item.subMenu.length > 0;
              const isOpen = hasSubMenu && isMobileSectionOpen(item);
              const itemClassName = `relative flex min-h-[56px] w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-[16px] font-bold no-underline transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? 'bg-white text-[#0F9B73]'
                  : 'text-gray-800 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-950'
              }`;

              return (
                <div key={item.name} className="border-b border-gray-100">
                  {hasSubMenu ? (
                    <button
                      type="button"
                      onClick={() => toggleMobileSection(item.name)}
                      className={itemClassName}
                      aria-expanded={isOpen}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#0F9B73]" />
                      )}
                      <span className="pl-1">{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0F9B73]' : 'text-gray-400'}`}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={itemClassName}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#0F9B73]" />
                      )}
                      <span className="pl-1">{item.name}</span>
                      <span
                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                          isActive ? 'scale-100 bg-[#0F9B73]' : 'scale-0 bg-transparent'
                        }`}
                      />
                    </Link>
                  )}

                  {hasSubMenu && isOpen && (
                    <div className="ml-4 border-l border-gray-200 pb-3 pl-3">
                      {item.subMenu.map(sub => {
                        const isSubActive = pathname.startsWith(sub.path);
                        return (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={closeMenu}
                            className={`flex min-h-[44px] items-center rounded-xl px-3 text-[14px] font-semibold no-underline transition-all duration-200 active:scale-[0.98] ${
                              isSubActive
                                ? 'text-[#0F9B73]'
                                : 'text-gray-500 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {(() => {
              const isActive = isActiveNavItem(customerSupportItem);
              const isOpen = isMobileSectionOpen(customerSupportItem);

              return (
                <div className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(customerSupportItem.name)}
                    className={`relative flex min-h-[56px] w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-[16px] font-bold no-underline transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-white text-[#0F9B73]'
                        : 'text-gray-800 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-950'
                    }`}
                    aria-expanded={isOpen}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#0F9B73]" />
                    )}
                    <span className="pl-1">{customerSupportItem.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0F9B73]' : 'text-gray-400'}`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 border-l border-gray-200 pb-3 pl-3">
                      {customerSupportItem.subMenu.map(sub => {
                        const isSubActive = pathname.startsWith(sub.path);
                        return (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={closeMenu}
                            className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-[14px] font-semibold no-underline transition-all duration-200 active:scale-[0.98] ${
                              isSubActive
                                ? 'text-[#0F9B73]'
                                : 'text-gray-500 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            {sub.path.includes('notice') ? (
                              <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <CircleHelp className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mt-4 flex justify-center border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold text-gray-500 transition-all duration-200 hover:-translate-y-px hover:bg-gray-50 hover:text-[#0F9B73] active:scale-[0.98]"
                aria-label="모바일 메뉴 접기"
              >
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                접기
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;