// 🚀 파일: src/pages/admin/Members/AdminMemberList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@api/axios";
import Swal from 'sweetalert2';

import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/common/AdminPagination";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@themeadmin/components/ui/table";
import Badge from "@themeadmin/components/ui/badge/Badge";

export default function AdminMemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  
  const [searchType, setSearchType] = useState('email');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [useYnFilter, setUseYnFilter] = useState(''); 

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  // 회원 목록 조회
  const fetchMembers = async (overrides = {}) => {
    try {
      const response = await api.get('/admin/members', {
        params: {
          page: overrides.page ?? page,
          size,
          searchType: overrides.searchType ?? searchType,
          keyword: overrides.keyword ?? searchKeyword,
          useYn: overrides.useYn ?? useYnFilter
        }
      });
      
      setMembers(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  // 필터 및 검색 핸들러
  const handleUseYnChange = (e) => {
    const newVal = e.target.value;
    setUseYnFilter(newVal); 
    setPage(1); 
    fetchMembers({ useYn: newVal, page: 1 });
  };

  const handleSearch = () => {
    setPage(1);
    fetchMembers({ page: 1 }); 
  };

  const handleResetSearch = () => {
    setSearchType('email');
    setSearchKeyword('');
    setUseYnFilter('');
    setPage(1);
    fetchMembers({ searchType: 'email', keyword: '', useYn: '', page: 1 });
  };

  // 🚀 [추가됨] 관리자가 회원의 정지/탈퇴 사유를 확인하는 모달
  const handleShowReason = async (memberId, isWithdrawn) => {
  try {
    // 🚀 백엔드에서 정지/탈퇴 사유를 통합 동적 조회하는 REST API 호출
    const response = await api.get(`/admin/members/${memberId}/reason`);
    const { type, reason, regDate } = response.data.data;

    // 🚀 SweetAlert2를 활용해 가독성 높은 모달 창으로 정보 시각화
    Swal.fire({
      icon: 'info',
      title: `${type} 사유 확인`,
      html: `
        <div class="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>처리 유형:</strong> <span className="text-gray-800 dark:text-white">${type}</span></p>
          <p><strong>상세 사유:</strong> <span class="text-red-500 font-semibold">${reason || '미기재'}</span></p>
          <p><strong>처리 일시:</strong> ${new Date(regDate).toLocaleString()}</p>
        </div>
      `,
      confirmButtonColor: '#0F9B73'
    });
  } catch (error) {
    console.error("사유 조회 실패:", error);
    Swal.fire({
      icon: 'error',
      title: '조회 실패',
      text: error.response?.data?.message || '사유를 불러오는 중 오류가 발생했습니다.'
    });
  }
};

  // 🚀 [수정됨] 정지 / 복구 처리 로직 (사유 입력)
  const handleToggleStatus = async (memberId, currentStatus) => {
    const targetStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const titleText = targetStatus === 'N' ? '회원 정지' : '회원 복구';

    const { value: reason, isConfirmed } = await Swal.fire({
      title: titleText,
      text: `${titleText} 사유를 입력해 주세요.`,
      input: 'text',
      inputPlaceholder: '사유 입력...',
      showCancelButton: true,
      confirmButtonColor: targetStatus === 'N' ? '#ef4444' : '#0F9B73',
      confirmButtonText: '처리하기',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value || value.trim() === '') return '사유를 반드시 입력해야 합니다!';
      }
    });

    if (!isConfirmed) return;

    try {
      const payload = {
        mbrUseYn: targetStatus,
        reason: reason.trim() 
      };
      await api.patch(`/admin/members/${memberId}/status`, payload);
      
      await Swal.fire({
        icon: 'success',
        title: '처리 완료',
        text: `${titleText} 처리가 완료되었습니다.`,
        timer: 1500,
        showConfirmButton: false
      });
      fetchMembers(); // 처리 후 목록 새로고침
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '처리 실패',
        text: error.response?.data?.message || '상태 변경 중 오류가 발생했습니다.'
      });
    }
  };

  // 🚀 [새로 추가됨] 강제 탈퇴 처리 로직 (사유 입력 및 물리적 제한)
  const handleForceWithdraw = async (memberId) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: '강제 탈퇴 처리',
      text: '탈퇴 처리 시 개인정보가 마스킹되며 복구할 수 없습니다. 탈퇴 사유를 입력하세요.',
      input: 'text',
      inputPlaceholder: '강제 탈퇴 사유 입력...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: '영구 탈퇴',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value || value.trim() === '') return '강제 탈퇴 사유는 필수입니다!';
      }
    });

    if (!isConfirmed) return;

    try {
      // 🚀 현재 백엔드 DELETE /api/admin/members/{memberId} 는 사유를 받지 않지만, 
      // 나중에 확장할 것을 대비해 프론트에서는 준비해 둡니다.
      await api.delete(`/admin/members/${memberId}`, { data: { reason: reason.trim() } });
      
      await Swal.fire({
        icon: 'success',
        title: '탈퇴 완료',
        text: '강제 탈퇴 처리가 완료되었습니다.',
        timer: 1500,
        showConfirmButton: false
      });
      fetchMembers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '탈퇴 실패',
        text: error.response?.data?.message || '탈퇴 처리 중 오류가 발생했습니다.'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">회원 목록</h2>
          <p className="text-sm text-gray-500">
            전체 회원 수: <span className="font-bold text-[#0F9B73]">{totalCount}</span>명
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <select
          value={useYnFilter}
          onChange={handleUseYnChange}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#0F9B73] dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer"
        >
          <option value="">전체 상태</option>
          <option value="Y">정상 (활성)</option>
          <option value="N">정지/탈퇴</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#0F9B73] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#0F9B73] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                <TableCell isHeader className="px-5 py-3 text-center">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">회원 정보</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">연락처 / 주소</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">권한</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">상태</TableCell> 
                <TableCell isHeader className="px-5 py-3 text-center">가입일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => {
                  // 🚀 [중요] 상태 판단 로직: 이메일이 'del_'로 시작하면 영구 탈퇴 처리된 유저[cite: 1]
                  const isWithdrawn = m.mbrEmail.startsWith('del_');
                  
                  return (
                    <TableRow key={m.mbrId} className={`transition-colors ${isWithdrawn ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50/50'}`}>
                      <TableCell className="px-5 py-4 text-center text-gray-500">{m.mbrId}</TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${isWithdrawn ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                            {isWithdrawn ? "탈" : (m.mbrName ? m.mbrName[0] : "?")}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 dark:text-white/90">
                              {isWithdrawn ? "탈퇴한 회원" : m.mbrName}
                            </span>
                            <span className="block text-xs text-gray-500">{m.mbrEmail}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span className="block text-sm text-gray-800 dark:text-white/90">{isWithdrawn ? "비공개" : m.mbrTelno}</span>
                        <span className="block text-xs text-gray-500 truncate max-w-[180px]" title={m.mbrAddr}>
                          {isWithdrawn ? "비공개" : m.mbrAddr}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <Badge color={m.mbrAuthCd === "ROLE_ADMIN" ? "error" : "success"}>
                          {m.mbrAuthCd === "ROLE_ADMIN" ? "관리자" : "일반"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {/* 🚀 상태 뱃지 분기 */}
                          <Badge color={isWithdrawn ? "error" : (m.mbrUseYn === "Y" ? "success" : "warning")}>
                            {isWithdrawn ? "탈퇴" : (m.mbrUseYn === "Y" ? "정상" : "정지")}
                          </Badge>
                          
                          {/* 🚀 정지/탈퇴 상태일 때만 사유 보기 버튼 활성화 */}
                          {(m.mbrUseYn === "N" || isWithdrawn) && (
                            <button 
                              onClick={() => handleShowReason(m.mbrId, isWithdrawn)} // 🚀 인자에 isWithdrawn 추가 전달
                              className="text-[11px] text-gray-400 hover:text-blue-500 underline"
                            >
                              사유 보기
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center text-gray-500 text-sm">
                        {new Date(m.mbrJoinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* 🚀 영구 탈퇴된 회원은 버튼 조작 불가 */}
                          {!isWithdrawn ? (
                            <>
                              {/* 정지 / 복구 버튼 */}
                              <button 
                                onClick={() => handleToggleStatus(m.mbrId, m.mbrUseYn)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                  m.mbrUseYn === 'Y' 
                                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                }`}
                              >
                                {m.mbrUseYn === 'Y' ? '정지' : '복구'}
                              </button>

                              {/* 강제 탈퇴 버튼 */}
                              <button 
                                onClick={() => handleForceWithdraw(m.mbrId)}
                                className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition"
                              >
                                강제탈퇴
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-gray-400">조치 불가</span>
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