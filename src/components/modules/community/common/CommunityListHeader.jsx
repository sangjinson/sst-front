import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";

const CommunityListHeader = ({
  breadcrumb,
  label,
  title,
  description,
  switchTo,
  writeTo,
  writeText,
  onWriteClick,
}) => {
  return (
    <>
      <Breadcrumb paths={breadcrumb} className="mb-4" />

      <section className="mt-8 mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73]">{label}</p>

          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>

            <Link
              to={switchTo.to}
              className="group mb-1 inline-flex h-8 items-center gap-1.5 rounded-full text-gray-400 transition-all duration-200 hover:text-[#0F9B73]"
              aria-label={`${switchTo.label}로 전환`}>
              <span className="inline-flex h-8 w-8 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>

              <span className="fs-down-1 md:text-lg font-bold">
                {switchTo.label}
              </span>
            </Link>
          </div>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            {description}
          </p>
        </div>

        {onWriteClick ? (
          <button
            type="button"
            onClick={onWriteClick}
            className="min-w-[120px] text-center cursor-pointer rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0F9B73] hover:shadow-md active:scale-95"
          >
            {writeText}
          </button>
        ) : (
          <Link to={writeTo} className="w-fit">
            <button className="min-w-[120px] text-center cursor-pointer rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0F9B73] hover:shadow-md active:scale-95">
              {writeText}
            </button>
          </Link>
        )}
      </section>
    </>
  );
};

export default CommunityListHeader;