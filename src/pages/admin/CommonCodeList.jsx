import { useEffect, useState } from 'react';
import api from '@api/axios';

//  1. 공통 페이지네이션 컴포넌트 임포트
import AdminPagination from "@components/admin/AdminPagination";

const CODE_PREFIX_MAP = {
  'GRP001': 'RGN',   // 지역 구분
  'GRP002': 'PLC',   // 장소 카테고리
  'GRP003': 'FLT',   // 장소 필터
  'GRP004': 'THM',   // 장소 테마
  'GRP005': 'RPT',   // 신고 대상 유형
  'GRP006': 'RSN',   // 신고 사유
  'GRP007': 'RST',   // 신고 처리 상태
  'GRP008': 'CMM',   // 커뮤니티 카테고리
  'GRP009': 'CSS',   // 고객지원 카테고리
  'MBR_AUTH': 'ROLE_', // 회원 권한등급
};

const CommonCodeList = () => {
  const [codes, setCodes] = useState([]);
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupCodes, setGroupCodes] = useState([]);

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  //  2. AdminPagination 컴포넌트에 넘겨줄 totalCount 상태 추가
  const [totalCount, setTotalCount] = useState(0); 

  const [sortBy, setSortBy] = useState('groupCode');
  const [sortDir, setSortDir] = useState('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const [formData, setFormData] = useState({
    groupCode: '',
    code: '',
    codeName: '',
    codeEngName: '',
    sortOrder: 0,
    useYn: 'Y'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 2000);
  };

  const resetFormData = () => {
    setFormData({
      code: '',
      codeName: '',
      codeEngName: '',
      groupCode: '',
      sortOrder: '',
      useYn: 'Y',
    });
  };

  const fetchCommonCodes = async (
    searchGroupCode = groupCode,
    searchPage = page,
    searchSortBy = sortBy,
    searchSortDir = sortDir
  ) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/common-codes/page', {
        params: {
          groupCode: searchGroupCode,
          page: searchPage,
          size,
          sortBy: searchSortBy,
          sortDir: searchSortDir,
        },
      });
      setCodes(Array.isArray(response.data.content) ? response.data.content : []);
      setTotalPages(response.data.totalPages || 0);
      //  3. totalCount 값 저장 (백엔드의 Page 객체 응답 필드명 방어 코드 적용)
      setTotalCount(response.data.totalElements ?? response.data.totalCount ?? response.data.content?.length ?? 0);
    } catch (error) {
      console.error('공통코드 조회 실패:', error);
      setCodes([]);
      setTotalPages(0);
      setTotalCount(0);
      showToast('공통코드 조회 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupCodes = async () => {
    try {
      const response = await api.get('/admin/common-codes/groups');
      setGroupCodes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('그룹코드 조회 실패:', error);
      setGroupCodes([]);
      showToast('그룹코드 조회 중 오류가 발생했습니다.', 'error');
    }
  };

  useEffect(() => {
    fetchCommonCodes(groupCode, page, sortBy, sortDir);
    fetchGroupCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDir]);

  const handleSearch = () => {
    setPage(1);
    fetchCommonCodes(groupCode, 1, sortBy, sortDir);
  };

  const handleResetSearch = () => {
    setGroupCode('');
    setPage(1);
    fetchCommonCodes('', 1, sortBy, sortDir);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    resetFormData();
    setIsModalOpen(true);
  };

  const handleEditClick = (code) => {
    setIsEditMode(true);
    setFormData({
      code: code.code,
      codeName: code.codeName,
      codeEngName: code.codeEngName || '',
      groupCode: code.groupCode,
      sortOrder: code.sortOrder,
      useYn: code.useYn,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    resetFormData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupCodeChange = async (e) => {
    const selectedGroup = e.target.value;
    const prefix = CODE_PREFIX_MAP[selectedGroup] || '';

    setFormData((prev) => ({ ...prev, groupCode: selectedGroup }));

    if (selectedGroup && prefix && !isEditMode) {
      try {
        const response = await api.get('/admin/common-codes/next-code', {
          params: { groupCode: selectedGroup, prefix }
        });
        setFormData((prev) => ({ ...prev, code: response.data.data }));
      } catch (error) {
        console.error('다음 코드 채번 실패:', error);
        setFormData((prev) => ({ ...prev, code: prefix })); 
      }
    } else if (!isEditMode) {
      setFormData((prev) => ({ ...prev, code: '' }));
    }
  };

  const validateForm = () => {
    if (!formData.code.trim()) { showToast('코드를 입력해주세요.', 'error'); return false; }
    if (!formData.codeName.trim()) { showToast('코드명을 입력해주세요.', 'error'); return false; }
    if (!formData.groupCode) { showToast('그룹코드를 선택해주세요.', 'error'); return false; }
    if (formData.sortOrder === '' || formData.sortOrder === null) { showToast('정렬순서를 입력해주세요.', 'error'); return false; }
    return true;
  };

  const handleSubmitCode = async () => {
    if (!validateForm()) return;

    if (!isEditMode) {
      try {
        const response = await api.get('/admin/common-codes/check', {
          params: { code: formData.code.trim() },
        });
        if (response.data === true) {
          showToast('이미 존재하는 코드입니다.', 'error');
          return;
        }
      } catch (error) {
        console.error('코드 중복 확인 실패:', error);
        showToast('코드 중복 확인 중 오류가 발생했습니다.', 'error');
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder),
      };

      if (isEditMode) {
        await api.put(`/admin/common-codes/${formData.code}`, payload);
        showToast('공통코드가 수정되었습니다.');
      } else {
        await api.post('/admin/common-codes', payload);
        showToast('공통코드가 등록되었습니다.');
      }

      handleCloseModal();
      fetchCommonCodes(groupCode);
    } catch (error) {
      console.error(isEditMode ? '공통코드 수정 실패:' : '공통코드 등록 실패:', error);
      showToast(isEditMode ? '공통코드 수정 중 오류가 발생했습니다.' : '공통코드 등록 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleToggleUseYn = async (code) => {
    const nextUseYn = code.useYn === 'Y' ? 'N' : 'Y';
    const message = nextUseYn === 'Y' ? '사용 처리하시겠습니까?' : '미사용 처리하시겠습니까?';

    if (!window.confirm(message)) return;

    try {
      await api.patch(`/admin/common-codes/${code.code}/use-yn`, null, {
        params: { useYn: nextUseYn },
      });
      showToast(nextUseYn === 'Y' ? '사용 처리되었습니다.' : '미사용 처리되었습니다.');
      fetchCommonCodes(groupCode);
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      showToast('사용여부 변경 중 오류가 발생했습니다.', 'error');
    }
  };

  const isAutoGenerated = !!CODE_PREFIX_MAP[formData.groupCode];
  const isCodeReadOnly = isEditMode || isAutoGenerated;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">공통코드 관리</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            지역, 장소 카테고리, 권한, 신고 사유 등 시스템 공통코드를 관리합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="rounded-lg bg-[#0F9B73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c8261] shadow-sm"
        >
          코드 추가
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <select
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          className="w-full sm:w-80 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#0F9B73]"
        >
          <option value="">전체 그룹</option>
          {groupCodes.map((group) => (
            <option key={group.groupCode} value={group.groupCode}>
              {group.groupCode} - {group.groupCodeName}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="button" onClick={handleSearch} className="h-10 rounded-lg bg-[#0F9B73] px-5 text-sm font-semibold text-white hover:bg-[#0c8261] shadow-sm">
            조회
          </button>
          <button type="button" onClick={handleResetSearch} className="h-10 rounded-lg bg-gray-900 border border-gray-700 px-5 text-sm font-semibold text-gray-300 hover:bg-gray-800 shadow-sm">
            전체보기
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="cursor-pointer px-4 py-3 font-semibold hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('code')}>코드 {sortBy === 'code' && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}</th>
                <th className="cursor-pointer px-4 py-3 font-semibold hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('codeName')}>코드명 {sortBy === 'codeName' && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}</th>
                <th className="px-4 py-3 font-semibold">영문명</th>
                <th className="cursor-pointer px-4 py-3 font-semibold hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('groupCode')}>그룹코드 {sortBy === 'groupCode' && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}</th>
                <th className="cursor-pointer px-4 py-3 font-semibold hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('sortOrder')}>정렬 {sortBy === 'sortOrder' && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}</th>
                <th className="px-4 py-3 font-semibold text-center">사용여부</th>
                <th className="px-4 py-3 font-semibold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">불러오는 중...</td></tr>
              ) : codes.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">조회된 공통코드가 없습니다.</td></tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.code} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">{code.code}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{code.codeName}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{code.codeEngName || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{code.groupCode}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{code.sortOrder}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        type="button" 
                        onClick={() => handleToggleUseYn(code)} 
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          code.useYn === 'Y' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {code.useYn === 'Y' ? '사용' : '미사용'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        type="button" 
                        onClick={() => handleEditClick(code)} 
                        className="text-sm font-semibold text-[#0F9B73] hover:text-[#0c8261] underline underline-offset-2"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  4. AdminPagination 컴포넌트로 완벽 교체 */}
      <AdminPagination 
        page={page} 
        size={size} 
        totalCount={totalCount} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl dark:border dark:border-gray-800">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {isEditMode ? '공통코드 수정' : '공통코드 추가'}
              </h2>
              <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold leading-none">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">그룹코드</label>
                <select
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={handleGroupCodeChange}
                  disabled={isEditMode}
                  className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73] ${
                    isEditMode 
                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200'
                  }`}
                >
                  <option value="">그룹코드 선택</option>
                  {groupCodes.map((group) => (
                    <option key={group.groupCode} value={group.groupCode}>
                      {group.groupCode} - {group.groupCodeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">공통코드</label>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  readOnly={isCodeReadOnly} 
                  placeholder={isCodeReadOnly ? "자동 생성됩니다." : "코드를 직접 입력하세요."}
                  className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73] ${
                    isCodeReadOnly 
                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">코드명</label>
                <input name="codeName" value={formData.codeName} onChange={handleChange} placeholder="코드명 예: 볼거리" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73]" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">영문명</label>
                <input name="codeEngName" value={formData.codeEngName} onChange={handleChange} placeholder="영문명 예: SEE" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73]" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">정렬순서</label>
                  <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} placeholder="예: 1" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">사용여부</label>
                  <select name="useYn" value={formData.useYn} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F9B73]">
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-5">
              <button type="button" onClick={handleCloseModal} className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                취소
              </button>
              <button type="button" onClick={handleSubmitCode} className="rounded-lg bg-[#0F9B73] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c8261] shadow-sm">
                {isEditMode ? '수정하기' : '등록하기'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[9999] rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${
          toast.type === 'success' 
          ? 'bg-gray-900 dark:bg-[#0F9B73]' 
          : 'bg-red-600 dark:bg-red-700'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CommonCodeList;