import React, { useEffect, useState } from "react";
import CustomerSupportLayout from "@components/modules/customersupport/CustomerSupportLayout";
import CustomerSupportAccordion from "@components/modules/customersupport/CustomerSupportAccordion";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";

const ITEMS_PER_PAGE = 10;

const Faq = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [faqList, setFaqList] = useState([]);

  const totalPages = Math.ceil(faqList.length / ITEMS_PER_PAGE) || 1;

  const pagedFaqList = faqList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/customersupport/faq")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`FAQ 조회 실패: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFaqList(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("FAQ 조회 실패", err);
        setFaqList([]);
      });
  }, []);

  useEffect(() => {
    setOpenId(null);
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <CustomerSupportLayout
      title="자주하는 질문"
      breadcrumb={[
        { label: "홈", to: "/" },
        { label: "고객지원", to: "/customersupport/notice" },
        { label: "자주하는 질문" },
      ]}>
      <CustomerSupportAccordion
        items={pagedFaqList}
        openId={openId}
        onToggle={toggleAccordion}
        type="faq"
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

export default Faq;