import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@api/axios";

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@themeadmin/icons";

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
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            {currentConfig.title} 관리
          </h2>
          <p className="text-sm text-gray-500">
            전체 {currentConfig.title} 수: <span className="font-bold text-blue-600">{totalCount}</span>개
          </p>
        </div>
        <button 
          onClick={() => navigate(`/admin/area/${type}/create`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <PlusIcon className="w-5 h-5 text-white shadow-sm" /> {currentConfig.title} 추가
        </button>
      </div>

      {/* 🚀 5. 정상 목록 / 휴지통 탭 UI 추가 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => { setUseYnFilter('Y'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'Y' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          운영 중인 장소
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
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={currentConfig.placeholder}
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">조회</button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">초기화</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">장소명</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">주소</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">상태</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {places.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    {useYnFilter === 'N' ? "휴지통이 비어 있습니다." : "검색 결과가 없습니다."}
                  </TableCell>
                </TableRow>
              ) : (
                places.map((p) => (
                  <TableRow key={p.plcNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <TableCell className="px-5 py-4 text-center">
                      <input type="checkbox" checked={selected.includes(p.plcNo)} onChange={() => toggleOne(p.plcNo)} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500">{p.plcNo}</TableCell>
                    <TableCell className="px-5 py-4"><span className="block font-medium text-gray-800 dark:text-white/90">{p.plcName}</span></TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="block text-sm text-gray-800 dark:text-white/90 truncate max-w-[200px]" title={p.plcAddr}>{p.plcAddr}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <Badge color={useYnFilter === 'Y' ? "success" : "error"}>
                        {useYnFilter === 'Y' ? "운영 중" : "삭제됨"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 🚀 6. 정상 탭에서는 [수정], [삭제] 버튼 / 휴지통 탭에서는 [복구] 버튼 렌더링 */}
                        {useYnFilter === 'Y' ? (
                          <>
                            <button 
                              onClick={() => navigate(`/admin/area/${type}/${p.plcNo}`)}
                              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" 
                              title="수정"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(p.plcNo, 'Y')}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" 
                              title="휴지통으로 이동"
                            >
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(p.plcNo, 'N')}
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