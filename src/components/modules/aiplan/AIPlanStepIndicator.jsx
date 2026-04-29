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
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) =>  (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
              i < current   ? 'bg-[#0F9B73] text-white' :
              i === current ? 'bg-[#0F9B73] text-white ring-4 ring-green-100' :
              'bg-gray-200 text-gray-400'
            }`}>
              {i < current ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i === current ? 'text-[#0F9B73] font-semibold' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-20 mx-2 mb-4 transition ${i < current ? 'bg-[#0F9B73]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AIPlanStepIndicator;