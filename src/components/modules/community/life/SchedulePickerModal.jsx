import React, { useState } from "react";
import { createPortal } from "react-dom";
import api from "@api/axios";

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

const SchedulePickerModal = ({ onClose, onSelect, schedules = [] }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleTripClick = async (schedule) => {
    try {
      setLoadingId(schedule.aisNo);

      const res = await api.get(
        `/community/life/schedules/${schedule.aisNo}/places`
      );

      onSelect(res.data, schedule);
      onClose();
    } catch (err) {
        console.error("일정 장소 목록 조회 실패:", err);
      alert("일정의 장소 목록을 불러오지 못했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center box-border pt-24 px-4 pb-4"
      style={{
        width: "100vw",
        height: "100dvh",
      }}>
      <div
        className="max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
        style={{
          width: "min(520px, calc(100vw - 32px))",
        }}>

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              내 AI 일정에서 가져오기
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              일정을 선택하면 코스 장소가 자동으로 추가돼요
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📅</div>

              <p className="text-sm font-medium">
                저장된 AI 일정이 없습니다.
              </p>

              <p className="text-xs mt-1 text-gray-300">
                먼저 AI 여행 일정을 만들어보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedules.map((schedule) => (
                <button
                  key={schedule.aisNo}
                  type="button"
                  onClick={() => handleTripClick(schedule)}
                  disabled={loadingId === schedule.aisNo}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#0F9B73] hover:bg-green-50 transition text-left disabled:opacity-60 disabled:cursor-wait">
                  <div className="w-11 h-11 rounded-full bg-[#0F9B73]/10 flex items-center justify-center text-xl shrink-0">
                    📍
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {schedule.aisSchdulName}
                    </p>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {schedule.aisBeginDate}
                      </span>

                      <span className="text-gray-200">~</span>

                      <span className="text-xs text-gray-400">
                        {schedule.aisEndDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-semibold text-[#0F9B73]">
                      {schedule.aisTotDays}일 일정
                    </span>

                    <span className="text-xs text-gray-400">
                      {loadingId === schedule.aisNo
                        ? "불러오는 중..."
                        : "전체 가져오기 →"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition">
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SchedulePickerModal;