import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import { useAuth } from '@hooks/useAuth';
import { LogIn, LogOut } from 'lucide-react';

import '@assets/css/landing.css';
import { getNorthRegions, getSouthRegions } from '@utils/regionMap'; // 북부 / 남부 리스트 가져오는 함수
import { Helmet } from 'react-helmet-async';

const authButtonClass = 'group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-lg font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-[#f8f6f0] hover:text-black! active:scale-[0.97] cursor-pointer';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-4 h-4 text-white! transition-all duration-200 group-hover:text-black!';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hoveredCityCode, setHoveredCityCode] = useState(null); // ID(code) 기반으로 관리

  const southRegions = useMemo(() => getSouthRegions(), []);  // 남부 지역
  const northRegions = useMemo(() => getNorthRegions(), []);  // 북부 지역

  const currentRegions = activeTab === '남부' ? southRegions : northRegions;

  const goToMainPage = (region) => {
    // 💡 region 객체 내부의 데이터를 바로 활용
    navigate(`/${region.textEn}`);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(`/search/${encodeURIComponent(searchKeyword.trim())}`);
  };

  return (
    <>
      <Helmet>
        <title>거리에섯 - Index</title>
      </Helmet>

      <div className="page-wrapper min-h-screen bg-[#f8f6f0]">
        <header className="container-fluid flex flex-col pb-0">
          <div className="container">
            <div className="flex justify-end p-5 md:py-[30px]">
              {user ? (
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

            <div className="mt-[12px] flex justify-center md:mt-[-4px] md:block md:text-center">
              <h1 className="landing-logo text-[184px] md:text-[248px] tracking-[0.19em] font-griun text-[#222]">
                거리에섯
              </h1>
            </div>
          </div>
        </header>

        <main className="container-fluid flex flex-col mt-10 pb-[5vw]">
          <div className="container fs-up-3">
            <div className="w-full md:w-8/12 mx-auto">
              <div className="flex flex-col md:flex-row items-center bg-white rounded-[20px] md:rounded-[50px] p-4 md:py-[10px] md:px-[20px] w-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-10 md:mb-[50px] gap-3 md:gap-0">
                <input
                  type="text"
                  placeholder="떠나고 싶은 지역이나 검색 하고 싶은 내용을 입력하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 border-none px-[20px] outline-none w-full text-center md:text-left bg-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#333] text-white border-none py-3 md:py-[15px] px-[35px] rounded-[30px] cursor-pointer transition-colors duration-200 hover:bg-[#0F9B73]"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="container my-10">
            <div className="bg-white/40 backdrop-blur-[8px] border border-white/50 rounded-[20px] p-5 md:p-[40px] w-full">
              <div className="flex justify-center gap-[15px] mb-[30px] fs-up-3">
                <button
                  className={`py-[12px] px-[40px] font-bold rounded-lg cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '남부' ? 'bg-[#2B4A48] text-white' : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('남부')}
                >
                  경기 남부
                </button>
                <button
                  className={`py-[12px] px-[40px] font-bold rounded-lg cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '북부' ? 'bg-[#2B4A48] text-white' : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('북부')}
                >
                  경기 북부
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-[15px] fs-up-3">
                {currentRegions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => goToMainPage(region)}
                    onMouseEnter={() => setHoveredCityCode(region.code)}
                    onMouseLeave={() => setHoveredCityCode(null)}
                    onFocus={() => setHoveredCityCode(region.code)}
                    onBlur={() => setHoveredCityCode(null)}
                    className={`group relative overflow-hidden rounded-lg border-none bg-white/90 px-[10px] py-[18px] font-medium text-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-transparent transition-all duration-200 ease-out hover:-translate-y-[2px] hover:scale-[1.04] hover:bg-white hover:text-[#0D7F60] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:ring-black/5 focus:-translate-y-[2px] focus:scale-[1.04] focus:bg-white focus:text-[#0D7F60] focus:shadow-[0_12px_28px_rgba(15,23,42,0.08)] focus:ring-black/5 active:translate-y-0 active:scale-[0.98] ${
                      hoveredCityCode && hoveredCityCode !== region.code ? 'opacity-45' : 'opacity-100'
                    }`}
                  >
                    <span className="relative z-10">{region.textKor}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;