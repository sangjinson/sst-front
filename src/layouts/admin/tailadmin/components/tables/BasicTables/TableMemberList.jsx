import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import api from "@api/axios";

export default function TableMemberList() {
  // 🚀 상태 관리
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  // 🚀 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/admin/members");
        setMembers(response.data.data);
      } catch (error) {
        console.error("회원 목록 조회 실패:", error);
      }
    };
    fetchMembers();
  }, []);

  // 🚀 체크박스 로직
  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(members.map((m) => m.mbrId));
    }
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // 🚀 강제 탈퇴 처리
  const handleDelete = async (mbrId) => {
    if (!window.confirm("정말 이 회원을 탈퇴 처리하시겠습니까?")) return;
    try {
      await api.delete(`/admin/members/${mbrId}`);
      setMembers((prev) => prev.filter((m) => m.mbrId !== mbrId));
      alert("회원이 탈퇴 처리되었습니다.");
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* 테이블 헤더 */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded border-gray-300" />
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                회원 정보
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                연락처 / 주소
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                권한
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                가입일
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                관리
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* 테이블 바디 */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {members.map((m) => (
              <TableRow key={m.mbrId} className={selected.includes(m.mbrId) ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}>
                <TableCell className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(m.mbrId)}
                    onChange={() => toggleOne(m.mbrId)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    {/* 프로필 이미지가 없다면 기본 아이콘이나 첫글자로 대체 가능 */}
                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-800">
                       <span className="font-semibold text-gray-500">{m.mbrName[0]}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {m.mbrName} ({m.mbrNickname})
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {m.mbrEmail}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <span className="block text-gray-800 text-theme-sm dark:text-white/90">{m.mbrTelno}</span>
                  <span className="block text-gray-500 text-theme-xs truncate max-w-[200px]" title={m.mbrAddr}>
                    [{m.mbrZip}] {m.mbrAddr}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={m.mbrAuthCd === "ROLE_ADMIN" ? "error" : "success"}
                  >
                    {m.mbrAuthCd === "ROLE_ADMIN" ? "관리자" : "일반회원"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {new Date(m.mbrJoinDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <button
                    onClick={() => handleDelete(m.mbrId)}
                    className="text-error-500 hover:text-error-600 font-medium text-theme-xs underline"
                  >
                    강제탈퇴
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}