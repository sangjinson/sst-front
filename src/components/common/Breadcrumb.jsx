import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    /* 🚀 고정되어 있던 mb-[50px]를 지우고, 밖에서 받아온 className을 합쳐줍니다! */
    <p className={`text-sm text-gray-400 flex items-center flex-wrap gap-1.5 ${className}`}>
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;

        return (
          <React.Fragment key={index}>
            <span
              onClick={() => !isLast && path.to && navigate(path.to)}
              className={`${
                isLast
                  ? 'text-gray-900 font-bold font-griun cursor-default'
                  : 'cursor-pointer hover:text-[#0F9B73] transition-colors'
              }`}
            >
              {path.label}
            </span>
            
            {!isLast && <span>{' > '}</span>}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default Breadcrumb;