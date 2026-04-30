import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const noticeData = [
  {
    id: 3,
    title: "운영 시간 변경 안내",
    date: "2026.04.15",
    time: "14:30",
    content: `안녕하세요. 보다 원활한 서비스 운영을 위해 운영 시간이 아래와 같이 변경될 예정입니다.\n\n변경 일정:\n- 적용일: 2026년 3월 1일 (일)\n\n변경 전:\n- 09:00 ~18:00\n\n변경 후:\n- 10:00 ~19:00\n\n감사합니다.`
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    date: "2026.03.27",
    time: "09:00",
    content: `안녕하세요. 보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.\n\n일정: 2026년 4월 5일 (일) 02:00 ~ 06:00\n내용: 서버 안정화 및 기능 개선\n\n점검 시간 동안 서비스 이용이 제한될 수 있는 점 양해 부탁드립니다.`,
  },
  {
    id: 1,
    title: "신규 서비스 오픈 안내",
    date: "2026.03.20",
    time: "11:15",
    content: `안녕하세요. 더 나은 서비스를 제공하기 위해 신규 서비스가 정식 오픈되었습니다.\n\n주요 변경 사항:\n- 사용자 인터페이스(UI) 개선\n- 서비스 속도 및 안정성 향상\n- 신규 기능 추가\n\n앞으로도 많은 관심 부탁드립니다.`,
  }
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const location = useLocation();
  
  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  const headerSyncContainer = "max-w-[1920px] mx-auto px-5 lg:px-[50px] xl:px-[300px]";
  const containerStyle = "bg-white rounded-2xl p-5 md:p-[30px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]";

  const totalPages = 1;

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-10 md:py-20 font-sans text-gray-800">
      <div className={headerSyncContainer}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          
          <aside className="w-full lg:w-72 shrink-0">
            <div className={containerStyle}>
              <h3 className="hidden lg:block fs-up-3 font-bold mb-5 text-gray-900">고객지원</h3>
              <div className="hidden lg:block border-t border-gray-100 mb-5"></div>
              <ul className="flex lg:flex-col gap-2">
                <li className="flex-1 lg:flex-none">
                  <Link
                    to="/customersupport/notice"
                    className={`flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all ${
                      isNotice
                        ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                        : "bg-white lg:bg-transparent text-gray-500 border border-gray-100 lg:border-none hover:bg-gray-50"
                    } fs-up-2 whitespace-nowrap`}
                  >
                    <span className="shrink-0">📢</span>
                    <span className="truncate">공지사항</span>
                  </Link>
                </li>
                <li className="flex-1 lg:flex-none">
                  <Link
                    to="/customersupport/faq"
                    className={`flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all ${
                      isFaq
                        ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                        : "bg-white lg:bg-transparent text-gray-500 border border-gray-100 lg:border-none hover:bg-gray-50"
                    } fs-up-2 whitespace-nowrap`}
                  >
                    <span className="shrink-0">❓</span>
                    <span className="truncate">자주 하는 질문</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <div className={containerStyle}>
              <h2 className="fs-up-5 font-bold mb-8 md:mb-12 text-gray-900 tracking-tight">공지사항</h2>

              <div className="border-t border-gray-200">
                {noticeData.map((notice) => (
                  <div key={notice.id} className="border-b border-gray-100 last:border-none">
                    <div
                      className={`flex items-center gap-3 md:gap-6 py-5 md:py-8 px-2 md:px-5 cursor-pointer transition-all hover:bg-gray-50/50 ${
                        openId === notice.id ? "bg-gray-50/80" : ""
                      }`}
                      onClick={() => toggleAccordion(notice.id)}>
                      
                      <span className="fs-down-2 text-gray-400 w-8 text-center shrink-0 font-medium">
                        {notice.id.toString().padStart(2, '0')}
                      </span>

                      <div className="flex-1">
                        <p className={`fs-up-2 leading-snug ${
                          openId === notice.id ? "font-bold text-blue-600" : "text-gray-800 font-medium"
                        }`}>
                          {notice.title}
                        </p>
                      </div>

                      <span className="hidden lg:block fs-down-2 text-gray-400 w-24 text-right shrink-0">
                        {notice.date}
                      </span>

                      <span className={`text-gray-300 transition-transform pt-1.5 ${
                        openId === notice.id ? "rotate-180 text-blue-400" : ""
                      }`} style={{ fontSize: '10px' }}>
                        ▼
                      </span>
                    </div>

                    {/* ✅ 아코디언 내용 영역 */}
                    {openId === notice.id && (
                      <div className="bg-gray-50/50 px-5 md:px-16 py-8 md:py-10 border-t border-gray-100">
                  
                        
                        {/* 🔹 본문 내용 */}
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line fs-up-2">
                          {notice.content}
                        </div>

                        {/* 🔹 2. 등록 정보 섹션 (오른쪽 아래 배치) */}
                        <div className="flex items-center justify-end gap-3 pt-10 fs-down-1 text-gray-400 self-end">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-400/80">등록일</span>
                            <span>{notice.date}</span>
                          </div>
                          <div className="w-[1px] h-2.5 bg-gray-300"></div>
                          <div className="flex items-center gap-1.5">
                            {/*<span className="font-medium text-gray-400/80">등록시간</span>*/}
                            <span>{notice.time}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages >= 1 && (
                <div className="flex items-center justify-center gap-1 mt-10 md:mt-14 pt-10 border-t border-gray-50">
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
    </div>
  );
};

export default Notice;