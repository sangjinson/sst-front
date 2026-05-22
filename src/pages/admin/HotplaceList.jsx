import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axios';

import { usePagination } from '@hooks/usePagination';
import AdminPagination from '@components/common/AdminPagination';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@themeadmin/components/ui/table';
import { TrashBinIcon } from '@themeadmin/icons';

export default function HotplaceList() {
  const navigate = useNavigate();
  const HOTPLACE_CAT_CD = "CMM002"; 

  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 상태 관리: 'Y'(운영 중), 'N'(일반 휴지통), 'B'(신고 누적 블라인드)
  const [useYn, setUseYn] = useState('Y'); 

  // 🚀 1. 수정 모달 관리를 위한 상태 추가
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ commNo: null, commTitle: '', commContent: '' });

  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/community/list', {
        params: {
          catCd: HOTPLACE_CAT_CD,
          useYn,
          page,
          size,
          keyword: searchKeyword,
        }
      });
      
      const resData = response.data.data;
      
      const fetchedList = resData.list || resData.content || resData || [];
      setPosts(fetchedList); 

      // 🚀 [마이너스 번호 버그 해결] 백엔드 응답 변수명(totalElements) 방어 코드 적용
      const fetchedTotalCount = resData.totalElements ?? resData.totalCount ?? resData.total ?? fetchedList.length ?? 0;
      setTotalCount(fetchedTotalCount);

    } catch (error) {
      console.error("핫플거리 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
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

  // 🚀 2. 글 수정 모달 열기 (기존 CommunityController의 단건 조회 API 활용)
  const openEditModal = async (commNo) => {
    try {
      // 관리자용 단건 조회 API가 없으므로, 사용자용 일반 조회 API를 재사용합니다.
      const response = await api.get(`/community/${commNo}`);
      const detail = response.data; // ApiResponse로 감싸져있지 않은 구조
      
      setEditForm({
        commNo: detail.commNo,
        commTitle: detail.commTitle,
        commContent: detail.commContent,
      });
      setIsEditModalOpen(true);
    } catch (error) {
      alert('게시글 정보를 불러오는 데 실패했습니다.');
    }
  };

  // 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ commNo: null, commTitle: '', commContent: '' });
  };

  // 🚀 3. 수정한 데이터 백엔드 전송 (기존 CommunityController 수정 API 활용)
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
      fetchPosts(); // 수정된 내용으로 리스트 새로고침
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  // 상태 변경 (삭제/복구)
  const handleToggleStatus = async (commNo) => {
    const isDeleting = useYn === 'Y';
    const newStatus = isDeleting ? 'N' : 'Y';
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

  return (
    <div className="space-y-6 p-4 md:p-8 relative">
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
          {/* 체크박스 로직이 제거되었으므로 다중 삭제 버튼도 제거됨 */}
          <button onClick={() => navigate('/showcase/hotplace')}
            className="px-4 py-2 bg-[#0F9B73] text-white text-sm rounded-lg hover:bg-[#0d8a66] transition shadow-sm">
            사용자 화면 바로가기
          </button>
        </div>
      </div>

      {/* 3단 탭 UI */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
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
            useYn === 'N' ? 'bg-gray-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🗑️ 휴지통
        </button>
        <button
          onClick={() => { setUseYn('B'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            useYn === 'B' ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
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
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#0F9B73] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                {/* 🚀 체크박스 영역 삭제 및 총 9개 헤더 유지 */}
                <TableCell isHeader className="px-5 py-3 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">번호</TableCell>
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
                  <td colSpan={9} className="px-5 py-16 text-center text-gray-500 font-medium bg-white">
                    {useYn === 'Y' ? '등록된 핫플거리 게시글이 없습니다.' : 
                     useYn === 'N' ? '휴지통이 비어있습니다.' : 
                     '신고 누적으로 블라인드 처리된 게시글이 없습니다.'}
                  </td>
                </TableRow>
              ) : (
                posts.map((post, idx) => (
                  <TableRow key={post.commNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <TableCell className="px-5 py-4 text-center text-gray-500">
                      {/* 역순 번호 정상 작동 */}
                      {totalCount > 0 ? (totalCount - ((page - 1) * size) - idx) : (idx + 1)}
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 text-start">
                      <button
                        onClick={() => navigate(`/showcase/hotplace/view/${post.commNo}`)}
                        className="text-gray-800 dark:text-white/90 font-medium hover:text-[#0F9B73] transition truncate max-w-[200px] block"
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
                      <div className="flex gap-2 justify-center">
                        {/* 🚀 4. 수정 버튼 추가 */}
                        <button 
                          onClick={() => openEditModal(post.commNo)} 
                          className="px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          수정
                        </button>
                        
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
      
      {totalPages > 1 && (
        <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* 🚀 5. 수정 모달 창 UI */}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                <textarea
                  value={editForm.commContent}
                  onChange={(e) => setEditForm({ ...editForm, commContent: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeEditModal} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold transition">
                  취소
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#0F9B73] text-white font-bold hover:bg-[#0d8a66] shadow-sm transition">
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