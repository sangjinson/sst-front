// 🚀 파일: src/pages/admin/Members/AdminMemberList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@api/axios";
import Swal from 'sweetalert2';
import AdminTable from "@components/admin/AdminTable"
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/admin/AdminPagination";

export default function AdminMemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  
  const [searchType, setSearchType] = useState('email');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [useYnFilter, setUseYnFilter] = useState(''); 

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

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
      
      const rawList = response.data.data.list || response.data.data;
      
      const processedList = rawList.map(m => ({
        ...m,
        isWithdrawn: m.mbrEmail.startsWith('del_')
      }));

      setMembers(processedList); 
      setTotalCount(response.data.data.totalCount || rawList.length);
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

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

  const handleShowReason = async (memberId, isWithdrawn) => {
    try {
      const response = await api.get(`/admin/members/${memberId}/reason`);
      const { type, reason, regDate } = response.data.data;

      Swal.fire({
        icon: 'info',
        title: `${type} 사유 확인`,
        html: `
          <div class="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong class="dark:text-gray-300">처리 유형:</strong> <span class="text-gray-800 dark:text-white">${type}</span></p>
            <p><strong class="dark:text-gray-300">상세 사유:</strong> <span class="text-red-500 font-semibold">${reason || '미기재'}</span></p>
            <p><strong class="dark:text-gray-300">처리 일시:</strong> <span class="dark:text-gray-400">${new Date(regDate).toLocaleString()}</span></p>
          </div>
        `,
        confirmButtonColor: '#0F9B73',
        // 🚀 Tailwind Important(!) 속성 적용으로 JS 안에서만 완벽 제어
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
    } catch (error) {
      console.error("사유 조회 실패:", error);
      Swal.fire({
        icon: 'error',
        title: '조회 실패',
        text: error.response?.data?.message || '사유를 불러오는 중 오류가 발생했습니다.',
        confirmButtonColor: '#0F9B73',
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
    }
  };

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
      // 🚀 Tailwind Important(!) 속성 적용
      customClass: {
        popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
        title: 'dark:!text-gray-100',
        htmlContainer: 'dark:!text-gray-300',
        input: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-white' // 입력창 다크모드
      },
      inputValidator: (value) => {
        if (!value || value.trim() === '') return '사유를 반드시 입력해야 합니다!';
      }
    });

    if (!isConfirmed) return;

    try {
      const payload = { mbrUseYn: targetStatus, reason: reason.trim() };
      await api.patch(`/admin/members/${memberId}/status`, payload);
      
      await Swal.fire({
        icon: 'success', 
        title: '처리 완료', 
        text: `${titleText} 처리가 완료되었습니다.`, 
        timer: 1500, 
        showConfirmButton: false,
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
      fetchMembers(); 
    } catch (error) {
      Swal.fire({
        icon: 'error', 
        title: '처리 실패', 
        text: error.response?.data?.message || '상태 변경 중 오류가 발생했습니다.',
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
    }
  };

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
      // 🚀 Tailwind Important(!) 속성 적용
      customClass: {
        popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
        title: 'dark:!text-gray-100',
        htmlContainer: 'dark:!text-gray-300',
        input: 'dark:!bg-gray-800 dark:!border-gray-700 dark:!text-white'
      },
      inputValidator: (value) => { if (!value || value.trim() === '') return '강제 탈퇴 사유는 필수입니다!'; }
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/admin/members/${memberId}`, { data: { reason: reason.trim() } });
      await Swal.fire({
        icon: 'success', 
        title: '탈퇴 완료', 
        text: '강제 탈퇴 처리가 완료되었습니다.', 
        timer: 1500, 
        showConfirmButton: false,
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
      fetchMembers();
    } catch (error) {
      Swal.fire({
        icon: 'error', 
        title: '탈퇴 실패', 
        text: error.response?.data?.message || '탈퇴 처리 중 오류가 발생했습니다.',
        customClass: {
          popup: 'dark:!bg-gray-900 dark:!border dark:!border-gray-800',
          title: 'dark:!text-gray-100',
          htmlContainer: 'dark:!text-gray-300'
        }
      });
    }
  };
  const columns = [
    { label: "ID", key: "mbrId" },
    { label: "회원명", key: "mbrName" },
    { label: "권한", key: "mbrAuthCd", render: (m) => (
        <span className={m.mbrAuthCd === "ROLE_ADMIN" ? "text-red-500" : "text-green-500"}>
            {m.mbrAuthCd === "ROLE_ADMIN" ? "관리자" : "일반"}
        </span>
    )},
    { label: "관리", key: "manage", render: (m) => (
        <button onClick={() => handleToggleStatus(m.mbrId)} className="text-[#0F9B73]">상태변경</button>
    )}
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">회원 목록</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            전체 회원 수: <span className="font-bold text-[#0F9B73]">{totalCount}</span>명
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <select
          value={useYnFilter}
          onChange={handleUseYnChange}
          className="w-full sm:w-32 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#0F9B73]"
        >
          <option value="">전체 상태</option>
          <option value="Y">정상 (활성)</option>
          <option value="N">정지/탈퇴</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-32 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#0F9B73]"
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
          className="flex-1 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#0F9B73]"
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

      <AdminTable 
          headers={["ID", "회원 정보", "연락처 / 주소", "권한", "상태", "가입일", "관리"]}
        >
          {members.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.mbrId} className={`${m.isWithdrawn ? 'bg-gray-100 dark:bg-gray-800 opacity-60' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">{m.mbrId}</td>
                
                {/* 회원 정보 상세 셀 */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${m.isWithdrawn ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                      {m.isWithdrawn ? "탈" : (m.mbrName ? m.mbrName[0] : "?")}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-gray-200">{m.isWithdrawn ? "탈퇴한 회원" : m.mbrName}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">{m.mbrEmail}</span>
                    </div>
                  </div>
                </td>

                {/* 나머지 셀들은 기존 코드와 동일하게 td로 작성 */}
                <td className="px-5 py-4">
                  <span className="block text-sm text-gray-800 dark:text-gray-300">{m.isWithdrawn ? "비공개" : m.mbrTelno}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{m.isWithdrawn ? "비공개" : m.mbrAddr}</span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.mbrAuthCd === "ROLE_ADMIN" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"}`}>
                    {m.mbrAuthCd === "ROLE_ADMIN" ? "관리자" : "일반"}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                    {/* 상태 뱃지 및 사유 보기 */}
                    <div className="flex flex-col items-center gap-1.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.isWithdrawn ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400" : (m.mbrUseYn === "Y" ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400")}`}>
                            {m.isWithdrawn ? "탈퇴" : (m.mbrUseYn === "Y" ? "정상" : "정지")}
                        </span>
                        {(m.mbrUseYn === "N" || m.isWithdrawn) && (
                            <button onClick={() => handleShowReason(m.mbrId, m.isWithdrawn)} className="text-[11px] text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 underline">사유 보기</button>
                        )}
                    </div>
                </td>

                <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">{new Date(m.mbrJoinDate).toLocaleDateString()}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {!m.isWithdrawn && (
                      <button onClick={() => handleToggleStatus(m.mbrId, m.mbrUseYn)} className={`px-3 py-1.5 text-xs font-medium rounded-md ${m.mbrUseYn === 'Y' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:hover:bg-orange-900' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900'}`}>
                        {m.mbrUseYn === 'Y' ? '정지' : '복구'}
                      </button>
                    )}
                    <button onClick={() => handleForceWithdraw(m.mbrId)} disabled={m.isWithdrawn} className={`px-3 py-1.5 text-xs font-medium rounded-md ${m.isWithdrawn ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900'}`}>
                      탈퇴
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </AdminTable>

      <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}