import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { LogIn, LogOut } from 'lucide-react';

import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값

const authButtonClass = 'group inline-flex items-center justify-center gap-1 h-9 px-3.5 rounded-lg text-base font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-[#f8f6f0] hover:text-black! active:scale-[0.97] cursor-pointer md:gap-2 md:h-12 md:px-5 md:text-xl';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-3.5 h-3.5 text-white! transition-all duration-200 group-hover:text-black! md:w-5 md:h-5';

const LandingHeader = () => {
  const { user, logout } = useAuth();
  const {getConfig} = useConfig();   // Config 값 가져오기

  return (
    <header className="container-fluid flex flex-col pb-0">
      <div className="container">
        {/* 우측 상단 인증 버튼 */}
        <div className="flex justify-end px-0 pt-2 pb-3 md:px-5 md:py-[30px]">
          {getConfig('user.isAuth') ? (
            <button className={authButtonClass} onClick={logout}>
              <span className={authButtonTextClass}>Logout</span>
              <LogOut className={`${authButtonIconClass} group-hover:translate-x-0.5`} aria-hidden="true" />
            </button>
          ) : (
            <Link to="/login" className={authButtonClass}>
              <span className={authButtonTextClass}>Login</span>
              <LogIn className={`${authButtonIconClass} rotate-180 group-hover:-translate-x-0.5`} aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* 중앙 초대형 브랜드 로고 */}
        <div className="mt-[12px] flex justify-center md:mt-[-4px] md:block md:text-center">
          <h1 className="landing-logo translate-y-2 !text-[3rem] tracking-[0.08em] font-griun text-[#222] md:translate-y-0 md:!text-[5em]">
            거리에섯
          </h1>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
