import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AIResultHeader = ({ existingId, onSave, onRestart }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => {
          if (existingId) {
            Swal.fire({
              title: '정말 돌아가시겠습니까?',
              text: '지금까지 수정한 내용은 모두 사라집니다.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: '돌아가기',
              cancelButtonText: '취소',
              confirmButtonColor: '#0F9B73',
              cancelButtonColor: '#9ca3af',
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.removeItem('currentSchedule');
                sessionStorage.removeItem('scheduleMetaData');
                navigate('/user/mypage', { state: { tab: 'schedule' } });
              }
            });
          } else {
            onRestart();
          }
        }}
        className="print-hide flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition"
      >
        {existingId ? '← 마이페이지로' : '← 다시 선택하기'}
      </button>

      <div className="print-hide hidden md:flex items-center gap-2">
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