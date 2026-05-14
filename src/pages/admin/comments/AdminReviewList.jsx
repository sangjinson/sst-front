import React, { useState, useEffect } from "react";
import api from "@api/axios";

// 🚀 공통화한 훅과 컴포넌트 임포트
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { TrashBinIcon } from "@themeadmin/icons";

export default function AdminReviewList() {
  const [reviews, setReviews] = useState([]);

  // 🚀 1. 상태 필터 기본값을 'Y'(운영 중)로 세팅
  const [useYnFilter, setUseYnFilter] = useState('Y');
  
  const [searchType, setSearchType] = useState('content');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchReviews = async (overrides = {}) => {
    try {
      const response = await api.get('/admin/reviews', {
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter
        }
      });
      
      setReviews(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error("리뷰 목록 조회 실패:", error);
    }
  };

  // 🚀 2. 탭(useYnFilter)이나 페이지가 변경될 때마다 데이터 갱신
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, useYnFilter]); 

  const handleSearch = () => {
    if (page === 1) fetchReviews();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchType('content');
    setSearchKeyword('');
    // 초기화 시 현재 선택된 탭(휴지통 뷰 여부)은 유지
    if (page === 1) setTimeout(() => fetchReviews({ searchType: 'content', keyword: '', useYn: useYnFilter, page: 1 }), 0); 
    else setPage(1);
  };

  // 🚀 3. 삭제 / 복구 토글 로직
  const handleToggleStatus = async (rvwNo, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const actionText = currentStatus === 'Y' ? '휴지통으로 이동' : '복구';

    if (!window.confirm(`정말 이 리뷰를 ${actionText} 하시겠습니까?`)) return;

    try {
      await api.patch(`/admin/reviews/${rvwNo}/status`, null, {
        params: { useYn: nextStatus }
      });
      alert(`성공적으로 ${actionText} 되었습니다.`);
      
      // 삭제 후 현재 페이지에 데이터가 없으면 이전 페이지로 이동
      if (reviews.length === 1 && page > 1) setPage(page - 1); 
      else fetchReviews(); 
    } catch (error) {
      console.error("리뷰 상태 변경 에러:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            리뷰 관리
          </h2>
          <p className="text-sm text-gray-500">
            전체 리뷰 수: <span className="font-bold text-blue-600">{totalCount}</span>개
          </p>
        </div>
      </div>

      {/* 🚀 4. 정상 목록 / 휴지통 탭 UI 적용 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => { setUseYnFilter('Y'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'Y' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          운영 중인 리뷰
        </button>
        <button
          onClick={() => { setUseYnFilter('N'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'N' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          휴지통 🗑️
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        
        {/* 🚀 불필요한 상태 필터(셀렉트 박스) 제거됨 */}

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="content">내용</option>
          <option value="reporter">작성자</option>
          <option value="place">장소명</option>
        </select>
        
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="리뷰 내용이나 작성자를 검색하세요"
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {/* 🚀 체크박스 열 제거 */}
                <TableCell isHeader className="px-5 py-3 text-center w-16">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start w-48">장소명</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">리뷰 내용</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">작성자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">별점</TableCell> 
                <TableCell isHeader className="px-5 py-3 text-center w-32">등록일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center w-24">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {reviews.length === 0 ? (
                <TableRow>
                  {/* 🚀 수정: 커스텀 TableCell 대신 순수 <td> 태그를 사용하여 7칸 병합(colSpan) 강제 적용 */}
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-500 font-medium">
                    {useYnFilter === 'N' ? "휴지통이 비어 있습니다." : "검색 결과가 없습니다."}
                  </td>
                </TableRow>
              ) : (
                reviews.map((r, idx) => (
                  <TableRow key={r.rvwNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    
                    <TableCell className="px-5 py-4 text-center text-gray-500">
                      {(page - 1) * size + idx + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-gray-800">
                      {r.plcName}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600">
                      <p className="line-clamp-2" title={r.rvwContent}>{r.rvwContent}</p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-sm font-medium">
                      {r.nickname}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center text-orange-500 font-bold text-sm">
                        <span className="mr-1">★</span>{r.rvwRating}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                      {r.rvwRegDate ? r.rvwRegDate.substring(0, 10) : ''}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        {/* 🚀 5. 정상 탭에서는 [삭제(휴지통)] 버튼 / 휴지통 탭에서는 [복구] 버튼 렌더링 */}
                        {useYnFilter === 'Y' ? (
                          <button 
                            onClick={() => handleToggleStatus(r.rvwNo, 'Y')}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex items-center justify-center" 
                            title="휴지통으로 이동"
                          >
                            <TrashBinIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(r.rvwNo, 'N')}
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