import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// 공지사항 데이터 (데이터 구조를 FAQ와 통일했습니다)
const noticeData = [
    {
    id: 3,
    title: "운영 시간 변경 안내",
    date: "2026.04.15",
    content: `안녕하세요. 보다 원활한 서비스 운영을 위해 운영 시간이 아래와 같이 변경될 예정입니다.

    변경 일정:
    - 적용일: 2026년 3월 1일 (일)

    변경 전:
    - 09:00 ~18:00

    변경 후:
    - 10:00 ~19:00

    변경된 운영 시간은 서비스 품질 향상 및 고객 지원 강화를 위해 조정되었습니다.

    이용에 참고 부탁드리며, 더 나은 서비스를 제공할 수 있도록 노력하겠습니다.

    감사합니다.`
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    date: "2026.03.27",
    content: `안녕하세요. 보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.

    일정: 2026년 4월 5일 (일) 02:00 ~ 06:00
    내용: 서버 안정화 및 기능 개선

    점검 시간 동안 서비스 이용이 제한될 수 있는 점 양해 부탁드립니다.`,
  },
  {
    id: 1,
    title: "신규 서비스 오픈 안내",
    date: "2026.03.20",
    content: `안녕하세요. 더 나은 서비스를 제공하기 위해 신규 서비스가 정식 오픈되었습니다.

    이번에 오픈된 서비스에서는 보다 빠르고 안정적인 이용 환경과 함께 다양한 기능이 추가되었습니다.

    주요 변경 사항:
    - 사용자 인터페이스(UI) 개선
    - 서비스 속도 및 안정성 향상
    - 신규 기능 추가 및 편의성 강화

    앞으로도 지속적인 업데이트를 통해 더욱 만족스러운 서비스를 제공해 드리겠습니다.

    많은 관심과 이용 부탁드립니다.

    감사합니다.`
  }
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null); // FAQ와 동일하게 아코디언 상태 관리
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
    <div className="bg-[#f7f8fa] min-h-screen py-20">
      <style>
        {`.mp-box {
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }`}
      </style>

      {/* 전체 컨테이너 */}
      <div className="max-w-7xl mx-auto flex gap-10">
        
        {/* 🔹 왼쪽 사이드바 (디자인 유지) */}
        <aside className="w-full lg:w-60">
          <div className="mp-box">
            <h3 className="text-lg font-semibold mb-4">고객지원</h3>
            <div className="border-t border-gray-200 mb-4"></div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/customersupport/notice"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${isNotice 
                      ? "bg-blue-50 text-blue-600 font-semibold" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`}
                >
                  <span>👤</span>
                  <span>공지사항</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/customersupport/faq"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${isFaq 
                      ? "bg-blue-50 text-blue-600 font-semibold" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`}
                >
                  <span>❓</span>
                  <span>자주 하는 질문</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="flex-1">
          <div className="mp-box">
            <h2 className="text-2xl font-semibold mb-10">공지사항</h2>

            {/* ✅ FAQ와 통일된 테이블 디자인 */}
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
                  {noticeData.map((notice) => (
                    <React.Fragment key={notice.id}>
                      {/* 공지사항 제목 행 */}
                      <tr
                        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          openId === notice.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => toggleAccordion(notice.id)}
                      >
                        <td className="py-5 px-6 text-center text-gray-400">{notice.id}</td>
                        <td className="py-5 px-6 font-medium">
                          <div className="flex items-center justify-between">
                            {notice.title}
                            <span className={`text-gray-400 transform transition-transform ${openId === notice.id ? "rotate-180" : ""}`}>
                              ▼
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-gray-400 text-center text-sm">{notice.date}</td>
                      </tr>

                      {/* 공지사항 내용 행 (클릭 시 노출) */}
                      {openId === notice.id && (
                        <tr className="bg-[#fcfcfc] border-b border-gray-100">
                          <td colSpan="3" className="py-8 px-12">
                            <div className="flex gap-4">
                              <span className="text-blue-500 font-bold text-xl">N.</span>
                              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                                {notice.content}
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

            {/* 페이지네이션 (디자인 통일) */}
            {totalPages >= 1 && (
              <div className="flex items-center justify-center gap-1 mt-12">
                <button
                  className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

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

                <button
                  className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
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
    </div>
  );
};

export default Notice;