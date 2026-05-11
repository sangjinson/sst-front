import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "@api/axios";
import { ArrowLeftIcon, PaperPlaneIcon } from "@themeadmin/icons";

export default function AdminStreetForm() {
  const { type } = useParams(); // food, play, see, sleep
  const { state } = useLocation(); // 수정 시 전달받은 데이터
  const navigate = useNavigate();
  const isUpdate = !!state?.data;

  // 🚀 공통 및 전용 필드 초기화
  const [formData, setFormData] = useState({
    plcName: "", plcRgnCd: "", plcAddr: "", plcDaddr: "", 
    plcTelno: "", plcHomepage: "", plcOverview: "",
    // 전용 필드들 (초기값 설정)
    foodOpeningHours: "", foodMenu: "", foodParking: "",
    playUsetime: "", playEventStart: "", playEventEnd: "",
    seeUsetime: "", seeParking: "",
    sleepCheckIn: "15:00", sleepCheckOut: "11:00", sleepReservationUrl: "",
  });

  useEffect(() => {
    if (isUpdate) {
      setFormData({ ...state.data });
    }
  }, [isUpdate, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await api.put(`/admin/street/${type}/${formData.plcNo}`, formData);
        alert("수정되었습니다.");
      } else {
        await api.post(`/admin/street/${type}`, formData);
        alert("등록되었습니다.");
      }
      navigate(`/admin/street/${type}`);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 🚀 타입별 추가 폼 렌더링
  const renderExtraFields = () => {
    switch (type) {
      case "food":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">대표 메뉴</label><input name="foodMenu" value={formData.foodMenu || ""} onChange={handleChange} className="input" /></div>
            <div><label className="label">영업 시간</label><input name="foodOpeningHours" value={formData.foodOpeningHours || ""} onChange={handleChange} className="input" /></div>
          </div>
        );
      case "play":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">이용 시간</label><input name="playUsetime" value={formData.playUsetime || ""} onChange={handleChange} className="input" /></div>
            <div><label className="label">행사 시작일</label><input type="date" name="playEventStart" value={formData.playEventStart || ""} onChange={handleChange} className="input" /></div>
          </div>
        );
      case "sleep":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">체크인</label><input name="sleepCheckIn" value={formData.sleepCheckIn || ""} onChange={handleChange} className="input" /></div>
            <div><label className="label">체크아웃</label><input name="sleepCheckOut" value={formData.sleepCheckOut || ""} onChange={handleChange} className="input" /></div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeftIcon className="w-5 h-5" /> 뒤로가기
        </button>
        <h2 className="text-2xl font-bold">{isUpdate ? "정보 수정" : "신규 등록"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/[0.03] p-8 rounded-2xl border border-gray-200 dark:border-white/[0.05] shadow-sm space-y-6">
        {/* 공통 필드 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600">기본 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">장소명</label>
              <input required name="plcName" value={formData.plcName} onChange={handleChange} className="input" placeholder="이름을 입력하세요" />
            </div>
            <div>
              <label className="label">연락처</label>
              <input name="plcTelno" value={formData.plcTelno} onChange={handleChange} className="input" placeholder="02-123-4567" />
            </div>
            <div>
              <label className="label">지역 코드</label>
              <input type="number" name="plcRgnCd" value={formData.plcRgnCd} onChange={handleChange} className="input" />
            </div>
            <div className="col-span-2">
              <label className="label">주소</label>
              <input name="plcAddr" value={formData.plcAddr} onChange={handleChange} className="input" placeholder="기본 주소" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-white/[0.05]" />

        {/* 타입별 전용 필드 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-600">상세 정보 ({type.toUpperCase()})</h3>
          {renderExtraFields()}
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            <PaperPlaneIcon className="w-5 h-5 text-white" />
            {isUpdate ? "수정 완료" : "정보 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}