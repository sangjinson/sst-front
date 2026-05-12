import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 🚀 useParams 추가
import api from "@api/axios";

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@themeadmin/icons";

export default function AdminPlaceList() {
  const navigate = useNavigate();
  
  // 🚀 1. URL 파라미터에서 현재 카테고리 타입을 가져옵니다 (see, food, sleep, play)
  const { type } = useParams(); 

  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  // 🚀 2. 타입에 따라 화면에 보여줄 텍스트 매핑 객체
  const typeConfig = {
    see: { title: "볼거리", placeholder: "볼거리 장소명을 입력하세요" },
    food: { title: "먹거리", placeholder: "식당, 카페명을 입력하세요" },
    sleep: { title: "잘거리", placeholder: "호텔, 펜션명을 입력하세요" },
    play: { title: "놀거리", placeholder: "테마파크, 체험명을 입력하세요" }
  };
  
  const currentConfig = typeConfig[type] || typeConfig.see;

  const fetchPlaces = async () => {
    try {
      // 🚀 3. API 요청 URL을 동적으로 생성합니다. (/api/admin/food/list 등)
      const response = await api.get(`/admin/${type}/list`, {
        params: {
          page,
          size,
          keyword: searchKeyword,
        }
      });
      
      setPlaces(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error(`${currentConfig.title} 목록 조회 실패:`, error);
    }
  };

  // 🚀 1. 카테고리(type)가 바뀔 때만! 상태를 초기화합니다.
  useEffect(() => {
    setSearchKeyword(''); // 카테고리 이동 시 검색어 초기화
    if (page !== 1) {
      setPage(1); // 🚀 현재 1페이지가 아닐 때만 1로 변경하여 불필요한 렌더링을 막습니다.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // 🚀 2. 실제 데이터 패칭은 page나 type이 확정된 이후에만 실행합니다.
  useEffect(() => {
    // 💡 여기서 setPage(1)을 절대 호출하면 안 됩니다!
    fetchPlaces();
    setAllChecked(false);
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

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

  const handleDelete = async (plcNo) => {
    if (!window.confirm("정말 이 장소를 삭제하시겠습니까?")) return;
    try {
      // 🚀 5. 삭제 API도 동적으로 호출
      await api.delete(`/admin/${type}/${plcNo}`);
      alert("삭제 완료되었습니다.");
      
      if (places.length === 1 && page > 1) setPage(page - 1); 
      else fetchPlaces(); 
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {/* 🚀 동적 텍스트 적용 */}
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
                <TableCell isHeader className="px-5 py-3 text-center">평점</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {places.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    검색 결과가 없습니다.
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
                      <Badge color="warning">★ {p.plcAvgRating ? p.plcAvgRating.toFixed(1) : "0.0"}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 🚀 6. 수정 페이지 이동 라우팅도 동적으로 처리 */}
                        <button 
                          onClick={() => navigate(`/admin/area/${type}/${p.plcNo}`)}
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" 
                          title="수정"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.plcNo)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="삭제"
                        ><TrashBinIcon className="w-5 h-5" /></button>
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