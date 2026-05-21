import React from "react";

const CustomerSupportAccordion = ({
  items,
  openId,
  onToggle,
  type = "notice",
}) => {
  const isFaq = type === "faq";

  return (
    <div className="border-t border-gray-200">
      {items.map((item, index) => (
        <div key={item.csNo} className="border-b border-gray-100 last:border-none">
          <div
            className={`flex items-center gap-3 md:gap-6 py-5 md:py-8 px-2 md:px-5 cursor-pointer transition-all hover:bg-gray-50/50 ${
              openId === item.csNo ? "bg-gray-50/80" : ""
            }`}
            onClick={() => onToggle(item.csNo)}>
            {isFaq ? (
              <span className="fs-up-2 text-blue-500 font-bold w-8 text-center shrink-0">
                Q.
              </span>
            ) : (
              <span className="fs-up-2 text-gray-400 w-8 text-center shrink-0 font-medium">
                {(items.length - index).toString().padStart(2, "0")}
              </span>
            )}

            <div className="flex-1">
              <p
                className={`fs-up-2 leading-snug ${
                  openId === item.csNo
                    ? "font-bold text-blue-600"
                    : "text-gray-800 font-medium"
                }`}>
                {item.csTitle}
              </p>
            </div>

            <span className="hidden lg:block fs-down-1 text-gray-400 w-28 text-right shrink-0">
              {item.csRegDate?.substring(0, 10)}
            </span>

            <span
              className={`text-gray-300 transition-transform pt-1.5 ${
                openId === item.csNo ? "rotate-180 text-blue-400" : ""
              }`}
              style={{ fontSize: "10px" }}>
              ▼
            </span>
          </div>

          {openId === item.csNo && (
            <div className="bg-gray-50/50 px-5 md:px-16 py-8 md:py-10 border-t border-gray-100">
              {isFaq ? (
                <div className="flex gap-3 md:gap-6">
                  <span className="fs-up-4 text-blue-500 font-bold shrink-0">
                    A.
                  </span>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line fs-up-2 flex-1">
                    {item.csContent}
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 leading-relaxed whitespace-pre-line fs-up-2">
                  {item.csContent}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-10 fs-down-1 text-gray-400 self-end">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-400/80">등록일</span>
                  <span>{item.csRegDate?.substring(0, 10)}</span>
                </div>

                <div className="w-[1px] h-2.5 bg-gray-300"></div>

                <div className="flex items-center gap-1.5">
                  <span>{item.csRegDate?.substring(11, 16)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerSupportAccordion;