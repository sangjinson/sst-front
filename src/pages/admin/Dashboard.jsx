import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import PageMeta from "@themeadmin/components/common/PageMeta";
import api from "@api/axios"; 

export default function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMembers: 0,
    newMembersToday: 0,
    totalPosts: 0,
    totalReports: 0,
    recentMembers: [],
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("대시보드 통계 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    { label: '전체 회원 수', value: stats.totalMembers, icon: '👥', bgColor: 'bg-blue-500', path: '/admin/members' },
    { label: '오늘 가입 수', value: stats.newMembersToday, icon: '✨', bgColor: 'bg-emerald-500', path: '/admin/members' },
    { label: '전체 게시글', value: stats.totalPosts, icon: '📝', bgColor: 'bg-yellow-500', path: '/admin/showcase/hotplace' }, 
    { label: '신고 건수', value: stats.totalReports, icon: '🚨', bgColor: 'bg-red-500', path: '/admin/report' }, 
  ];

  return (
    <>
      <PageMeta
        title="시스템 현황 | 거리에섯 관리자"
        description="거리에섯 관리자 시스템 현황 대시보드입니다."
      />
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          시스템 현황
        </h2>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-500 dark:text-gray-400">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <>
            {/* 1. 상단 핵심 지표(KPI) 카드 영역 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(card.path)}
                  className={`${card.bgColor} rounded-2xl p-6 text-white h-40 flex flex-col justify-between shadow-md transition-transform hover:-translate-y-1 cursor-pointer`} 
                >
                  <div className="flex items-center gap-2 text-[1.1rem] font-medium tracking-wide opacity-95">
                    <span>{card.icon}</span>
                    <span>{card.label}</span>
                  </div>
                  <div className="text-5xl font-bold text-right tracking-tight drop-shadow-sm">
                    {card.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. 하단 최근 활동 리스트 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              
              {/* 최근 가입 회원 리스트 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">최근 가입 회원</h3>
                  <button onClick={() => navigate('/admin/members')} className="text-sm text-[#0F9B73] hover:underline">더보기</button>
                </div>
                <ul className="space-y-3">
                  {stats.recentMembers?.length > 0 ? (
                    stats.recentMembers.map((member) => (
                      <li key={member.mbrId} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{member.mbrNickname}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{member.mbrEmail}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(member.mbrJoinDate).toLocaleDateString('ko-KR')}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 dark:text-gray-600 py-4 text-sm">최근 가입한 회원이 없습니다.</div>
                  )}
                </ul>
              </div>

              {/* 최근 게시글 리스트 */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">최근 등록된 뽐낼거리</h3>
                  <button onClick={() => navigate('/admin/showcase/hotplace')} className="text-sm text-[#0F9B73] hover:underline">더보기</button>
                </div>
                <ul className="space-y-3">
                  {stats.recentPosts?.length > 0 ? (
                    stats.recentPosts.map((post) => (
                      <li key={post.commNo} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <span className="font-medium text-gray-700 dark:text-gray-200 truncate pr-4">{post.commTitle}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(post.commRegDate).toLocaleDateString('ko-KR')}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 dark:text-gray-600 py-4 text-sm">최근 등록된 게시글이 없습니다.</div>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}