import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ 인생거리 더미데이터 - 실제 연동 시 communityLifeData에서 import
const DUMMY_LIFE_POSTS = [
  { id: 1, title: '수원 화성 나들이', author: '경기인', place: '수원 화성', regDt: '2026-04-20', viewCnt: 120, wishCnt: 30, commentCnt: 5 },
  { id: 2, title: '파주 헤이리 예술마을', author: '예술가', place: '파주 헤이리', regDt: '2026-04-18', viewCnt: 88, wishCnt: 21, commentCnt: 3 },
  { id: 3, title: '가평 남이섬 여행', author: '여행자', place: '가평 남이섬', regDt: '2026-04-15', viewCnt: 210, wishCnt: 55, commentCnt: 12 },
];

const LifeList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(DUMMY_LIFE_POSTS);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(posts.map(p => p.id));
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelected(prev => prev.filter(s => s !== id));
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) { alert('삭제할 게시글을 선택해주세요.'); return; }
    if (!window.confirm(`${selected.length}개의 게시글을 삭제하시겠습니까?`)) return;
    setPosts(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
    setAllChecked(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">인생거리 게시판 관리</h1>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
              선택 삭제 ({selected.length})
            </button>
          )}
          <button onClick={() => navigate('/showcase/life')}
            className="px-4 py-2 bg-[#0F9B73] text-white text-sm rounded-lg hover:bg-[#0d8a66] transition">
            게시판 바로가기
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              <th className="p-3">번호</th>
              <th className="p-3">제목</th>
              <th className="p-3">작성자</th>
              <th className="p-3">장소</th>
              <th className="p-3">작성일</th>
              <th className="p-3">조회</th>
              <th className="p-3">찜</th>
              <th className="p-3">댓글</th>
              <th className="p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-16 text-gray-400">게시글이 없습니다.</td>
              </tr>
            ) : (
              posts.map((post, idx) => (
                <tr key={post.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(post.id)} onChange={() => toggleOne(post.id)} />
                  </td>
                  <td className="p-3 text-gray-500">{idx + 1}</td>
                  <td className="p-3 text-left">
                    <button
                      onClick={() => navigate(`/showcase/life/view/${post.id}`)}
                      className="text-gray-800 hover:text-[#0F9B73] font-medium transition truncate max-w-[200px] block"
                    >
                      {post.title}
                    </button>
                  </td>
                  <td className="p-3 text-gray-500">{post.author}</td>
                  <td className="p-3 text-gray-500">{post.place}</td>
                  <td className="p-3 text-gray-500 whitespace-nowrap">{post.regDt}</td>
                  <td className="p-3 text-gray-500">{post.viewCnt}</td>
                  <td className="p-3 text-gray-500">{post.wishCnt}</td>
                  <td className="p-3 text-gray-500">{post.commentCnt}</td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => navigate(`/showcase/life/view/${post.id}`)}
                        className="px-3 py-1 bg-blue-50 text-blue-500 text-xs rounded hover:bg-blue-100 transition"
                      >
                        보기
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LifeList;