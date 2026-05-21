import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PCNavItem = ({ item, pathname, setIsMenuOpen, setIsSearchOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  const hasSubMenu = item.subMenu && item.subMenu.length > 0;

  // 활성화 로직
  const isActive = (() => {
    if (hasSubMenu) {
      return item.subMenu.some((sub) => pathname.startsWith(sub.path));
    }
    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) return true;
    
    const sectionPath = item.path.replace(/\/list$/, '');
    return sectionPath !== item.path && pathname.startsWith(`${sectionPath}/`);
  })();

  // 클릭 시 메뉴들을 닫아주는 핸들러도 내장
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (hasSubMenu) setIsHovered(true); }}
      onMouseLeave={() => { if (hasSubMenu) setIsHovered(false); }}>
      <Link
        to={item.path}
        onClick={handleLinkClick}
        className={`relative fs-up-3 font-medium py-1 px-1 transition-all duration-300 hover:text-[#0F9B73] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#0F9B73] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[1px] ${
          isActive ? 'text-[#0F9B73] -translate-y-[1px] after:w-full' : 'text-black after:w-0'
        }`}>
        {item.name}
      </Link>

      {hasSubMenu && isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ease-in-out z-[1001]">
          <div className="absolute -top-2 left-0 w-full h-2" />
          <div className="w-32 bg-white border border-gray-100 shadow-xl rounded-md py-1">
            {item.subMenu.map((sub) => (
              <Link
                key={sub.name}
                to={sub.path}
                onClick={handleLinkClick}
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
};

export default PCNavItem;