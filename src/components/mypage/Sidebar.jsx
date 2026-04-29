// src/components/mypage/Sidebar.jsx
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ profile }) => {
  const fileInputRef = useRef(null);
  
  // 선택한 이미지를 화면에 바로 보여주기 위한 로컬 상태
  const [previewImage, setPreviewImage] = useState(null);

  // 프로필(카메라) 클릭 시 숨겨진 input 태그를 클릭하는 효과
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // 파일이 선택되었을 때 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // FileReader를 사용해 브라우저에서 이미지 미리보기를 생성합니다.
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // 변환된 이미지 URL을 상태에 저장
        
        // 🚀 실제 프로젝트(백엔드 연동 시)에는 이 부분에 
        // 폼데이터(FormData)를 만들어 서버로 axios.post 요청을 보내는 코드를 작성하시면 됩니다.
        console.log("업로드할 파일 객체:", file);
      };
      reader.readAsDataURL(file);
    }
  };

  // 화면에 보여줄 이미지 결정 (미리보기 이미지 -> 기존 프로필 이미지 -> 기본 이미지 순서)
  const displayImage = previewImage || profile.image || "https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png";

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[220px] shrink-0">
      
      {/* 상단: 프로필 영역 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">마이페이지</h3>
        <div className="flex flex-col items-center gap-2 mb-4">
          
          {/* 🚀 프로필 이미지 및 변경 버튼 영역 */}
          <div 
            className="relative inline-block cursor-pointer group" 
            onClick={handleImageClick}
          >
            <img 
              src={displayImage} 
              alt="프로필" 
              className="w-16 h-16 rounded-full object-cover border-[3px] border-[#0F9B73] transition-all duration-300" 
            />
            
            {/* 마우스 호버 시 나타나는 검은색 반투명 오버레이와 카메라 아이콘 */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xl">📷</span>
            </div>

            {/* 실제 파일 선택 창 (화면에서는 숨김 처리) */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>

          <div className="font-bold text-gray-900">{profile.name} 🏅</div>
          <div className="text-xs text-gray-500 text-center leading-relaxed">
            안녕하세요! {profile.name}입니다.<br />리액트 참 좋네요! 잘 부탁드려요.
          </div>
        </div>
        
        {/* 회원 정보 리스트 */}
        <ul className="flex flex-col gap-2">
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">🗺️</span>{profile.location} 거주
          </li>
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">📅</span>가입일: 2026-04-10
          </li>
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">📞</span>{profile.phone}
          </li>
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">✉️</span>{profile.email}
          </li>
        </ul>
      </div>

      {/* 하단: 프로필 더보기 영역 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3">프로필 더보기</h3>
        <ul className="flex flex-col gap-1.5">
          <Link to="/customersupport/notice" className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
            <span>👤</span> 공지사항
          </Link>
          <Link to="/customersupport/faq" className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
            <span>❓</span> 자주 하는 질문
          </Link>
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;