import React, { useState, useEffect } from 'react';

const COOKIE_NAME = 'hidePortfolioNotice';

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const setCookie = (name, value, hours) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const PortfolioNoticeModal = () => {
  const [show, setShow] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_NAME)) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowToday) {
      setCookie(COOKIE_NAME, 'true', 24);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-12 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          포트폴리오 프로젝트 안내
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-5">
          본 사이트는 팀 [SST]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며,
          일체의 상업적 목적이 없음을 밝힙니다. <br/><br/>
          
          [일반 회원] <br/> id : user@sst.com / pw : user1234 <br/>
          [관리자] <br/> id : admin@sst.com / pw : admin1234 <br/>
        </p>

        <label className="flex items-center gap-2 mb-4 cursor-pointer text-sm text-gray-500">
          <input
            type="checkbox"
            checked={dontShowToday}
            onChange={(e) => setDontShowToday(e.target.checked)}
            className="accent-[#0F9B73]"
          />
          오늘 하루 보지 않기
        </label>

        <button
          onClick={handleClose}
          className="w-full rounded-xl bg-[#0F9B73] py-2.5 font-bold text-white hover:bg-[#0d8a66] transition"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default PortfolioNoticeModal;