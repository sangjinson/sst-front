import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@api/axios";
import PageBreadcrumb from "@themeadmin/components/common/PageBreadCrumb";
import PageMeta from "@themeadmin/components/common/PageMeta";

export default function AdminMemberInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 수정 모드 여부 판단 (경로에 'update'가 포함되어 있거나 state로 데이터가 넘어온 경우)
  const isUpdate = location.pathname.includes("update");
  const memberData = location.state?.member;

  const [formData, setFormData] = useState({
    mbrEmail: "",
    mbrPassword: "",
    mbrName: "",
    mbrNickname: "",
    mbrTelno: "",
    mbrZip: "",
    mbrAddr: "",
    mbrDaddr: "",
    mbrAuthCd: "ROLE_USER",
    mbrUseYn: "Y",
  });

  useEffect(() => {
    if (isUpdate && memberData) {
      setFormData({ ...memberData, mbrPassword: "" }); // 수정 시 비밀번호는 초기화
    }
  }, [isUpdate, memberData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await api.put(`/admin/members/${formData.mbrId}`, formData);
        alert("회원 정보가 수정되었습니다.");
      } else {
        await api.post("/admin/members", formData);
        alert("새로운 회원이 등록되었습니다.");
      }
      navigate("/admin/members");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <PageMeta title={isUpdate ? "회원 수정 | 관리자" : "회원 등록 | 관리자"} />
      <PageBreadcrumb pageTitle={isUpdate ? "회원 정보 수정" : "신규 회원 등록"} />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-200 px-6.5 py-4 dark:border-gray-800">
              <h3 className="font-medium text-gray-800 dark:text-white">
                회원 기본 정보
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6.5 space-y-5">
                {/* 이메일 (ID) */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">
                    이메일 (ID) {!isUpdate && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    name="mbrEmail"
                    value={formData.mbrEmail}
                    onChange={handleChange}
                    disabled={isUpdate}
                    placeholder="example@domain.com"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 text-gray-800 outline-none transition focus:border-blue-600 active:border-blue-600 disabled:cursor-default disabled:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.05] dark:text-white"
                    required
                  />
                </div>

                {/* 비밀번호 - 수정 시에는 입력 시에만 변경되도록 처리 권장 */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">
                    비밀번호 {!isUpdate && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="mbrPassword"
                    value={formData.mbrPassword}
                    onChange={handleChange}
                    placeholder={isUpdate ? "변경 시에만 입력하세요" : "비밀번호를 입력하세요"}
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 text-gray-800 outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05] dark:text-white"
                    required={!isUpdate}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* 이름 */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">이름</label>
                    <input
                      type="text"
                      name="mbrName"
                      value={formData.mbrName}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                    />
                  </div>
                  {/* 닉네임 */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">닉네임</label>
                    <input
                      type="text"
                      name="mbrNickname"
                      value={formData.mbrNickname}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">연락처</label>
                  <input
                    type="text"
                    name="mbrTelno"
                    value={formData.mbrTelno}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                  />
                </div>

                {/* 주소 정보 */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-800 dark:text-white">주소</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="mbrZip"
                      value={formData.mbrZip}
                      onChange={handleChange}
                      placeholder="우편번호"
                      className="w-32 rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                    />
                    <button type="button" className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20">주소 검색</button>
                  </div>
                  <input
                    type="text"
                    name="mbrAddr"
                    value={formData.mbrAddr}
                    onChange={handleChange}
                    placeholder="기본 주소"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                  />
                  <input
                    type="text"
                    name="mbrDaddr"
                    value={formData.mbrDaddr}
                    onChange={handleChange}
                    placeholder="상세 주소"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                  />
                </div>

                {/* 권한 및 상태 설정 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">권한 설정</label>
                    <select
                      name="mbrAuthCd"
                      value={formData.mbrAuthCd}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                    >
                      <option value="ROLE_USER">일반회원</option>
                      <option value="ROLE_ADMIN">관리자</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-800 dark:text-white">계정 상태</label>
                    <select
                      name="mbrUseYn"
                      value={formData.mbrUseYn}
                      onChange={handleChange}
                      className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-white/[0.05]"
                    >
                      <option value="Y">활성</option>
                      <option value="N">비활성(차단)</option>
                    </select>
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/members")}
                    className="flex justify-center rounded-lg border border-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-opacity-90"
                  >
                    {isUpdate ? "수정 완료" : "회원 등록"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}