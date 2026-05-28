import React, { useEffect, useState } from "react";
import CustomerSupportLayout from "@components/modules/customersupport/CustomerSupportLayout";
import CustomerSupportAccordion from "@components/modules/customersupport/CustomerSupportAccordion";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";
import api from "@api/axios";

/* 한 페이지에 보여줄 FAQ 개수 */
const ITEMS_PER_PAGE = 10;

const Faq = () => {

  /* 현재 페이지 */
  const [currentPage, setCurrentPage] = useState(1);

  /* 현재 열려있는 아코디언 ID */
  const [openId, setOpenId] = useState(null);

  /* FAQ 목록 데이터 */
  const [faqList, setFaqList] = useState([]);

  /* 전체 페이지 수 계산 */
  const totalPages = Math.ceil(faqList.length / ITEMS_PER_PAGE) || 1;

  /* 현재 페이지에 보여줄 FAQ 목록 */
  const pagedFaqList = faqList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* 아코디언 열기/닫기 */
  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  /* FAQ 데이터 조회 */
  useEffect(() => {
    api.get("/customersupport/faq")
      /* 조회 성공 */
      .then((res) => {
        setFaqList(Array.isArray(res.data) ? res.data : []);
      })

      /* 조회 실패 */
      .catch((err) => {
        console.error("FAQ 조회 실패", err);
        setFaqList([]);
      });

  }, []);

  /* 페이지 변경 시 */
  useEffect(() => {

    /* 열려있던 아코디언 닫기 */
    setOpenId(null);

    /* 페이지 상단 이동 */
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

      {/* FAQ 아코디언 */}
      <CustomerSupportAccordion
        items={pagedFaqList}
        openId={openId}
        onToggle={toggleAccordion}
        type="faq"
      />

      {/* 페이지네이션 */}
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
