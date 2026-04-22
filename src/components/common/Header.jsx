import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@assets/css/header.css'; // 생성한 CSS 파일 불러오기

const Header = () => {
  // 모바일 햄버거 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ['볼거리', '먹거리', '잘거리', '놀거리', '뽐낼거리', '내거리'];

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메뉴 클릭 시 드롭다운 닫기
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header-container">
      {/* 1920px 제한이 걸린 내부 영역 */}
      <div className="header-inner">
        <div className="header-logo">
          <Link to="/" onClick={closeMenu}>거리에섯</Link>
        </div>
        
        {/* 데스크톱용 메뉴 */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item} to="/user">{item}</Link>
          ))}
        </nav>

        {/* 우측 아이콘 및 로그인/햄버거 버튼 */}
        <div className="header-right">
          <button className="search-btn">🔍</button>
          <button className="login-btn">로그인</button>
          
          {/* 모바일 햄버거 버튼 */}
          <button className="hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* 모바일용 드롭다운 메뉴 (조건부 클래스 렌더링) */}
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link key={item} to="/user" onClick={closeMenu}>
            {item}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;