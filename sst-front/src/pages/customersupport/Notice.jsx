import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Notice = () => {
  // 1. 페이지 관련 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 테스트를 위해 전체 페이지를 3으로 설정 (데이터가 적어도 UI가 보이게 함)
  // 실제 데이터가 들어오면 Math.ceil(noticeData.length / 10) 등으로 변경하세요.
  const totalPages = 3;

  useEffect(()=>{
    window.scrollTo({
      top: 0,
    });
  },[currentPage])

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-20">
      {/* 전체 컨테이너 */}
      <div className="max-w-5xl mx-auto flex gap-20">

        {/* 왼쪽 사이드 */}
        <div className="w-56">
          <h3 className="text-lg font-semibold mb-6">고객지원</h3>

          {/* 상단 라인 */}
          <div className="border-t border-gray-300 mb-6"></div>

          <div className="space-y-4">
            <Link to="/customersupport/notice"><p className="text-gray-900 font-medium mb-4">공지사항</p></Link>
            <Link to="/customersupport/Faq"><p className="text-gray-500">자주하는 질문</p></Link>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1">

          {/* breadcrumb */}
          <div className="text-sm text-gray-400 mb-4">
            홈 &gt; 고객지원 &gt; 
            <span className="font-semibold text-gray-600">
                공지사항
            </span>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-semibold mb-10">공지사항</h2>

          {/* 테이블 */}
          <div className="bg-white rounded-md">

            <table className="w-full table-fixed">
              
              {/* 헤더 */}
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left w-20">번호</th>
                  <th className="py-3 px-6 text-left">제목</th>
                  <th className="py-3 px-6 text-left w-40">등록일</th>
                  <th className="py-3 px-6 text-center w-28">상태</th>
                </tr>
              </thead>

              {/* 바디 */}
              <tbody className="text-gray-700">
                
                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">3</td>
                  <td className="py-5 px-6"><Link to="/customersupport/notice/3" className="hover:underline">운영 시간 변경 안내</Link></td>
                  <td className="py-5 px-6 text-gray-500">2026.02.25</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">2</td>
                  <td className="py-5 px-6"><Link to="/customersupport/notice/2" className="hover:underline">시스템 점검 안내</Link></td>
                  <td className="py-5 px-6 text-gray-500">2026.03.30</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">1</td>
                  <td className="py-5 px-6"><Link to="/customersupport/notice/1" className="hover:underline">신규 서비스 오픈 안내</Link></td>
                  <td className="py-5 px-6 text-gray-500">2026.03.20</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      안내중
                    </span>
                  </td>
                </tr>

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

export default Notice;