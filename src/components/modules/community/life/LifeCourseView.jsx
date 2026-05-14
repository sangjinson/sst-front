import React from "react";

const TYPE_LABEL = {
  food: "맛집",
  play: "관광",
  sleep: "숙소",
};

const TYPE_COLOR = {
  food: "bg-orange-100 text-orange-700",
  play: "bg-sky-100 text-sky-700",
  sleep: "bg-violet-100 text-violet-700",
};

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#0F9B73]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const CalendarPlanIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="5" width="16" height="16" rx="4" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M4 10h16" />
    <path d="M8.5 14h.01" />
    <path d="M12 14h.01" />
    <path d="M15.5 14h.01" />
    <path d="M8.5 17.5h.01" />
    <path d="M12 17.5h.01" />
    <path d="M15.5 17.5h.01" />
  </svg>
);

/**
 * LifeCourseView
 *
 * 인생거리 상세페이지에서 여행 코스 목록과
 * "내 일정으로 가져오기", "이 코스로 일정 만들기" 버튼을 보여주는 컴포넌트입니다.
 *
 * 사용 예시:
 * 
 * import LifeCourseView from "@components/modules/community/life/LifeCourseView";
 *
 * <LifeCourseView
 *   courseList={courseList}
 *   region={region}
 *   thumbnail={thumbnail}
 *   navigate={navigate}
 *   handleImportSchedule={handleImportSchedule}
 *   handleMakePlan={handleMakePlan}
 * />
 */

const LifeCourseView = ({
  courseList,
  region,
  thumbnail,
  navigate,
  handleImportSchedule,
  handleMakePlan,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <h3 className="fs-down-2 font-extrabold text-gray-900 mb-5 flex items-center gap-2">
        <MapIcon />
        여행 코스
        <span className="fs-down-1 font-normal text-gray-400">
          {courseList.length}개 장소
        </span>
      </h3>

      {courseList.length > 0 ? (
        <div className="space-y-4">
          {courseList.map((c, i) => (
            <div key={c.order || i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#0F9B73] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {c.order || i + 1}
                </div>

                {i < courseList.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-1 min-h-[20px]" />
                )}
              </div>

              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/${region}/${c.type}/view`, {
                      state: {
                        item: c,
                        region,
                        type: c.type,
                      },
                    });
                  }}
                  className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 transition hover:scale-105 active:scale-95"
                >
                  <img
                    src={c.image || thumbnail}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`fs-down-1 px-2 py-0.5 rounded-full font-bold ${
                        TYPE_COLOR?.[c.type] ||
                        "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {TYPE_LABEL?.[c.type] || "여행"}
                    </span>
                  </div>

                  <p className="fs-down-1 font-bold text-gray-900 truncate">
                    {c.name}
                  </p>

                  <p className="fs-down-1 text-gray-400 mt-0.5">
                    {c.address}
                  </p>

                  <p className="fs-down-1 text-gray-500 mt-1">
                    {c.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-5 fs-down-1 text-gray-500">
          등록된 여행 코스가 없습니다.
        </p>
      )}

      <div className="flex flex-col gap-3 mt-6 sm:flex-row">
        <button
          type="button"
          onClick={handleImportSchedule}
          className="flex-1 py-3 bg-[#0F9B73] text-white fs-down-1 font-bold rounded-xl hover:bg-[#0d8a66] transition inline-flex items-center justify-center gap-2 leading-none"
        >
          <DownloadIcon />
          <span className="leading-none">내 일정으로 가져오기</span>
        </button>

        <button
          type="button"
          onClick={handleMakePlan}
          className="flex-1 py-3 border border-[#0F9B73] text-[#0F9B73] fs-down-1 font-bold rounded-xl hover:bg-green-50 transition inline-flex items-center justify-center gap-2 leading-none"
        >
          <CalendarPlanIcon />
          <span className="leading-none">이 코스로 일정 만들기</span>
        </button>
      </div>
    </div>
  );
};

export default LifeCourseView;