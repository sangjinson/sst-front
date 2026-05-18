import React, { useEffect, useState } from "react";
import CustomerSupportLayout from "@components/modules/customersupport/CustomerSupportLayout";
import CustomerSupportAccordion from "@components/modules/customersupport/CustomerSupportAccordion";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";

const ITEMS_PER_PAGE = 10;

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [noticeList, setNoticeList] = useState([]);

  const totalPages = Math.ceil(noticeList.length / ITEMS_PER_PAGE) || 1;

  const pagedNoticeList = noticeList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/customersupport/notice")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`공지사항 조회 실패: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setNoticeList(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("공지사항 조회 실패", err);
        setNoticeList([]);
      });
  }, []);

  useEffect(() => {
    setOpenId(null);
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <CustomerSupportLayout
      title="공지사항"
      breadcrumb={[
        { label: "홈", to: "/" },
        { label: "고객지원", to: "/customersupport/notice" },
        { label: "공지사항" },
      ]}>
      <CustomerSupportAccordion
        items={pagedNoticeList}
        openId={openId}
        onToggle={toggleAccordion}
        type="notice"
      />

      <div className="mt-10 md:mt-14 pt-10 border-t border-gray-50">
        <AreaPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </CustomerSupportLayout>
  );
};

export default Notice;