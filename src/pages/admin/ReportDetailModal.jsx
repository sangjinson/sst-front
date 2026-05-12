// src/pages/admin/ReportDetailModal.jsx
import React from 'react';

const ReportDetailModal = ({ report, onClose, onProcess }) => {
  if (!report) return null;

  // 🚀 새 창으로 원본 글 띄우기 함수
  const handleOpenOriginalPost = () => {
    let url = '';
    
    // 🚀 신고 유형(rptTypeCd) 및 커뮤니티 카테고리(reportedCategory)에 따른 라우터 동적 설정
    if (report.rptTypeCd === 'RPT002') {
      
      // 🚀 백엔드에서 넘겨준 커뮤니티 카테고리 코드로 정확한 주소 매핑
      if (report.reportedCategory === 'CMM001') {
        url = `/showcase/life/view/${report.targetId}`;     // 인생거리
      } else if (report.reportedCategory === 'CMM002') {
        url = `/showcase/hotplace/view/${report.targetId}`; // 핫플거리
      } else {
        url = `/showcase/view/${report.targetId}`;          // 기본 Fallback
      }

    } else if (report.rptTypeCd === 'RPT001') {
      alert('리뷰 원본은 하단 상세 내용 박스를 확인해 주세요.');
      return;
    } else if (report.rptTypeCd === 'RPT003') {
      alert('댓글 원본은 하단 상세 내용 박스를 확인해 주세요.');
      return;
    }

    if (url) {
      // 🚀 새 탭(새 창)으로 열기 (보안을 위해 noopener, noreferrer 속성 추가)
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            신고 상세 내용 
            <span className="text-sm font-semibold text-[#0F9B73] ml-2 px-2 py-1 bg-green-100 rounded-md">
              대상: {report.rptTypeCd === 'RPT001' ? '리뷰' : report.rptTypeCd === 'RPT002' ? '커뮤니티' : '댓글'}
            </span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition">&times;</button>
        </div>

        {/* 본문 영역 */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. 신고 접수 정보 */}
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
            <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <span>🚨</span> 신고 접수 정보
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong className="w-20 inline-block text-gray-500">신고자</strong> {report.reporterName}</p>
              <p><strong className="w-20 inline-block text-gray-500">신고 사유</strong> 
                {report.rptReasonCd === 'RSN003' ? report.rptReasonContent : (report.rptReasonCd === 'RSN001' ? '스팸/홍보' : '욕설/비방')}
              </p>
              <p><strong className="w-20 inline-block text-gray-500">접수 일자</strong> {new Date(report.rptRegDate).toLocaleString()}</p>
            </div>
          </div>

          {/* 2. 원본 글 확인 영역 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span>📄</span> 신고당한 원본 글
              </h3>
              
              {/* 🚀 커뮤니티(게시물)인 경우에만 '새 창에서 보기' 버튼 활성화 */}
              {report.rptTypeCd === 'RPT002' && (
                <button 
                  onClick={handleOpenOriginalPost}
                  className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold transition shadow-sm"
                >
                  새 창에서 보기 ↗
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[150px] text-sm text-gray-700 leading-relaxed flex flex-col gap-3">
              {/* 백엔드에서 가져온 제목 출력 */}
              {report.reportedTitle && (
                <div className="border-b border-gray-200 pb-2 font-bold text-gray-900 text-base flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                    {report.reportedCategory === 'CMM001' ? '인생거리' : report.reportedCategory === 'CMM002' ? '핫플거리' : '기타'}
                  </span>
                  {report.reportedTitle}
                </div>
              )}

              {/* 내용 출력 */}
              <div className="whitespace-pre-wrap">
                {report.reportedContent ? (
                  report.reportedContent
                ) : (
                  <span className="text-gray-400 italic">이미 삭제되었거나 존재하지 않는 콘텐츠입니다.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 하단 액션 버튼 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            닫기
          </button>
          
          {report.rptStatusCd === 'RST001' && (
            <>
              <button 
                onClick={() => onProcess(report.rptNo, 'RST004')} 
                className="px-5 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                신고 반려 (문제없음)
              </button>
              <button 
                onClick={() => onProcess(report.rptNo, 'RST003')} 
                className="px-5 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold shadow-sm transition"
              >
                신고 승인 (게시물 숨김)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;