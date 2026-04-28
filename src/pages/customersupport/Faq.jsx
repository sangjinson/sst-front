import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// 가짜 데이터 (FAQ용)
const faqData = [
  {
    id: 3,
    title: "로그인을 하지 않아도 일정을 저장할 수 있나요?",
    date: "2026.02.25",
    content: `아쉽게도 생성하신 여행 일정을 안전하게 보관하기 위해서는 로그인이 꼭 필요합니다. 

    로그인 없이 저장되지 않는 이유는 다음과 같습니다.

    1. 소중한 일정실실 방지: 
    로그인을 하지 않으면 브라우저의 방문 기록이 삭제되거나 기기가 바뀌었을 때, 공들여 짠 경기도 여행 
    코스를 다시 찾을 수 없게 됩니다.

    2. 언제 어디서든 확인: 
    PC에서 짜둔 일정을 여행 당일 스마트폰으로 확인하려면, 계정에 안전하게 저장되어 있어야 합니다.

    카카오계정을 이용하시면 별도의 가입 절차 없이 3초 만에 간편하게 시작하실 수 있습니다. 
    지금 바로 로그인하고 당신만의 경기도 여행 지도를 완성해 보세요!`

  },
  {
    id: 2,
    title: "생성된 일정을 일행과 공유할 수 있나요?",
    date: "2026.03.30",
    content: `네! 정성껏 만든 경기도 여행 일정을 일행과 손쉽게 공유할 수 있습니다.

    1. 링크 복사: 고유 URL 주소를 복사해 단톡방이나 메모장에 보관할 수 있습니다.
    2. PDF 저장: 여행 중 데이터 사용이 걱정된다면, 일정을 PDF 파일로 내려받아 오프라인에서도 확인할 수 있습니다.

    함께 가는 친구, 가족들과 함께 일정을 확인하고, 모두가 만족하는 경기도 여행을 만들어보세요!`

  },
  {
    id: 1,
    title: "AI 여행 일정은 어떻게 생성되나요?",
    date: "2026.03.20",
    content: `안녕하세요! 경기도 구석구석을 연결하는 스마트한 AI 여행 플래너입니다.

    저희 AI는 경기도 31개 시·군의 방대한 관광 데이터와 실시간 리뷰를 분석하여, 사용자의 취향에 딱 맞는 최적의 동선을 설계합니다. 
    '보는 것, 먹는 것, 노는 것, 자는 것'을 한 번에 해결하는 방법은 아주 간단합니다!

    [AI 여행 일정 생성 단계]

    1. 내거리를 클릭하여 여행을 가고 싶은 지역을 선택합니다.
    (예: 수원, 가평, 파주 등 경기도 내 가고 싶은 지역 선택)

    2. 여행 기간과 일정을 선택합니다.
    (당일치기부터 1박 2일 이상까지 자유롭게 설정 가능합니다.)

    3. 자신이 가고 싶은 여행의 테마를 선택합니다.
    (볼거리, 먹거리, 놀거리, 잘거리 등 자신이 가고 싶은 곳을 알려주세요.)

    4. AI가 짜준 여행일정을 보고 여행코스를 수정해보세요.
    (추천된 장소가 마음에 들지 않는다면 언제든 다른 곳으로 변경할 수 있습니다.)

    복잡한 여행 계획은 이제 AI에게 맡기고, 여러분은 즐거운 경기도 여행을 즐기기만 하세요!

    감사합니다.`
  },
];

const Faq = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const location = useLocation();

  // 현재 경로 확인
  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  // .mp-box CSS를 대체하는 Tailwind 공통 클래스
  const containerStyle = "bg-white rounded-2xl p-5 md:p-[30px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]";

  const totalPages = 1;

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-10 md:py-20 font-sans">
      
      {/* 전체 컨테이너: lg 이상에서만 가로 배치 */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* 🔹 왼쪽 사이드바 (기존 .mp-box 대신 containerStyle 적용) */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className={containerStyle}>
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

        {/* 🔹 오른쪽 콘텐츠 영역 (기존 .mp-box 대신 containerStyle 적용) */}
        <div className="flex-1">
          <div className={containerStyle}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-gray-800">
              {isFaq ? "자주하는 질문" : "공지사항"}
            </h2>

            {/* ✅ 반응형 아코디언 리스트 */}
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

            {/* 🔹 페이지네이션 */}
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