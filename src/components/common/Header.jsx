import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Search } from 'lucide-react';
// 🚀 추가: 전역 상태에서 유저 정보와 로그아웃 함수를 가져오기 위한 커스텀 훅 임포트
import { useAuth } from '@hooks/useAuth'; 
import '@assets/css/header.css';

import ProfileImage from '@modules/member/ProfileImage'; // 프로필 아이콘



// 🚀 방어막: 'showcase' 등 시스템 경로가 지역명으로 오염되는 것 차단
const FORBIDDEN_REGIONS = ['showcase', 'plan', 'user', 'search', 'login', 'customersupport', 'admin'];
const authButtonClass = 'group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-lg font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-white hover:text-black! active:scale-[0.97] cursor-pointer';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-4 h-4 text-white! transition-all duration-200 group-hover:text-black!';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 🚀 추가: AuthContext에서 user 상태와 logout 함수 추출
  const { user, logout } = useAuth();

  // console.log(user) //회원정보

  const { region } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // region이 존재하면서, 동시에 금지된 시스템 단어가 아닐 때만 저장!
    if (region && !FORBIDDEN_REGIONS.includes(region)) {
      localStorage.setItem('lastVisitedRegion', region);
    }
  }, [region]);

  // 🚀 2. 현재 지역을 가져올 때도 방어막 적용
  const currentRegion = (region && !FORBIDDEN_REGIONS.includes(region)) 
    ? region 
    : localStorage.getItem('lastVisitedRegion') || '수원시';

  const headerRef = useRef(null);

  const navItems = [
    { name: '볼거리', path: `/${currentRegion}/see/list` },
    { name: '먹거리', path: `/${currentRegion}/food/list` },
    { name: '잘거리', path: `/${currentRegion}/sleep/list` },
    { name: '놀거리', path: `/${currentRegion}/play/list` },
    { 
      name: '뽐낼거리', 
      // 🚀 3. 빈 깡통 경로 대신, 핫플거리를 기본(Default) 목적지로 지정
      path: `/showcase/hotplace`, 
      subMenu: [
        { name: '핫플거리', path: '/showcase/hotplace' },
        { name: '인생거리', path: '/showcase/life' },
      ]
    },
    { name: '내거리', path: '/user/mypage' },
    { name: '내거리(일정)', path: '/plan' },
  ];

  const isActiveNavItem = (item) => {
    if (item.subMenu) {
      return item.subMenu.some((sub) => pathname.startsWith(sub.path));
    }

    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
      return true;
    }

    const sectionPath = item.path.replace(/\/list$/, '');
    return sectionPath !== item.path && pathname.startsWith(`${sectionPath}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false); 
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false); 
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(`/search/${searchKeyword}`);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTagClick = (tag) => {
    setSearchKeyword(tag.replace('#', '').trim());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header ref={headerRef} className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000] relative">
      <div className="container mx-auto flex justify-between items-end pt-7 pb-4">
        
        {/* 로고 및 데스크톱 네비게이션 영역 (기존 동일) */}
        <div className="header-logo text-black no-underline fs-up-6">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        <nav className="hidden md:flex gap-4 lg:gap-[30px] mb-2">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item);

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => {
                  if (item.subMenu) setIsMenuOpen(true);
                }}
                onMouseLeave={() => {
                  if (item.subMenu) setIsMenuOpen(false);
                }}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(false);
                  }}
                  className={`relative fs-up-3 font-medium py-1 px-1 transition-all duration-300 hover:text-[#0F9B73] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#0F9B73] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[1px] ${
                    isActive
                      ? 'text-[#0F9B73] -translate-y-[1px] after:w-full'
                      : 'text-black after:w-0'
                  }`}
                >
                  {item.name}
                </Link>

                {/* 🚀 뽐낼거리 하위 메뉴 드롭다운 */}
                {item.subMenu && isMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ease-in-out z-[1001]">
                    {/* 메뉴와 드롭다운 사이 마우스 이탈 방지를 위한 투명 레이어 */}
                    <div className="absolute -top-2 left-0 w-full h-2"></div>
                    <div className="w-32 bg-white border border-gray-100 shadow-xl rounded-md py-1">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsSearchOpen(false);
                          }}
                          className={`block px-4 py-2 text-[14px] hover:bg-gray-50 hover:text-primary transition-colors whitespace-nowrap text-center ${
                            pathname.startsWith(sub.path) ? 'text-primary font-semibold' : 'text-gray-700'
                          }`}>
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
            aria-pressed={isSearchOpen}
          >
            <Search className="w-8 h-8 text-gray-600" />
          </button>
          
          {/* 수정: user 상태에 따른 조건부 렌더링 적용 */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* 프로필 이미지 */}
              <Link to="/user/mypage" className="shrink-0 block">
                <ProfileImage user={user} size="sm" className="cursor-pointer" />
              </Link>
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

      {/* --- 확장 검색창 오버레이 --- */}
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

      {/* --- 모바일 전용 드롭다운 메뉴 --- */}
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
              {/* 모바일에서도 하위 메뉴를 보여주고 싶다면 여기에 추가 로직을 넣을 수 있어 */}
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
        </nav>
      )}
    </header>
  );
};

export default Header;
