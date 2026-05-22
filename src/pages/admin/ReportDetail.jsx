// src/pages/admin/ReportDetail.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dummyReports = {
  1: {
    title: '부적절한 댓글로 인한 신고',
    reporter: '김철수',
    reportedUser: '홍길동',
    date: '2026.04.10',
    status: '접수 중',
    content: '',
  },
  2: {
    title: '불법 광고 및 홍보 인한 신고',
    reporter: '이영희',
    reportedUser: '스팸계정123',
    date: '2026.03.30',
    status: '접수 중',
    content: '',
  },
  3: {
    title: '기타',
    reporter: '박민준',
    reportedUser: '익명사용자',
    date: '2025.11.20',
    status: '접수 완료',
    content: '기타 사유로 신고합니다. 해당 게시물이 커뮤니티 가이드라인에 맞지 않는 내용을 포함하고 있습니다.',
  },
};

const statusColor = {
  '접수 중': 'bg-yellow-100 text-yellow-700',
  '접수 완료': 'bg-green-100 text-green-700',
};

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = dummyReports[id];

  if (!report) {
    return (
      <div className="p-8 text-gray-400 text-center">
        신고 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">신고 관리</h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b">
          신고 내용 안내
        </h2>

        {/* 신고 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">신고 제목</p>
            <p className="text-sm font-semibold text-gray-800">{report.title}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">신고 상태</p>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[report.status]}`}>
              {report.status}
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">신고자</p>
            <p className="text-sm font-semibold text-gray-800">{report.reporter}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">신고 대상</p>
            <p className="text-sm font-semibold text-gray-800">{report.reportedUser}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 col-span-2">
            <p className="text-xs text-gray-400 mb-1">신고 일자</p>
            <p className="text-sm font-semibold text-gray-800">{report.date}</p>
          </div>
        </div>

        {/* 신고 내용 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">신고 내용</p>
          <div className="border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed min-h-[150px] bg-gray-50">
            {report.content}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => {
              if (window.confirm('신고를 삭제하시겠습니까?')) {
                navigate('/admin1/report');
              }
            }}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            삭제
          </button>
          <button
            onClick={() => navigate('/admin1/report')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;