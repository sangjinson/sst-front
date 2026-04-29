import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '@assets/css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { region } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (region) {
      localStorage.setItem('lastVisitedRegion', region);
    }
  }, [region]);

  const currentRegion = region || localStorage.getItem('lastVisitedRegion') || '수원시';

  const headerRef = useRef(null);

  const navItems = [
    { name: '볼거리', path: `/${currentRegion}/see/list` },
    { name: '먹거리', path: `/${currentRegion}/food/list` },
    { name: '잘거리', path: `/${currentRegion}/sleep/list` },
    { name: '놀거리', path: `/${currentRegion}/play/list` },
    { 
      name: '뽐낼거리', 
      path: `/showcase`,
      subMenu: [ // 하위 메뉴 추가
        { name: '핫플거리', path: '/showcase/hot' },
        { name: '인생거리', path: '/showcase/life' },
      ]
    },
    { name: '내거리', path: '/user/mypage' },
    { name: '내거리(일정)', path: '/plan' },
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
    navigate(`/user/${searchKeyword}`);
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
      <div className="container mx-auto flex justify-between items-end pt-7 pb-4 px-4">
        
        {/* 로고 */}
        <div className="header-logo text-black no-underline fs-up-6">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex gap-4 lg:gap-[30px] mb-2">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link 
                to={item.path} 
                className="text-black fs-up-3 font-medium hover:text-primary transition-colors block py-1"
              >
                {item.name}
              </Link>

              {/* 🚀 뽐낼거리 하위 메뉴 드롭다운 */}
              {item.subMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-[1001]">
                  {/* 메뉴와 드롭다운 사이 마우스 이탈 방지를 위한 투명 레이어 */}
                  <div className="absolute -top-2 left-0 w-full h-2"></div>
                  
                  <div className="w-32 bg-white border border-gray-100 shadow-xl rounded-md py-1">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors whitespace-nowrap text-center"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-4 md:gap-5 mb-2">
          <button onClick={toggleSearch} className="fs-up-3 cursor-pointer bg-transparent border-none">
            🔍
          </button>
          
          <Link to="/login">
            <button className="bg-primary text-white py-2 px-4 md:px-6 rounded fs-up-1 font-bold border-none cursor-pointer whitespace-nowrap">
              로그인
            </button>
          </Link>
          
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
            <React.Fragment key={item.name}>
              <Link 
                to={item.path} 
                onClick={closeMenu} 
                className="text-gray-800 text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline font-bold"
              >
                {item.name}
              </Link>
              {/* 모바일에서도 하위 메뉴를 보여주고 싶다면 여기에 추가 로직을 넣을 수 있어 */}
              {item.subMenu && item.subMenu.map(sub => (
                <Link key={sub.name} to={sub.path} onClick={closeMenu} className="text-gray-500 text-[14px] py-[10px] px-8 border-b border-gray-50 hover:bg-gray-50 no-underline">
                  - {sub.name}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;