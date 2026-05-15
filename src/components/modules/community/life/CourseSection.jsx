import React from "react";

/*
 인생거리 글쓰기에서 여행 코스를 보여주고 수정하는 컴포넌트입니다.

 * 사용 예시:

 *  const [course, setCourse] = useState([]);

 *  const removeCourseItem = (idx) => {
 *  setCourse((prev) => prev.filter((_, i) => i !== idx));
 *  };

 *  const updateCourseItem = (idx, field, value) => {
 *  setCourse((prev) =>
 *      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
 *  );
 *  };
 *
 * <CourseSection
 *   course={course}
 *   onOpenModal={() => setShowModal(true)}
 *   onRemoveCourseItem={removeCourseItem}
 *   onUpdateCourseItem={updateCourseItem}
*/

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

const CourseSection = ({
  course,
  onOpenModal,
  onRemoveCourseItem,
  onUpdateCourseItem,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block fs-down-2 font-bold text-gray-700">
          여행 코스
        </label>

        <button
          type="button"
          onClick={onOpenModal}
          className="px-4 py-2 bg-[#0F9B73] text-white fs-down-1 font-semibold rounded-lg hover:bg-[#0d8a66] transition">
          내 일정에서 가져오기
        </button>
      </div>

      {course.length === 0 ? (
        <div
          onClick={onOpenModal}
          className="border border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#0F9B73] hover:bg-green-50 transition"
        >
          <div className="text-3xl mb-2">📅</div>
          <p className="fs-down-1 font-semibold text-gray-500">
            내 일정에서 장소를 가져오세요
          </p>
          <p className="fs-down-1 text-gray-400 mt-1">
            클릭하면 내 여행 일정 목록이 열려요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {course.map((c, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#0F9B73] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                {idx < course.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[12px]" />
                )}
              </div>

              <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex gap-3">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xl shrink-0">
                    {c.type === "food"
                      ? "🍽"
                      : c.type === "sleep"
                      ? "🛏"
                      : c.type === "play"
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
                      }`}
                    >
                      {TYPE_LABEL?.[c.type] || "여행"}
                    </span>
                  </div>

                  <p className="fs-down-1 font-bold text-gray-900">
                    {c.name}
                  </p>

                  {c.address && (
                    <p className="fs-down-1 text-gray-400 mt-0.5 truncate">
                      {c.address}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveCourseItem(idx)}
                  className="shrink-0 self-start p-1.5 text-gray-300 hover:text-red-400 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

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