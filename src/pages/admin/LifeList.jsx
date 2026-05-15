import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axios';

import { usePagination } from '@hooks/usePagination';
import AdminPagination from '@components/common/AdminPagination';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@themeadmin/components/ui/table';
// 🚀 1. AdminPlaceList에서 사용하는 세련된 아이콘 버튼 가져오기
import { PencilIcon, TrashBinIcon } from "@themeadmin/icons"; 

export default function LifeList() {
  const navigate = useNavigate();
  // 🚀 카테고리 코드 (핫플거리에 적용 시 "CMM002"로 변경)
  const LIFE_CAT_CD = "CMM001"; 

  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 🚀 2. 탭 상태 관리를 AdminPlaceList와 동일한 네이밍(useYnFilter)으로 통일
  const [useYnFilter, setUseYnFilter] = useState('Y'); 

  // 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ commNo: null, commTitle: '', commContent: '' });

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/community/list', {
        params: {
          catCd: LIFE_CAT_CD,
          useYn: useYnFilter,
          page,
          size,
          keyword: searchKeyword,
        }
      });
      
      const resData = response.data.data;
      const fetchedList = resData.list || resData.content || resData || [];
      setPosts(fetchedList); 

      const fetchedTotalCount = resData.totalElements ?? resData.totalCount ?? resData.total ?? fetchedList.length ?? 0;
      setTotalCount(fetchedTotalCount);
    } catch (error) {
      console.error("인생거리 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    setSearchKeyword('');
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useYnFilter]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, useYnFilter]);

  const handleSearch = () => {
    if (page === 1) fetchPosts();
    else setPage(1); 
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    if (page === 1) setTimeout(() => fetchPosts(), 0); 
    else setPage(1);
  };

  const handleToggleStatus = async (commNo, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y'; 
    const actionText = currentStatus === 'Y' ? '휴지통으로 이동' : '복구';

    if (!window.confirm(`정말 이 게시글을 ${actionText} 하시겠습니까?`)) return;
    
    try {
      await api.patch(`/admin/community/${commNo}/status`, null, { 
        params: { useYn: nextStatus } 
      });
      alert(`성공적으로 ${actionText} 되었습니다.`);
      
      if (posts.length === 1 && page > 1) setPage(page - 1); 
      else fetchPosts(); 
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const openEditModal = async (commNo) => {
    try {
      const response = await api.get(`/community/${commNo}`);
      const detail = response.data; 
      setEditForm({ commNo: detail.commNo, commTitle: detail.commTitle, commContent: detail.commContent });
      setIsEditModalOpen(true);
    } catch (error) {
      alert('게시글 정보를 불러오는 데 실패했습니다.');
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ commNo: null, commTitle: '', commContent: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/community/${editForm.commNo}`, {
        commNo: editForm.commNo,
        commTitle: editForm.commTitle,
        commContent: editForm.commContent,
      });
      alert('성공적으로 수정되었습니다.');
      closeEditModal();
      fetchPosts(); 
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 relative">
      {/* 🚀 3. 타이틀 영역 레이아웃 통일 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
            인생거리 게시판 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            전체 게시글: <span className="font-bold text-blue-600">{totalCount}</span>개
          </p>
        </div>
        <button 
          onClick={() => navigate('/showcase/life')}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          사용자 화면 바로가기
        </button>
      </div>

      {/* 🚀 4. AdminPlaceList 스타일의 상단 라운드 탭 디자인 적용 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => { setUseYnFilter('Y'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'Y' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          운영 중인 목록
        </button>
        <button
          onClick={() => { setUseYnFilter('N'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'N' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          휴지통 🗑️
        </button>
        <button
          onClick={() => { setUseYnFilter('B'); setPage(1); }}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            useYnFilter === 'B' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          블라인드 🚨
        </button>
      </div>

      {/* 🚀 5. 검색 바 디자인 통일 */}
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
                {/* 🚀 6. 불필요한 체크박스는 없애고 원래의 커뮤니티 전용 9개 컬럼 완벽 복구 */}
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-semibold text-gray-600 whitespace-nowrap">제목</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">작성자</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-bold text-red-500 whitespace-nowrap">신고 수</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">조회수</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">좋아요</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">댓글수</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">작성일</TableCell>
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">관리</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-16 text-center text-gray-500 font-medium bg-white">
                    {useYnFilter === 'Y' && '등록된 인생거리 게시글이 없습니다.'}
                    {useYnFilter === 'N' && '휴지통이 비어있습니다.'}
                    {useYnFilter === 'B' && '신고 누적으로 블라인드된 게시글이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post, idx) => (
                  <TableRow key={post.commNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    
                    <TableCell className="px-5 py-4 text-center text-gray-500">
                      {totalCount > 0 ? (totalCount - ((page - 1) * size) - idx) : (idx + 1)}
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 text-start">
                      <button
                        onClick={() => navigate(`/showcase/life/view/${post.commNo}`)}
                        className="text-gray-800 dark:text-white/90 font-medium hover:text-blue-600 transition truncate max-w-[200px] block"
                      >
                        {post.commTitle}
                      </button>
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.mbrNickname}</TableCell>
                    
                    <TableCell className="px-5 py-4 text-center">
                      <span className={`font-bold ${post.reportCnt >= 5 ? 'text-red-500' : post.reportCnt > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {post.reportCnt || 0}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center text-gray-500">{post.commInqireCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-red-500 font-semibold">{post.commLikeCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-blue-500 font-semibold">{post.commCmntCnt}</TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500 whitespace-nowrap">{post.commRegDate}</TableCell>
                    
                    <TableCell className="px-5 py-4">
                      {/* 🚀 7. 관리 버튼을 AdminPlaceList와 완벽하게 일치시킴 (PencilIcon, TrashBinIcon) */}
                      <div className="flex gap-2 justify-center">
                        {useYnFilter === 'Y' ? (
                          <>
                            <button 
                              onClick={() => openEditModal(post.commNo)} 
                              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                              title="수정"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(post.commNo, 'Y')}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" 
                              title="휴지통으로 이동"
                            >
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(post.commNo, 'N')}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg transition" 
                            title="복구하기"
                          >
                            복구하기
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
      
      {totalPages > 1 && (
        <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* 게시글 제목/내용 인라인 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">게시글 수정</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition">✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={editForm.commTitle}
                  onChange={(e) => setEditForm({ ...editForm, commTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                <textarea
                  value={editForm.commContent}
                  onChange={(e) => setEditForm({ ...editForm, commContent: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeEditModal} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold transition">
                  취소
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm transition">
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}