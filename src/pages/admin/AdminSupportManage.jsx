import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "@api/axios";
import { PencilIcon, TrashBinIcon } from "@components/Icon";

export default function AdminSupportManage() {
  const { type } = useParams();

  // 🚀 type에 따른 설정값 동적 매핑
  const CONFIG = {
    notices: {
      title: "공지사항",
      apiPath: "notice",
      titlePlaceholder: "공지사항 제목",
      contentPlaceholder: "공지사항 내용",
      emptyMessage: "등록된 공지사항이 없습니다."
    },
    faq: {
      title: "FAQ",
      apiPath: "faq",
      titlePlaceholder: "질문 제목",
      contentPlaceholder: "답변 내용",
      emptyMessage: "등록된 FAQ가 없습니다."
    }
  };

  const currentConfig = CONFIG[type];

  // 잘못된 URL 접근 시 방어 로직
  if (!currentConfig) {
    return <Navigate to="/admin" replace />;
  }

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    csTitle: "",
    csContent: "",
    csPinYn: "N",
  });
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/customersupport/${currentConfig.apiPath}`);
      setItems(res.data);
    } catch (error) {
      console.error(`${currentConfig.title} 조회 실패:`, error);
      alert(`${currentConfig.title}을(를) 불러오지 못했습니다.`);
    }
  };

  // 메뉴(type) 변경 시 데이터 다시 불러오고 폼 초기화
  useEffect(() => {
    fetchItems();
    handleCancelEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleChange = (e) => {
    const { name, value, checked, type: inputType } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.csTitle.trim()) {
      alert(`${currentConfig.titlePlaceholder}을(를) 입력해주세요.`);
      return;
    }

    if (!form.csContent.trim()) {
      alert(`${currentConfig.contentPlaceholder}을(를) 입력해주세요.`);
      return;
    }

    try {
      if (editId) {
        await api.put(`/admin/customersupport/${currentConfig.apiPath}/${editId}`, form);
        alert(`${currentConfig.title}이(가) 수정되었습니다.`);
      } else {
        await api.post(`/admin/customersupport/${currentConfig.apiPath}`, {
          ...form,
          csWrterNo: 1,
        });
        alert(`${currentConfig.title}이(가) 등록되었습니다.`);
      }

      handleCancelEdit();
      fetchItems();
    } catch (error) {
      console.error(`${currentConfig.title} 저장 실패:`, error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.csNo);
    setForm({
      csTitle: item.csTitle,
      csContent: item.csContent,
      csPinYn: item.csPinYn || "N",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (csNo) => {
    if (!window.confirm(`정말 이 ${currentConfig.title}을(를) 삭제하시겠습니까?`)) return;

    try {
      await api.delete(`/admin/customersupport/${currentConfig.apiPath}/${csNo}`);
      alert(`${currentConfig.title}이(가) 삭제되었습니다.`);
      fetchItems();
    } catch (error) {
      console.error(`${currentConfig.title} 삭제 실패:`, error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({
      csTitle: "",
      csContent: "",
      csPinYn: "N",
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{currentConfig.title} 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            고객센터 {currentConfig.title} 게시물을 등록하고 관리합니다.
          </p>
        </div>
      </div>

      {/* 🚀 작성 폼 영역 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          {editId ? `${currentConfig.title} 수정` : `${currentConfig.title} 작성`}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="csTitle"
            value={form.csTitle}
            onChange={handleChange}
            placeholder={currentConfig.titlePlaceholder}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#0F9B73] placeholder-gray-400 dark:placeholder-gray-500"
          />

          <textarea
            name="csContent"
            value={form.csContent}
            onChange={handleChange}
            placeholder={currentConfig.contentPlaceholder}
            rows="6"
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#0F9B73] placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                name="csPinYn"
                checked={form.csPinYn === "Y"}
                onChange={handleChange}
                className="w-4 h-4 text-[#0F9B73] bg-gray-100 border-gray-300 rounded focus:ring-[#0F9B73] dark:bg-gray-700 dark:border-gray-600"
              />
              상단 고정
            </label>

            <div className="flex gap-2">
              {editId && (
                <button
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  취소
                </button>
              )}
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-[#0F9B73] text-white text-sm font-bold rounded-lg hover:bg-[#0c8261] shadow-sm"
              >
                {editId ? "수정완료" : "등록하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 리스트 테이블 영역 (컴포넌트 제거 및 다크모드 대응) */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-fixed text-sm text-center whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
              <tr>
                <th className="px-5 py-3 w-[10%]">번호</th>
                <th className="px-5 py-3 w-[15%]">상태</th>
                <th className="px-5 py-3 w-[45%] text-left">제목</th>
                <th className="px-5 py-3 w-[15%]">등록일</th>
                <th className="px-5 py-3 w-[15%]">관리</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-gray-500 dark:text-gray-400 font-medium">
                    {currentConfig.emptyMessage}
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.csNo} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{item.csNo}</td>
                    
                    <td className="px-5 py-4">
                      {item.csPinYn === "Y" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          고정
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-left font-medium text-gray-800 dark:text-gray-200 truncate" title={item.csTitle}>
                      {item.csTitle}
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {item.csRegDate ? new Date(item.csRegDate).toLocaleDateString() : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg"
                          title="수정"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.csNo)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                          title="삭제"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}