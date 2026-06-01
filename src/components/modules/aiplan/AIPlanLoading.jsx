import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import capybaraHat from '@assets/images/aiplan-capybara-hat.png';
import capybaraGirlfriend from '@assets/images/aiplan-capybara-girlfriend.png';
// import goalFlag from '@assets/images/aiplan-goal-flag.png';

const AIPlanLoading = ({
  isFinishing = false,
  title = '여행 일정을 불러오고 있어요',
}) => {
  const containerRef = useRef(null);
  const capybaraRef = useRef(null);
  const girlfriendRef = useRef(null);
  const capybaraProgressRef = useRef(0);
  const capybaraDistanceRef = useRef(0);

  const applyCapybaraPosition = useCallback((progress, transition) => {
    capybaraProgressRef.current = progress;

    if (!capybaraRef.current) return;

    if (transition !== undefined) {
      capybaraRef.current.style.transition = transition;
    }

    capybaraRef.current.style.transform = `translateX(${capybaraDistanceRef.current * (progress / 100)}px)`;

    const capybaraImage = capybaraRef.current.querySelector('img');
    capybaraImage?.classList.toggle(
      'ai-plan-capybara-waiting-hop',
      !isFinishing && progress >= 72
    );
  }, [isFinishing]);

  useEffect(() => {
    let animationFrame;

    if (isFinishing) {
      applyCapybaraPosition(100, 'transform 1.6s ease-in-out');
      return undefined;
    }

    const maxProgressBeforeFinish = 72;
    const startProgress = Math.min(capybaraProgressRef.current, maxProgressBeforeFinish);
    const remainingProgress = maxProgressBeforeFinish - startProgress;

    if (remainingProgress <= 0) return undefined;

    const startTime = window.performance.now();
    const cruiseDuration = 7200 * (remainingProgress / maxProgressBeforeFinish);

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const nextProgress = Math.min(
        maxProgressBeforeFinish,
        startProgress + (elapsed / cruiseDuration) * remainingProgress
      );

      applyCapybaraPosition(nextProgress, 'none');

      if (nextProgress < maxProgressBeforeFinish) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = window.requestAnimationFrame(updateProgress);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [applyCapybaraPosition, isFinishing]);

  const updateCapybaraDistance = useCallback(() => {
    if (!containerRef.current || !capybaraRef.current || !girlfriendRef.current) return;

    const nextDistance = girlfriendRef.current.offsetLeft
      - capybaraRef.current.offsetLeft
      - capybaraRef.current.offsetWidth * 0.72;

    capybaraDistanceRef.current = Math.max(0, Math.round(nextDistance));
    applyCapybaraPosition(capybaraProgressRef.current, 'none');
  }, [applyCapybaraPosition]);

  useLayoutEffect(() => {
    updateCapybaraDistance();
  }, [updateCapybaraDistance]);

  useEffect(() => {
    window.addEventListener('resize', updateCapybaraDistance);

    return () => {
      window.removeEventListener('resize', updateCapybaraDistance);
    };
  }, [updateCapybaraDistance]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[520px] overflow-hidden rounded-2xl bg-transparent"
    >
      <style>
        {`
          @keyframes aiPlanHeartPop {
            0%, 42% { opacity: 0; transform: translate(-50%, 10px) scale(0.65); }
            58% { opacity: 1; transform: translate(-50%, -10px) scale(1.16); }
            78% { opacity: 1; transform: translate(-50%, -18px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -28px) scale(0.9); }
          }

          @keyframes aiPlanCapybaraWaitingHop {
            0%, 100% { transform: translateY(0); }
            45% { transform: translateY(-10px); }
          }

          .ai-plan-capybara-waiting-hop {
            animation: aiPlanCapybaraWaitingHop 0.85s ease-in-out infinite;
          }

          .ai-plan-heart-pop {
            opacity: 0;
          }

          .ai-plan-heart-finish {
            animation: aiPlanHeartPop 1.6s ease-in-out forwards;
          }
        `}
      </style>

      {/* 여자친구 카피바라 위치 조절: bottom/right 값으로 위치, w 값으로 크기 조절 */}
      <img
        ref={girlfriendRef}
        src={capybaraGirlfriend}
        onLoad={updateCapybaraDistance}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[42px] right-[1%] z-10 w-[118px] select-none sm:w-[150px] md:bottom-[50px] md:right-[2%] md:w-[190px]"
      />

      {/* 도착 후 하트 위치 조절: bottom/right 값으로 위치, text 크기로 하트 크기 조절 */}
      <div
        aria-hidden="true"
        className={`${isFinishing ? 'ai-plan-heart-finish' : ''} ai-plan-heart-pop pointer-events-none absolute bottom-[152px] right-[13%] z-30 text-5xl text-red-500 drop-shadow-sm sm:text-6xl md:bottom-[194px] md:right-[15%] md:text-7xl`}
      >
        ♥
      </div>

      {/* 모자 쓴 카피바라 위치 조절: bottom/left 값으로 시작 위치, w 값으로 크기 조절 */}
      <div
        ref={capybaraRef}
        className="pointer-events-none absolute bottom-[34px] left-[1%] z-20 select-none will-change-transform md:bottom-[42px] md:left-[2%]"
      >
        <img
          src={capybaraHat}
          onLoad={updateCapybaraDistance}
          alt=""
          aria-hidden="true"
          className="w-[120px] sm:w-[154px] md:w-[196px]"
        />
      </div>

      <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
        <div className="px-7 py-6">
          <p className="text-sm font-bold text-[#0F9B73]">여행코스 로딩 중</p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-500 md:text-base">
            선택한 지역과 테마를 바탕으로 동선을 정리하는 중이에요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPlanLoading;
