import React, { useEffect, useState } from "react";

/*
 인생거리 글쓰기에서 여행 코스를 보여주고 수정하는 컴포넌트입니다.
*/

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

const DAY_STYLES = [
  {
    title: "bg-emerald-50 text-emerald-700 border-emerald-200",
    number: "bg-emerald-500 text-white",
    line: "bg-emerald-200",
    card: "bg-emerald-50/70 border-emerald-100",
  },
  {
    title: "bg-sky-50 text-sky-700 border-sky-200",
    number: "bg-sky-500 text-white",
    line: "bg-sky-200",
    card: "bg-sky-50/70 border-sky-100",
  },
  {
    title: "bg-purple-50 text-purple-700 border-purple-200",
    number: "bg-purple-500 text-white",
    line: "bg-purple-200",
    card: "bg-purple-50/70 border-purple-100",
  },
  {
    title: "bg-orange-50 text-orange-700 border-orange-200",
    number: "bg-orange-500 text-white",
    line: "bg-orange-200",
    card: "bg-orange-50/70 border-orange-100",
  },
  {
    title: "bg-pink-50 text-pink-700 border-pink-200",
    number: "bg-pink-500 text-white",
    line: "bg-pink-200",
    card: "bg-pink-50/70 border-pink-100",
  },
];

const getDayStyle = (dayNo) => {
  const index = Math.max(Number(dayNo || 1) - 1, 0);
  return DAY_STYLES[index % DAY_STYLES.length];
};

const groupCourseByDay = (course = []) => {
  return course.reduce((acc, item, index) => {
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

const CourseSection = ({
  course,
  onOpenModal,
  onRemoveCourseItem,
  onUpdateCourseItem,
}) => {
  const [activeDay, setActiveDay] = useState(1);

  const groupedCourse = groupCourseByDay(course);
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

  return (
    <div>
      <label className="block fs-down-2 font-bold text-gray-700 mb-3">
        여행 코스
      </label>

      {course.length === 0 ? (
        <div
          onClick={onOpenModal}
          className="border border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#0F9B73] hover:bg-green-50 transition">
          <div className="text-3xl mb-2">📅</div>

          <p className="fs-down-1 font-semibold text-gray-500">
            내 일정에서 장소를 가져오세요
          </p>

          <p className="fs-down-1 text-gray-400 mt-1">
            클릭하면 내 여행 일정 목록이 열려요
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
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
          </div>

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

            <div className="space-y-3">
              {activeDayCourses.map((c, dayIndex) => {
                const isLast = dayIndex === activeDayCourses.length - 1;

                return (
                  <div key={c.originalIndex} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${activeDayStyle.number}`}>
                        {dayIndex + 1}
                      </div>

                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 my-1 min-h-[12px] ${activeDayStyle.line}`}
                        />
                      )}
                    </div>

                    <div
                      className={`flex-1 rounded-2xl border p-4 flex gap-3 ${activeDayStyle.card}`}>
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/70 flex items-center justify-center text-xl shrink-0">
                          {c.type === "food" || c.type === "먹거리"
                            ? "🍽"
                            : c.type === "sleep" || c.type === "잘거리"
                            ? "🛏"
                            : c.type === "play" || c.type === "놀거리"
                            ? "🎡"
                            : "🏛"}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              TYPE_COLOR?.[c.type] ||
                              "bg-emerald-50 text-emerald-600"
                            }`}>
                            {TYPE_LABEL?.[c.type] || "여행"}
                          </span>
                        </div>

                        <p className="fs-down-1 font-bold text-gray-900">
                          {c.name}
                        </p>

                        {c.address && (
                          <p className="fs-down-1 text-gray-500 mt-0.5 truncate">
                            {c.address}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveCourseItem(c.originalIndex)}
                        className="shrink-0 self-start p-1.5 text-gray-300 hover:text-red-400 transition">
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="w-full py-2.5 border border-dashed border-gray-200 rounded-xl fs-down-1 text-gray-400 hover:border-[#0F9B73] hover:text-[#0F9B73] transition">
            + 다른 일정으로 변경하기
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseSection;