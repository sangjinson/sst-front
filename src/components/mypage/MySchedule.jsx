import React, { useState } from 'react';
import Pagination from '@components/common/Pagination';

const DUMMY_SCHEDULES = [
  { id: 1, title: "이천 여행", startDate: "2026.02.25", endDate: "2026.02.27", status: "여행완료" },
  { id: 2, title: "엄마랑 고양 여행~~^", startDate: "2026.03.30", endDate: "2026.04.01", status: "여행 완료" },
  { id: 3, title: "친구들이랑 3일 슈웃", startDate: "2026.04.20", endDate: "2026.04.23", status: "여행 예정" },
];

const STATUS_COLOR = {
  "여행완료":  { bg: "#d1fae5", color: "#065f46" },
  "여행 완료": { bg: "#d1fae5", color: "#065f46" },
  "여행 예정": { bg: "#fef3c7", color: "#92400e" },
  "여행중":    { bg: "#dbeafe", color: "#1e40af" },
};

const MySchedule = () => {
  const [page, setPage] = useState(1);
  
  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 일정 관리</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100">
              {["번호", "제목", "여행 날짜", "상태"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_SCHEDULES.map((s) => {
              const sc = STATUS_COLOR[s.status] || { bg: "#f3f4f6", color: "#374151" };
              return (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-500">{s.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{s.title}</td>
                  <td className="py-4 px-4 text-xs text-gray-500 leading-relaxed whitespace-nowrap">
                    {s.startDate} <br />~<br /> {s.endDate}
                  </td>
                  <td className="py-4 px-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={3} onPageChange={setPage} />
    </div>
  );
};

export default MySchedule;