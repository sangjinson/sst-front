import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import { useAuth } from '@hooks/useAuth';
import api from '@api/axios';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 5;

const STATUS_COLOR = {
  "여행 예정": { bg: "#fef3c7", color: "#92400e" },
  "여행중":    { bg: "#dbeafe", color: "#1e40af" },
  "여행 완료": { bg: "#d1fae5", color: "#065f46" },
};

const getStatus = (beginDate, endDate) => {
  const today = new Date();
  const start = new Date(beginDate);
  const end   = new Date(endDate);
  if (today < start) return '여행 예정';
  if (today > end)   return '여행 완료';
  return '여행중';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').slice(0, -1);
};

const MySchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);

  useEffect(() => {
    if (!user?.mbrId) { setLoading(false); return; }
    api.get('/ai/schedule/my', { params: { mbrId: user.mbrId } })
      .then((res) => setSchedules(res.data))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, [user?.mbrId]);

  const totalPages   = Math.ceil(schedules.length / ITEMS_PER_PAGE) || 1;
  const currentItems = schedules.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ─────────────────────────────────────────
  // 일정 삭제
  // ─────────────────────────────────────────
  const handleDelete = async (e, aisNo) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: '일정을 삭제하시겠습니까?',
      text : '삭제된 일정은 복구할 수 없습니다.',
      icon : 'warning',
      showCancelButton  : true,
      confirmButtonText : '삭제',
      cancelButtonText  : '취소',
      confirmButtonColor: '#ef4444',
      cancelButtonColor : '#9ca3af',
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/ai/schedule/delete', { params: { aisNo } });
        setSchedules(prev => prev.filter(s => s.aisNo !== aisNo));

        const newTotalPages = Math.ceil((schedules.length - 1) / ITEMS_PER_PAGE) || 1;
        if (page > newTotalPages) setPage(newTotalPages);

        await Swal.fire({
          icon : 'success',
          title: '삭제되었습니다.',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({ icon: 'error', title: '삭제 실패', text: '다시 시도해주세요.' });
      }
    }
  };

  if (loading) return (
    <div className="p-10 text-center text-gray-500">불러오는 중...</div>
  );

  return (
    <div className="p-4 md:p-7">
      <h3 className="fs-up-3 font-bold text-gray-700 mb-4">내 일정 관리</h3>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7" />

      {schedules.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-sm">아직 저장된 일정이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['번호', '일정명', '여행 날짜', '총 일수', '상태', '지역',''].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((s, idx) => {
                  const status = getStatus(s.aisBeginDate, s.aisEndDate);
                  const sc = STATUS_COLOR[status] || { bg: '#f3f4f6', color: '#374151' };
                  return (
                    <tr
                      key={s.aisNo}
                      onClick={() => {
                        localStorage.removeItem('currentSchedule');
                        navigate('/plan/result', { state: { aisNo: s.aisNo } });
                      }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {s.aisSchdulName}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 leading-relaxed whitespace-nowrap">
                        {formatDate(s.aisBeginDate)}<br />~<br />{formatDate(s.aisEndDate)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {s.aisTotDays}일
                      </td>
                      <td className="py-4 px-4">
                      <span
                          className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                          {status}
                      </span>
                      </td>
                      <td className="py-4 px-4">
                      {s.rgnName && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                              {s.rgnName}
                          </span>
                      )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={(e) => handleDelete(e, s.aisNo)}
                          className="px-3 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {schedules.length > ITEMS_PER_PAGE && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default MySchedule;