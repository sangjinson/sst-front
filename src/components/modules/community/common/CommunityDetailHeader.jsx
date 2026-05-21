import React from "react";
import Breadcrumb from "@components/common/Breadcrumb";

const CommunityDetailHeader = ({
  breadcrumb,
  label,
  title,
  description,
  onBack,
}) => {
  return (
    <>
      <Breadcrumb paths={breadcrumb} className="mb-4" />

      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73] pt-2">
            {label}
          </p>

          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-fit rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-[#0F9B73] hover:text-[#0F9B73] hover:shadow-sm active:scale-95">
          목록으로
        </button>
      </section>
    </>
  );
};

export default CommunityDetailHeader;