import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@api/axios";

// 🚀 1. 우리가 만든 공통 페이징 훅과 컴포넌트 임포트
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@themeadmin/components/ui/table";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashBinIcon 
  // 🚀 2. Chevron 아이콘들은 AdminPagination 내부로 이동했으므로 여기서 삭제
} from "@themeadmin/icons";

export default function AdminStreetListPage() {
  const { type } = useParams(); // see, play, food, sleep 중 하나
  const navigate = useNavigate();
  
  const [list, setList] = useState([]);

  // 🚀 3. 커스텀 훅으로 페이징 상태 관리 대체 (기존 totalCount, currentPage 등 삭제)
  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  // 타입별 설정 (제목 및 테이블 헤더)
  const streetConfig = {
    food: { title: "맛집 리스트", path: "food", headers: ["ID", "식당명", "주요메뉴", "영업시간", "연락처"] },
    play: { title: "놀거리 리스트", path: "play", headers: ["ID", "명소명", "이용시간", "행사기간", "연락처"] },
    see: { title: "볼거리 리스트", path: "see", headers: ["ID", "장소명", "이용시간", "주소", "연락처"] },
    sleep: { title: "숙박 리스트", path: "sleep", headers: ["ID", "숙소명", "체크인/아웃", "예약여부", "연락처"] },
  };

  const currentConfig = streetConfig[type] || streetConfig.food;

  const fetchList = async () => {
    try {
      // 🚀 4. API 요청 시 훅에서 제공하는 page와 size 사용
      const response = await api.get(`/admin/${type}/list?page=${page}&size=${size}`);
      
      // 🚀 5. 백엔드가 PageResponse 공통 DTO를 적용했다고 가정하고 데이터 세팅
      // (만약 아직 백엔드 적용 전이라면 기존처럼 response.data.data, response.data.total 등을 사용하세요)
      const pageData = response.data.data;
      setList(pageData.list || pageData); 
      setTotalCount(pageData.totalCount || response.data.total || pageData.length);

    } catch (error) {
      console.error(`${currentConfig.title} 조회 실패:`, error);
    }
  };

  // 🚀 6. 탭(type)이 변경되면 무조건 1페이지로 강제 이동
  useEffect(() => {
    setPage(1); 
  }, [type]);

  // 🚀 7. page나 type이 변경될 때마다 데이터를 다시 불러옴
  useEffect(() => {
    fetchList();
  }, [page, type]);

  // 타입별 행(Row) 렌더링 로직 (기존과 동일)
  const renderRow = (item) => {
    switch (type) {
      case "food":
        return (
          <>
            <TableCell className="px-5 py-4 font-medium text-gray-800">{item.plcName}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.foodMenu}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.foodOpeningHours}</TableCell>
          </>
        );
      case "play":
        return (
          <>
            <TableCell className="px-5 py-4 font-medium text-gray-800">{item.plcName}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.playUsetime}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.playEventStart} ~ {item.playEventEnd}</TableCell>
          </>
        );
      case "see":
        return (
          <>
            <TableCell className="px-5 py-4 font-medium text-gray-800">{item.plcName}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.seeUsetime}</TableCell>
            <TableCell className="px-5 py-4 text-sm truncate max-w-[200px]">{item.plcAddr}</TableCell>
          </>
        );
      case "sleep":
        return (
          <>
            <TableCell className="px-5 py-4 font-medium text-gray-800">{item.plcName}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.sleepCheckIn} / {item.sleepCheckOut}</TableCell>
            <TableCell className="px-5 py-4 text-sm">{item.sleepReservation === "1" ? "가능" : "불가"}</TableCell>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">{currentConfig.title}</h2>
          <p className="text-sm text-gray-500">총 <span className="font-bold text-blue-600">{totalCount}</span> 건</p>
        </div>
        <button 
          onClick={() => navigate(`/admin/street/${type}/create`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <PlusIcon className="w-5 h-5 text-white" /> 정보 추가
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {currentConfig.headers.map((header, idx) => (
                  <TableCell key={idx} isHeader className={`px-5 py-3 ${idx === 0 ? "text-center" : "text-start"}`}>
                    {header}
                  </TableCell>
                ))}
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {list.map((item) => (
                <TableRow key={item.plcNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <TableCell className="px-5 py-4 text-center text-gray-500">{item.plcNo}</TableCell>
                  
                  {/* 공통 필드 외의 데이터는 렌더링 함수 사용 */}
                  {renderRow(item)}

                  <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">{item.plcTelno}</TableCell>
                  
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/street/${type}/update`, { state: { data: item } })}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" title="수정"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="삭제">
                        <TrashBinIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 🚀 8. 지저분한 페이징 UI 코드를 컴포넌트 하나로 완벽하게 교체! */}
      <AdminPagination 
        page={page} 
        size={size} 
        totalCount={totalCount} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
}