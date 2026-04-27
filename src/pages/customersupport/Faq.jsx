import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const faqData = [
  {
    id: 3,
    title: "로그인을 하지 않아도 일정을 저장할 수 있나요?",
    date: "2026.02.25",
    content: `아쉽게도 생성하신 여행 일정을 안전하게 보관하기 위해서는 로그인이 꼭 필요합니다. \n\n1. 소중한 일정 손실 방지\n2. 언제 어디서든 확인\n\n카카오계정을 이용하시면 별도의 가입 절차 없이 3초 만에 간편하게 시작하실 수 있습니다.`,
  },
  {
    id: 2,
    title: "생성된 일정을 일행과 공유할 수 있나요?",
    date: "2026.03.30",
    content: `네! 정성껏 만든 경기도 여행 일정을 일행과 손쉽게 공유할 수 있습니다.\n\n1. 링크 복사\n2. PDF 저장\n\n함께 가는 친구, 가족들과 함께 일정을 확인해보세요!`,
  },
  {
    id: 1,
    title: "AI 여행 일정은 어떻게 생성되나요?",
    date: "2026.03.20",
    content: `안녕하세요! 경기도 31개 시·군의 방대한 관광 데이터를 분석하여 최적의 동선을 설계합니다.\n\n[AI 여행 일정 생성 단계]\n1. 지역 선택\n2. 기간 선택\n3. 테마 선택\n4. 일정 수정 및 완성`,
  },
];

const Faq = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const location = useLocation();
  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  const totalPages = 1;

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-10 md:py-20 font-sans">
      <style>
        {`.mp-box {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        @media (min-width: 768px) {
          .mp-box { padding: 30px; }
        }`}
      </style>

      {/* 전체 컨테이너: lg 이상에서만 가로 배치 */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* 🔹 왼쪽 사이드바 (모바일에서는 가로 탭 메뉴) */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="mp-box">
            <h3 className="hidden lg:block text-lg font-semibold mb-4 text-gray-800">고객지원</h3>
            <div className="hidden lg:block border-t border-gray-200 mb-4"></div>
            <ul className="flex lg:flex-col gap-2">
              <li className="flex-1 lg:flex-none">
                <Link
                  to="/customersupport/notice"
                  className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:py-2 rounded-lg transition text-sm md:text-base ${
                    isNotice
                      ? "bg-blue-600 text-white lg:bg-blue-50 lg:text-blue-600 font-semibold shadow-md lg:shadow-none"
                      : "bg-white lg:bg-transparent text-gray-700 border border-gray-200 lg:border-none hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">📢</span>
                  <span>공지사항</span>
                </Link>
              </li>
              <li className="flex-1 lg:flex-none">
                <Link
                  to="/customersupport/faq"
                  className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:py-2 rounded-lg transition text-sm md:text-base ${
                    isFaq
                      ? "bg-blue-600 text-white lg:bg-blue-50 lg:text-blue-600 font-semibold shadow-md lg:shadow-none"
                      : "bg-white lg:bg-transparent text-gray-700 border border-gray-200 lg:border-none hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">❓</span>
                  <span>자주 하는 질문</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* 🔹 오른쪽 콘텐츠 영역 */}
        <div className="flex-1">
          <div className="mp-box">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-gray-800">자주하는 질문</h2>

            {/* ✅ 반응형 아코디언 리스트 (Table 구조 탈피) */}
            <div className="border-t border-gray-200">
              {faqData.map((faq) => (
                <div key={faq.id} className="border-b border-gray-100 last:border-none">
                  {/* 질문 영역 */}
                  <div
                    className={`flex items-start gap-4 py-4 md:py-6 px-2 md:px-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      openId === faq.id ? "bg-gray-50/50" : ""
                    }`}
                    onClick={() => toggleAccordion(faq.id)}
                  >
                    <span className="text-blue-500 font-bold text-sm md:text-base pt-0.5">Q.</span>
                    <div className="flex-1">
                      <p className={`text-sm md:text-[16px] leading-snug ${openId === faq.id ? "font-bold text-blue-600" : "text-gray-800"}`}>
                        {faq.title}
                      </p>
                      <span className="block mt-1 text-[11px] md:text-xs text-gray-400 font-normal lg:hidden">
                        {faq.date}
                      </span>
                    </div>
                    {/* PC에서만 보이는 날짜 */}
                    <span className="hidden lg:block text-sm text-gray-400 w-24 text-right">
                      {faq.date}
                    </span>
                    <span className={`text-gray-300 text-xs md:text-sm transform transition-transform pt-1 ${openId === faq.id ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>

                  {/* 답변 영역 */}
                  {openId === faq.id && (
                    <div className="bg-[#fcfcfc] px-4 md:px-10 py-6 md:py-8 border-t border-gray-50">
                      <div className="flex gap-4">
                        <span className="text-blue-500 font-bold text-lg md:text-xl">A.</span>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-[15px]">
                          {faq.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 🔹 페이지네이션 (반응형 최적화) */}
            {totalPages >= 1 && (
              <div className="flex items-center justify-center gap-1 mt-10 md:mt-14">
                <button
                  className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 rounded-md transition-all"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border text-sm font-medium rounded-md transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 rounded-md transition-all"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;