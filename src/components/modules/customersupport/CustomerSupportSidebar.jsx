import React from "react";
import { Link, useLocation } from "react-router-dom";

const CustomerSupportSidebar = () => {
  const location = useLocation();

  const isNotice = location.pathname.includes("notice");
  const isFaq = location.pathname.includes("faq");

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl p-5 md:p-[30px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="hidden lg:block fs-up-3 font-bold mb-5 text-gray-900">
          고객지원
        </h3>

        <div className="hidden lg:block border-t border-gray-100 mb-5"></div>

        <ul className="flex lg:flex-col gap-2">
          <li className="flex-1 lg:flex-none">
            <Link
              to="/customersupport/notice"
              className={`flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-all ${
                isNotice
                  ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                  : "bg-white lg:bg-transparent text-gray-500 border border-gray-100 lg:border-none hover:bg-gray-50"
              } fs-up-2 whitespace-nowrap`}>
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
              } fs-up-2 whitespace-nowrap`}>
              <span className="shrink-0">❓</span>
              <span className="truncate">자주하는 질문</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default CustomerSupportSidebar;