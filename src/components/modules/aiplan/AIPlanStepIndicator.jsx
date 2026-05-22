// 역할: 상단에 1,2,3단계 진행상태 표시
import React from 'react';

/**
 * AIPlanStepIndicator - AI 플랜 스텝 인디케이터
 *
 * 사용 예시:
 * <AIPlanStepIndicator current={step} />
 *
 * props:
 * - current : 현재 스텝 번호 (0부터 시작)
 */
const AIPlanStepIndicator = ({ current }) => {
  const steps = ['지역 선택', '여행 기간', '여행 테마'];

  return (
    <div className="mb-9 flex items-center justify-center md:mb-10">
      {steps.map((label, i) =>  (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center" data-aos="zoom-in" data-aos-once="true">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-black shadow-sm transition-all duration-200 ${
              i < current   ? 'bg-[#0F9B73] text-white' :
              i === current ? 'bg-[#0F9B73] text-white ring-4 ring-green-100' :
              'bg-gray-200 text-gray-400'
            }`}>
              {i < current ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`mt-2 text-sm font-bold ${i === current ? 'text-[#0F9B73]' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-3 mb-6 h-1 w-24 rounded-full transition-all duration-200 ${i < current ? 'bg-[#0F9B73]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AIPlanStepIndicator;