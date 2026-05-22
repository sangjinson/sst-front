import React, { useState, useEffect } from "react";
import api from "@api/axios";

// 🚀 1. 공통 훅 및 페이지네이션
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

// 🚀 2. 테마 통일을 위한 UI 컴포넌트 임포트
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
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
  RST001: { label: "접수 대기", color: "error" },    // 빨간색 뱃지
  RST002: { label: "처리중", color: "warning" },     // 노란색 뱃지
  RST003: { label: "처리 완료", color: "success" },  // 초록색 뱃지
  RST004: { label: "반려", color: "light" },         // 회색 뱃지
};

export default function AdminReport() {
  const [reports, setReports] = useState([]);
  
  // 🚀 3. 탭 UI를 위한 상태 (기본값: 해야 할 일인 '접수 대기')
  const [statusTab, setStatusTab] = useState("RST001"); 
  
  // 검색 및 필터 상태
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

      // 🚀 1. 백엔드 응답 구조 방어 로직 추가
      // response.data.data가 배열이면 그대로 사용하고, 객체면 .list나 .content 속성을 찾습니다.
      const responseData = response.data.data;
      const fetchedList = Array.isArray(responseData)
        ? responseData
        : (responseData?.list || responseData?.content || []);
        
      // 🚀 2. totalCount 속성명 불일치 (totalElements 등) 방어
      const fetchedTotal = responseData?.totalCount ?? responseData?.totalElements ?? fetchedList.length;

      setReports(fetchedList);
      setTotalCount(fetchedTotal);
      
    } catch (error) {
      console.error("신고 목록 조회 실패:", error);
    }
  };

  // 🚀 4. 탭이나 페이지, 필터가 변경될 때마다 자동 패칭
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
      
      // 🚀 백엔드에서 생성한 성공/블라인드 안내 메시지를 그대로 띄워줍니다.
      alert(response.data.data || "상태가 변경되었습니다.");
      
      fetchReports();
      if (selectedReport) setSelectedReport(null); 
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 5. 리뷰/댓글 관리와 완벽하게 동일한 헤더 및 카운트 구조 */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            신고 관리
          </h2>
          <p className="text-sm text-gray-500">
            해당 탭의 신고 수: <span className="font-bold text-orange-500">{totalCount}</span>건
          </p>
        </div>
      </div>

      {/* 🚀 6. 처리 상태(Status) 기준의 직관적인 탭 UI 적용 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => { setStatusTab('RST001'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            statusTab === 'RST001' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🚨 미처리 (접수 대기)
        </button>
        <button
          onClick={() => { setStatusTab('RST003'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            statusTab === 'RST003' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          ✅ 처리 완료
        </button>
        <button
          onClick={() => { setStatusTab('RST004'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            statusTab === 'RST004' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          반려 내역
        </button>
      </div>

      {/* 🚀 7. 검색 영역: 신고 유형(Type)은 서브 필터로 검색바 옆에 배치 */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-36 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">전체 대상</option>
          <option value="RPT002">뽐낼거리(글)</option>
          <option value="RPT001">리뷰</option>
          <option value="RPT003">댓글</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition dark:bg-gray-700 dark:hover:bg-gray-600">
            조회
          </button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            초기화
          </button>
        </div>
      </div>

      {/* 🚀 8. ThemeAdmin 공통 Table 적용 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center w-16">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-28">대상 유형</TableCell>
                
                {/* 🚀 수정: 신고 사유 칸 넓이를 w-36(144px)에서 w-56(224px)으로 대폭 확대 */}
                <TableCell isHeader className="px-5 py-3 text-center w-56">신고 사유</TableCell>
                
                <TableCell isHeader className="px-5 py-3 text-start">신고 대상 (요약)</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-28">신고자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-28">상태</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">상세</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {reports.length === 0 ? (
                <TableRow>
                  {/* 🚀 수정: 커스텀 TableCell이 colSpan을 무시하므로, 순수 <td> 태그를 사용하여 7칸 병합 강제 적용 */}
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-500 font-medium">
                    해당 조건의 신고 내역이 없습니다.
                  </td>
                </TableRow>
              ) : (
                reports.map((report, idx) => (
                  <TableRow key={report.rptNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <TableCell className="px-5 py-4 text-center text-gray-500">
                      {(page - 1) * size + idx + 1}
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 text-center font-medium text-gray-700">
                      {TYPE_MAP[report.rptTypeCd] || "알수없음"}
                    </TableCell>

                    {/* 🚀 추가: 넓어진 칸 안에서 텍스트가 예쁘게 보이도록 break-keep 속성 추가 (단어 단위 줄바꿈) */}
                    <TableCell className="px-5 py-4 text-center font-bold text-red-500 break-keep">
                      {REASON_MAP[report.rptReasonCd] || report.rptReasonCd}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-gray-600">
                      <div className="line-clamp-2" title={report.reportedContent}>
                        {report.rptTypeCd === "RPT002" && (
                          <span className="font-bold text-gray-800 mr-2">[{report.reportedTitle}]</span>
                        )}
                        {report.reportedContent}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center text-sm font-medium">
                      {report.reporterName}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <Badge color={STATUS_MAP[report.rptStatusCd]?.color || "light"}>
                        {STATUS_MAP[report.rptStatusCd]?.label || report.rptStatusCd}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition"
                      >
                        상세보기
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* 🚀 모달 영역 (기존 내용 유지, 스타일만 미세 조정) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">신고 상세 정보</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">신고 사유</p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                  {REASON_MAP[selectedReport.rptReasonCd]}
                  {selectedReport.rptReasonCd === "RSN003" && selectedReport.rptReasonContent && (
                    <div className="mt-2 pt-2 border-t border-red-200/50 font-normal text-gray-700">
                      <span className="font-bold text-red-500 mr-1">↳ 상세내용:</span> 
                      {selectedReport.rptReasonContent}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">
                  대상 원문 ({TYPE_MAP[selectedReport.rptTypeCd]})
                </p>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 space-y-2 max-h-40 overflow-y-auto">
                  {selectedReport.rptTypeCd === "RPT002" && (
                    <div className="font-bold text-gray-900 border-b border-gray-200 pb-2">
                      {selectedReport.reportedTitle}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-600">
                    {selectedReport.reportedContent}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><strong>신고자:</strong> {selectedReport.reporterName}</p>
                <p><strong>신고일:</strong> {new Date(selectedReport.rptRegDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end bg-gray-50">
              {selectedReport.rptStatusCd === "RST001" && (
                <>
                  <button onClick={() => handleUpdateStatus(selectedReport.rptNo, "RST004")} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">
                    반려
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedReport.rptNo, "RST003")} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition">
                    확인 및 블라인드 (처리완료)
                  </button>
                </>
              )}
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}