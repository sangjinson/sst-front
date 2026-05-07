import React, { useState } from 'react';
import Swal from 'sweetalert2';


// 공유 버튼
/**
 * AIResultShareButton - 공유 버튼 + 드롭다운
 *
 * 사용 예시:
 * <AIResultShareButton />
 */
const AIResultShareButton = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    Swal.fire({
      icon: 'success',
      title: '복사 완료!',
      text: '링크가 클립보드에 복사되었습니다.',
      timer: 1500,
      showConfirmButton: false,
    });
    setIsShareOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsShareOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        공유
      </button>

      {isShareOpen && (
        <div className="absolute top-10 right-0 w-[280px] rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl z-10 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">페이지 링크</p>
          <div className="flex gap-2">
            <input
              value={window.location.href}
              readOnly
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F9B73] transition cursor-pointer"
            >
              복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResultShareButton;