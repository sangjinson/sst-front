import capybaraImage from '@assets/images/not-found-capybara.png';
import roadImage from '@assets/images/not-found-road.png';

const notFoundStyles = `
/* 손전등 불빛 전체 깜빡임 */
.not-found-capybara .light-beam {
  animation: notFoundLightBeam 4.8s steps(1, end) infinite;
  transform-origin: 283px 316px;
}



/* 손전등 glow */
.not-found-capybara .flashlight-glow {
  animation: notFoundFlashlightGlow 4.8s steps(1, end) infinite;
}


/* 404 글자 */
.not-found-capybara .letters-front {
  animation: notFoundLettersFront 4.8s steps(1, end) infinite;
}


/* 404 그림자 */
.not-found-capybara .letters-shadow {
  animation: notFoundLettersShadow 4.8s steps(1, end) infinite;
}


/* 불빛 on/off */
@keyframes notFoundLightBeam {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 1;
  }
}

/* glow on/off */
@keyframes notFoundFlashlightGlow {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0.35;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 1;
  }
}

/* 404 색상 변화 */
@keyframes notFoundLettersFront {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    fill: #071421;
    stroke: #ffffff;
  }

  13%, 19%, 30%, 66%, 75% {
    fill: #5F9FCA;
    stroke: #0B2538;
  }
}

/* 404 그림자 변화 */
@keyframes notFoundLettersShadow {
  0%, 12%, 16%, 21%, 72%, 78%, 100% {
    opacity: 0.08;
  }

  13%, 19%, 30%, 66%, 75% {
    opacity: 0.24;
  }
}
`;

const NotFoundPage = () => {
  return (
    <main
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${roadImage})` }}
    >
      <style>{notFoundStyles}</style>

      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center justify-center px-5 py-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#8ED0FF]">
          Page Not Found
        </p>

        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          길을 잃은 것 같아요
        </h1>

        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-300 md:text-lg">
          찾으려는 페이지가 사라졌거나 주소가 바뀌었어요.
          카피바라 탐험대가 손전등으로 다시 찾아보는 중입니다.
        </p>

        <div className="not-found-capybara relative mt-6 w-full max-w-7xl overflow-visible">
          <svg
            viewBox="-420 -40 1600 700"
            className="h-[620px] w-full overflow-visible"
            role="img"
            aria-label="발밑 손전등 불빛에 놀란 카피바라 404 애니메이션"
          >
            <defs>
              {/* 손전등 불빛 그라데이션 */}
              <linearGradient
                id="beamGradient"
                x1="-35"
                y1="390"
                x2="1855"
                y2="60"
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

              {/* blur 제거 */}
              <filter id="softGlow">
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 그림자 */}
              <filter
                id="softShadow"
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

            {/* 손전등 불빛 */}
            <g className="light-beam">
              <path
                d="M-35 390 L1250 -520 L1855 -521 L1855 60 L-10 450 Z"
                fill="url(#beamGradient)"
                opacity="0.38"
              />

              <path
                d="M-35 410 L1250 -520 L1855 -521 L1855 60 L-10 435 Z"
                fill="url(#beamGradient)"
                opacity="0.38"
              />
            </g>



            {/* 404 */}
            <g filter="url(#softShadow)">
              <text
                x="1140"
                y="-240"
                className="letters-front"
                fontFamily="Arial Black, Arial, sans-serif"
                fontSize="130"
                fontWeight="900"
                strokeWidth="4"
              >
                404
              </text>
            </g>

            {/* 카피바라 */}
            <g transform="translate(-920 20) scale(2.85)">
              <g filter="url(#softShadow)">
                <image
                  href={capybaraImage}
                  x="38"
                  y="28"
                  width="292"
                  height="389"
                  preserveAspectRatio="xMidYMin meet"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;