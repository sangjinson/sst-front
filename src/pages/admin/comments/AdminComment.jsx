import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '@layouts/admin/tailadmin/components/common/PageBreadCrumb';
import Pagination from '@components/common/AdminPagination';
import Swal from 'sweetalert2';
import { getAdminComments, toggleAdminCommentStatus } from '@api/adminCommentApi';

const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [useYn, setUseYn] = useState('ALL'); 
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchComments();
  }, [page, useYn, keyword]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getAdminComments({ page, size: 10, useYn, keyword });
      setComments(data.list);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      Swal.fire('오류', '댓글 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1); 
  };

  const handleStatusToggle = async (cmntNo, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const actionText = nextStatus === 'N' ? '숨김(삭제)' : '복구';

    const confirm = await Swal.fire({
      title: `이 댓글을 ${actionText} 처리하시겠습니까?`,
      text: "상태 변경 시 해당 게시글의 댓글 수가 자동 동기화됩니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nextStatus === 'N' ? '#ef4444' : '#10b981',
      confirmButtonText: `${actionText}하기`,
      cancelButtonText: '취소'
    });

    if (confirm.isConfirmed) {
      try {
        await toggleAdminCommentStatus(cmntNo, nextStatus);
        Swal.fire('완료', `댓글이 ${actionText} 처리되었습니다.`, 'success');
        fetchComments(); 
      } catch (error) {
        Swal.fire('실패', '상태 변경 중 문제가 발생했습니다.', 'error');
      }
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="댓글 관리" />

      {/* 🚀 1. 하얀색 박스 (테이블 컨테이너) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <select
              value={useYn}
              onChange={(e) => {
                setUseYn(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0F9B73]"
            >
              <option value="ALL">전체 보기</option>
              <option value="Y">정상 댓글</option>
              {/* 🚀 직관적인 휴지통 명칭 부여 */}
              <option value="N">휴지통 (삭제된 댓글)</option>
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="댓글 내용, 원문 제목, 닉네임"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#0F9B73] w-64"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
            >
              검색
            </button>
          </form>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">번호</th>
                <th className="px-4 py-3 w-1/4">원문(커뮤니티) 제목</th>
                <th className="px-4 py-3">작성자(닉네임)</th>
                <th className="px-4 py-3 w-1/3">댓글 내용</th>
                <th className="px-4 py-3">등록일</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-10">데이터를 불러오는 중입니다...</td></tr>
              ) : comments.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10">조회된 댓글이 없습니다.</td></tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.cmntNo} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3">{comment.cmntNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[150px]" title={comment.commTitle}>
                      {comment.commTitle}
                    </td>
                    <td className="px-4 py-3">{comment.nickname}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]" title={comment.cmntContent}>{comment.cmntContent}</td>
                    <td className="px-4 py-3">{comment.cmntRegDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        comment.cmntUseYn === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {comment.cmntUseYn === 'Y' ? '정상' : '삭제됨'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleStatusToggle(comment.cmntNo, comment.cmntUseYn)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          comment.cmntUseYn === 'Y' 
                            ? 'border border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {comment.cmntUseYn === 'Y' ? '삭제 처리' : '복구 하기'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 2. 하얀색 박스 바깥으로 페이지네이션 분리 완료 */}
      {!loading && comments.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </>
  );
};

export default AdminComment;