import React, { useEffect, useState } from "react";

// 장소 유형별 한글 라벨
const TYPE_LABEL = {
  food: "맛집",
  play: "관광",
  sleep: "숙소",
  see: "관광",
  먹거리: "맛집",
  볼거리: "관광",
  놀거리: "관광",
  잘거리: "숙소",
};

// 장소 유형별 색상
const TYPE_COLOR = {
  food: "bg-orange-100 text-orange-700",
  play: "bg-sky-100 text-sky-700",
  sleep: "bg-violet-100 text-violet-700",
  see: "bg-blue-100 text-blue-700",
  먹거리: "bg-orange-100 text-orange-700",
  볼거리: "bg-blue-100 text-blue-700",
  놀거리: "bg-purple-100 text-purple-700",
  잘거리: "bg-violet-100 text-violet-700",
};

// 일차별 색상 스타일
const DAY_STYLES = [
  {
    title: "bg-emerald-50 text-emerald-700 border-emerald-200",
    number: "bg-emerald-500 text-white",
    line: "bg-emerald-200",
    card: "bg-emerald-50/70 border-emerald-100 hover:bg-emerald-100/70",
  },
  {
    title: "bg-sky-50 text-sky-700 border-sky-200",
    number: "bg-sky-500 text-white",
    line: "bg-sky-200",
    card: "bg-sky-50/70 border-sky-100 hover:bg-sky-100/70",
  },
  {
    title: "bg-purple-50 text-purple-700 border-purple-200",
    number: "bg-purple-500 text-white",
    line: "bg-purple-200",
    card: "bg-purple-50/70 border-purple-100 hover:bg-purple-100/70",
  },
  {
    title: "bg-orange-50 text-orange-700 border-orange-200",
    number: "bg-orange-500 text-white",
    line: "bg-orange-200",
    card: "bg-orange-50/70 border-orange-100 hover:bg-orange-100/70",
  },
  {
    title: "bg-pink-50 text-pink-700 border-pink-200",
    number: "bg-pink-500 text-white",
    line: "bg-pink-200",
    card: "bg-pink-50/70 border-pink-100 hover:bg-pink-100/70",
  },
];

// dayNo 값에 따라 일차 색상 선택
const getDayStyle = (dayNo) => {
  const index = Math.max(Number(dayNo || 1) - 1, 0);
  return DAY_STYLES[index % DAY_STYLES.length];
};

// courseList를 dayNo 기준으로 묶기
const groupCourseByDay = (courseList = []) => {
  return courseList.reduce((acc, item, index) => {
    const dayNo = Number(item.dayNo || 1);

    if (!acc[dayNo]) {
      acc[dayNo] = [];
    }

    acc[dayNo].push({
      ...item,
      originalIndex: index,
    });

    return acc;
  }, {});
};

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

const MapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6 shrink-0 text-[#0F9B73]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const LifeCourseView = ({
  courseList,
  region,
  thumbnail,
  navigate,
  handleImportSchedule,
  handleMakePlan,
}) => {
  const [activeDay, setActiveDay] = useState(1);

  // dayNo 기준으로 묶은 코스 데이터
  const groupedCourse = groupCourseByDay(courseList);

  // 일차 번호를 오름차순으로 정렬
  const dayNumbers = Object.keys(groupedCourse)
    .map(Number)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (dayNumbers.length > 0 && !dayNumbers.includes(activeDay)) {
      setActiveDay(dayNumbers[0]);
    }
  }, [dayNumbers, activeDay]);

  const activeDayStyle = getDayStyle(activeDay);
  const activeDayCourses = groupedCourse[activeDay] || [];

  // 코스 장소 유형을 URL 이동용 type 값으로 변환
  const getPlaceType = (type) => {
    const typeMap = {
      먹거리: "food",
      볼거리: "see",
      놀거리: "play",
      잘거리: "sleep",
      food: "food",
      see: "see",
      play: "play",
      sleep: "sleep",
    };

    return typeMap[type] || "see";
  };

  // 장소 카드 클릭 시 해당 장소 상세페이지로 이동
  const handlePlaceClick = (place) => {
    if (!place.placeId) {
      alert("장소 상세 정보를 찾을 수 없습니다.");
      return;
    }

    const type = getPlaceType(place.type);
    navigate(`/${region}/${type}/view?id=${place.placeId}`);
  };

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
          {/* 일차 탭 */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dayNumbers.map((dayNo) => {
              const dayStyle = getDayStyle(dayNo);
              const isActive = activeDay === dayNo;

              return (
                <button
                  key={dayNo}
                  type="button"
                  onClick={() => setActiveDay(dayNo)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition ${
                    isActive
                      ? dayStyle.title
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                  }`}>
                  {dayNo}일차
                </button>
              );
            })}
          </div>

          {/* 선택된 일차 */}
          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 fs-down-1 font-extrabold ${activeDayStyle.title}`}>
                {activeDay}일차
              </span>

              <span className="fs-down-1 text-gray-400">
                {activeDayCourses.length}개 장소
              </span>
            </div>

            <div className="space-y-4">
              {activeDayCourses.map((c, dayIndex) => {
                const isLast = dayIndex === activeDayCourses.length - 1;

                return (
                  <div key={c.order || c.originalIndex} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${activeDayStyle.number}`}>
                        {dayIndex + 1}
                      </div>

                      {!isLast && (
                        <div
                          className={`w-0.5 h-full my-1 min-h-[20px] ${activeDayStyle.line}`}
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlaceClick(c)}
                      className={`flex-1 rounded-2xl border p-4 flex gap-4 mb-2 text-left transition active:scale-[0.99] ${activeDayStyle.card}`}>
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/70">
                        <img
                          src={c.image || thumbnail}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-sm px-2 py-0.5 rounded-full font-bold ${
                              TYPE_COLOR?.[c.type] ||
                              "bg-emerald-50 text-emerald-600"
                            }`}>
                            {TYPE_LABEL?.[c.type] || c.type || "여행"}
                          </span>
                        </div>

                        <p className="fs-down-1 font-bold text-gray-900 truncate">
                          {c.name}
                        </p>

                        <p className="fs-down-1 text-gray-500 mt-0.5">
                          {c.address}
                        </p>

                        {c.desc && (
                          <p className="fs-down-1 text-gray-600 mt-1 line-clamp-2">
                            {c.desc}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-5 fs-down-1 text-gray-500">
          등록된 여행 코스가 없습니다.
        </p>
      )}  
    </div>
  );
};

export default LifeCourseView;