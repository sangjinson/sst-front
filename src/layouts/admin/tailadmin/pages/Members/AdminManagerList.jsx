import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@api/axios";

// 🚀 공통화한 훅과 컴포넌트 임포트
import { usePagination } from "@hooks/usePagination";
import { useAuth } from "@hooks/useAuth"; // 🚀 본인 계정 보호를 위해 현재 로그인 정보 가져오기
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";
import { PlusIcon, TrashBinIcon } from "@themeadmin/icons";

export default function AdminManagerList() {
  const navigate = useNavigate();
  const { user } = useAuth(); // 🚀 전역 상태에서 현재 로그인한 관리자 정보 추출
  
  const [managers, setManagers] = useState([]);
  
  // 🚀 삭제됨: 체크박스 관련 상태 (selected, allChecked)

  const [searchType, setSearchType] = useState('email');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [useYnFilter, setUseYnFilter] = useState(''); 

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  // 🚀 1. 관리자 목록 조회 (Override 패턴 적용 & authCd 강제 주입)
  const fetchManagers = async (overrides = {}) => {
    try {
      const response = await api.get('/admin/members', {
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter,
          // 🚀 백엔드에 '관리자(ROLE_ADMIN)'만 달라고 명시적으로 요청!
          authCd: 'ROLE_ADMIN' 
        }
      });
      
      setManagers(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error("관리자 목록 조회 실패:", error);
    }
  };

  // 페이지 이동 시 데이터 갱신
  useEffect(() => {
    fetchManagers();
    // 🚀 삭제됨: 체크박스 상태 초기화 로직
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  // 🚀 2. 상태 셀렉트 박스 변경 시 즉시 조회
  const handleUseYnChange = (e) => {
    const newVal = e.target.value;
    setUseYnFilter(newVal); 
    setPage(1); 
    fetchManagers({ useYn: newVal, page: 1 });
  };

  // 🚀 3. 조회 버튼
  const handleSearch = () => {
    setPage(1);
    fetchManagers({ page: 1 }); 
  };

  // 🚀 4. 초기화 버튼: 클릭 즉시 빈 값으로 API 조회!
  const handleResetSearch = () => {
    setSearchType('email');
    setSearchKeyword('');
    setUseYnFilter('');
    setPage(1);
    fetchManagers({ searchType: 'email', keyword: '', useYn: '', page: 1 });
  };

  // 🚀 삭제됨: toggleAll, toggleOne 함수

  // 🚀 5. 상태 변경 로직
  const handleToggleStatus = async (mbrId, currentStatus) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const actionText = newStatus === 'Y' ? '활성화' : '정지';

    if (!window.confirm(`정말 이 관리자의 계정을 ${actionText} 처리하시겠습니까?`)) return;

    try {
      await api.put(`/admin/members/${mbrId}`, { mbrUseYn: newStatus });
      alert(`관리자 계정이 ${actionText} 처리되었습니다.`);
      fetchManagers(); 
    } catch (error) {
      console.error("상태 변경 에러:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 🚀 6. 강제 탈퇴 (삭제) 로직
  const handleDelete = async (mbrId) => {
    if (!window.confirm("정말 이 관리자를 강제 탈퇴 처리하시겠습니까?\n(개인정보가 마스킹 처리됩니다.)")) return;
    try {
      await api.delete(`/admin/members/${mbrId}`);
      alert("관리자가 탈퇴 처리되었습니다.");
      if (managers.length === 1 && page > 1) setPage(page - 1); 
      else fetchManagers(); 
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">관리자 계정 관리</h2>
          <p className="text-sm text-gray-500">
            등록된 관리자 수: <span className="font-bold text-red-500">{totalCount}</span>명
          </p>
        </div>
        
        {/* 🚀 관리자 추가 버튼 */}
        <button 
          onClick={() => navigate("/admin/managers/create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
        >
          <PlusIcon className="w-5 h-5 text-white shadow-sm" /> 관리자 추가
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        
        <select
          value={useYnFilter}
          onChange={handleUseYnChange}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer"
        >
          <option value="">전체 상태</option>
          <option value="Y">정상 (활성)</option>
          <option value="N">정지 (비활성)</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="email">이메일</option>
          <option value="name">이름</option>
          <option value="phone">연락처</option>
        </select>
        
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어를 입력하세요"
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
                {/* 🚀 삭제됨: 전체 선택 체크박스 열 */}
                <TableCell isHeader className="px-5 py-3 text-center">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">관리자 정보</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">연락처 / 주소</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">권한</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">상태</TableCell> 
                <TableCell isHeader className="px-5 py-3 text-center">가입일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {managers.length === 0 ? (
                <TableRow>
                  {/* 🚀 수정됨: 체크박스 열이 빠졌으므로 colSpan을 8에서 7로 변경 */}
                  <TableCell colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                managers.map((m) => {
                  // 🚀 현재 로그인한 관리자 본인인지 확인하는 로직
                  const isMe = user?.mbrId === m.mbrId;

                  return (
                    <TableRow key={m.mbrId} className={`transition-colors ${isMe ? 'bg-orange-50/30' : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.01]'}`}>
                      {/* 🚀 삭제됨: 개별 체크박스 열 */}
                      <TableCell className="px-5 py-4 text-center text-gray-500">{m.mbrId}</TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full font-bold">
                            {m.mbrName ? m.mbrName[0] : "?"}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 dark:text-white/90">
                              {m.mbrName} {isMe && <span className="text-xs text-orange-500 font-bold ml-1">(나)</span>}
                            </span>
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
                        <Badge color="error">
                          관리자
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <Badge color={m.mbrUseYn === "Y" ? "success" : "warning"}>
                          {m.mbrUseYn === "Y" ? "정상" : "정지"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                        {new Date(m.mbrJoinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* 🚀 본인 계정이 아닐 때만 정지/삭제 버튼 노출 */}
                          {!isMe ? (
                            <>
                              <button 
                                onClick={() => handleToggleStatus(m.mbrId, m.mbrUseYn)}
                                className={`p-2 rounded-lg transition ${
                                  m.mbrUseYn === 'Y' 
                                    ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                                    : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                }`}
                                title={m.mbrUseYn === 'Y' ? '계정 정지' : '계정 활성화'}
                              >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                  <line x1="12" y1="2" x2="12" y2="12"></line>
                                </svg>
                              </button>

                              <button 
                                onClick={() => handleDelete(m.mbrId)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" 
                                title="강제탈퇴"
                              >
                                <TrashBinIcon className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 font-semibold px-2 py-1 bg-gray-100 rounded-md">보호됨</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}