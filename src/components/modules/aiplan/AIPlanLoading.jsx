import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import capybaraHat from '@assets/images/aiplan-capybara-hat.png';
import capybaraGirlfriend from '@assets/images/aiplan-capybara-girlfriend.png';
// import goalFlag from '@assets/images/aiplan-goal-flag.png';

const AIPlanLoading = ({ isFinishing = false }) => {
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

      {/* 배경/도로 SVG 임시 주석 처리: 카피바라 2마리와 깃발만 확인할 때 사용
      <svg
        viewBox="0 0 1600 760"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="여행 일정 생성 중인 길 풍경"
      >
        <defs>
          <linearGradient id="aiPlanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BDEFFF" />
            <stop offset="1" stopColor="#E8FAFF" />
          </linearGradient>

          <linearGradient id="aiPlanRoad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#61707A" />
            <stop offset="1" stopColor="#424F58" />
          </linearGradient>
        </defs>

        <rect width="1600" height="760" fill="url(#aiPlanSky)" />

        <g style={sceneryBackStyle} opacity="0.22" fill="#7ACFE8">
          <rect x="-210" y="276" width="42" height="96" rx="5" />
          <rect x="-118" y="252" width="46" height="120" rx="5" />
          <rect x="0" y="282" width="28" height="90" rx="4" />
          <rect x="55" y="270" width="38" height="102" rx="5" />
          <rect x="138" y="248" width="48" height="124" rx="5" />
          <rect x="218" y="286" width="34" height="86" rx="4" />
          <rect x="320" y="266" width="42" height="106" rx="5" />
          <rect x="520" y="290" width="36" height="82" rx="4" />
          <rect x="710" y="272" width="54" height="100" rx="6" />
          <rect x="910" y="252" width="44" height="120" rx="5" />
          <rect x="1080" y="282" width="56" height="90" rx="4" />
          <rect x="1270" y="264" width="38" height="108" rx="5" />
          <rect x="1390" y="280" width="48" height="92" rx="5" />
          <rect x="1530" y="250" width="46" height="122" rx="5" />
          <rect x="1648" y="272" width="48" height="100" rx="5" />
          <rect x="1760" y="246" width="54" height="126" rx="6" />
        </g>

        <g style={cloudStyle} fill="#FFFFFF" opacity="0.96">
          <ellipse cx="150" cy="104" rx="48" ry="26" />
          <ellipse cx="195" cy="92" rx="40" ry="32" />
          <ellipse cx="238" cy="108" rx="52" ry="24" />
          <rect x="105" y="104" width="184" height="28" rx="14" />
        </g>

        <g style={cloudStyle} fill="#FFFFFF" opacity="0.92">
          <ellipse cx="640" cy="162" rx="44" ry="24" />
          <ellipse cx="684" cy="146" rx="42" ry="32" />
          <ellipse cx="728" cy="164" rx="46" ry="22" />
          <rect x="600" y="164" width="176" height="26" rx="13" />
        </g>

        <g style={cloudStyle} fill="#FFFFFF" opacity="0.94">
          <ellipse cx="1260" cy="94" rx="54" ry="24" />
          <ellipse cx="1310" cy="78" rx="46" ry="32" />
          <ellipse cx="1360" cy="98" rx="44" ry="22" />
          <rect x="1222" y="98" width="180" height="26" rx="13" />
        </g>

        <g style={sceneryFrontStyle}>
          <path
            d="M-260 382 C-80 360 120 374 320 386 C610 404 760 462 1000 430 C1220 388 1370 350 1600 368 C1700 374 1780 382 1860 370 L1860 640 L-260 640 Z"
            fill="#9AD246"
          />
          <path
            d="M-260 456 C-70 438 180 440 430 452 C700 466 900 506 1120 482 C1320 460 1490 422 1600 438 C1700 448 1780 456 1860 444 L1860 640 L-260 640 Z"
            fill="#8BC43E"
          />
          <path
            d="M-260 522 C40 500 390 508 680 526 C940 542 1240 574 1600 540 C1700 530 1780 524 1860 532 L1860 640 L-260 640 Z"
            fill="#7EB934"
          />

          <path
            d="M390 388 C365 420 362 460 368 500"
            fill="none"
            stroke="#F5DCA3"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path
            d="M1180 410 C1110 432 1070 468 1048 510"
            fill="none"
            stroke="#F5DCA3"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.82"
          />

          <g className="ai-plan-tree">
            <rect x="88" y="432" width="9" height="64" fill="#7A4A28" />
            <circle cx="92" cy="412" r="24" fill="#6CAA38" />
            <circle cx="76" cy="432" r="24" fill="#78B945" />
          </g>
          <g className="ai-plan-tree">
            <rect x="472" y="394" width="8" height="58" fill="#7A4A28" />
            <circle cx="476" cy="376" r="20" fill="#5A9F32" />
            <circle cx="492" cy="396" r="22" fill="#72B641" />
          </g>
          <g className="ai-plan-tree">
            <rect x="1460" y="338" width="8" height="62" fill="#7A4A28" />
            <circle cx="1464" cy="320" r="24" fill="#6AAA33" />
            <circle cx="1482" cy="336" r="22" fill="#78B83C" />
          </g>
        </g>

        <rect x="0" y="540" width="1600" height="220" fill="url(#aiPlanRoad)" />
        <rect x="0" y="532" width="1600" height="6" fill="#FFFFFF" opacity="0.9" />
        <rect x="0" y="748" width="1600" height="6" fill="#FFFFFF" opacity="0.9" />

        <g className="ai-plan-road-line" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.95">
          {Array.from({ length: 16 }).map((_, index) => (
            <line
              key={index}
              x1={index * 136 + 16}
              y1="650"
              x2={index * 136 + 88}
              y2="650"
            />
          ))}
        </g>
      </svg>
      */}

      {/* 도착 지점 깃발 임시 주석 처리
      <img
        src={goalFlag}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[60px] right-[-5.5%] z-10 w-[100px] select-none sm:w-[200px] md:bottom-[60px] md:right-[-3%] md:w-[200px]"
      />
      */}

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
          <p className="text-sm font-bold text-[#0F9B73]">AI 여행코스 생성 중</p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
            여행 일정을 만들고 있어요
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
