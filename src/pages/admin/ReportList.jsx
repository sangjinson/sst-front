// src/pages/admin/ReportList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyReports = [
  { id: 1, title: '부적절한 댓글로 인한 신고', date: '2026.04.10', status: '접수 중' },
  { id: 2, title: '불법 광고 및 홍보 인한 신고', date: '2026.03.30', status: '접수 중' },
  { id: 3, title: '기타', date: '2025.11.20', status: '접수 완료' },
];

const statusColor = {
  '접수 중': 'bg-yellow-100 text-yellow-700',
  '접수 완료': 'bg-green-100 text-green-700',
};

const ReportList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">신고 관리</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="p-3 text-left w-16">번호</th>
              <th className="p-3 text-left">제목</th>
              <th className="p-3 text-left w-32">수정 일자</th>
              <th className="p-3 text-left w-28">상태</th>
              <th className="p-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {dummyReports.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
                onClick={() => navigate(`/admin1/report/${r.id}`)}
              >
                <td className="p-3 text-gray-500">{r.id}</td>
                <td className="p-3 text-gray-800">{r.title}</td>
                <td className="p-3 text-gray-500">{r.date}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            입력하기
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            서목
          </button>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-2 py-1 text-gray-500 hover:text-gray-800">{'<'}</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                currentPage === page ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="px-2 py-1 text-gray-500 hover:text-gray-800">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default ReportList;