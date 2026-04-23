import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@assets/css/header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- 검색창 상태 관리 ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const navItems = [
    { name: '볼거리', path: '/user' },
    { name: '먹거리', path: '/user' },
    { name: '잘거리', path: '/user' },
    { name: '놀거리', path: '/user' },
    { name: '뽐낼거리', path: '/user' },
    { name: '내거리', path: '/user/mypage' }, // 마이페이지
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // 검색창 토글 함수
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 검색 실행 함수
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    alert(`'${searchKeyword}'(으)로 검색합니다.`);
    setIsSearchOpen(false); // 검색 후 창 닫기
  };

  // 엔터키 감지
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 해시태그 클릭
  const handleTagClick = (tag) => {
    setSearchKeyword(tag.replace('#', '').trim());
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-logo">
          <Link to="/user" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path}>{item.name}</Link>
          ))}
        </nav>

        <div className="header-right">
          {/* 돋보기 버튼 클릭 시 toggleSearch 실행 */}
          <button className="search-btn" onClick={toggleSearch}>🔍</button>
          <button className="login-btn">로그인</button>
          
          <button className="hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* --- 확장되는 검색창 오버레이 --- */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-inner">
            <div className="search-input-box">
              <input 
                type="text" 
                placeholder="어디로 여행을 떠나실 건가요?" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button onClick={handleSearch}>🔍</button>
            </div>
            <div className="search-tags">
              {['#마술의 거리', '#낭만의 거리', '#숲속의 거리', '#필수 관광명소'].map(tag => (
                <span key={tag} onClick={() => handleTagClick(tag)}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 */}
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} onClick={closeMenu}>
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;