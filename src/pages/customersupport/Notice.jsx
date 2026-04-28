import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const noticeData = [
  {
    id: 3,
    title: "운영 시간 변경 안내",
    date: "2026.04.15",
    content: `안녕하세요. 보다 원활한 서비스 운영을 위해 운영 시간이 아래와 같이 변경될 예정입니다.\n\n변경 일정:\n- 적용일: 2026년 3월 1일 (일)\n\n변경 전:\n- 09:00 ~18:00\n\n변경 후:\n- 10:00 ~19:00\n\n감사합니다.`
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    date: "2026.03.27",
    content: `안녕하세요. 보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.\n\n일정: 2026년 4월 5일 (일) 02:00 ~ 06:00\n내용: 서버 안정화 및 기능 개선\n\n점검 시간 동안 서비스 이용이 제한될 수 있는 점 양해 부탁드립니다.`,
  },
  {
    id: 1,
    title: "신규 서비스 오픈 안내",
    date: "2026.03.20",
    content: `안녕하세요. 더 나은 서비스를 제공하기 위해 신규 서비스가 정식 오픈되었습니다.\n\n주요 변경 사항:\n- 사용자 인터페이스(UI) 개선\n- 서비스 속도 및 안정성 향상\n- 신규 기능 추가\n\n앞으로도 많은 관심 부탁드립니다.`,
  }
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const location = useLocation();
  
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
      
      {/* 전체 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        {/* 🔹 왼쪽 사이드바 (기존 .mp-box 제거 후 containerStyle 적용) */}
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
                  }`}>
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

        {/* 🔹 오른쪽 콘텐츠 영역 (기존 .mp-box 제거 후 containerStyle 적용) */}
        <div className="flex-1">
          <div className={containerStyle}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-10 text-gray-800">공지사항</h2>

            {/* ✅ 반응형 리스트 레이아웃 */}
            <div className="border-t border-gray-200">
              {noticeData.map((notice) => (
                <div key={notice.id} className="border-b border-gray-100 last:border-none">
                  {/* 제목 행 */}
                  <div
                    className={`flex items-start gap-3 md:gap-4 py-4 md:py-6 px-1 md:px-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      openId === notice.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => toggleAccordion(notice.id)}>
                    
                    {/* 번호 표시 */}
                    <span className="text-gray-400 text-sm md:text-base w-8 text-center pt-0.5 shrink-0">
                      {notice.id}
                    </span>

                    {/* 제목 및 모바일 날짜 영역 */}
                    <div className="flex-1">
                      <p className={`text-sm md:text-[16px] leading-snug ${
                        openId === notice.id ? "font-bold text-blue-600" : "text-gray-800"
                      }`}>
                        {notice.title}
                      </p>
                      <span className="block mt-1 text-[11px] text-gray-400 font-normal lg:hidden">
                        {notice.date}
                      </span>
                    </div>

                    {/* PC 전용 날짜 */}
                    <span className="hidden lg:block text-sm text-gray-400 w-24 text-right shrink-0">
                      {notice.date}
                    </span>

                    <span className={`text-gray-300 text-xs md:text-em transform transition-transform pt-1 ${
                      openId === notice.id ? "rotate-180" : ""
                    }`}>
                      ▼
                    </span>
                  </div>

                  {/* 내용 영역 */}
                  {openId === notice.id && (
                    <div className="bg-[#fcfcfc] px-4 md:px-12 py-6 md:py-10 border-t border-gray-50">
                      <div className="flex gap-4">
                        <span className="text-blue-500 font-bold text-lg md:text-xl shrink-0">N.</span>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-[15px] w-full">
                          {notice.content}
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
                  disabled={currentPage === 1}>
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
                    }`}>
                    {page}
                  </button>
                ))}
                <button
                  className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 rounded-md transition-all"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}>
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

export default Notice;