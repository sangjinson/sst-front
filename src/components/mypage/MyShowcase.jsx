import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 라우팅을 위해 추가
import Pagination from '@components/common/Pagination';

// 더미 데이터
const DUMMY_POSTS = [
  { id: 1, title: "경기도 화성 1일차", desc: "화성행궁 다녀왔습니다.", image: "https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?w=400&q=80", likes: 30, author: "경기도 청년" },
  { id: 2, title: "수원 왕갈비 투어", desc: "수원 통닭거리도 가봤어요!", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80", likes: 62, author: "부산 소녀" },
];

const MyShowcase = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // 🚀 네비게이션 훅 추가

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 뽐낼 거리</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {DUMMY_POSTS.map((post) => (
          <div 
            key={post.id} 
            // 🚀 클릭 시 뽐낼거리 상세 보기로 이동
            onClick={() => navigate(`/showcase/view/${post.id}`)}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold">{post.author}</span>
                <span className="text-xs text-gray-500">
                  <span className="text-red-500 mr-1">♥</span>{post.likes}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{post.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={3} onPageChange={setPage} />
    </div>
  );
};

export default MyShowcase;