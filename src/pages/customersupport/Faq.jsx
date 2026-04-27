import React, { useEffect, useState } from "react";
import { Link, useLocation} from "react-router-dom";

// 상세 페이지에 있던 데이터를 목록으로 가져왔습니다.
const faqData = [
  {
    id: 3,
    title: "로그인을 하지 않아도 일정을 저장할 수 있나요?",
    date: "2026.02.25",
    content: `아쉽게도 생성하신 여행 일정을 안전하게 보관하기 위해서는 로그인이 꼭 필요합니다. 
    
    로그인 없이 저장되지 않는 이유는 다음과 같습니다.
    
    1. 소중한 일정실실 방지: 
    로그인을 하지 않으면 브라우저의 방문 기록이 삭제되거나 기기가 바뀌었을 때, 공들여 짠 경기도 여행 코스를 다시 찾을 수 없게 됩니다.
    
    2. 언제 어디서든 확인: 
    PC에서 짜둔 일정을 여행 당일 스마트폰으로 확인하려면, 계정에 안전하게 저장되어 있어야 합니다.
    
    카카오계정을 이용하시면 별도의 가입 절차 없이 3초 만에 간편하게 시작하실 수 있습니다. 
    지금 바로 로그인하고 당신만의 경기도 여행 지도를 완성해 보세요!`,
  },
  {
    id: 2,
    title: "생성된 일정을 일행과 공유할 수 있나요?",
    date: "2026.03.30",
    content: `네! 정성껏 만든 경기도 여행 일정을 일행과 손쉽게 공유할 수 있습니다.
    
    1. 링크 복사: 고유 URL 주소를 복사해 단톡방이나 메모장에 보관할 수 있습니다.
    2. PDF 저장: 여행 중 데이터 사용이 걱정된다면, 일정을 PDF 파일로 내려받아 오프라인에서도 확인할 수 있습니다.
    
    함께 가는 친구, 가족들과 함께 일정을 확인하고, 모두가 만족하는 경기도 여행을 만들어보세요!`,
  },
  {
    id: 1,
    title: "AI 여행 일정은 어떻게 생성되나요?",
    date: "2026.03.20",
    content: `안녕하세요! 경기도 구석구석을 연결하는 스마트한 AI 여행 플래너입니다.
    
    저희 AI는 경기도 31개 시·군의 방대한 관광 데이터와 실시간 리뷰를 분석하여, 사용자의 취향에 딱 맞는 최적의 동선을 설계합니다.
    
    [AI 여행 일정 생성 단계]
    1. 내거리를 클릭하여 여행을 가고 싶은 지역을 선택합니다.
    2. 여행 기간과 일정을 선택합니다.
    3. 자신이 가고 싶은 여행의 테마를 선택합니다.
    4. AI가 짜준 여행일정을 보고 여행코스를 수정해보세요.
    
    복잡한 여행 계획은 이제 AI에게 맡기고, 즐거운 경기도 여행을 즐기기만 하세요!`,
  },
];

const Faq = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // ✅ 어떤 항목이 열려있는지 관리하는 상태 (null이면 모두 닫힘)
  const [openId, setOpenId] = useState(null);
  const location = useLocation();
  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  const totalPages = 1;

  // 아코디언 토글 함수
  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-20">

    <style>
        {`.mp-box {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }`}
      </style>

      {/* 전체 컨테이너 */}
      <div className="max-w-5xl mx-auto flex gap-20">

        {/* 🔹 왼쪽 사이드 (카드형) */}
        <aside className="w-full lg:w-60">
          <div className="mp-box">
            <h3 className="text-lg font-semibold mb-4">고객지원</h3>
            <div className="border-t border-gray-200 mb-4"></div>
            <ul className="space-y-3">

            <li>
              <Link
                to="/customersupport/notice"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isNotice
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}>
                <span>👤</span>
                <span>공지사항</span>
              </Link>
            </li>
            <li>
              <Link
                to="/customersupport/faq"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isFaq
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}>
                <span>❓</span>
                <span>자주 하는 질문</span>
              </Link>
            </li>
          </ul>
          </div>
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1">
      
          <h2 className="text-2xl font-semibold mb-10">자주하는 질문</h2>

          {/* ✅ 아코디언 테이블 스타일 */}
          <div className="bg-white rounded-md">
            <table className="w-full table-fixed">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left w-20">번호</th>
                  <th className="py-3 px-6 text-left">제목</th>
                  <th className="py-3 px-6 w-40 text-center">등록일</th>
                </tr>
              </thead>
              <tbody>
                {faqData.map((faq) => (
                  <React.Fragment key={faq.id}>
                    {/* 질문 행 */}
                    <tr
                      className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        openId === faq.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <td className="py-5 px-6 text-center text-gray-400">{faq.id}</td>
                      <td className="py-5 px-6 font-mediu">
                        <div className="flex items-center justify-between">
                          {faq.title}
                          <span className={`text-gray-400 transform transition-transform ${openId === faq.id ? "rotate-180" : ""}`}>
                            ▼
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-400 text-center text-sm">{faq.date}</td>
                    </tr>

                    {/* ✅ 답변 행 (클릭 시에만 보임) */}
                    {openId === faq.id && (
                      <tr className="bg-[#fcfcfc] border-b border-gray-100">
                        <td colSpan="3" className="py-8 px-12">
                          <div className="flex gap-4">
                            <span className="text-blue-500 font-bold text-xl">A.</span>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                              {faq.content}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 (테일윈드 적용) */}
          {totalPages >= 1 && (
            <div className="flex items-center justify-center gap-1 mt-12">
              {/* 이전 페이지 버튼 */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* 숫자 버튼들 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-10 h-10 border transition-all text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* 다음 페이지 버튼 */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faq;