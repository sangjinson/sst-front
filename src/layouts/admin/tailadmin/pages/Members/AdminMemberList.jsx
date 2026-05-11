import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@api/axios";

// 🚀 공통화한 훅과 컴포넌트 임포트
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@themeadmin/icons"; // Chevron 아이콘은 Pagination으로 빼서 삭제

export default function AdminMemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  // 🚀 1. 커스텀 훅 하나로 지저분한 페이징 상태 관리 끝!
  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchMembers = async () => {
    try {
      // 🚀 2. 백엔드에 페이징 정보를 넘겨 서버단 페이징 처리
      const response = await api.get(`/admin/members?page=${page}&size=${size}`);
      
      // 백엔드에서 10개만 주므로 slice 같은 클라이언트 자르기 불필요!
      setMembers(response.data.data.list || response.data.data); 
      setTotalCount(response.data.total || response.data.data.length);
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  // page가 변경될 때마다 데이터 재호출
  useEffect(() => {
    fetchMembers();
    setAllChecked(false);
    setSelected([]);
  }, [page]); 

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(members.map((m) => m.mbrId)); // 현재 보이는 10명만 전체 선택
    }
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleDelete = async (mbrId) => {
    if (!window.confirm("정말 이 회원을 탈퇴 처리하시겠습니까?")) return;
    try {
      await api.delete(`/admin/members/${mbrId}`);
      alert("회원이 탈퇴 처리되었습니다.");
      
      // 🚀 3. 현재 페이지에 아이템이 1개 남았을 때 삭제하면, 이전 페이지로 이동
      if (members.length === 1 && page > 1) {
        setPage(page - 1); 
      } else {
        fetchMembers(); 
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            회원 목록
          </h2>
          <p className="text-sm text-gray-500">
            전체 회원 수: <span className="font-bold text-blue-600">{totalCount}</span>명
          </p>
        </div>
        <button 
          onClick={() => navigate("/admin/members/create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <PlusIcon className="w-5 h-5 text-white shadow-sm" /> 회원 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">회원 정보</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">연락처 / 주소</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">권한</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">가입일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {members.map((m) => (
                <TableRow key={m.mbrId} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <TableCell className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(m.mbrId)}
                      onChange={() => toggleOne(m.mbrId)}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-gray-500">{m.mbrId}</TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {m.mbrName ? m.mbrName[0] : "?"}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">{m.mbrName}</span>
                        <span className="block text-xs text-gray-500">{m.mbrEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className="block text-sm text-gray-800 dark:text-white/90">{m.mbrTelno}</span>
                    <span className="block text-xs text-gray-500 truncate max-w-[180px]" title={m.mbrAddr}>
                      {m.mbrAddr}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <Badge color={m.mbrAuthCd === "ROLE_ADMIN" ? "error" : "success"}>
                      {m.mbrAuthCd === "ROLE_ADMIN" ? "관리자" : "일반"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                    {new Date(m.mbrJoinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate("/admin/members/update", { state: { member: m } })}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" 
                        title="수정"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.mbrId)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" 
                        title="강제탈퇴"
                      >
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

      {/* 🚀 5. 분리한 페이지네이션 컴포넌트 하나로 UI 완벽 교체! */}
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