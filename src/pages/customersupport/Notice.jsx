import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const location = useLocation();
  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [currentPage]);



  return (

    <div className="bg-[#f7f8fa] min-h-screen py-10 lg:py-20 px-4">
      
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
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20">

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

        {/* 🔹 오른쪽 콘텐츠 (✔ 그대로 유지) */}
        <div className="flex-1">

          {/* 제목 */}
          <h2 className="text-2xl font-semibold mb-10">공지사항</h2>

          {/* 테이블 */}
          <div className="bg-white rounded-md overflow-x-auto">

            <table className="w-full table-fixed min-w-[600px]">
              
              {/* 헤더 */}
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left w-20">번호</th>
                  <th className="py-3 px-6 text-left">제목</th>
                  <th className="py-3 px-6 w-40 text-center">등록일</th>
                  <th className="py-3 px-6 text-center w-28">상태</th>
                </tr>
              </thead>

              {/* 바디 */}
              <tbody className="text-gray-700">
                
                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">3</td>
                  <td className="py-5 px-6">
                    <Link to="/customersupport/notice/3" className="hover:underline">
                      운영 시간 변경 안내
                    </Link>
                  </td>
                  <td className="py-5 px-6 text-gray-500 text-center">2026.02.25</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">2</td>
                  <td className="py-5 px-6">
                    <Link to="/customersupport/notice/2" className="hover:underline">
                      시스템 점검 안내
                    </Link>
                  </td>
                  <td className="py-5 px-6 text-gray-500 text-center">2026.03.30</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">1</td>
                  <td className="py-5 px-6">
                    <Link to="/customersupport/notice/1" className="hover:underline">
                      신규 서비스 오픈 안내
                    </Link>
                  </td>
                  <td className="py-5 px-6 text-gray-500 text-center">2026.03.20</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages >= 1 && (
            <div className="flex items-center justify-center gap-1 mt-12">
              
              {/* 이전 */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>

              {/* 숫자 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-10 h-10 border text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* 다음 */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notice;