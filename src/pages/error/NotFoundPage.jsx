import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import capybaraImage from '@assets/images/not-found-capybara.png';
import flashlightImage from '@assets/images/not-found-flashlight.png';

const notFoundStyles = "\n.not-found-capybara .light-beam {\n  animation: notFoundLightBeam 4.8s ease-in-out infinite;\n  transform-origin: 283px 316px;\n}\n\n.not-found-capybara .flashlight-glow {\n  animation: notFoundFlashlightGlow 4.8s ease-in-out infinite;\n}\n\n.not-found-capybara .surprised-face {\n  animation: notFoundSurprisedFace 4.8s ease-in-out infinite;\n  transform-origin: 211px 194px;\n}\n\n.not-found-capybara .letters-front {\n  animation: notFoundLettersFront 4.8s ease-in-out infinite;\n}\n\n.not-found-capybara .letters-shadow {\n  animation: notFoundLettersShadow 4.8s ease-in-out infinite;\n}\n\n@keyframes notFoundLightBeam {\n  0%, 12%, 16%, 21%, 72%, 78%, 100% { opacity: 0; }\n  13%, 19%, 30%, 66%, 75% { opacity: 1; }\n}\n\n@keyframes notFoundFlashlightGlow {\n  0%, 12%, 16%, 21%, 72%, 78%, 100% { opacity: 0.35; }\n  13%, 19%, 30%, 66%, 75% { opacity: 1; }\n}\n\n@keyframes notFoundSurprisedFace {\n  0%, 27%, 68%, 100% { opacity: 0; transform: scale(0.9); }\n  34%, 61% { opacity: 1; transform: scale(1); }\n}\n\n@keyframes notFoundLettersFront {\n  0%, 12%, 16%, 21%, 72%, 78%, 100% { fill: #153149; stroke: #071421; }\n  13%, 19%, 30%, 66%, 75% { fill: #8ed0ff; stroke: #123047; }\n}\n\n@keyframes notFoundLettersShadow {\n  0%, 12%, 16%, 21%, 72%, 78%, 100% { opacity: 0.08; }\n  13%, 19%, 30%, 66%, 75% { opacity: 0.24; }\n}\n";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setCursorPoint({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B1F33] text-white" onMouseMove={handleMouseMove}>
      <style>{notFoundStyles}</style>

      {/* 개발용 마우스 좌표 표시 */}
      <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-screen w-screen">
        <div
          className="absolute top-0 h-screen border-l border-dashed border-[#8ED0FF]/90"
          style={{ left: cursorPoint.x }}
        />
        <div
          className="absolute left-0 w-screen border-t border-dashed border-[#8ED0FF]/90"
          style={{ top: cursorPoint.y }}
        />
        <div className="absolute left-3 top-3 rounded-lg bg-slate-950/75 px-3 py-2 text-sm font-bold text-white shadow-sm">
          x: {cursorPoint.x} / y: {cursorPoint.y}
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center justify-center px-5 py-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#8ED0FF]">
          Page Not Found
        </p>
        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          길을 잃은 것 같아요
        </h1>
        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-300 md:text-lg">
          찾으려는 페이지가 사라졌거나 주소가 바뀌었어요. 카피바라 탐험대가 손전등으로 다시 찾아보는 중입니다.
        </p>

        <div className="not-found-capybara relative mt-6 w-full max-w-7xl">
          <svg
            viewBox="0 0 760 420"
            className="h-auto w-full"
            role="img"
            aria-label="발밑 손전등 불빛에 놀란 카피바라 404 애니메이션"
          >
            <defs>
              <linearGradient id="beamGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#FFF6A8" stopOpacity="0.95" />
                <stop offset="0.55" stopColor="#FFFDE7" stopOpacity="0.72" />
                <stop offset="1" stopColor="#FFF6A8" stopOpacity="0.68" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#020617" floodOpacity="0.35" />
              </filter>
            </defs>
            <circle cx="626" cy="74" r="2" fill="#C7E8FF" opacity="0.7" />
            <circle cx="690" cy="148" r="1.7" fill="#C7E8FF" opacity="0.6" />
            <circle cx="548" cy="112" r="1.6" fill="#C7E8FF" opacity="0.55" />

            {/* 손전등 불빛 위치 */}
            <g className="light-beam" filter="url(#softGlow)">
              <path d="M275 310 L760 102 L760 366 L291 332 Z" fill="url(#beamGradient)" />
              <path d="M290 318 L760 148 L760 328 L299 325 Z" fill="#FFFDE7" opacity="0.56" />
            </g>
            <g filter="url(#softShadow)">
              <text x="498" y="324" className="letters-front" fontFamily="Arial Black, Arial, sans-serif" fontSize="92" fontWeight="900" strokeWidth="4">
                404
              </text>
            </g>
            {/* 카피바라 위치/크기 조정 */}
            <g transform="translate(22 72) scale(1.055)">
              <g filter="url(#softShadow)">
                <image
                  href={capybaraImage}
                  x="38"
                  y="28"
                  width="292"
                  height="389"
                  preserveAspectRatio="xMidYMin meet"
                  transform="translate(368 0) scale(-1 1)"
                />
              </g>

              <g className="surprised-face">
                <circle cx="169" cy="127" r="9" fill="#2B1A10" />
                <circle cx="228" cy="127" r="9" fill="#2B1A10" />
                <circle cx="165" cy="123" r="3" fill="#FFFFFF" />
                <circle cx="224" cy="123" r="3" fill="#FFFFFF" />
                <circle cx="211" cy="194" r="10" fill="#2B1A10" />
              </g>
            </g>
            <g transform="translate(158 292) rotate(-7)">
              <image
                href={flashlightImage}
                x="0"
                y="0"
                width="182"
                height="87"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#071421] active:scale-95"
          >
            이전 페이지
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl bg-[#0F9B73] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B8A66] active:scale-95"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
