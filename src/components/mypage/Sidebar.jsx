import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth'; 

const Sidebar = ({ profile, profileImg, coverImg, onImgChange, onCoverChange, imgRef, coverRef }) => {
  const { user } = useAuth();

  // 기본 이미지 경로
  const defaultProfile = "/assets/images/default-user.png";

  const handleCoverBtnClick = () => {
    if (coverRef && coverRef.current) coverRef.current.click();
  };

  const handleProfileBtnClick = () => {
    if (imgRef && imgRef.current) imgRef.current.click();
  };

  return (
    <aside className="hidden lg:flex flex-col gap-4 max-w-[250px] shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <h3 className="fs-up-3 font-bold text-center text-gray-700 py-4">마이페이지</h3>
        <hr className="w-full border-b border-t-0 border-gray-200" />
        
        <div className="relative mb-14">
          {/* 배경 이미지 영역 */}
          <div className="relative w-full h-28 bg-gray-200 cursor-pointer" onClick={handleCoverBtnClick}>
            {coverImg && (
              <img 
                src={coverImg} 
                alt="배경"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
          </div>
          
          {/* 프로필 이미지 영역 - 요청하신 로직 반영 */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 cursor-pointer" onClick={handleProfileBtnClick}>
            <div className="w-full h-full rounded-full border-[3px] border-[#0F9B73] shadow-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              {user?.mbrProfileInfo?.filePath ? (
                <img 
                  src={user.mbrProfileInfo.filePath} 
                  alt="프로필" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultProfile;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-bold">
                    {user?.mbrNickname?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={onImgChange} />
          </div>
        </div>

        <div className="flex flex-col items-center px-5 pb-5">
          <div className="fs-up-2 font-bold text-gray-900 mb-2">{user?.mbrNickname || "미지정"} 🏅</div>
          <hr className="w-full border-b border-t-0 border-gray-200 my-2" />
          <ul className="w-full flex flex-col gap-3 py-2 fs-up-2 text-gray-700">
            <li className="flex items-start gap-1.5"><span>📅</span>가입일: {user?.mbrRegDate || "0000.00.00"}</li>
            <li className="flex items-start gap-1.5"><span>📞</span>{user?.mbrPhone || "등록된 번호 없음"}</li>
            <li className="flex items-start gap-1.5"><span>✉️</span>{user?.mbrEmail || "이메일 정보 없음"}</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="fs-up-3 font-bold text-center text-gray-700 mb-3">고객센터</h3>
        <hr className="w-full border-b border-t-0 border-gray-200 my-2" />
        <ul className="flex flex-col gap-1.5 fs-up-2">
          <li>
            <Link to="/customersupport/notice" className="text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
              <span>👤</span> 공지사항
            </Link>
          </li>
          <li>
            <Link to="/customersupport/faq" className="text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
              <span>❓</span> 자주 하는 질문
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;