import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

/*
 
페이지별 메타 태그(제목, 설명)를 설정하는 컴포넌트*/
const PageMeta = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

/*
 
애플리케이션 최상위에서 Helmet 기능을 사용하기 위해 감싸주는 컴포넌트
보통 메인 App.jsx나 index.js에서 사용합니다.*/
export const AppWrapper = ({ children }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;