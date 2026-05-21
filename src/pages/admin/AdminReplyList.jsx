import React, { useState, useEffect } from "react";
import api from "@api/axios";
import { useParams, Navigate } from "react-router-dom";
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/admin/AdminPagination";
import { TrashBinIcon } from "@themeadmin/icons";

export default function AdminReplyList() {

    const { type } = useParams();
  // 🚀 type에 따른 설정값 동적 매핑
  const CONFIG = {
    comments: {
      title: "댓글",
      apiPath: "/admin/comments",
      idKey: "cmntNo",
      contentKey: "cmntContent",
      dateKey: "cmntRegDate",
      searchOptions: [
        { value: "content", label: "내용" },
        { value: "writer", label: "작성자" }
      ]
    },
    reviews: {
      title: "리뷰",
      apiPath: "/admin/reviews",
      idKey: "rvwNo",
      contentKey: "rvwContent",
      dateKey: "rvwRegDate",
      searchOptions: [
        { value: "content", label: "내용" },
        { value: "reporter", label: "작성자" },
        { value: "place", label: "장소명" }
      ]
    }
  };

  const currentConfig = CONFIG[type];
  if (!currentConfig) {
    return <Navigate to="/admin" replace />;
  }

  const [dataList, setDataList] = useState([]);
  const [useYnFilter, setUseYnFilter] = useState('Y');
  const [searchType, setSearchType] = useState('content');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchData = async (overrides = {}) => {
    try {
      const response = await api.get(currentConfig.apiPath, {
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter
        }
      });
      
      const responseData = response.data.data || response.data; 
      setDataList(responseData.list || responseData.content || responseData || []); 
      setTotalCount(responseData.totalCount || responseData.total || responseData.length || 0);
    } catch (error) {
      console.error(`${currentConfig.title} 목록 조회 실패:`, error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, useYnFilter, type]); 

  // 메뉴(type) 변경 시 초기화
  useEffect(() => {
    setUseYnFilter('Y');
    setSearchType('content');
    setSearchKeyword('');
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSearch = () => {
    if (page === 1) fetchData();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchType('content');
    setSearchKeyword('');
    if (page === 1) setTimeout(() => fetchData({ searchType: 'content', keyword: '', useYn: useYnFilter, page: 1 }), 0); 
    else setPage(1);
  };

  const handleToggleStatus = async (id, nextStatus, actionText) => {
    if (!window.confirm(`정말 이 ${currentConfig.title}을(를) ${actionText} 하시겠습니까?`)) return;

    try {
      await api.patch(`${currentConfig.apiPath}/${id}/status`, null, {
        params: { useYn: nextStatus }
      });
      alert(`성공적으로 ${actionText} 되었습니다.`);
      if (dataList.length === 1 && page > 1) setPage(page - 1); 
      else fetchData(); 
    } catch (error) {
      console.error(`${currentConfig.title} 상태 변경 에러:`, error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const getEmptyMessage = () => {
    if (useYnFilter === 'N') return "휴지통이 비어 있습니다.";
    if (useYnFilter === 'B') return `신고 누적된 ${currentConfig.title}이(가) 없습니다.`;
    return "검색 결과가 없습니다.";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentConfig.title} 관리</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            전체 {currentConfig.title} 수: <span className="font-bold text-[#0F9B73]">{totalCount}</span>개
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button onClick={() => { setUseYnFilter('Y'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg ${useYnFilter === 'Y' ? 'bg-[#0F9B73] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>운영 중인 {currentConfig.title}</button>
        <button onClick={() => { setUseYnFilter('N'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg ${useYnFilter === 'N' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>휴지통 🗑️</button>
        <button onClick={() => { setUseYnFilter('B'); setPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-t-lg ${useYnFilter === 'B' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>신고 누적 🚨</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="w-full sm:w-32 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 rounded-lg text-sm outline-none dark:border-gray-700 dark:text-gray-200 focus:border-[#0F9B73]">
          {currentConfig.searchOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="검색어를 입력하세요" className="flex-1 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 rounded-lg text-sm outline-none dark:border-gray-700 dark:text-gray-200 focus:border-[#0F9B73]" />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-[#0F9B73] text-white text-sm font-semibold rounded-lg hover:bg-[#0c8261] shadow-sm">조회</button>
          <button onClick={handleResetSearch} className="px-5 h-10 bg-gray-900 border border-gray-700 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-800 shadow-sm">초기화</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
              <tr>
                <th className="px-5 py-3 text-center w-16">No</th>
                {type === 'review' && <th className="px-5 py-3 text-start w-48">장소명</th>}
                <th className="px-5 py-3 text-start">{currentConfig.title} 내용</th>
                <th className="px-5 py-3 text-center w-24">작성자</th>
                {type === 'review' && <th className="px-5 py-3 text-center w-24">별점</th>}
                <th className="px-5 py-3 text-center w-32">등록일</th>
                <th className="px-5 py-3 text-center w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {dataList.length === 0 ? (
                  <tr><td colSpan={type === 'review' ? 7 : 5} className="px-5 py-16 text-center text-gray-500 dark:text-gray-400 font-medium">{getEmptyMessage()}</td></tr>
                ) : (
                  dataList.map((item, idx) => (
                    <tr key={item[currentConfig.idKey]} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                        {(page - 1) * size + idx + 1}
                      </td>
                      
                      {type === 'review' && (
                        <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-200">
                          {item.plcName}
                        </td>
                      )}
                      
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <p className="line-clamp-2" title={item[currentConfig.contentKey]}>{item[currentConfig.contentKey]}</p>
                      </td>
                      
                      <td className="px-5 py-4 text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.nickname}
                      </td>
                      
                      {type === 'review' && (
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center text-orange-500 font-bold text-sm">
                            <span className="mr-1">★</span>{item.rvwRating}
                          </div>
                        </td>
                      )}
                      
                      <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {item[currentConfig.dateKey] ? item[currentConfig.dateKey].substring(0, 10) : ''}
                      </td>
                      
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          {useYnFilter === 'Y' && (
                            <button 
                              onClick={() => handleToggleStatus(item[currentConfig.idKey], 'N', '휴지통으로 이동')} 
                              className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-lg flex items-center justify-center"
                              title="휴지통으로 이동"
                            >
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          )}
                          
                          {useYnFilter === 'N' && (
                            <button 
                              onClick={() => handleToggleStatus(item[currentConfig.idKey], 'Y', '정상 복구')} 
                              className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F9B73] hover:bg-[#0c8261] rounded-lg shadow-sm"
                            >
                              복구하기
                            </button>
                          )}
                          
                          {useYnFilter === 'B' && (
                            <button 
                              onClick={() => handleToggleStatus(item[currentConfig.idKey], 'Y', '블라인드 해제 및 복구')} 
                              className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F9B73] hover:bg-[#0c8261] rounded-lg shadow-sm"
                            >
                              블라인드 해제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </div>
      <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}