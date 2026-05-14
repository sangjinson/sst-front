import React, { useState, useEffect } from "react";
import api from "@api/axios";

// 🚀 공통화한 훅과 컴포넌트 임포트 (리뷰 관리와 완전 동일)
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { TrashBinIcon } from "@themeadmin/icons";

export default function AdminComment() {
  const [comments, setComments] = useState([]);

  // 🚀 1. 상태 필터 기본값: Y(운영 중), N(휴지통), B(신고 누적)
  const [useYnFilter, setUseYnFilter] = useState('Y');
  
  const [searchType, setSearchType] = useState('content');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchComments = async (overrides = {}) => {
    try {
      const response = await api.get('/admin/comments/list', { // 🚀 Endpoint를 /list로 통일 권장
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter // 🚀 'Y', 'N', 'B' 전송
        }
      });
      
      setComments(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
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

  // 🚀 2. 삭제 / 복구 토글 로직 (B 상태에서도 복구 가능하도록 처리)
  const handleToggleStatus = async (cmntNo, currentStatus) => {
    // 🚀 휴지통('N')이나 블라인드('B') 상태에서는 무조건 'Y'로 복구
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const actionText = currentStatus === 'Y' ? '휴지통으로 이동' : '복구';

    if (!window.confirm(`정말 이 댓글을 ${actionText} 하시겠습니까?\n(게시글의 댓글 수도 자동 동기화됩니다)`)) return;

    try {
      await api.patch(`/admin/comments/${cmntNo}/status`, null, {
        params: { useYn: nextStatus }
      });
      alert(`성공적으로 ${actionText} 되었습니다.`);
      
      if (comments.length === 1 && page > 1) setPage(page - 1); 
      else fetchComments(); 
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            댓글 관리
          </h2>
          <p className="text-sm text-gray-500">
            전체 댓글 수: <span className="font-bold text-emerald-600">{totalCount}</span>개
          </p>
        </div>
      </div>

      {/* 🚀 3. 3가지 탭 UI 구성 (운영 중 / 휴지통 / 신고 누적) */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 flex-wrap">
        <button
          onClick={() => { setUseYnFilter('Y'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'Y' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          운영 중인 댓글
        </button>
        <button
          onClick={() => { setUseYnFilter('N'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors flex items-center gap-1 ${
            useYnFilter === 'N' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          휴지통 🗑️
        </button>
        <button
          onClick={() => { setUseYnFilter('B'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors flex items-center gap-1 ${
            useYnFilter === 'B' ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🚨 블라인드 (신고 누적)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500"
        >
          <option value="content">내용</option>
          <option value="reporter">작성자</option>
          <option value="title">원문 제목</option>
        </select>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어를 입력하세요"
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500"
        />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">조회</button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">초기화</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 border-b border-gray-100">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center w-16">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start w-48">원문 제목</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">댓글 내용</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-28">작성자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-32">등록일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">상태</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {comments.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500 font-medium">
                    {/* 🚀 4. 빈 목록 메시지 세분화 */}
                    {useYnFilter === 'Y' && "운영 중인 댓글이 없습니다."}
                    {useYnFilter === 'N' && "휴지통이 비어 있습니다."}
                    {useYnFilter === 'B' && "신고 누적으로 블라인드된 댓글이 없습니다."}
                  </td>
                </TableRow>
              ) : (
                comments.map((c, idx) => (
                  <TableRow key={c.cmntNo} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-5 py-4 text-center text-gray-500">{(page - 1) * size + idx + 1}</TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-gray-800">
                      <p className="line-clamp-1" title={c.commTitle}>{c.commTitle}</p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600">
                      <p className="line-clamp-2" title={c.cmntContent}>{c.cmntContent}</p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-sm font-medium">{c.mbrNickname}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                      {c.cmntRegDate ? c.cmntRegDate.substring(0, 10) : ''}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <Badge color={useYnFilter === 'Y' ? "success" : "error"}>
                        {useYnFilter === 'Y' ? '정상' : '삭제됨'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        {useYnFilter === 'Y' ? (
                          <button 
                            onClick={() => handleToggleStatus(c.cmntNo, 'Y')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="휴지통으로 이동"
                          >
                            <TrashBinIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(c.cmntNo, useYnFilter)} // 'N' 또는 'B' 전달
                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                          >
                            복구하기
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