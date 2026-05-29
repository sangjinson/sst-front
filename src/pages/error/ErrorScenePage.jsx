import { useNavigate } from 'react-router-dom';
import capybaraImage from '@assets/images/not-found-capybara.png';
import roadImage from '@assets/images/not-found-road.png';

const errorSceneStyles = `
/* 손전등 불빛 전체 깜빡임 */
.error-scene-capybara .light-beam {
  animation: errorSceneLightBeam 4.8s steps(1, end) infinite;
  transform-origin: 283px 316px;
}

/* 손전등 glow */
.error-scene-capybara .flashlight-glow {
  animation: errorSceneFlashlightGlow 4.8s steps(1, end) infinite;
}

/* 에러 숫자 */
.error-scene-capybara .letters-front {
  animation: errorSceneLettersFront 4.8s steps(1, end) infinite;
}

.error-scene-capybara .letters-front-mobile {
  fill: #071421;
  stroke: #ffffff;
}

.error-scene-capybara .flash-on-layer {
  animation: errorSceneLightBeam 4.8s steps(1, end) infinite;
}

.error-scene-capybara .letters-front-off {
  fill: #071421;
  stroke: #ffffff;
}

.error-scene-capybara .letters-front-on {
  fill: #5F9FCA;
  stroke: #0B2538;
}

.error-scene-capybara .mobile-only {
  display: none;
}

@media (max-width: 767px) {
  .error-scene-capybara .desktop-only {
    display: none;
  }

  .error-scene-capybara .mobile-only {
    display: block;
  }
}

/* 에러 숫자 그림자 */
.error-scene-capybara .letters-shadow {
  animation: errorSceneLettersShadow 4.8s steps(1, end) infinite;
}

/* 불빛 on/off */
@keyframes errorSceneLightBeam {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 1;
  }
}

/* glow on/off */
@keyframes errorSceneFlashlightGlow {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0.35;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 1;
  }
}

/* 에러 숫자 색상 변화 */
@keyframes errorSceneLettersFront {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    fill: #071421;
    stroke: #ffffff;
  }

  13%, 19%, 30%, 66%, 75% {
    fill: #5F9FCA;
    stroke: #0B2538;
  }
}

/* 에러 숫자 그림자 변화 */
@keyframes errorSceneLettersShadow {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0.08;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 0.24;
  }
}
`;

const ErrorScenePage = ({
  code,
  label,
  title,
  description,
}) => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <style>{errorSceneStyles}</style>

      <svg
        viewBox="0 0 1774 887"
        className="error-scene-capybara absolute inset-0 z-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`발밑 손전등 불빛에 놀란 카피바라 ${code} 에러 애니메이션`}
      >
        <defs>
          {/* 손전등 불빛 그라데이션 */}
          <linearGradient
            id={`beamGradient-${code}`}
            x1="630"
            y1="625"
            x2="1605"
            y2="245"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0"
              stopColor="#FFF6A8"
              stopOpacity="0.36"
            />

            <stop
              offset="0.55"
              stopColor="#FFFDE7"
              stopOpacity="0.48"
            />

            <stop
              offset="1"
              stopColor="#FFF6A8"
              stopOpacity="0.36"
            />
          </linearGradient>

          {/* 그림자 */}
          <filter
            id={`softShadow-${code}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="12"
              floodColor="#020617"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        {/* 배경 */}
        <image
          href={roadImage}
          x="0"
          y="0"
          width="1774"
          height="887"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* 에러 숫자 모바일 */}
        <g
          filter={`url(#softShadow-${code})`}
          className="mobile-only"
        >
          <text
            x="887"
            y="120"
            className="letters-front-mobile"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="80"
            fontWeight="900"
            strokeWidth="2"
            textAnchor="middle"
          >
            {code}
          </text>
        </g>

        {/* PC 불빛과 에러 숫자는 같은 레이어 애니메이션으로 동기화 */}
        <g className="desktop-only">
          <g filter={`url(#softShadow-${code})`}>
            <text
              x="1350"
              y="185"
              className="letters-front-off"
              fontFamily="Arial Black, Arial, sans-serif"
              fontSize="75"
              fontWeight="900"
              strokeWidth="3"
            >
              {code}
            </text>
          </g>

          {/* 불빛 좌표 */}
          <g className="flash-on-layer">
            <path
              d="M720 580 L1300 0 L1855 -521 L1780 300 L720 610 Z"
              fill={`url(#beamGradient-${code})`}
              opacity="0.38"
            />

            <g filter={`url(#softShadow-${code})`}>
              <text
                x="1350"
                y="185"
                className="letters-front-on"
                fontFamily="Arial Black, Arial, sans-serif"
                fontSize="75"
                fontWeight="900"
                strokeWidth="3"
              >
                {code}
              </text>
            </g>
          </g>
        </g>

        {/* 카피바라 모바일 */}
        <g
          filter={`url(#softShadow-${code})`}
          className="mobile-only"
        >
          <image
            href={capybaraImage}
            x="700"
            y="400"
            width="300"
            height="500"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* 카피바라 데스크탑 */}
        <g
          filter={`url(#softShadow-${code})`}
          className="desktop-only"
        >
          <image
            href={capybaraImage}
            x="250"
            y="400"
            width="500"
            height="500"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pt-[18vh] text-center">
        <p className="mb-4 text-base font-bold uppercase tracking-[0.28em] text-[#8ED0FF] md:text-lg">
          {label}
        </p>

        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-300 md:text-xl">
          {description}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-8 rounded-full border border-white/25 bg-slate-950/45 px-8 py-3.5 text-lg font-bold text-white shadow-[0_14px_34px_rgba(2,6,23,0.24)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white hover:text-slate-950 active:translate-y-0 md:mt-10 md:px-14 md:py-5 md:text-2xl"
        >
          ← 뒤로가기
        </button>
      </div>
    </main>
  );
};

export default ErrorScenePage;
