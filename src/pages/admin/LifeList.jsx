import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axios';

import { usePagination } from '@hooks/usePagination';
import AdminPagination from '@components/common/AdminPagination';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@themeadmin/components/ui/table';
import { TrashBinIcon } from '@themeadmin/icons';

export default function LifeList() {
  const navigate = useNavigate();
  const LIFE_CAT_CD = "CMM001"; 

  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 🚀 1. 운영(Y) / 휴지통(N) / 신고누적(B) 상태 관리
  const [useYn, setUseYn] = useState('Y');

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/community/list', {
        params: {
          catCd: LIFE_CAT_CD,
          useYn, // 🚀 2. 백엔드로 'Y', 'N', 'B' 상태값 전달
          page,
          size,
          keyword: searchKeyword,
        }
      });
      setPosts(response.data.data.list || response.data.data); 
      setTotalCount(response.data.data.totalCount || response.data.data.length);
    } catch (error) {
      console.error("인생거리 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    setAllChecked(false);
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, useYn]);

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

  // 🚀 3. 삭제/복구 토글 로직 (B 상태에서도 복구 가능하도록 처리)
  const handleToggleStatus = async (commNo) => {
    const isDeleting = useYn === 'Y';
    const newStatus = isDeleting ? 'N' : 'Y'; // 'N'이나 'B' 탭에서는 복구 시 'Y'로 변경
    const actionText = isDeleting ? '휴지통으로 이동' : '복구';

    if (!window.confirm(`정말 이 게시글을 ${actionText} 하시겠습니까?`)) return;
    try {
      await api.patch(`/admin/community/${commNo}/status`, null, { params: { useYn: newStatus } });
      alert(`${actionText}가 완료되었습니다.`);
      
      if (posts.length === 1 && page > 1) setPage(page - 1); 
      else fetchPosts(); 
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // 🚀 4. 다중 선택 토글 로직
  const handleBulkToggle = async () => {
    if (selected.length === 0) { alert('게시글을 선택해주세요.'); return; }
    
    const isDeleting = useYn === 'Y';
    const newStatus = isDeleting ? 'N' : 'Y';
    const actionText = isDeleting ? '삭제' : '복구';

    if (!window.confirm(`선택한 ${selected.length}개의 게시글을 ${actionText} 하시겠습니까?`)) return;
    
    try {
      await Promise.all(selected.map((commNo) => api.patch(`/admin/community/${commNo}/status`, null, { params: { useYn: newStatus } })));
      alert(`선택한 게시글이 처리되었습니다.`);
      setSelected([]);
      setAllChecked(false);
      
      if (posts.length === selected.length && page > 1) setPage(page - 1);
      else fetchPosts();
    } catch (error) {
      alert("다중 처리 중 일부 오류가 발생했습니다.");
      fetchPosts(); 
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            인생거리 게시판 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            전체 게시글: <span className="font-bold text-blue-600">{totalCount}</span>개
          </p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={handleBulkToggle}
              className={`px-4 py-2 text-white text-sm rounded-lg transition shadow-sm ${useYn === 'Y' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
              선택 {useYn === 'Y' ? '삭제' : '복구'} ({selected.length})
            </button>
          )}
          <button onClick={() => navigate('/showcase/life')}
            className="px-4 py-2 bg-[#0F9B73] text-white text-sm rounded-lg hover:bg-[#0d8a66] transition shadow-sm">
            사용자 화면 바로가기
          </button>
        </div>
      </div>

      {/* 🚀 5. 3가지 탭 UI 구성 (운영 중 / 휴지통 / 신고 누적) */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 flex-wrap">
        <button
          onClick={() => { setUseYn('Y'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            useYn === 'Y' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          운영 중 목록
        </button>
        <button
          onClick={() => { setUseYn('N'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            useYn === 'N' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🗑️ 휴지통
        </button>
        <button
          onClick={() => { setUseYn('B'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            useYn === 'B' ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🚨 블라인드 (신고 누적)
        </button>
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
                    {/* 🚀 6. 빈 목록 메시지를 상태별로 분기 처리 */}
                    {useYn === 'Y' && '등록된 인생거리 게시글이 없습니다.'}
                    {useYn === 'N' && '휴지통이 비어있습니다.'}
                    {useYn === 'B' && '신고 누적으로 블라인드된 게시글이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.commNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <TableCell className="px-5 py-4 text-center">
                      <input type="checkbox" checked={selected.includes(post.commNo)} onChange={() => toggleOne(post.commNo)} className="rounded border-gray-300"/>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.commNo}</TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <button
                        onClick={() => navigate(`/showcase/life/view/${post.commNo}`)}
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
                        {useYn === 'Y' ? (
                          <button
                            onClick={() => handleToggleStatus(post.commNo)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="휴지통 이동"
                          >
                            <TrashBinIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(post.commNo)}
                            className="px-3 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg transition" title="복구하기"
                          >
                            복구
                          </button>
                        )}
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