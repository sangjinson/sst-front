import React, { useState, useEffect } from "react";
import api from "@api/axios";

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/admin/AdminPagination";

import Badge from "@themeadmin/components/ui/badge/Badge";

const TYPE_MAP = {
  RPT001: "리뷰",
  RPT002: "뽐낼거리(글)",
  RPT003: "댓글",
};

const REASON_MAP = {
  RSN001: "불법 광고 및 홍보",
  RSN002: "부적절한 내용(욕설/비방 등)",
  RSN003: "기타",
};

const STATUS_MAP = {
  RST001: { label: "접수 대기", color: "error" },
  RST002: { label: "처리중", color: "warning" },
  RST003: { label: "처리 완료", color: "success" },
  RST004: { label: "반려", color: "light" },
};

export default function AdminReport() {
  const [reports, setReports] = useState([]);
  const [statusTab, setStatusTab] = useState("RST001");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchType, setSearchType] = useState("reporter");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchReports = async (overrides = {}) => {
    try {
      const response = await api.get("/admin/reports", {
        params: {
          page: overrides.page ?? page,
          size,
          statusCd: overrides.statusCd ?? statusTab,
          rptTypeCd: overrides.rptTypeCd ?? typeFilter,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
        },
      });

      const responseData = response.data.data;
      const fetchedList = Array.isArray(responseData)
        ? responseData
        : (responseData?.list || responseData?.content || []);
               
      const fetchedTotal = responseData?.totalCount ?? responseData?.totalElements ?? fetchedList.length;

      setReports(fetchedList);
      setTotalCount(fetchedTotal);
           
    } catch (error) {
      console.error("신고 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusTab, typeFilter, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setTypeFilter("");
    setSearchType("reporter");
    setPage(1);
  };

  const handleUpdateStatus = async (rptNo, newStatusCd) => {
    if (!window.confirm("신고 처리 상태를 변경하시겠습니까?")) return;
    try {
      const response = await api.put(`/admin/reports/${rptNo}/status`, null, {
        params: { statusCd: newStatusCd },
      });
      
      alert(response.data.data || "상태가 변경되었습니다.");
      
      fetchReports();
      if (selectedReport) setSelectedReport(null); 
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 타이틀 영역 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            신고 관리
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            해당 탭의 신고 수: <span className="font-bold text-[#0F9B73] dark:text-[#0F9B73]">{totalCount}</span>건
          </p>
        </div>
      </div>

      {/* 🚀 탭 UI 다크모드 대응 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => { setStatusTab('RST001'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
            statusTab === 'RST001' 
              ? 'bg-[#0F9B73] text-white dark:bg-[#0F9B73]/90' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          🚨 미처리 (접수 대기)
        </button>
        <button
          onClick={() => { setStatusTab('RST003'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
            statusTab === 'RST003' 
              ? 'bg-[#0F9B73] text-white dark:bg-[#0F9B73]/90' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          ✅ 처리 완료
        </button>
        <button
          onClick={() => { setStatusTab('RST004'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
            statusTab === 'RST004' 
              ? 'bg-[#0F9B73] text-white dark:bg-[#0F9B73]/90' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          반려 내역
        </button>
      </div>

      {/* 🚀 검색/필터 영역 다크모드 대응 */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-36 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-orange-400"
        >
          <option value="">전체 대상</option>
          <option value="RPT002">뽐낼거리(글)</option>
          <option value="RPT001">리뷰</option>
          <option value="RPT003">댓글</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-orange-400"
        >
          <option value="reporter">신고자</option>
          <option value="content">신고 내용</option>
        </select>
        
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어를 입력하세요"
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-orange-400"
        />
        
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-[#0F9B73] text-white text-sm font-semibold rounded-lg hover:bg-[#0d8a66] dark:bg-[#0F9B73]/90 dark:hover:bg-[#0F9B73]">
            조회
          </button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500">
            초기화
          </button>
        </div>
      </div>

      {/* 🚀 테이블 다크모드 적용 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            
            {/* 🚀 테이블 헤더 (thead, tr, th) */}
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-5 py-3 text-center w-16 font-semibold text-gray-600 dark:text-gray-300">No</th>
                <th className="px-5 py-3 text-center w-28 font-semibold text-gray-600 dark:text-gray-300">대상 유형</th>
                <th className="px-5 py-3 text-center w-56 font-semibold text-gray-600 dark:text-gray-300">신고 사유</th>
                <th className="px-5 py-3 text-start font-semibold text-gray-600 dark:text-gray-300">신고 대상 (요약)</th>
                <th className="px-5 py-3 text-center w-28 font-semibold text-gray-600 dark:text-gray-300">신고자</th>
                <th className="px-5 py-3 text-center w-28 font-semibold text-gray-600 dark:text-gray-300">상태</th>
                <th className="px-5 py-3 text-center w-24 font-semibold text-gray-600 dark:text-gray-300">상세</th>
              </tr>
            </thead>

            {/* 🚀 테이블 본문 (tbody, tr, td) */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reports.length === 0 ? (
                <tr>
                  {/* 🚀 데이터가 없을 때의 처리 */}
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-500 dark:text-gray-400 font-medium">
                    해당 조건의 신고 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr 
                    key={report.rptNo} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/80 transition-colors"
                  >
                    <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                      {(page - 1) * size + idx + 1}
                    </td>
                    
                    <td className="px-5 py-4 text-center font-medium text-gray-700 dark:text-gray-300">
                      {TYPE_MAP[report.rptTypeCd] || "알수없음"}
                    </td>

                    <td className="px-5 py-4 text-center font-bold text-red-500 dark:text-red-400 break-keep">
                      {REASON_MAP[report.rptReasonCd] || report.rptReasonCd}
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-normal">
                      <div className="line-clamp-2" title={report.reportedContent}>
                        {report.rptTypeCd === "RPT002" && (
                          <span className="font-bold text-gray-800 dark:text-gray-100 mr-2">
                            [{report.reportedTitle}]
                          </span>
                        )}
                        {report.reportedContent}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center font-medium dark:text-gray-300">
                      {report.reporterName}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {/* Badge 컴포넌트는 커스텀 UI지만 레이아웃을 망치지 않으므로 유지합니다 */}
                      <Badge color={STATUS_MAP[report.rptStatusCd]?.color || "light"}>
                        {STATUS_MAP[report.rptStatusCd]?.label || report.rptStatusCd}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 bg-[#0F9B73] text-white text-xs font-semibold rounded-lg hover:bg-[#0d8a66] dark:bg-[#0F9B73]/90 dark:hover:bg-[#0F9B73]"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* 🚀 모달 영역 다크모드 완벽 대응 */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/70">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">신고 상세 정보</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">신고 사유</p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                  {REASON_MAP[selectedReport.rptReasonCd]}
                  {selectedReport.rptReasonCd === "RSN003" && selectedReport.rptReasonContent && (
                    <div className="mt-2 pt-2 border-t border-red-200/50 dark:border-red-500/20 font-normal text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-red-500 dark:text-red-400 mr-1">↳ 상세내용:</span> 
                      {selectedReport.rptReasonContent}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                  대상 원문 ({TYPE_MAP[selectedReport.rptTypeCd]})
                </p>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800/50 dark:border-gray-700 space-y-2 max-h-40 overflow-y-auto">
                  {selectedReport.rptTypeCd === "RPT002" && (
                    <div className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                      {selectedReport.reportedTitle}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300">
                    {selectedReport.reportedContent}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <p><strong className="dark:text-gray-300">신고자:</strong> {selectedReport.reporterName}</p>
                <p><strong className="dark:text-gray-300">신고일:</strong> {new Date(selectedReport.rptRegDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 justify-end bg-gray-50 dark:bg-gray-800/50">
              {selectedReport.rptStatusCd === "RST001" && (
                <>
                  <button onClick={() => handleUpdateStatus(selectedReport.rptNo, "RST004")} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    반려
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedReport.rptNo, "RST003")} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                    확인 및 블라인드 (처리완료)
                  </button>
                </>
              )}
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-[#0F9B73] text-white font-bold rounded-lg hover:bg-[#0d8a66] dark:bg-[#0F9B73]/90 dark:hover:bg-[#0F9B73]">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}