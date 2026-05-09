import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIResultShareButton from './AIResultShareButton';


// 상단 버튼 (뒤로/공유/인쇄/저장)
const AIResultHeader = ({ existingId, onSave }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => existingId
          ? navigate('/user/mypage', { state: { tab: 'schedule' } })
          : navigate('/plan')
        }
        className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
      >
        {existingId ? '← 마이페이지로' : '← 다시 선택하기'}
      </button>

      <div className="flex items-center gap-2">
        <AIResultShareButton />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          인쇄/PDF 저장
        </button>
        {/* ✅ 저장 버튼도 헤더에 */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F9B73] text-white text-sm font-semibold hover:bg-[#0d8a66] transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          일정 저장
        </button>
      </div>
    </div>
  );
};

export default AIResultHeader;