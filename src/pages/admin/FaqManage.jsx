import React, { useEffect, useState } from "react";
import api from "@api/axios";

const FaqManage = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({
    csTitle: "",
    csContent: "",
    csPinYn: "N",
  });
  const [editId, setEditId] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.csTitle.trim()) {
      alert("질문 제목을 입력해주세요.");
      return;
    }

    if (!form.csContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/admin/customersupport/faq/${editId}`, form);
        alert("FAQ가 수정되었습니다.");
      } else {
        await api.post("/admin/customersupport/faq", {
          ...form,
          csWrterNo: 1,
        });
        alert("FAQ가 등록되었습니다.");
      }

      setForm({
        csTitle: "",
        csContent: "",
        csPinYn: "N",
      });
      setEditId(null);
      fetchFaqs();
    } catch (error) {
      console.error("FAQ 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq.csNo);
    setForm({
      csTitle: faq.csTitle,
      csContent: faq.csContent,
      csPinYn: faq.csPinYn || "N",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (csNo) => {
    if (!window.confirm("정말 이 FAQ를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/customersupport/faq/${csNo}`);
      alert("FAQ가 삭제되었습니다.");
      fetchFaqs();
    } catch (error) {
      console.error("FAQ 삭제 실패:", error);
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">FAQ 관리</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">
          {editId ? "FAQ 수정" : "FAQ 작성"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="csTitle"
            value={form.csTitle}
            onChange={handleChange}
            placeholder="질문 제목"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 fs-down-1"
          />

          <textarea
            name="csContent"
            value={form.csContent}
            onChange={handleChange}
            placeholder="답변 내용"
            rows="8"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 fs-down-1 resize-none"
          />

          <label className="flex items-center gap-2 fs-down-1">
            <input
              type="checkbox"
              name="csPinYn"
              checked={form.csPinYn === "Y"}
              onChange={handleChange}
            />
            상단 고정
          </label>

          <div className="flex gap-2 justify-end">
            {editId && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-400 text-white fs-down-1 rounded hover:bg-gray-500">
                취소
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white fs-down-1 rounded hover:bg-blue-700">
              {editId ? "수정" : "등록"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full table-fixed fs-down-1 text-center">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3 w-[10%]">번호</th>
              <th className="p-3 w-[20%]">고정</th>
              <th className="p-3 w-[20%]">질문</th>
              <th className="p-3 w-[20%]">등록일</th>
              <th className="p-3 w-[15%]">관리</th>
            </tr>
          </thead>

          <tbody>
            {faqs.map((faq, index) => (
              <tr key={faq.csNo} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  {faq.csPinYn === "Y" ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                      고정
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 text-center truncate" title={faq.csTitle}>
                  {faq.csTitle}
                </td>

                <td className="p-3">
                  {faq.csRegDate
                    ? new Date(faq.csRegDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3">
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-3 py-1 bg-blue-500 text-white fs-down-1 rounded hover:bg-blue-600 transition">
                      수정
                    </button>

                    <button
                      onClick={() => handleDelete(faq.csNo)}
                      className="px-3 py-1 bg-red-500 text-white fs-down-1 rounded hover:bg-red-600 transition">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {faqs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-gray-400">
                  등록된 FAQ가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FaqManage;