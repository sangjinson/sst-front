import React from "react";
import Breadcrumb from "@components/common/Breadcrumb";
import CustomerSupportSidebar from "./CustomerSupportSidebar";

const CustomerSupportLayout = ({ title, breadcrumb, children }) => {
  const headerSyncContainer =
    "max-w-[1920px] mx-auto px-5 lg:px-[50px] xl:px-[300px]";

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-10 md:py-20 text-gray-800">
      <div className={headerSyncContainer}>
        <Breadcrumb paths={breadcrumb} className="mb-10" />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <CustomerSupportSidebar />

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-5 md:p-[30px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <h2 className="fs-up-5 font-bold mb-8 md:mb-12 text-gray-900 tracking-tight">
                {title}
              </h2>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportLayout;