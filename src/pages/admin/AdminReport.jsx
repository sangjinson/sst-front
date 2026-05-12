// src/pages/admin/AdminReport.jsx
import React, { useState, useEffect } from 'react';
import api from '@api/axios';
import Pagination from '@components/common/AdminPagination';
import ReportDetailModal from './ReportDetailModal'; // 🚀 분리된 모달 임포트

const AdminReport = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 🚀 다중 필터 및 검색 상태 관리
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); 
  const [searchType, setSearchType] = useState('reporter'); 
  const [searchInput, setSearchInput] = useState(''); 
  const [keyword, setKeyword] = useState(''); 

  // 🚀 모달에 넘길 선택된 리포트 상태
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports', {
        params: { 
          page, 
          size: 10, 
          statusCd: statusFilter,
          rptTypeCd: typeFilter,
          searchType: searchType,
          keyword: keyword 
        }
      });
      setReports(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      alert('신고 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, statusFilter, typeFilter, keyword]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleProcess = async (rptNo, newStatusCd) => {
    const actionText = newStatusCd === 'RST003' ? '신고를 승인하고 게시물을 숨김' : '신고를 반려';
    if (!window.confirm(`정말로 ${actionText} 처리하시겠습니까?`)) return;
    
    try {
      await api.put(`/admin/reports/${rptNo}/status`, null, { params: { statusCd: newStatusCd } });
      alert('정상적으로 처리되었습니다.');
      
      setSelectedReport(null); // 🚀 모달 닫기
      fetchReports(); // 🚀 목록 갱신
    } catch (error) {
      alert('처리에 실패했습니다.');
    }
  };

  const getStatusLabel = (code) => {
    const map = { 'RST001': '접수 대기', 'RST002': '처리중', 'RST003': '처리 완료', 'RST004': '반려' };
    return map[code] || code;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      <h2 className="text-xl font-bold mb-6 text-gray-800">신고 관리</h2>

      {/* 검색 및 필터 바 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        
        {/* 좌측: 드롭다운 필터들 */}
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          >
            <option value="">상태: 전체</option>
            <option value="RST001">접수 대기</option>
            <option value="RST003">처리 완료</option>
            <option value="RST004">반려</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          >
            <option value="">유형: 전체</option>
            <option value="RPT001">리뷰</option>
            <option value="RPT002">커뮤니티</option>
            <option value="RPT003">댓글</option>
          </select>
        </div>

        {/* 우측: 검색 영역 */}
        <div className="flex items-center gap-2">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          >
            <option value="reporter">신고자명</option>
            <option value="content">신고 내용</option>
          </select>
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="px-3 py-2 w-48 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          />
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            검색
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-t border-gray-200">
            <tr>
              <th className="py-3 px-4">번호</th>
              <th className="py-3 px-4">대상유형</th>
              <th className="py-3 px-4">신고사유</th>
              <th className="py-3 px-4">신고자</th>
              <th className="py-3 px-4">등록일</th>
              <th className="py-3 px-4">상태</th>
              <th className="py-3 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((rpt) => (
              <tr key={rpt.rptNo} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                <td className="py-3 px-4 text-gray-500">{rpt.rptNo}</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                    {rpt.rptTypeCd === 'RPT001' ? '리뷰' : rpt.rptTypeCd === 'RPT002' ? '커뮤니티' : '댓글'}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-gray-800 max-w-[200px] truncate">
                  {rpt.rptReasonCd === 'RSN003' ? rpt.rptReasonContent : (rpt.rptReasonCd === 'RSN001' ? '스팸/홍보' : '욕설/비방')}
                </td>
                <td className="py-3 px-4 text-gray-600">{rpt.reporterName}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(rpt.rptRegDate).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold inline-block whitespace-nowrap ${
                    rpt.rptStatusCd === 'RST001' ? 'bg-orange-100 text-orange-600' : 
                    rpt.rptStatusCd === 'RST003' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getStatusLabel(rpt.rptStatusCd)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {/* 🚀 상세 보기 버튼 클릭 시 모달 오픈 */}
                  <button 
                    onClick={() => setSelectedReport(rpt)} 
                    className="bg-gray-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-700 shadow-sm transition"
                  >
                    상세 보기
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">조회된 신고 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* 🚀 상세 보기 모달 렌더링 */}
      <ReportDetailModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
        onProcess={handleProcess} 
      />
    </div>
  );
};

export default AdminReport;