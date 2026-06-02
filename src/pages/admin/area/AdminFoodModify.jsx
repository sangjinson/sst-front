import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@api/axios";

export default function AdminFoodModify() {
  const { plcNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  //  목록에서 넘어온 데이터를 받습니다 (AppRoutes의 라우팅 구조에 맞춤)
  const passedPlace = location.state?.place || location.state?.item;

  //  먹거리(Food) 전용 필드들로 초기 상태 구성
  const [form, setForm] = useState({
    plcName: passedPlace?.plcName || "",
    plcAddr: passedPlace?.plcAddr || "",
    plcDaddr: passedPlace?.plcDaddr || "",
    plcTelno: passedPlace?.plcTelno || "",
    plcHomepage: passedPlace?.plcHomepage || "",
    plcOverview: passedPlace?.plcOverview || "",
    foodOpeningHours: passedPlace?.foodOpeningHours || "",
    foodRestdate: passedPlace?.foodRestdate || "",
    foodParking: passedPlace?.foodParking || "",
    foodMenu: passedPlace?.foodMenu || "",
    foodInfocenter: passedPlace?.foodInfocenter || "",
  });

  //  새로고침 시 데이터 유지 로직
  useEffect(() => {
    if (!passedPlace) {
      const fetchDetail = async () => {
        try {
          const response = await api.get(`/admin/food/${plcNo}`);
          const data = response.data?.data || response.data; 
          
          setForm({
            plcName: data.plcName || "",
            plcAddr: data.plcAddr || "",
            plcDaddr: data.plcDaddr || "",
            plcTelno: data.plcTelno || "",
            plcHomepage: data.plcHomepage || "",
            plcOverview: data.plcOverview || "",
            foodOpeningHours: data.foodOpeningHours || "",
            foodRestdate: data.foodRestdate || "",
            foodParking: data.foodParking || "",
            foodMenu: data.foodMenu || "",
            foodInfocenter: data.foodInfocenter || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("먹거리 정보를 수정하시겠습니까?")) return;

    try {
      //  백엔드에 PUT 요청 (인터셉터가 쿠키/토큰을 알아서 처리합니다)
      await api.put(`/admin/food/${plcNo}`, form);
      alert("성공적으로 수정되었습니다.");
      navigate("/admin/area/food"); // 먹거리 목록으로 복귀
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">먹거리 정보 수정</h2>
      <p className="text-sm text-gray-500 mb-6">장소 번호: {plcNo}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 공통 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">장소명 *</label>
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

        {/*  먹거리(Food) 전용 상세 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-gray-100 rounded-lg">
          <div className="md:col-span-2 border-b pb-2 mb-2">
            <h3 className="font-semibold text-gray-800">먹거리 전용 상세 정보</h3>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">대표 메뉴</label>
            <input type="text" name="foodMenu" value={form.foodMenu} onChange={handleChange} placeholder="예: 한우육회비빔밥, 갈비탕" className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">영업 시간</label>
            <input type="text" name="foodOpeningHours" value={form.foodOpeningHours} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">쉬는 날</label>
            <input type="text" name="foodRestdate" value={form.foodRestdate} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">주차 정보</label>
            <input type="text" name="foodParking" value={form.foodParking} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">문의 안내</label>
            <input type="text" name="foodInfocenter" value={form.foodInfocenter} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
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