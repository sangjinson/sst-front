// src/pages/admin/AdminShowcaseList.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@api/axios";

// UI 컴포넌트 (프로젝트 환경에 맞게 경로 조정 필요)
import { usePagination } from "@hooks/usePagination";
import AdminPagination from "@components/admin/AdminPagination";


//  type에 따른 카테고리 매핑 정보 사전 정의
const TYPE_MAP = {
  hotplace: { catCd: "CMM002", title: "핫플거리 관리" },
  life: { catCd: "CMM001", title: "인생거리 관리" },
};

export default function AdminShowcaseList() {
  const { type } = useParams(); // URL에서 'hotplace' 또는 'life' 추출
  const navigate = useNavigate();
  
  //  유효하지 않은 type 접근 방어 로직
  const currentConfig = TYPE_MAP[type];
  if (!currentConfig) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const [posts, setPosts] = useState([]);
  const [statusTab, setStatusTab] = useState("Y"); // Y: 정상, N: 숨김, B: 블라인드 대상
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  const { page, size, totalCount, totalPages, setPage, setTotalCount } = usePagination(1, 10);

  //  백엔드 통합 API 호출
  const fetchPosts = async () => {
    try {
      const response = await api.get("/admin/community/list", {
        params: {
          catCd: currentConfig.catCd, // URL type에 매핑된 카테고리 코드
          useYn: statusTab,
          keyword: searchKeyword,
          page: page,
          size: size,
        },
      });
      
      const responseData = response.data.data;
      setPosts(responseData.list || []);
      setTotalCount(responseData.totalCount || 0);
    } catch (error) {
      console.error("게시물 목록 조회 오류:", error);
    }
  };

  //  type(메뉴 이동), page, statusTab, 검색어가 변경될 때마다 재조회
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page, statusTab, searchKeyword]);

  //  메뉴(type)가 바뀔 때 상태 초기화
  useEffect(() => {
    setStatusTab("Y");
    setSearchInput("");
    setSearchKeyword("");
    setPage(1);
  }, [type]);

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
  };

  const handleUpdateStatus = async (commNo, currentStatus) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";
    const msg = newStatus === "Y" ? "정상 노출로 복구하시겠습니까?" : "해당 게시물을 숨김 처리하시겠습니까?";
    
    if (!window.confirm(msg)) return;

    try {
      //  백엔드의 상태 변경 API 호출 (PatchMapping("/{commNo}/status"))
      await api.patch(`/admin/community/${commNo}/status`, null, {
        params: { useYn: newStatus },
      });
      alert("상태가 변경되었습니다.");
      fetchPosts();
    } catch (error) {
      alert("상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 타이틀 및 총 게시물 카운트 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">{currentConfig.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            총 게시물: <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalCount}</span>건
          </p>
        </div>
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        {[
          { id: "Y", label: "정상 게시물", activeClass: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white" },
          { id: "N", label: "숨김 처리됨", activeClass: "bg-gray-600 text-white dark:bg-gray-500 dark:text-white" },
          { id: "B", label: "블라인드",    activeClass: "bg-red-500 text-white dark:bg-red-400 dark:text-white" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setStatusTab(tab.id); setPage(1); }}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg ${
              statusTab === tab.id
                ? tab.activeClass
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색 바:  검색 버튼 청록색(emerald-600) 적용 */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="제목 또는 작성자 검색"
          className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-emerald-400 dark:placeholder-gray-500"
        />
        <button 
          onClick={handleSearch} 
          className="px-5 h-10 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
        >
          검색
        </button>
      </div>

      {/* 테이블 목록 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.05]">
              <tr>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-16">No</th>
                <th className="px-5 py-3 text-start font-medium text-gray-600 dark:text-gray-400">제목</th>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-28">작성자</th>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-40">조회/좋아요/댓글</th>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-32">등록일</th>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-24">상태</th>
                <th className="px-5 py-3 text-center font-medium text-gray-600 dark:text-gray-400 w-28">관리</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-500 dark:text-gray-400 font-medium">
                    조회된 게시물이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => (
                  <tr key={post.commNo} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    <td className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                      {(page - 1) * size + idx + 1}
                    </td>
                    <td
                      className="px-5 py-4 text-gray-800 dark:text-gray-200 font-medium cursor-pointer hover:underline hover:text-emerald-600 dark:hover:text-emerald-400"
                      onClick={() =>
                        window.open(
                          `/showcase/${type}/view/${post.commNo}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }>
                      {post.commTitle}
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
                      {post.mbrNickname}
                    </td>
                    <td className="px-5 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
                      {post.commInqireCnt} / {post.commLikeCnt} / {post.commCmntCnt}
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      {post.commRegDate}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        post.commUseYn === "Y"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }`}>
                        {post.commUseYn === "Y" ? "정상" : "숨김"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleUpdateStatus(post.commNo, post.commUseYn)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg${
                          post.commUseYn === "Y"
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
                        }`}
                      >
                        {post.commUseYn === "Y" ? "숨기기" : "복구"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <AdminPagination page={page} size={size} totalCount={totalCount} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}