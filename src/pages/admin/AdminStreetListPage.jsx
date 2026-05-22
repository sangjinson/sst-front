import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@api/axios";

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/admin/AdminPagination";

import { PlusIcon, PencilIcon, TrashBinIcon } from "@components/icon";

export default function AdminPlaceList() {
  const navigate = useNavigate();
  const { type } = useParams(); 

  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 🚀 1. 상태 필터 기본값을 'Y'(운영 중)로 세팅. 'N'이면 휴지통!
  const [useYnFilter, setUseYnFilter] = useState('Y');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const typeConfig = {
    see: { title: "볼거리", placeholder: "볼거리 장소명을 입력하세요" },
    food: { title: "먹거리", placeholder: "식당, 카페명을 입력하세요" },
    sleep: { title: "잘거리", placeholder: "호텔, 펜션명을 입력하세요" },
    play: { title: "놀거리", placeholder: "테마파크, 체험명을 입력하세요" }
  };
  
  const currentConfig = typeConfig[type] || typeConfig.see;

  const fetchPlaces = async () => {
    try {
      const response = await api.get(`/admin/${type}/list`, {
        params: {
          page,
          size,
          keyword: searchKeyword,
          useYn: useYnFilter // 🚀 2. 백엔드로 현재 탭의 상태값 전달
        }
      });
      
      setPlaces(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error(`${currentConfig.title} 목록 조회 실패:`, error);
    }
  };

  useEffect(() => {
    setSearchKeyword('');
    setUseYnFilter('Y'); // 🚀 카테고리(type)가 바뀔 때 무조건 정상 탭으로 초기화
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    fetchPlaces();
    setAllChecked(false);
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, useYnFilter]); // 🚀 3. useYnFilter가 바뀔 때도 데이터 갱신

  const handleSearch = () => {
    if (page === 1) fetchPlaces();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    if (page === 1) setTimeout(() => fetchPlaces(), 0); 
    else setPage(1);
  };

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(places.map((p) => p.plcNo)); 
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  // 🚀 4. 물리 삭제 대신 '상태 토글(휴지통 이동 및 복구)' 로직으로 변경
  const handleToggleStatus = async (plcNo, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const actionText = currentStatus === 'Y' ? '휴지통으로 이동' : '복구';

    if (!window.confirm(`정말 이 장소를 ${actionText} 하시겠습니까?`)) return;

    try {
      // 🚀 PATCH 메서드를 사용하여 상태값만 부분 업데이트
      await api.patch(`/admin/${type}/${plcNo}/status`, null, {
        params: { useYn: nextStatus }
      });
      
      alert(`성공적으로 ${actionText} 되었습니다.`);
      if (places.length === 1 && page > 1) setPage(page - 1); 
      else fetchPlaces(); 
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {/* 🚀 dark:text-gray-100으로 통일성 부여 */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {currentConfig.title} 관리
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              전체 {currentConfig.title} 수: <span className="font-bold text-[#0F9B73]">{totalCount}</span>개
            </p>
          </div>
          
          {/* 🚀 bg-blue-600 -> bg-[#0F9B73] (청록색)으로 통일 */}
          <button 
            onClick={() => navigate(`/admin/area/${type}/create`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0c8261] shadow-sm"
          >
            <PlusIcon className="w-5 h-5 text-white shadow-sm" /> {currentConfig.title} 추가
          </button>
        </div>

        {/* 🚀 탭 UI 색상 테마 수정 (청록색 계열로 통일) */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button
            onClick={() => { setUseYnFilter('Y'); setPage(1); }}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
              useYnFilter === 'Y' 
                ? 'bg-[#0F9B73] text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            운영 중인 장소
          </button>
          <button
            onClick={() => { setUseYnFilter('N'); setPage(1); }}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
              useYnFilter === 'N' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            휴지통 🗑️
          </button>
        </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={currentConfig.placeholder}
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex gap-2">
          <button 
            onClick={handleSearch} 
            className="px-5 h-10 bg-[#0F9B73] text-white text-sm font-semibold rounded-lg hover:bg-[#0c8261] shadow-sm"
          >
            조회
          </button>
          
          <button 
            onClick={handleResetSearch} 
            className="px-5 h-10 bg-gray-900 border border-gray-700 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-800 shadow-sm"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
              <tr>
                <th className="px-5 py-3 text-center">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="cursor-pointer" />
                </th>
                <th className="px-5 py-3 text-center">No</th>
                <th className="px-5 py-3 text-start">장소명</th>
                <th className="px-5 py-3 text-start">주소</th>
                <th className="px-5 py-3 text-center">상태</th>
                <th className="px-5 py-3 text-center">관리</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {places.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                    {useYnFilter === 'N' ? "휴지통이 비어 있습니다." : "검색 결과가 없습니다."}
                  </td>
                </tr>
              ) : (
                // 🚀 { } 대신 ( ) 를 사용하여 JSX를 즉시 반환하도록 수정
                places.map((p) => (
                  <tr key={p.plcNo} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-5 py-4 text-center">
                      <input type="checkbox" checked={selected.includes(p.plcNo)} onChange={() => toggleOne(p.plcNo)} className="cursor-pointer" />
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">{p.plcNo}</td>
                    <td className="px-5 py-4">
                      <span className="block font-medium text-gray-800 dark:text-gray-200">{p.plcName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block text-sm text-gray-800 dark:text-gray-300 truncate max-w-[200px]" title={p.plcAddr}>{p.plcAddr}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        useYnFilter === 'Y' 
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400" 
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                      }`}>
                        {useYnFilter === 'Y' ? "운영 중" : "삭제됨"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {useYnFilter === 'Y' ? (
                          <>
                            <button 
                              onClick={() => navigate(`/admin/area/${type}/${p.plcNo}`)}
                              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg" 
                              title="수정"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(p.plcNo, 'Y')}
                              className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-lg" 
                              title="휴지통으로 이동"
                            >
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(p.plcNo, 'N')}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F9B73] hover:bg-[#0c8261] rounded-lg shadow-sm"
                          >
                            복구하기
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