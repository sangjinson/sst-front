import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import IconSVG from "@components/Icon/IconSVG";



/*
// 사용법
<Breadcrumb 
  paths={[
    { label: '홈', to: '/' },
    { label: region, to: `/${region}` },
    { label: '먹거리', to: `/${region}/food/list` },
    { label: item.name } 
  ]} 
  className="mb-4" // 🚀 여기서는 좁은 여백을 던져줍니다!
/>
*/
// 🚀 className을 props로 추가로 받습니다 (기본값은 빈 문자열)
const Breadcrumb = ({ paths, className = '' }) => {
  return (
    /* w-full과 flex-end를 유지하여 오른쪽 상단 배치를 살리되, daisyUI의 breadcrumbs 스타일을 입힙니다. */
    <div className={`text-sm breadcrumbs w-full flex justify-center md:justify-start ${className}`}>
      <ul>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <li key={index} className="flex items-center fs-up-2">
              {isLast ? (
                <span className="text-gray-900 font-bold tracking-tight">
                  {path.label}
                </span>
              ) : (
                <Link
                  to={path.to}
                  className="text-gray-500 hover:text-[#0F9B73] transition-all duration-200 ease-in-out"
                >
                  {index === 0 ? (
                    <IconSVG name="home" size={20} />
                  ) : (
                    path.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;