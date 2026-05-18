import React, { useEffect, useState } from "react";
import CustomerSupportLayout from "@components/modules/customersupport/CustomerSupportLayout";
import CustomerSupportAccordion from "@components/modules/customersupport/CustomerSupportAccordion";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";

/* 한 페이지에 보여줄 공지사항 개수 */
const ITEMS_PER_PAGE = 10;

const Notice = () => {

  /* 현재 페이지 */
  const [currentPage, setCurrentPage] = useState(1);

  /* 현재 열려있는 아코디언 ID */
  const [openId, setOpenId] = useState(null);

  /* 공지사항 목록 데이터 */
  const [noticeList, setNoticeList] = useState([]);

  /* 전체 페이지 수 계산 */
  const totalPages = Math.ceil(noticeList.length / ITEMS_PER_PAGE) || 1;

  /* 현재 페이지에 보여줄 공지사항 목록 */
  const pagedNoticeList = noticeList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* 아코디언 열기/닫기 */
  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  /* 공지사항 데이터 조회 */
  useEffect(() => {

    fetch("http://localhost:8080/api/customersupport/notice")

      .then((res) => {

        /* 응답 실패 처리 */
        if (!res.ok) {
          throw new Error(`공지사항 조회 실패: ${res.status}`);
        }

        return res.json();
      })

      /* 조회 성공 */
      .then((data) => {
        setNoticeList(Array.isArray(data) ? data : []);
      })

      /* 조회 실패 */
      .catch((err) => {
        console.error("공지사항 조회 실패", err);
        setNoticeList([]);
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
      title="공지사항"
      breadcrumb={[
        { label: "홈", to: "/" },
        { label: "고객지원", to: "/customersupport/notice" },
        { label: "공지사항" },
      ]}>

      {/* 공지사항 아코디언 */}
      <CustomerSupportAccordion
        items={pagedNoticeList}
        openId={openId}
        onToggle={toggleAccordion}
        type="notice"
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

export default Notice;