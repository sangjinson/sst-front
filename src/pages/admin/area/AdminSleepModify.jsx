import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@api/axios";

export default function AdminSleepModify() {
  const { plcNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const passedPlace = location.state?.place || location.state?.item;

  //  잘거리(Sleep) 전용 필드들 구성
  const [form, setForm] = useState({
    plcName: passedPlace?.plcName || "",
    plcAddr: passedPlace?.plcAddr || "",
    plcDaddr: passedPlace?.plcDaddr || "",
    plcTelno: passedPlace?.plcTelno || "",
    plcHomepage: passedPlace?.plcHomepage || "",
    plcOverview: passedPlace?.plcOverview || "",
    sleepCheckIn: passedPlace?.sleepCheckIn || "",
    sleepCheckOut: passedPlace?.sleepCheckOut || "",
    sleepInfocenter: passedPlace?.sleepInfocenter || "",
    sleepParking: passedPlace?.sleepParking || "",
    sleepReservation: passedPlace?.sleepReservation || "",
    sleepReservationUrl: passedPlace?.sleepReservationUrl || "",
    sleepSubFacility: passedPlace?.sleepSubFacility || "",
    // 부대시설 여부 (기본값 0)
    sleepBarbecu: passedPlace?.sleepBarbecu || 0,
    sleepBeauty: passedPlace?.sleepBeauty || 0,
    sleepBeverage: passedPlace?.sleepBeverage || 0,
    sleepBicycle: passedPlace?.sleepBicycle || 0,
    sleepCampfire: passedPlace?.sleepCampfire || 0,
    sleepFitness: passedPlace?.sleepFitness || 0,
    sleepKaraoke: passedPlace?.sleepKaraoke || 0,
    sleepPublicBath: passedPlace?.sleepPublicBath || 0,
    sleepPublicPc: passedPlace?.sleepPublicPc || 0,
    sleepSauna: passedPlace?.sleepSauna || 0,
    sleepSeminar: passedPlace?.sleepSeminar || 0,
    sleepSports: passedPlace?.sleepSports || 0,
  });

  useEffect(() => {
    if (!passedPlace) {
      const fetchDetail = async () => {
        try {
          const response = await api.get(`/admin/sleep/${plcNo}`);
          const data = response.data?.data || response.data; 
          
          setForm({
            plcName: data.plcName || "",
            plcAddr: data.plcAddr || "",
            plcDaddr: data.plcDaddr || "",
            plcTelno: data.plcTelno || "",
            plcHomepage: data.plcHomepage || "",
            plcOverview: data.plcOverview || "",
            sleepCheckIn: data.sleepCheckIn || "",
            sleepCheckOut: data.sleepCheckOut || "",
            sleepInfocenter: data.sleepInfocenter || "",
            sleepParking: data.sleepParking || "",
            sleepReservation: data.sleepReservation || "",
            sleepReservationUrl: data.sleepReservationUrl || "",
            sleepSubFacility: data.sleepSubFacility || "",
            sleepBarbecu: data.sleepBarbecu || 0,
            sleepBeauty: data.sleepBeauty || 0,
            sleepBeverage: data.sleepBeverage || 0,
            sleepBicycle: data.sleepBicycle || 0,
            sleepCampfire: data.sleepCampfire || 0,
            sleepFitness: data.sleepFitness || 0,
            sleepKaraoke: data.sleepKaraoke || 0,
            sleepPublicBath: data.sleepPublicBath || 0,
            sleepPublicPc: data.sleepPublicPc || 0,
            sleepSauna: data.sleepSauna || 0,
            sleepSeminar: data.sleepSeminar || 0,
            sleepSports: data.sleepSports || 0,
          });
        } catch (error) {
          console.error("데이터 조회 실패:", error);
          alert("데이터를 불러오지 못했습니다.");
          navigate(-1);
        }
      };
      fetchDetail();
    }
  }, [plcNo, passedPlace, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  체크박스는 0 또는 1로 변환하여 저장
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("숙소 정보를 수정하시겠습니까?")) return;

    try {
      await api.put(`/admin/sleep/${plcNo}`, form);
      alert("성공적으로 수정되었습니다.");
      navigate("/admin/area/sleep"); 
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  //  부대시설 목록 배열화 (렌더링 맵핑용)
  const facilities = [
    { key: "sleepBarbecu", label: "바비큐장" },
    { key: "sleepBeauty", label: "뷰티시설" },
    { key: "sleepBeverage", label: "식음료장" },
    { key: "sleepBicycle", label: "자전거대여" },
    { key: "sleepCampfire", label: "캠프파이어" },
    { key: "sleepFitness", label: "피트니스" },
    { key: "sleepKaraoke", label: "노래방" },
    { key: "sleepPublicBath", label: "공용샤워실" },
    { key: "sleepPublicPc", label: "공용 PC실" },
    { key: "sleepSauna", label: "사우나실" },
    { key: "sleepSeminar", label: "세미나실" },
    { key: "sleepSports", label: "스포츠시설" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">숙박 정보 수정</h2>
      <p className="text-sm text-gray-500 mb-6">장소 번호: {plcNo}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 공통 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">숙소명 *</label>
            <input required type="text" name="plcName" value={form.plcName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">기본 주소 *</label>
            <input required type="text" name="plcAddr" value={form.plcAddr} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">상세 주소</label>
            <input type="text" name="plcDaddr" value={form.plcDaddr} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 bg-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">전화번호</label>
            <input type="text" name="plcTelno" value={form.plcTelno} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">홈페이지</label>
            <input type="text" name="plcHomepage" value={form.plcHomepage} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 bg-white" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">장소 소개</label>
            <textarea name="plcOverview" value={form.plcOverview} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 resize-none bg-white"></textarea>
          </div>
        </div>

        {/*  잘거리(Sleep) 전용 상세 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-gray-100 rounded-lg">
          <div className="md:col-span-2 border-b pb-2 mb-2">
            <h3 className="font-semibold text-gray-800">숙박 전용 상세 정보</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">체크인 시간</label>
            <input type="time" name="sleepCheckIn" value={form.sleepCheckIn} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">체크아웃 시간</label>
            <input type="time" name="sleepCheckOut" value={form.sleepCheckOut} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">예약 안내 (전화/설명 등)</label>
            <input type="text" name="sleepReservation" value={form.sleepReservation} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">예약 URL</label>
            <input type="text" name="sleepReservationUrl" value={form.sleepReservationUrl} onChange={handleChange} placeholder="http://..." className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">주차 안내</label>
            <input type="text" name="sleepParking" value={form.sleepParking} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">숙소 문의 안내</label>
            <input type="text" name="sleepInfocenter" value={form.sleepInfocenter} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">부대 시설 여부</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilities.map((fac) => (
                <label key={fac.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={fac.key}
                    checked={form[fac.key] === 1}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{fac.label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">기타 부대시설 내용</label>
              <input type="text" name="sleepSubFacility" value={form.sleepSubFacility} onChange={handleChange} placeholder="위 체크박스 외 기타 시설" className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 border rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-[#0F9B73] text-white font-semibold rounded-lg hover:bg-[#0d8a66] shadow-md transition"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}