import React, { useState, useEffect } from "react";
import api from "@api/axios";

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import { TrashBinIcon } from "@themeadmin/icons";

export default function AdminCommentList() {
  const [comments, setComments] = useState([]);
  const [useYnFilter, setUseYnFilter] = useState('Y');
  const [searchType, setSearchType] = useState('content');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchComments = async (overrides = {}) => {
    try {
      const response = await api.get('/admin/comments', {
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter
        }
      });
      
      const responseData = response.data.data || response.data; 
      setComments(responseData.list || responseData.content || responseData || []); 
      setTotalCount(responseData.totalCount || responseData.total || responseData.length || 0);
    } catch (error) {
      console.error("댓글 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, useYnFilter]); 

  const handleSearch = () => {
    if (page === 1) fetchComments();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchType('content');
    setSearchKeyword('');
    if (page === 1) setTimeout(() => fetchComments({ searchType: 'content', keyword: '', useYn: useYnFilter, page: 1 }), 0); 
    else setPage(1);
  };

  const handleToggleStatus = async (cmtNo, nextStatus, actionText) => {
    if (!window.confirm(`정말 이 댓글을 ${actionText} 하시겠습니까?`)) return;

    try {
      await api.patch(`/admin/comments/${cmtNo}/status`, null, {
        params: { useYn: nextStatus }
      });
      alert(`성공적으로 ${actionText} 되었습니다.`);
      if (comments.length === 1 && page > 1) setPage(page - 1); 
      else fetchComments(); 
    } catch (error) {
      console.error("댓글 상태 변경 에러:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const getEmptyMessage = () => {
    if (useYnFilter === 'N') return "휴지통이 비어 있습니다.";
    if (useYnFilter === 'B') return "신고 누적된 댓글이 없습니다.";
    return "등록된 댓글이 없거나 검색 결과가 없습니다.";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">댓글 관리</h2>
          <p className="text-sm text-gray-500">전체 댓글 수: <span className="font-bold text-blue-600">{totalCount}</span>개</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button onClick={() => { setUseYnFilter('Y'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${useYnFilter === 'Y' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>운영 중인 댓글</button>
        <button onClick={() => { setUseYnFilter('N'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${useYnFilter === 'N' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>휴지통 🗑️</button>
        <button onClick={() => { setUseYnFilter('B'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${useYnFilter === 'B' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>신고 누적 🚨</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03]">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm outline-none dark:bg-gray-800 dark:text-white">
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="검색어를 입력하세요" className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm outline-none dark:bg-gray-800 dark:text-white" />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800">조회</button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">초기화</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center w-16">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">댓글 내용</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-32">작성자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-40">등록일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">관리</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
                {comments.length === 0 ? (
                  <TableRow><td colSpan={5} className="px-5 py-16 text-center text-gray-500 font-medium">{getEmptyMessage()}</td></TableRow>
                ) : (
                  comments.map((c, idx) => (
                    // 🚀 수정 1: c.cmtNo -> c.cmntNo (고유 키값 복구)
                    <TableRow key={c.cmntNo} className="hover:bg-gray-50/50">
                      <TableCell className="px-5 py-4 text-center text-gray-500">
                        {(page - 1) * size + idx + 1}
                      </TableCell>
                      
                      <TableCell className="px-5 py-4 text-sm text-gray-600">
                        {/* 🚀 수정 2: c.cmtContent -> c.cmntContent (이게 없어서 내용이 안 보였던 걸세!) */}
                        <p className="line-clamp-2" title={c.cmntContent}>{c.cmntContent}</p>
                      </TableCell>
                      
                      <TableCell className="px-5 py-4 text-center text-sm font-medium">
                        {c.nickname}
                      </TableCell>
                      
                      <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                        {/* 🚀 수정 3: c.cmtRegDate -> c.cmntRegDate */}
                        {c.cmntRegDate}
                      </TableCell>
                      
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          {/* 🚀 수정 4: 버튼 클릭 시 넘겨주는 ID값도 c.cmntNo로 변경 */}
                          {useYnFilter === 'Y' && (
                            <button 
                              onClick={() => handleToggleStatus(c.cmntNo, 'N', '휴지통으로 이동')} 
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          )}
                          
                          {useYnFilter === 'N' && (
                            <button 
                              onClick={() => handleToggleStatus(c.cmntNo, 'Y', '정상 복구')} 
                              className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                            >
                              복구하기
                            </button>
                          )}
                          
                          {useYnFilter === 'B' && (
                            <button 
                              onClick={() => handleToggleStatus(c.cmntNo, 'Y', '블라인드 해제 및 복구')} 
                              className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                            >
                              블라인드 해제
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
          </Table>
        </div>
      </div>
      <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}