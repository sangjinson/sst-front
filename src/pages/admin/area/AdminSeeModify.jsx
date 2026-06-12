import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "@api/axios";

export default function AdminSeeModify() {
  const navigate = useNavigate();
  //  1. AppRoutes.jsx에 설정된 /admin/area/see/update/:plcNo 에서 번호 추출
  const { plcNo } = useParams();
  const location = useLocation();

  //  2. 전체 필드를 포괄하는 초기 상태 (상태 변수에는 값을 남겨두어 에러 방지)
  const [formData, setFormData] = useState({
    plcName: "",
    plcAddr: "",
    plcDaddr: "",
    plcTelno: "",
    plcHomepage: "",
    plcOverview: "",
    plcFltCd: "",
    plcLat: "",
    plcLot: "",
    seeInfocenter: "",
    seeParking: "",
    seeRestdate: "",
    seeUsetime: "",
  });

  //  3. 데이터 불러오기 (목록에서 넘겨준 state가 있으면 쓰고, 없으면 API 호출)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (location.state?.place) {
          fillFormData(location.state.place);
        } else {
          const response = await api.get(`/admin/see/${plcNo}`);
          fillFormData(response.data.data);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오지 못했습니다.");
        navigate("/admin/area/see");
      }
    };
    fetchDetail();
  }, [plcNo, location.state, navigate]);

  //  4. API 응답 데이터를 폼에 맞게 매핑
  const fillFormData = (data) => {
    setFormData({
      plcName: data.plcName || "",
      plcAddr: data.plcAddr || "",
      plcDaddr: data.plcDaddr || "",
      plcTelno: data.plcTelno || "",
      plcHomepage: data.plcHomepage || "",
      plcOverview: data.plcOverview || "",
      plcFltCd: data.plcFltCd || "",
      plcLat: data.plcLat || "",
      plcLot: data.plcLot || "",
      seeInfocenter: data.seeInfocenter || "",
      seeParking: data.seeParking || "",
      seeRestdate: data.seeRestdate || "",
      seeUsetime: data.seeUsetime || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  5. 수정 전송 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("수정하시겠습니까?")) return;

    try {
      //  백엔드 SeeUpdateRequestDto가 받는 정보만 자동으로 매핑되어 전송됩니다.
      await api.put(`/admin/see/${plcNo}`, formData);
      alert("성공적으로 수정되었습니다.");
      navigate("/admin/area/see"); // 목록으로 복귀
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          볼거리 장소 수정
        </h2>
        <p className="text-sm text-gray-500 mt-1">장소 번호: {plcNo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 공통 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">장소명 *</label>
            <input required type="text" name="plcName" value={formData.plcName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">기본 주소 *</label>
            <input required type="text" name="plcAddr" value={formData.plcAddr} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">상세 주소</label>
            <input type="text" name="plcDaddr" value={formData.plcDaddr} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">전화번호</label>
            <input type="text" name="plcTelno" value={formData.plcTelno} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          {/*  삭제 완료: 필터코드 입력란 제거 */}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">홈페이지</label>
            <input type="text" name="plcHomepage" value={formData.plcHomepage} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>

          {/*  삭제 완료: 멘티 요청으로 위도, 경도 입력란 제거 */}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">장소 개요 (설명)</label>
            <textarea name="plcOverview" value={formData.plcOverview} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500 resize-none"></textarea>
          </div>
        </div>

        {/* 상세 정보 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-gray-100 rounded-lg">
          <div className="md:col-span-2 border-b pb-2 mb-2">
            <h3 className="font-semibold text-gray-800">볼거리 전용 상세 정보</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이용 시간</label>
            <input type="text" name="seeUsetime" value={formData.seeUsetime} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">쉬는 날</label>
            <input type="text" name="seeRestdate" value={formData.seeRestdate} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">주차 정보</label>
            <input type="text" name="seeParking" value={formData.seeParking} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">문의 안내 (전화번호)</label>
            <input type="text" name="seeInfocenter" value={formData.seeInfocenter} onChange={handleChange} className="w-full px-4 py-2 border rounded-md outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition">취소</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition shadow-sm">수정 저장</button>
        </div>
      </form>
    </div>
  );
}