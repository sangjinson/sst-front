import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PageBreadcrumb from '@layouts/admin/tailadmin/components/common/PageBreadCrumb';
import ComponentCard from '@layouts/admin/tailadmin/components/common/ComponentCard';
import AdminPagination from '@components/common/AdminPagination';
import { 
  getAdminCommunities, 
  toggleAdminCommunityStatus, 
  deleteAdminCommunity, 
  getAdminCommunityDetail, 
  updateAdminCommunity 
} from '@api/adminCommunityApi';

const ShowcaseList = () => {
  const [activeTab, setActiveTab] = useState('Y');
  const [activeCategory, setActiveCategory] = useState('CMM001'); // CMM001: 인생거리, CMM002: 핫플레이스
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 페이징 및 검색
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // 🚀 수정 모달 제어 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ commNo: null, commTitle: '', commContent: '' });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAdminCommunities({
        page,
        size: 10,
        useYn: activeTab,
        catCd: activeCategory,
        keyword: searchKeyword,
      });
      setPosts(data.list || []);
      setTotalPages(Math.ceil((data.totalElements || 0) / 10) || 1);
    } catch (error) {
      console.error('뽐낼거리 로드 실패:', error);
      Swal.fire({ icon: 'error', title: '조회 실패', text: '데이터를 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, activeTab, activeCategory, searchKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setPage(1);
  };

  // 🚀 상태 토글 (휴지통 ↔ 정상)
  const handleToggleStatus = async (commNo, currentStatus) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    try {
      await toggleAdminCommunityStatus(commNo, newStatus);
      Swal.fire({ icon: 'success', title: '성공', text: '상태가 변경되었습니다.', timer: 1000, showConfirmButton: false });
      fetchPosts();
    } catch (error) {
      Swal.fire({ icon: 'error', title: '실패', text: '상태 변경 중 오류가 발생했습니다.' });
    }
  };

  // 🚀 완전 영구 삭제
  const handleDelete = async (commNo) => {
    const result = await Swal.fire({
      title: '정말 영구 삭제하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: '삭제',
    });
    if (result.isConfirmed) {
      try {
        await deleteAdminCommunity(commNo);
        Swal.fire({ icon: 'success', title: '삭제됨', text: '영구 삭제 처리되었습니다.', timer: 1000, showConfirmButton: false });
        fetchPosts();
      } catch (error) {
        Swal.fire({ icon: 'error', title: '실패', text: '삭제 중 오류가 발생했습니다.' });
      }
    }
  };

  // 🚀 글 수정 모달 열기
  const openEditModal = async (commNo) => {
    try {
      const detail = await getAdminCommunityDetail(commNo);
      setEditForm({
        commNo: detail.commNo,
        commTitle: detail.commTitle,
        commContent: detail.commContent,
      });
      setIsEditModalOpen(true);
    } catch (error) {
      Swal.fire({ icon: 'error', title: '실패', text: '글 정보를 불러오지 못했습니다.' });
    }
  };

  // 🚀 수정 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({ commNo: null, commTitle: '', commContent: '' });
  };

  // 🚀 수정 사항 저장
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminCommunity(editForm.commNo, {
        commTitle: editForm.commTitle,
        commContent: editForm.commContent,
      });
      Swal.fire({ icon: 'success', title: '수정 완료', text: '글이 성공적으로 수정되었습니다.', timer: 1000, showConfirmButton: false });
      closeEditModal();
      fetchPosts();
    } catch (error) {
      Swal.fire({ icon: 'error', title: '실패', text: '수정에 실패했습니다.' });
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="뽐낼거리 관리" />

      <ComponentCard title="게시글 목록" className="mt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* 카테고리 탭 */}
          <div className="flex gap-2">
            {[
              { id: 'CMM001', label: '인생거리' },
              { id: 'CMM002', label: '핫플레이스' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeCategory === cat.id ? 'bg-[#0F9B73] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* 상태 탭 (정상/휴지통/블라인드) */}
            <select
              value={activeTab}
              onChange={(e) => { setActiveTab(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0F9B73]"
            >
              <option value="Y">정상 운영 (Y)</option>
              <option value="N">휴지통 (N)</option>
              <option value="B">블라인드 (신고 누적)</option>
            </select>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="제목 또는 작성자 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0F9B73]"
              />
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition">
                검색
              </button>
            </form>
          </div>
        </div>

        {/* 데이터 테이블 (🚀 체크박스 로직 완벽히 제거 및 신고 수 표시) */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold w-16">No</th>
                <th className="px-4 py-3 font-semibold">제목</th>
                <th className="px-4 py-3 font-semibold w-32">작성자</th>
                <th className="px-4 py-3 font-semibold text-center w-24">신고 수</th>
                <th className="px-4 py-3 font-semibold text-center w-28">등록일</th>
                <th className="px-4 py-3 font-semibold text-center w-24">상태</th>
                <th className="px-4 py-3 font-semibold text-center w-36">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center">데이터를 불러오는 중입니다...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.commNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{post.commNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 line-clamp-1">{post.commTitle}</td>
                    <td className="px-4 py-3 truncate">{post.mbrNickname}</td>
                    <td className="px-4 py-3 text-center">
                      {/* 🚀 신고 수에 따른 강조 스타일링 */}
                      <span className={`font-bold ${post.reportCnt >= 5 ? 'text-red-500' : post.reportCnt > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {post.reportCnt}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{post.commRegDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        activeTab === 'Y' ? 'bg-green-100 text-green-700' :
                        activeTab === 'B' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activeTab === 'Y' ? '정상' : activeTab === 'B' ? '블라인드' : '삭제됨'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(post.commNo)} 
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition"
                      >
                        수정
                      </button>
                      {activeTab === 'Y' ? (
                        <button onClick={() => handleToggleStatus(post.commNo, 'Y')} className="text-orange-500 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded transition">숨김</button>
                      ) : (
                        <button onClick={() => handleToggleStatus(post.commNo, 'N')} className="text-[#0F9B73] hover:text-[#0d8a66] bg-green-50 px-2 py-1 rounded transition">복구</button>
                      )}
                      <button onClick={() => handleDelete(post.commNo)} className="text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded transition">영구삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </ComponentCard>

      {/* 🚀 수정 모달 오버레이 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">게시글 수정</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={editForm.commTitle}
                  onChange={(e) => setEditForm({ ...editForm, commTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                <textarea
                  value={editForm.commContent}
                  onChange={(e) => setEditForm({ ...editForm, commContent: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeEditModal} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                  취소
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#0F9B73] text-white font-semibold hover:bg-[#0d8a66] shadow-sm transition">
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowcaseList;