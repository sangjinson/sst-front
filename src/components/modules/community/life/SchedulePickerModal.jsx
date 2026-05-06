import React, { useEffect, useState } from "react";

/* 
 * 사용 예시:
 *
 * const [showModal, setShowModal] = useState(false);
 *
 * const handleSelectPlaces = (places, region) => {
 *   console.log(places); // 선택한 일정의 전체 장소 목록
 *   console.log(region); // 선택한 일정의 지역
 * };
 *
 * {showModal && (
 *   <SchedulePickerModal
 *     onClose={() => setShowModal(false)}
 *     onSelect={handleSelectPlaces}
 *   />
 * )}
*/


const SchedulePickerModal = ({ onClose, onSelect }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTrips") || "[]");
    setSchedules(saved);
  }, []);

  const handleTripClick = (trip) => {
    const allPlaces = (trip.schedule || []).flat();
    onSelect(allPlaces, trip.region || "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 flex flex-col max-h-[70vh]">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              내 일정에서 가져오기
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              일정을 선택하면 장소가 자동으로 추가돼요
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm font-medium">저장된 일정이 없습니다.</p>
              <p className="text-xs mt-1 text-gray-300">
                내거리에서 일정을 먼저 만들어보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedules.map((trip) => {
                const placeCount = (trip.schedule || []).flat().length;

                return (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => handleTripClick(trip)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#0F9B73] hover:bg-green-50 transition text-left"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#0F9B73]/10 flex items-center justify-center text-xl shrink-0">
                      📍
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {trip.name}
                      </p>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">
                          {trip.region}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">
                          {trip.period}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-semibold text-[#0F9B73]">
                        장소 {placeCount}개
                      </span>
                      <span className="text-xs text-gray-400">
                        전체 가져오기 →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePickerModal;