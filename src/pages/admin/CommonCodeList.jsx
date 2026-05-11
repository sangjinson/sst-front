import { useEffect, useState } from 'react';
import api from '@api/axios';

const CommonCodeList = () => {
  // 공통코드 목록, 검색 조건, 로딩 상태
  const [codes, setCodes] = useState([]);
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupCodes, setGroupCodes] = useState([]);

  // 페이지네이션과 정렬 조건
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('groupCode');
  const [sortDir, setSortDir] = useState('asc');

  // 등록/수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 처리 결과를 잠깐 보여주는 토스트 메시지 상태
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  // 등록/수정 폼 입력값
  const [formData, setFormData] = useState({
    code: '',
    codeName: '',
    codeEngName: '',
    groupCode: '',
    sortOrder: '',
    useYn: 'Y',
  });

  // 성공/실패 메시지를 화면 오른쪽 아래에 2초 동안 표시한다.
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success',
      });
    }, 2000);
  };

  // 모달을 새로 열거나 닫을 때 폼을 초기 상태로 되돌린다.
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

  // 공통코드 목록을 페이지 단위로 조회한다.
  // 검색, 페이지 이동, 정렬 변경 시에도 같은 함수를 재사용한다.
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
  } catch (error) {
    console.error('공통코드 조회 실패:', error);
    setCodes([]);
    setTotalPages(0);
    showToast('공통코드 조회 중 오류가 발생했습니다.', 'error');
  } finally {
    setLoading(false);
  }
};

  // 검색/등록 폼에서 선택할 수 있는 그룹코드 목록을 불러온다.
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

  // 페이지 번호나 정렬 조건이 바뀌면 목록을 다시 조회한다.
  useEffect(() => {
  fetchCommonCodes(groupCode, page, sortBy, sortDir);
  fetchGroupCodes();
}, [page, sortBy, sortDir]);

  // 선택한 그룹코드로 검색하고 첫 페이지로 이동한다.
  const handleSearch = () => {
  setPage(1);
  fetchCommonCodes(groupCode, 1, sortBy, sortDir);
};

// 검색 조건을 초기화하고 전체 목록을 다시 조회한다.
const handleResetSearch = () => {
  setGroupCode('');
  setPage(1);
  fetchCommonCodes('', 1, sortBy, sortDir);
};

