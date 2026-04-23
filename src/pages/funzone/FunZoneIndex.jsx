import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import InListCard from '@components/card/InListCard'; // 경로에 맞춰 수정하세요
import '@assets/css/landing.css';

const FunZoneIndex = () => {
  // 1. 상태 관리: 실제로는 API 호출 등을 통해 데이터를 가져옵니다.
  const [dataList, setDataList] = useState([
    {
      id: 1,
      title: "수원화성",
      location: "수원",
      type: "지역명소",
      rating: "0.0",
      desc: "유네스코 세계문화유산으로 지정된 조선시대 성곽입니다. 웅장한 성벽과 함께 아름다운 풍경을 즐길 수 있습니다.",
      address: "경기도 수원시 장안구 연무동 190",
      imageUrl: "https://via.placeholder.com/400x300"
    },
    {
      id: 2,
      title: "광명 동굴",
      location: "광명",
      type: "지역명소",
      rating: "0.0",
      desc: "일제강점기 금속 채광에 사용되던 동굴을 문화예술 공간으로 재탄생시킨 곳입니다.",
      address: "경기도 광명시 가학로85번길 142",
      imageUrl: "https://via.placeholder.com/400x300"
    },
    // 추가 데이터들을 이곳에 넣거나 API로 받아옵니다.
  ]);

  const categories = ['전체', '놀이공원', '동물원', '수목원', '공연'];
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 영역 */}
      <Header />

      {/* 2. Hero Section: 상단 비주얼 영역 */}
      <section className="relative h-[280px] w-full flex flex-col items-center justify-center text-white overflow-hidden bg-slate-800">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-[0.2em] drop-shadow-lg">수 원</h1>
          <p className="text-lg font-light opacity-90 drop-shadow-md">정조의 효심과 화성의 기상이 깃든, 미래를 여는 수반 도시</p>
        </div>
      </section>

      {/* 3. 메인 리스트 영역 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 필터 및 정렬 */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-2">
            {categories.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab ? 'bg-[#1e293b] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-gray-400 font-medium">
            <button className="text-black border-b border-black pb-0.5">최신순</button>
            <button className="hover:text-gray-600 transition-colors">인기순</button>
          </div>
        </div>

        {/* 4. 카드 그리드 (데이터 매핑) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {dataList.length > 0 ? (
            dataList.map((item) => (
              <InListCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center text-gray-400">
              해당하는 콘텐츠가 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 (샘플) */}
        <div className="mt-20 flex justify-center items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg text-sm">1</button>
          <button className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 text-sm">2</button>
          <button className="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 text-sm">3</button>
        </div>
      </main>

      {/* 푸터 영역 */}
      <Footer />
    </div>
  );
};

export default FunZoneIndex;