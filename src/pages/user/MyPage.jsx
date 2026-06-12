import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '@api/axios'; 
import { useConfig } from '@hooks/useConfig'; // setConfig를 위해 추가
import { useAuth } from '@hooks/useAuth'; // localLogout을 위해 추가
import { useApi } from '@hooks/useApi';

import { toast, confirm, mapDataToState } from '@utils/common'

/* =========================================== */
// Plugin
/* =========================================== */
import Swal from 'sweetalert2';

/* =========================================== */
// Components
/* =========================================== */
import Breadcrumb from '@components/common/Breadcrumb';
import Sidebar from '@components/mypage/Sidebar';
import MemberInfo from '@components/mypage/MemberInfo';
import MyShowcase from '@components/mypage/MyShowcase';
import MySchedule from '@components/mypage/MySchedule';
import MyWishlist from '@components/mypage/MyWishlist';

const CARDS = [
  { key: 'member',   label: '회원정보',   icon: '👤' },
  { key: 'showcase', label: '내 뽐낼거리', icon: '🖼️' },
  { key: 'schedule', label: '내 일정관리', icon: '📅' },
  { key: 'wishlist', label: '내 찜목록',   icon: '❤️' },
];

const MyPage = () => {
  const apiTool = useApi(); // Api 의 사용
  const { getConfig, setConfig } = useConfig();

  const location = useLocation();
  const { localLogout } = useAuth();
  const [activeSection, setActiveSection] = useState(
    location.state?.tab || sessionStorage.getItem("mypageTab") || "member"
  );

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("mypageTab", activeSection);
  }, [activeSection]);

  const fetchMemberData = async () => {
    try {
      const response = await apiTool.getProfile();
      setProfile(mapDataToState('profile', response.data));
      setConfig('user',mapDataToState('user', response.data));
    } catch (error) {
      console.error('회원 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchMemberData(); }, []);

  // 회원 수정 처리
  const handleProfileUpdate = async (formData) => {
    try {
      // 프로필 데이터를 저장
      const response = await apiTool.updateProfile(formData);
      // 코드가 정상으로 들어왔을 경우.
      if(response.data.httpCode == 200){
        // 반환 데이터를 가져온다.
        const updatedData = response.data.data;

        // 프로필 상태 업데이트
        // 1. 업데이트할 데이터를 미리 변수로 정의 (규격 맞추기)
        const nextProfile = mapDataToState('profile', updatedData, profile) 

        // 2. 상태 업데이트 (Sidebar가 Props로 받는 값)
        setProfile(nextProfile);

        // 3. 전역 설정 동기화 (가공된 데이터를 넘겨야 Sidebar가 useConfig를 써도 반응함)
        setConfig('profile', nextProfile);

        toast({ icon: 'success', title: '프로필 수정 완료!'})

        return true;
      }
      // 프로필 수정에 실패하였으므로 
      throw new Error(response.data.message || "프로필 수정 실패");
      return false;
    } catch (error) {

      toast({ icon: 'error', html: '프로필 수정 실패!</br>관리자에게 문의 하세요.'})
      return false; // 실패 반환
    }
  };

  // 회원 탈퇴 처리
  const handleWithdraw = async () => {
      //  1. SweetAlert2로 탈퇴 사유 모달 띄우기
      const result = await Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        html: `
          <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="radio" name="withdraw-reason" value="WDR001" style="accent-color:#0F9B73;" />
              사용 빈도가 낮아서
            </label>
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="radio" name="withdraw-reason" value="WDR002" style="accent-color:#0F9B73;" />
              서비스 이용이 불편해서
            </label>
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="radio" name="withdraw-reason" value="WDR003" style="accent-color:#0F9B73;" />
              개인정보 보호를 위해
            </label>
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <input type="radio" name="withdraw-reason" value="WDR004" id="reason-etc" style="accent-color:#0F9B73;"
                onclick="document.getElementById('etc-withdraw-wrap').style.display='block'" />
              기타
            </label>
            <div id="etc-withdraw-wrap" style="display:none; margin-top:4px;">
              <textarea id="etc-withdraw-input" placeholder="탈퇴 사유를 알려주시면 서비스 개선에 큰 도움이 됩니다."
                style="width:100%; border:1px solid #e5e7eb; border-radius:8px; padding:10px; font-size:13px; outline:none; resize:none; height:80px;"></textarea>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: '탈퇴하기',
        cancelButtonText: '취소',
        confirmButtonColor: '#ef4444', //  탈퇴는 위험 행동이므로 빨간색 버튼
        cancelButtonColor: '#9ca3af',
        preConfirm: () => {
          const selected = document.querySelector('input[name="withdraw-reason"]:checked');
          if (!selected) {
            Swal.showValidationMessage('탈퇴 사유를 선택해주세요.');
            return false;
          }
          
          let reasonDesc = null;
          if (selected.value === 'WDR004') {
            reasonDesc = document.getElementById('etc-withdraw-input')?.value?.trim();
            if (!reasonDesc) {
              Swal.showValidationMessage('기타 사유를 입력해주세요.');
              return false;
            }
          }
          
          return { reasonCd: selected.value, reasonDesc };
        },
      });
  
      if (!result.isConfirmed) return;
  
      try {
        //  2. axios delete 요청 시 body에 데이터를 담으려면 { data: payload } 구조를 사용해야 합니다.
        await apiTool.withdrawMember(result.value);
        
        await Swal.fire({
          icon: 'success',
          title: '탈퇴 완료',
          text: '그동안 거리에섯을 이용해 주셔서 감사합니다.',
          timer: 1500,
          showConfirmButton: false,
        });
        
        localLogout(); // 전역 상태 초기화 및 메인 이동
      } catch (error) {
        alert('탈퇴 처리 중 문제가 발생했습니다.');
      }
    };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || '';

  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:px-10 lg:py-10">
        <div className="w-full flex justify-start mb-6">
          <Breadcrumb
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <Sidebar profile={profile} />

          <section className="flex-1 min-w-0 flex flex-col gap-4 w-full">
            <div className="relative">
              <div className={`
                fixed bottom-0 left-0 right-0 z-[100] px-2 h-16 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]
                md:relative md:h-auto md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:px-0 md:z-0
                grid grid-cols-4 gap-x-2 md:gap-x-4 
              `}>
                {CARDS.map((card) => (
                  <div
                    key={card.key}
                    onClick={() => setActiveSection(card.key)}
                    className={`
                      flex flex-col items-center justify-center flex-1 gap-1 cursor-pointer transition-all
                      md:flex-row md:justify-between md:px-5 md:py-3.5 md:rounded-lg md:border-[1.5px] md:hover:shadow-md
                      ${activeSection === card.key
                        ? 'text-[#0F9B73] md:border-[#0F9B73] md:bg-[#f0fdf9]'
                        : 'text-gray-400 md:text-gray-700 md:border-gray-200 md:bg-white md:hover:border-[#0F9B73]'
                      }
                    `}
                  >
                    <span className="text-2xl md:text-xl md:order-2">{card.icon}</span>
                    <span className="text-[10px] font-bold md:text-[15px] md:order-1">{card.label}</span>
                    {activeSection === card.key && (
                      <div className="w-1 h-1 bg-[#0F9B73] rounded-full md:hidden" />
                    )}
                  </div>
                ))}
                <div className="h-[env(safe-area-inset-bottom)] md:h-0" />
              </div>
            </div>

            <div key={activeSection} className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] animate-[fadeIn_0.3s_ease-in-out]">
              {loading ? (
                <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
              ) : (
                <>
                  {activeSection === 'member' && (
                    <MemberInfo 
                      profile={profile} 
                      onUpdate={handleProfileUpdate} 
                      onWithdraw={handleWithdraw} 
                    />
                  )}
                  {activeSection === 'showcase' && <MyShowcase />}
                  {activeSection === 'schedule' && <MySchedule />}
                  {activeSection === 'wishlist' && <MyWishlist />}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyPage;