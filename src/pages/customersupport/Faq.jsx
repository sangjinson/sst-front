import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Notice = () => {

  useEffect(()=>{
    window.scrollTo({
      top: 0,
    });
  },[])

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
            <p className="text-gray-500">자주하는 질문</p>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1">

          {/* breadcrumb */}
          <div className="text-sm text-gray-400 mb-2">
            홈 &gt; 고객지원 &gt; 자주하는 질문
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-semibold mb-10">자주하는 질문</h2>

          {/* 테이블 */}
          <div className="bg-white rounded-md">

            <table className="w-full table-fixed">
              
              {/* 헤더 */}
              <thead className="bg-gray-100 text-gray-700">
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
                  <td className="py-5 px-6">추천 결과가 마음에 들지 않으면 어떻게 하나요?</td>
                  <td className="py-5 px-6 text-gray-500">2026.02.25</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      답변완료
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">2</td>
                  <td className="py-5 px-6">일정은 수정할 수 있나요?</td>
                  <td className="py-5 px-6 text-gray-500">2026.03.30</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      답변완료
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-5 px-6 text-center">1</td>
                  <td className="py-5 px-6">AI 여행 일정은 어떻게 생성되나요?</td>
                  <td className="py-5 px-6 text-gray-500">2026.03.20</td>
                  <td className="py-5 px-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                      답변완료
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-12 gap-2">
            
            <button className="w-8 h-8 border border-gray-300 rounded text-gray-500 hover:bg-gray-100">
              &lt;
            </button>

            <button className="w-8 h-8 bg-blue-500 text-white rounded">
              1
            </button>

            <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">
              2
            </button>

            <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">
              3
            </button>

            <button className="w-8 h-8 border border-gray-300 rounded text-gray-500 hover:bg-gray-100">
              &gt;
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Notice;