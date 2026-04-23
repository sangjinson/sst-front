import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@assets/css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const navItems = [
    { name: '볼거리', path: '/area/see/list' },
    { name: '먹거리', path: '/area/food/list' },
    { name: '잘거리', path: '/area/sleep/list' },
    { name: '놀거리', path: '/area/play/list' },
    { name: '뽐낼거리', path: '/user' },
    { name: '내거리', path: '/user/mypage' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    alert(`'${searchKeyword}'(으)로 검색합니다.`);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTagClick = (tag) => {
    setSearchKeyword(tag.replace('#', '').trim());
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000]">
      {/* 1920px 중앙 정렬 기준 헤더 이너 */}
      <div className="max-w-[1920px] mx-auto flex justify-between items-center py-5 px-5 lg:px-[50px] xl:px-[250px]">
        
        {/* 로고 */}
        <div className="header-logo text-black no-underline text-[28px] my-5">
          {/* to="/user" 였던 것을 to="/" 로 변경합니다 */}
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
        <div className="flex items-center gap-5">
          {/* 검색 돋보기 버튼 */}
          <button onClick={toggleSearch} className="text-xl cursor-pointer bg-transparent border-none">
            🔍
          </button>
          
          <button className="bg-primary text-white py-2 px-6 rounded text-sm font-bold border-none cursor-pointer">
            로그인
          </button>
          
          {/* 모바일 햄버거 버튼 */}
          <button className="md:hidden text-[26px] text-gray-800 bg-transparent border-none cursor-pointer" onClick={toggleMenu}>
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* --- 확장 검색창 오버레이 --- */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white/98 shadow-[0_10px_30px_rgba(0,0,0,0.1)] pt-[50px] pb-[40px] px-5 flex justify-center z-[999] border-t border-gray-100 animate-slidedown">
          <div className="w-full max-w-[800px] flex flex-col">
            
            {/* 검색 입력 박스 */}
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
            
            {/* 추천 검색어 태그 */}
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
      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col bg-white border-t border-gray-100 py-2.5`}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} onClick={closeMenu} className="text-gray-800 text-[16px] py-[15px] px-5 border-b border-gray-50 hover:bg-gray-50 no-underline">
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;