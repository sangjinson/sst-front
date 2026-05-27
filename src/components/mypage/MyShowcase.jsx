import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@components/common/Pagination";
import api from "@api/axios";

const MyShowcase = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 6;

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/400x240";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        // 로그인 사용자 조회
        const meRes = await api.get("/auth/me");
        const currentUserId = meRes.data.data.mbrId;

        // 핫플거리 조회
        const hotplaceRes = await api.get("/community", {
          params: {
            catCd: "CMM002",
            page: 1,
            size: 100,
            searchType: "all",
            keyword: "",
            sortType: "latest",
          },
        });

        // 인생거리 조회
        const lifeRes = await api.get("/community", {
          params: {
            catCd: "CMM001",
            page: 1,
            size: 100,
            searchType: "all",
            keyword: "",
            sortType: "latest",
          },
        });

        // 두 리스트 합치기
        const allPosts = [
          ...(hotplaceRes.data.list || []),
          ...(lifeRes.data.list || []),
        ];

        // 내가 작성한 글만 필터
        const myPosts = allPosts
          .filter(
            (item) => Number(item.commMbrId) === Number(currentUserId)
          )
          .map((item) => ({
            id: item.commNo,
            title: item.commTitle,
            desc: item.commContent,
            image: getImageUrl(item.commMainImgUrl),
            likes: item.commLikeCnt,
            author: item.mbrNickname,
            catCd: item.commCatCd,
          }));

        setPosts(myPosts);
      } catch (error) {
        console.error("내 뽐낼거리 조회 실패:", error);
      }
    };

    fetchMyPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE) || 1;

  const pagedPosts = posts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // 카테고리별 상세 이동
  const handleMoveDetail = (post) => {
    localStorage.setItem("mypageTab", "showcase");

    if (post.catCd === "CMM001") {
      navigate(`/showcase/life/view/${post.id}`);
    } else if (post.catCd === "CMM002") {
      navigate(`/showcase/hotplace/view/${post.id}`);
    }
  };

  return (
    <div className="p-4 md:p-7">
      <h3 className="fs-up-3 font-bold text-gray-700 mb-4">
        내 뽐낼 거리
      </h3>

      <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7 order-2 md:order-4" />

      {pagedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {pagedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleMoveDetail(post)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-3 md:p-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold">
                    {post.title}
                  </span>

                  <span className="text-xs text-gray-500">
                    <span className="text-red-500 mr-1">♥</span>
                    {post.likes}
                  </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {post.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400">
          작성한 뽐낼거리가 없습니다.
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default MyShowcase;