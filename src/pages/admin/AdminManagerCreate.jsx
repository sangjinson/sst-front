import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@api/axios";

export default function AdminManagerCreate() {
  const navigate = useNavigate();

  //  1. 상태 관리: 백엔드 DTO(AdminMemberCreateRequest) 규격에 맞게 초기값 세팅
  const [form, setForm] = useState({
    mbrEmail: "",
    mbrPassword: "",
    mbrName: "",
    mbrNickname: "",
    mbrTelno: "",
    mbrZip: "00000",        // 임시 기본값 (필요시 UI 추가)
    mbrAddr: "본사",         // 임시 기본값
    mbrDaddr: "관리자",       // 임시 기본값
    mbrAuthCd: "ROLE_ADMIN", //  핵심: 사용자가 선택하지 못하게 관리자 권한으로 하드코딩 고정
    mbrUseYn: "Y"            //  생성 시 기본으로 활성화 상태
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 프론트엔드 유효성 검사
    if (!form.mbrEmail || !form.mbrPassword || !form.mbrName || !form.mbrNickname) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      //  2. 백엔드 관리자 생성 API 호출 (자동으로 JWT 쿠키가 함께 전송됨)
      await api.post("/admin/members", form);
      alert("새로운 관리자 계정이 생성되었습니다.");
      navigate("/admin/managers"); //  성공 시 목록 페이지로 복귀
    } catch (error) {
      console.error("관리자 생성 실패:", error);
      // 백엔드에서 던진 예외 메시지(예: 이메일 중복 등) 처리
      const errMsg = error.response?.data?.message || "관리자 생성 중 오류가 발생했습니다.";
      alert(errMsg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">신규 관리자 등록</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          뒤로 가기
        </button>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              이메일 (아이디) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="mbrEmail"
              value={form.mbrEmail}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              초기 비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="mbrPassword"
              value={form.mbrPassword}
              onChange={handleChange}
              placeholder="8자 이상 입력"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* 이름 & 닉네임 */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                실명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mbrName"
                value={form.mbrName}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                닉네임 (부서/직급 등) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mbrNickname"
                value={form.mbrNickname}
                onChange={handleChange}
                placeholder="운영팀_홍길동"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              연락처
            </label>
            <input
              type="text"
              name="mbrTelno"
              value={form.mbrTelno}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              className="w-full px-4 py-3 text-sm font-bold text-white transition bg-gray-900 rounded-lg hover:bg-gray-800 shadow-sm"
            >
              관리자 계정 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}