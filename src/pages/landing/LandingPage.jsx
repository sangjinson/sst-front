import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import { useAuth } from '@hooks/useAuth';

import '@assets/css/landing.css';
import { toEnRegion } from '@utils/regionMap';
import { Helmet } from 'react-helmet-async';
import api from '@api/axios'; 

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 🚀 핵심 수정: 무조건 false가 아니라, localStorage에 'true'라고 적혀있는지 확인해서 초기값 설정
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem('isLogin') === 'true');

  const citiesSouth = ['수원시', '성남시', '용인시', '안양시', '안산시', '과천시', '광명시', '광주시', '군포시', '부천시', '시흥시', '안성시', '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시', '여주시', '양평군'];
  const citiesNorth = ['고양시', '구리시', '남양주시', '동두천시', '양주시', '의정부시', '파주시', '포천시', '연천군', '가평군'];

  const currentCities = activeTab === '남부' ? citiesSouth : citiesNorth;

  const goToMainPage = (regionName) => {
    navigate(`/${toEnRegion(regionName)}`);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(searchKeyword);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); 
      
      // 🚀 핵심 추가: 로그아웃 성공 시 브라우저에서 꼬리표 제거
      localStorage.removeItem('isLogin'); 
      
      setIsLogin(false); 
      alert('로그아웃 되었습니다.');
      window.location.reload(); 
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <> 
      <Helmet>
        <title>거리에섯 - Index</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </Helmet>
      
      <div className="page-wrapper min-h-screen bg-[#f8f6f0]">
        <header className="container-fluid flex flex-col pb-[5vw]">
          <div className="container">
            
            {/* 🚀 isLogin 상태를 기준으로 조건부 렌더링 */}
            <div className="flex justify-end p-5 md:py-[30px]">
              {user ? (
                <button 
                  onClick={logout}
                  className="btn bg-gray-500 text-white border-none py-3 px-9 rounded font-bold cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <Link to="/login">
                  <button className="btn bg-[#0F9B73] text-white border-none py-3 px-9 rounded font-bold cursor-pointer hover:bg-[#0d8a66] transition-colors">
                    로그인
                  </button>
                </Link>
              )}
            </div>

            <div className="flex justify-center md:block md:text-center">
              <h1 className="landing-logo text-[60px] md:text-[80px] font-griun text-[#222]">
                거리에섯
              </h1>
            </div>

          </div>
        </header>
        
        <main className="container-fluid flex flex-col mt-10 pb-[5vw]">
          <div className='container fs-up-3'>
              <div className='w-full md:w-8/12 mx-auto'>
                <div className="flex flex-col md:flex-row items-center bg-white rounded-[20px] md:rounded-[50px] p-4 md:py-[10px] md:px-[20px] w-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-10 md:mb-[50px] gap-3 md:gap-0">
                  
                  <select 
                    id="category"
                    name="category"
                    className="w-full md:w-auto border-b md:border-b-0 md:border-r border-[#ddd] bg-transparent text-[#333] py-2 md:py-[10px] px-[20px] outline-none cursor-pointer text-center md:text-left">
                    <option>지역 선택</option>
                  </select>
                  
                  <input 
                    type="text" 
                    placeholder="떠나고 싶은 지역이나 테마를 입력하세요" 
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

          <div className='container my-10'>
            <div className="bg-white/40 backdrop-blur-[8px] border border-white/50 rounded-[20px] p-5 md:p-[40px] w-full">
              
              <div className="flex justify-center gap-[15px] mb-[30px] fs-up-3">
                <button
                  className={`py-[12px] px-[40px] font-bold rounded cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '남부' 
                      ? 'bg-[#2B4A48] text-white' 
                      : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('남부')}
                >
                  경기 남부
                </button>
                <button
                  className={`py-[12px] px-[40px] font-bold rounded cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '북부' 
                      ? 'bg-[#2B4A48] text-white' 
                      : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('북부')}
                >
                  경기 북부
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-[15px] fs-up-3">
                {currentCities.map((city, index) => (
                  <button 
                    key={index} 
                    onClick={() => goToMainPage(city)}
                    className="bg-white/90 border-none py-[18px] px-[10px] rounded-lg font-medium cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 hover:bg-[#0F9B73] hover:text-white hover:-translate-y-[2px]"
                  >
                    {city}
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