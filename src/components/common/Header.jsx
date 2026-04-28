import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '@assets/css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { region } = useParams();
  const navigate = useNavigate();

  // 🚀 1. URL에 지역 정보(region)가 있을 때마다 브라우저에 저장해둡니다.
  useEffect(() => {
    if (region) {
      localStorage.setItem('lastVisitedRegion', region);
    }
  }, [region]);

  // 🚀 2. 현재 지역을 결정합니다. (URL 파라미터 우선 -> 없으면 저장된 값 -> 없으면 기본값)
  const currentRegion = region || localStorage.getItem('lastVisitedRegion') || '수원시';

  const headerRef = useRef(null);

  // 🚀 3. 이제 currentRegion이 항상 유지되므로 링크가 깨지지 않습니다.
  const navItems = [
    { name: '볼거리', path: `/${currentRegion}/see/list` },
    { name: '먹거리', path: `/${currentRegion}/food/list` },
    { name: '잘거리', path: `/${currentRegion}/sleep/list` },
    { name: '놀거리', path: `/${currentRegion}/play/list` },
    { name: '뽐낼거리', path: `/showcase` },
    { name: '내거리', path: '/user/mypage' },
  ];

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
        
        {/* 로고 */}
        <div className="header-logo text-black no-underline fs-up-6">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex gap-4 lg:gap-[30px] mb-2">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="text-black fs-up-3 font-medium hover:text-primary transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-4 md:gap-5 mb-2">
          <button onClick={toggleSearch} className="fs-up-3 cursor-pointer bg-transparent border-none">
            🔍
          </button>
          
          {/* 로그인 버튼 → /login으로 이동 */}
          <Link to="/login">
            <button className="bg-primary text-white py-2 px-4 md:px-6 rounded fs-up-1 font-bold border-none cursor-pointer whitespace-nowrap">
              로그인
            </button>
          </Link>
          
          {/* 모바일 햄버거 버튼 */}
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
        <div className="absolute top-full left-0 w-full bg-white/98 shadow-[0_10px_30px_rgba(0,0,0,0.1)] pt-[50px] pb-[40px] px-5 flex justify-center z-[999] border-t border-gray-100 animate-slidedown">
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
                🔍
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
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={closeMenu} 
              className="text-gray-800 text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;