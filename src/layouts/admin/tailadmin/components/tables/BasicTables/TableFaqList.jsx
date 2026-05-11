import React, { useEffect, useState } from "react";
import api from "@api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table"; // 경로에 맞춰 수정 필요
import Badge from "../../ui/badge/Badge"; // 경로에 맞춰 수정 필요

const FaqManage = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({
    csTitle: "",
    csContent: "",
    csPinYn: "N",
  });
  const [editId, setEditId] = useState(null);

  // FAQ 데이터 불러오기
  const fetchFaqs = async () => {
    try {
      const res = await api.get("/customersupport/faq");
      setFaqs(res.data);
    } catch (error) {
      console.error("FAQ 조회 실패:", error);
      alert("FAQ를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
  };

  // 등록 및 수정 제출
  const handleSubmit = async () => {
    if (!form.csTitle.trim() || !form.csContent.trim()) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/admin/customersupport/faq/${editId}`, form);
        alert("성공적으로 수정되었습니다.");
      } else {
        await api.post("/admin/customersupport/faq", {
          ...form,
          csWrterNo: 1, // 관리자 번호 세션 등에 맞춰 조정 가능
        });
        alert("새로운 FAQ가 등록되었습니다.");
      }
      resetForm();
      fetchFaqs();
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // 수정 모드 진입
  const handleEdit = (faq) => {
    setEditId(faq.csNo);
    setForm({
      csTitle: faq.csTitle,
      csContent: faq.csContent,
      csPinYn: faq.csPinYn || "N",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 삭제 처리
  const handleDelete = async (csNo) => {
    if (!window.confirm("정말 이 FAQ를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/admin/customersupport/faq/${csNo}`);
      alert("FAQ가 삭제되었습니다.");
      fetchFaqs();
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ csTitle: "", csContent: "", csPinYn: "N" });
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* 1. 작성/수정 폼 영역 */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-6">
          {editId ? "🔥 FAQ 수정하기" : "📝 새로운 FAQ 등록"}
        </h2>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="csTitle"
              value={form.csTitle}
              onChange={handleChange}
              placeholder="자주 묻는 질문 제목을 입력하세요"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

            <textarea
              name="csContent"
              value={form.csContent}
              onChange={handleChange}
              placeholder="상세한 답변 내용을 입력하세요"
              rows="5"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="csPinYn"
                checked={form.csPinYn === "Y"}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition">
                이 질문을 목록 상단에 고정합니다
              </span>
            </label>

            <div className="flex gap-3">
              {editId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  취소
                </button>
              )}
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition"
              >
                {editId ? "수정 완료" : "FAQ 등록하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 리스트 테이블 영역 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell isHeader className="px-5 py-4 font-bold text-gray-500 text-center text-theme-xs uppercase">
                  번호
                </TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-gray-500 text-center text-theme-xs uppercase">
                  상태
                </TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-gray-500 text-start text-theme-xs uppercase">
                  질문 내용
                </TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-gray-500 text-center text-theme-xs uppercase">
                  등록일
                </TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-gray-500 text-center text-theme-xs uppercase">
                  관리
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <TableRow
                    key={faq.csNo}
                    className={`${
                      faq.csPinYn === "Y"
                        ? "bg-blue-50/30 dark:bg-blue-900/10"
                        : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    } transition-colors`}
                  >
                    <TableCell className="px-5 py-4 text-center text-gray-500 text-theme-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      {faq.csPinYn === "Y" ? (
                        <Badge size="sm" color="success">고정됨</Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm truncate max-w-[400px]" title={faq.csTitle}>
                        {faq.csTitle}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-500 text-theme-sm">
                      {faq.csRegDate ? new Date(faq.csRegDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-3 justify-center items-center">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-theme-xs underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(faq.csNo)}
                          className="text-error-500 hover:text-error-600 font-semibold text-theme-xs underline"
                        >
                          삭제
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="px-5 py-12 text-center text-gray-400">
                    현재 등록된 자주 묻는 질문이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FaqManage;