import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axios';

// 🚀 공통 훅 및 UI 컴포넌트 임포트 (기존 멤버 관리/장소 관리와 동일한 톤앤매너)
import { usePagination } from '@hooks/usePagination';
import AdminPagination from '@components/common/AdminPagination';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@themeadmin/components/ui/table';
import { TrashBinIcon } from '@themeadmin/icons';

export default function HotplaceList() {
  const navigate = useNavigate();
  
  // 🚀 핫플거리 고정 카테고리 코드 (CMM_CODE 테이블 참조)
  const HOTPLACE_CAT_CD = "CMM002"; 

  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 🚀 페이징 커스텀 훅 사용
  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  // 🚀 데이터 불러오기 함수
  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/community/list', {
        params: {
          catCd: HOTPLACE_CAT_CD,
          page,
          size,
          keyword: searchKeyword,
        }
      });
      setPosts(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error("핫플거리 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    setAllChecked(false);
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    if (page === 1) fetchPosts();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    if (page === 1) setTimeout(() => fetchPosts(), 0); 
    else setPage(1);
  };

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(posts.map((p) => p.commNo)); 
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  // 🚀 단일 게시글 삭제
  const handleDelete = async (commNo) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/admin/community/${commNo}`);
      alert("삭제가 완료되었습니다.");
      
      if (posts.length === 1 && page > 1) setPage(page - 1); 
      else fetchPosts(); 
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 🚀 다중 게시글 삭제 (선택 삭제)
  const handleBulkDelete = async () => {
    if (selected.length === 0) { alert('삭제할 게시글을 선택해주세요.'); return; }
    if (!window.confirm(`선택한 ${selected.length}개의 게시글을 삭제하시겠습니까?`)) return;
    
    try {
      // Promise.all을 활용해 다중 삭제 API 동시 호출 처리
      await Promise.all(selected.map((commNo) => api.delete(`/admin/community/${commNo}`)));
      alert("선택한 게시글이 삭제되었습니다.");
      setSelected([]);
      setAllChecked(false);
      
      if (posts.length === selected.length && page > 1) setPage(page - 1);
      else fetchPosts();
    } catch (error) {
      alert("다중 삭제 중 일부 오류가 발생했습니다.");
      fetchPosts(); // 에러가 나도 최신화
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            핫플거리 게시판 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            전체 게시글: <span className="font-bold text-blue-600">{totalCount}</span>개
          </p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition shadow-sm">
              선택 삭제 ({selected.length})
            </button>
          )}
          <button onClick={() => navigate('/showcase/hotplace')}
            className="px-4 py-2 bg-[#0F9B73] text-white text-sm rounded-lg hover:bg-[#0d8a66] transition shadow-sm">
            사용자 화면 바로가기
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="게시글 제목이나 작성자를 검색하세요"
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-5 h-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">조회</button>
          <button onClick={handleResetSearch} className="px-5 h-10 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">초기화</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-center">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded border-gray-300"/>
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">번호</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">제목</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">작성자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">조회수</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">좋아요</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">댓글수</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">작성일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-10 text-center text-gray-500">
                    등록된 핫플거리 게시글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post, idx) => (
                  <TableRow key={post.commNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <TableCell className="px-5 py-4 text-center">
                      <input type="checkbox" checked={selected.includes(post.commNo)} onChange={() => toggleOne(post.commNo)} className="rounded border-gray-300"/>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.commNo}</TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <button
                        onClick={() => navigate(`/showcase/hotplace/view/${post.commNo}`)}
                        className="text-gray-800 dark:text-white/90 font-medium hover:text-[#0F9B73] transition truncate max-w-[200px] block"
                      >
                        {post.commTitle}
                      </button>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.mbrNickname}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.commInqireCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-red-500 font-semibold">{post.commLikeCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-blue-500 font-semibold">{post.commCmntCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500 whitespace-nowrap">{post.commRegDate}</TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDelete(post.commNo)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="삭제"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}