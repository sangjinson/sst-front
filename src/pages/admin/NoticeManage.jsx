import React, { useEffect, useState } from "react";
import api from "@api/axios";

const NoticeManage = () => {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({
    csTitle: "",
    csContent: "",
    csPinYn: "N",
  });
  const [editId, setEditId] = useState(null);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/customersupport/notice");
      setNotices(res.data);
    } catch (error) {
      console.error("공지사항 조회 실패:", error);
      alert("공지사항을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchNotices();
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
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.csContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/admin/customersupport/notice/${editId}`, form);
        alert("공지사항이 수정되었습니다.");
      } else {
        await api.post("/admin/customersupport/notice", {
          ...form,
          csWrterNo: 1,
        });
        alert("공지사항이 등록되었습니다.");
      }

      setForm({
        csTitle: "",
        csContent: "",
        csPinYn: "N",
      });
      setEditId(null);
      fetchNotices();
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (notice) => {
    setEditId(notice.csNo);
    setForm({
      csTitle: notice.csTitle,
      csContent: notice.csContent,
      csPinYn: notice.csPinYn || "N",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (csNo) => {
    if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/customersupport/notice/${csNo}`);
      alert("공지사항이 삭제되었습니다.");
      fetchNotices();
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">공지사항 관리</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">
          {editId ? "공지사항 수정" : "공지사항 작성"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="csTitle"
            value={form.csTitle}
            onChange={handleChange}
            placeholder="공지사항 제목"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 fs-down-1"
          />

          <textarea
            name="csContent"
            value={form.csContent}
            onChange={handleChange}
            placeholder="공지사항 내용"
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
                <th className="p-3 w-[20%]">제목</th>
                <th className="p-3 w-[20%]">등록일</th>
                <th className="p-3 w-[15%]">관리</th>
            </tr>
          </thead>

          <tbody>
            {notices.map((notice) => (
              <tr key={notice.csNo} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{notice.csNo}</td>
                <td className="p-3">
                  {notice.csPinYn === "Y" ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                      고정
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3 text-center">{notice.csTitle}</td>
                <td className="p-3">
                  {notice.csRegDate
                    ? new Date(notice.csRegDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-3">
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="px-3 py-1 bg-blue-500 text-white fs-down-1 rounded hover:bg-blue-600 transition">
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(notice.csNo)}
                      className="px-3 py-1 bg-red-500 text-white fs-down-1 rounded hover:bg-red-600 transition">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {notices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-gray-400">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeManage;