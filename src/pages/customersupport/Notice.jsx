import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [noticeList, setNoticeList] = useState([]);
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
    fetch("http://localhost:8080/api/customersupport/notice")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`공지사항 조회 실패: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setNoticeList(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("공지사항 조회 실패", err);
        setNoticeList([]);
      });
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
                    <span className="truncate">자주하는 질문</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <div className={containerStyle}>
              <h2 className="fs-up-5 font-bold mb-8 md:mb-12 text-gray-900 tracking-tight">공지사항</h2>

              <div className="border-t border-gray-200">
                {noticeList.map((notice, index) => (
                  <div key={notice.csNo} className="border-b border-gray-100 last:border-none">
                    
                    <div
                      className={`flex items-center gap-3 md:gap-6 py-5 md:py-8 px-2 md:px-5 cursor-pointer transition-all hover:bg-gray-50/50 ${
                        openId === notice.csNo ? "bg-gray-50/80" : ""
                      }`}
                      onClick={() => toggleAccordion(notice.csNo)}>

                      <span className="fs-down-2 text-gray-400 w-8 text-center shrink-0 font-medium">
                        {(noticeList.length - index).toString().padStart(2, "0")}
                      </span>

                      <div className="flex-1">
                        <p
                          className={`fs-up-2 leading-snug ${
                            openId === notice.csNo
                              ? "font-bold text-blue-600"
                              : "text-gray-800 font-medium"
                          }`}>
                          {notice.csTitle}
                        </p>
                      </div>

                      <span className="hidden lg:block fs-down-2 text-gray-400 w-28 text-right shrink-0">
                        {notice.csRegDate?.substring(0, 10)}
                      </span>

                      <span
                        className={`text-gray-300 transition-transform pt-1.5 ${
                          openId === notice.csNo ? "rotate-180 text-blue-400" : ""
                        }`}
                        style={{ fontSize: "10px" }}>
                        ▼
                      </span>
                    </div>

                    {/* ✅ 아코디언 내용 영역 */}
                    {openId === notice.csNo && (
                      <div className="bg-gray-50/50 px-5 md:px-16 py-8 md:py-10 border-t border-gray-100">

                        {/* 🔹 본문 내용 */}
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line fs-up-2">
                          {notice.csContent}
                        </div>

                        {/* 🔹 등록 정보 */}
                        <div className="flex items-center justify-end gap-3 pt-10 fs-down-1 text-gray-400 self-end">

                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-400/80">
                              등록일
                            </span>

                            <span>
                              {notice.csRegDate?.substring(0, 10)}
                            </span>
                          </div>

                          <div className="w-[1px] h-2.5 bg-gray-300"></div>

                          <div className="flex items-center gap-1.5">
                            <span>
                              {notice.csRegDate?.substring(11, 16)}
                            </span>
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