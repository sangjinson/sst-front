import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────
// 더미 데이터 세팅
// ─────────────────────────────────────────
const DUMMY_RESULTS = [
  { id: 1, regionEn: 'suwon',category: '볼거리', title: '수원화성', desc: '유네스코 세계문화유산, 조선시대 성곽 건축의 꽃', image: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?w=600&q=80' },
  { id: 2, regionEn: 'suwon',category: '볼거리', title: '화성행궁', desc: '정조대왕이 머물던 아름답고 웅장한 행궁', image: 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?w=600&q=80' },
  { id: 3, regionEn: 'suwon',category: '볼거리', title: '플라잉수원', desc: '열기구를 타고 하늘에서 내려다보는 수원의 파노라마', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80' },
];

const BOARD_DATA = {
  showcase: [
    { title: '수원 행궁동 카페 투어 다녀왔어요!', date: '03.23' },
    { title: '화성행궁 야간개장 사진 공유합니다', date: '03.22' },
    { title: '수원 통닭거리 진짜 맛집 추천', date: '03.20' },
  ],
  notice: [
    { title: '[안내] 사이트 점검 안내 (03.28)', date: '03.28' },
    { title: '[이벤트] 봄맞이 여행 코스 추천 이벤트', date: '03.15' },
    { title: '[필독] 게시판 이용 수칙 안내', date: '03.01' },
  ],
  faq: [
    { title: '🔒 일정 추가 기능에 오류가 있습니다.', date: '03.24' },
    { title: '🔒 AI 추천 코스 지역 변경 가능한가요?', date: '03.23' },
    { title: '🔒 회원가입 시 이메일 인증 문제', date: '03.21' },
  ],
};

const TABS = ['전체', '볼거리', '먹거리', '놀거리', '잘거리'];

// 카테고리별 라우팅 경로 매핑 객체
const CATEGORY_PATH = {
  '볼거리': 'see',
  '먹거리': 'food',
  '놀거리': 'play',
  '잘거리': 'sleep',
};

const SearchPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');

  const filteredResults = activeTab === '전체' 
    ? DUMMY_RESULTS 
    : DUMMY_RESULTS.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-white pb-20 font-paperlogy">
      <div className="max-w-[1200px] mx-auto px-5 pt-12 md:pt-16">
        
        {/* 1. 타이틀 영역 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            “{keyword}” 검색결과
          </h1>
          <p className="text-sm text-gray-600">
            총 <strong className="text-gray-900">{filteredResults.length}</strong>건의 결과가 검색되었습니다.
          </p>
        </div>

        {/* 2. 탭 필터 */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. 검색 결과 그리드 영역 */}
        <div className="mb-20">
         <div className="flex justify-end mb-4 min-h-[30px]">
            {activeTab !== '전체' && filteredResults.length > 0 && (
                <button 
                /* 🚀 수정됨: 검색 결과 중 첫 번째 아이템의 지역으로 이동합니다. */
                onClick={() => {
                    const firstItemRegion = filteredResults[0].regionEn;
                    navigate(`/${firstItemRegion}/${CATEGORY_PATH[activeTab]}/list`);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-md hover:bg-gray-100 transition-colors border border-gray-100"
                >
                더보기 <span className="text-[10px]">→</span>
                </button>
            )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResults.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
                onClick={() => navigate(`/${item.regionEn}/${CATEGORY_PATH[item.category]}/view?id=${item.id}`)}
                >
                <div className="h-48 md:h-52 overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] font-semibold rounded mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>

        {/* 4. 사거리 교차로 (게시판 영역) */}
        <section>
          {/* 섹션 전체 더보기 버튼은 삭제 유지 */}
          <div className="flex items-end mb-6">
            <h2 className="text-2xl md:text-[26px] font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#E85C0D] rounded-sm"></span>
              사거리 교차로
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 뽐낼거리 게시판 */}
            <div className="border border-gray-800 rounded-xl p-5 md:p-6 bg-white">
              {/* 🚀 카드 내부 제목 영역: flex justify-between으로 더보기 배치 */}
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="text-[17px] font-bold text-gray-900">뽐낼거리 게시판</h3>
                {/* 🚀 카드 내부 더보기 링크 추가 */}
                <button 
                  onClick={() => navigate('/showcase')}
                  className="text-gray-400 text-xs hover:text-gray-700 flex items-center gap-0.5"
                >
                  더보기 <span className="text-[9px]">→</span>
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {BOARD_DATA.showcase.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/showcase')}>
                    <span className="text-[13px] md:text-[14px] text-gray-700 truncate pr-4 group-hover:underline">{item.title}</span>
                    <span className="text-[12px] text-gray-400 shrink-0">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 공지사항 */}
            <div className="border border-gray-800 rounded-xl p-5 md:p-6 bg-white">
              {/* 🚀 카드 내부 제목 영역: flex justify-between으로 더보기 배치 */}
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="text-[17px] font-bold text-gray-900">공지사항</h3>
                {/* 🚀 카드 내부 더보기 링크 추가 */}
                <button 
                  onClick={() => navigate('/customersupport/notice')}
                  className="text-gray-400 text-xs hover:text-gray-700 flex items-center gap-0.5"
                >
                  더보기 <span className="text-[9px]">→</span>
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {BOARD_DATA.notice.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/customersupport/notice')}>
                    <span className="text-[13px] md:text-[14px] text-gray-700 truncate pr-4 group-hover:underline">{item.title}</span>
                    <span className="text-[12px] text-gray-400 shrink-0">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 자주 하는 질문 */}
            <div className="border border-gray-800 rounded-xl p-5 md:p-6 bg-white">
              {/* 🚀 카드 내부 제목 영역: flex justify-between으로 더보기 배치 */}
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="text-[17px] font-bold text-gray-900">자주 하는 질문</h3>
                {/* 🚀 카드 내부 더보기 링크 추가 */}
                <button 
                  onClick={() => navigate('/customersupport/faq')}
                  className="text-gray-400 text-xs hover:text-gray-700 flex items-center gap-0.5"
                >
                  더보기 <span className="text-[9px]">→</span>
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {BOARD_DATA.faq.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/customersupport/faq')}>
                    <span className="text-[13px] md:text-[14px] text-gray-700 truncate pr-4 group-hover:underline">{item.title}</span>
                    <span className="text-[12px] text-gray-400 shrink-0">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default SearchPage;