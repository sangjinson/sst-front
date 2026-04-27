import React, { useState, useEffect, useRef } from 'react'; // 🚀 useEffect, useRef 추가
import { Link, useParams, useNavigate } from 'react-router-dom';
import '@assets/css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { region } = useParams();
  const navigate = useNavigate();

  const currentRegion = region || '수원시';

  // 🚀 1. 헤더 전체 영역을 감지하기 위한 ref 생성
  const headerRef = useRef(null);

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
    setIsSearchOpen(false); // 메뉴 열 때 검색창 닫기
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false); // 검색창 열 때 메뉴 닫기
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

  // 🚀 2. 바깥 클릭 감지 로직 (useEffect)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 클릭한 요소(event.target)가 headerRef(헤더) 안에 없으면 닫기!
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };

    // 마우스 클릭 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    
    // 컴포넌트가 언마운트될 때 리스너 정리 (메모리 누수 방지)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    /* 🚀 3. header 태그에 ref를 달아주고, 모바일을 위해 relative를 추가합니다. */
    <header ref={headerRef} className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000] relative">
      
      <div className="max-w-[1920px] mx-auto flex justify-between items-center py-5 px-5 lg:px-[50px] xl:px-[250px]">
        
        {/* 로고 */}
        <div className="header-logo text-black no-underline text-[28px] my-5">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex gap-[30px]">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="text-black text-lg font-medium hover:text-primary transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-4 md:gap-5">
          <button onClick={toggleSearch} className="text-xl cursor-pointer bg-transparent border-none">
            🔍
          </button>
          
          <button className="bg-primary text-white py-2 px-4 md:px-6 rounded text-sm font-bold border-none cursor-pointer whitespace-nowrap">
            로그인
          </button>
          
          {/* 모바일 햄버거 버튼 */}
          <button 
            className="block md:hidden text-[26px] text-gray-800 bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center" 
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
      {/* 🚀 모바일 메뉴도 화면을 밀어내지 않고 absolute로 덮이게 처리했습니다. */}
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