// 같은 컬럼을 다시 누르면 정렬 방향을 바꾸고, 다른 컬럼이면 오름차순으로 시작한다.
const handleSort = (field) => {
  if (sortBy === field) {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortBy(field);
    setSortDir('asc');
  }

  setPage(1);
};

  // 등록 모달을 열기 전에 수정 모드를 끄고 빈 폼을 준비한다.
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    resetFormData();
    setIsModalOpen(true);
  };

  // 선택한 행의 값을 폼에 채워 수정 모달을 연다.
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

  // 모달을 닫으면서 등록/수정 상태와 입력값을 초기화한다.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    resetFormData();
  };

  // 폼 input/select의 name에 맞춰 formData 값을 갱신한다.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 필수 입력값을 확인하고 부족한 값은 토스트로 알려준다.
  const validateForm = () => {
    if (!formData.code.trim()) {
      showToast('코드를 입력해주세요.', 'error');
      return false;
    }

    if (!formData.codeName.trim()) {
      showToast('코드명을 입력해주세요.', 'error');
      return false;
    }

    if (!formData.groupCode) {
      showToast('그룹코드를 선택해주세요.', 'error');
      return false;
    }

    if (!formData.sortOrder) {
      showToast('정렬순서를 입력해주세요.', 'error');
      return false;
    }

    return true;
  };

  // 등록/수정 버튼 클릭 시 폼 검증 후 API를 호출한다.
  const handleSubmitCode = async () => {
    if (!validateForm()) return;

    // 등록 모드일 때 코드 중복 검사
if (!isEditMode) {
  try {
    const response = await api.get('/admin/common-codes/check', {
      params: {
        code: formData.code.trim(),
      },
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
      showToast(
        isEditMode
          ? '공통코드 수정 중 오류가 발생했습니다.'
          : '공통코드 등록 중 오류가 발생했습니다.',
        'error'
      );
    }
  };

  // 사용/미사용 버튼 클릭 시 상태를 반대로 바꾼다.
  const handleToggleUseYn = async (code) => {
    const nextUseYn = code.useYn === 'Y' ? 'N' : 'Y';
    const message = nextUseYn === 'Y' ? '사용 처리하시겠습니까?' : '미사용 처리하시겠습니까?';

    if (!window.confirm(message)) {
      return;
    }

    try {
      await api.patch(`/admin/common-codes/${code.code}/use-yn`, null, {
        params: {
          useYn: nextUseYn,
        },
      });

      showToast(nextUseYn === 'Y' ? '사용 처리되었습니다.' : '미사용 처리되었습니다.');
      fetchCommonCodes(groupCode);
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      showToast('사용여부 변경 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="p-6">
      {/* 페이지 제목과 등록 버튼 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공통코드 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            지역, 장소 카테고리, 권한, 신고 사유 등 시스템 공통코드를 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          코드 추가
        </button>
      </div>

      {/* 그룹코드 검색 영역 */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex gap-2">
          <select
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="w-80 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">전체 그룹</option>

            {groupCodes.map((group) => (
              <option key={group.groupCode} value={group.groupCode}>
                {group.groupCode} - {group.groupCodeName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            조회
          </button>

          <button
            type="button"
            onClick={handleResetSearch}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            전체보기
          </button>
        </div>
      </div>

      {/* 공통코드 목록 테이블 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full table-auto text-left text-sm">
          {/* 클릭 가능한 헤더는 정렬 기준을 변경한다. */}
          <thead className="bg-gray-50 text-gray-600">
  <tr>
    <th
      className="cursor-pointer px-4 py-3 hover:text-gray-900"
      onClick={() => handleSort('code')}
    >
      코드
      {sortBy === 'code' && (
        <span className="ml-1">
          {sortDir === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>

    <th
      className="cursor-pointer px-4 py-3 hover:text-gray-900"
      onClick={() => handleSort('codeName')}
    >
      코드명
      {sortBy === 'codeName' && (
        <span className="ml-1">
          {sortDir === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>

    <th className="px-4 py-3">영문명</th>

    <th
      className="cursor-pointer px-4 py-3 hover:text-gray-900"
      onClick={() => handleSort('groupCode')}
    >
      그룹코드
      {sortBy === 'groupCode' && (
        <span className="ml-1">
          {sortDir === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>

    <th
      className="cursor-pointer px-4 py-3 hover:text-gray-900"
      onClick={() => handleSort('sortOrder')}
    >
      정렬
      {sortBy === 'sortOrder' && (
        <span className="ml-1">
          {sortDir === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>

    <th className="px-4 py-3">사용여부</th>
    <th className="px-4 py-3">관리</th>
  </tr>
</thead>

          <tbody className="divide-y divide-gray-100">
            {/* 로딩, 빈 목록, 목록 표시 상태를 나누어 렌더링한다. */}
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                  불러오는 중...
                </td>
              </tr>
            ) : codes.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                  조회된 공통코드가 없습니다.
                </td>
              </tr>
            ) : (
              codes.map((code) => (
                <tr key={code.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{code.code}</td>
                  <td className="px-4 py-3 text-gray-700">{code.codeName}</td>
                  <td className="px-4 py-3 text-gray-500">{code.codeEngName}</td>
                  <td className="px-4 py-3 text-gray-700">{code.groupCode}</td>
                  <td className="px-4 py-3 text-gray-700">{code.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleUseYn(code)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        code.useYn === 'Y'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {code.useYn === 'Y' ? '사용' : '미사용'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleEditClick(code)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
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

      {/* 페이지 이동 버튼 */}
      <div className="mt-4 flex items-center justify-center gap-2">
  <button
    type="button"
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
      page === 1
        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
        : 'bg-gray-900 text-white hover:bg-gray-800'
    }`}
  >
    이전
  </button>

  {Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;

    return (
      <button
        key={pageNumber}
        type="button"
        onClick={() => setPage(pageNumber)}
        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
          page === pageNumber
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {pageNumber}
      </button>
    );
  })}

  <button
    type="button"
    disabled={page === totalPages || totalPages === 0}
    onClick={() => setPage((prev) => prev + 1)}
    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
      page === totalPages || totalPages === 0
        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
        : 'bg-gray-900 text-white hover:bg-gray-800'
    }`}
  >
    다음
  </button>
</div>

      {/* 공통코드 등록/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {isEditMode ? '공통코드 수정' : '공통코드 추가'}
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={isEditMode}
                placeholder="코드 예: PLC001"
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                  isEditMode ? 'bg-gray-100 text-gray-500' : ''
                }`}
              />

              <input
                name="codeName"
                value={formData.codeName}
                onChange={handleChange}
                placeholder="코드명 예: 볼거리"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <input
                name="codeEngName"
                value={formData.codeEngName}
                onChange={handleChange}
                placeholder="영문명 예: SEE"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <select
                name="groupCode"
                value={formData.groupCode}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">그룹코드 선택</option>

                {groupCodes.map((group) => (
                  <option key={group.groupCode} value={group.groupCode}>
                    {group.groupCode} - {group.groupCodeName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                placeholder="정렬순서 예: 1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <select
                name="useYn"
                value={formData.useYn}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSubmitCode}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {isEditMode ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 등록, 수정, 조회 실패 등의 결과 메시지 */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CommonCodeList;
