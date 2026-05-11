import React, { useEffect, useRef } from 'react';

const EyesFollow = () => {
  const eyeRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      eyeRefs.current.forEach((eye) => {
        if (!eye) return;

        const rect = eye.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const radian = Math.atan2(event.clientX - x, event.clientY - y);
        const rotation = radian * (180 / Math.PI) * -1 + 270;
        
        // 1. 눈동자 회전
        eye.style.transform = `rotate(${rotation}deg)`;

        // 2. [추가] 마우스 거리에 따른 눈 크기 변화 (움찔거리는 효과)
        const dist = Math.hypot(event.clientX - x, event.clientY - y);
        const scale = Math.max(0.95, 1.1 - dist / 2000); 
        eye.parentElement.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 눈 전체 스타일 (흰자위)
  const eyeStyle = {
    position: 'relative',
    width: 'clamp(80px, 15vw, 100px)',
    height: 'clamp(80px, 15vw, 100px)',
    background: '#fff',
    borderRadius: '50%',
    // 선명한 테두리로 '그림' 같은 느낌 강조
    border: '4px solid #222',
    // 밋밋하지 않게 하단에 묵직한 그림자 (캐릭터 느낌)
    boxShadow: '0 10px 0 rgba(0,0,0,0.05), 0 20px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s ease-out',
    overflow: 'hidden',
  };

  // 눈동자 스타일
  const pupilStyle = {
    position: 'absolute',
    top: '50%',
    left: '18px', // 회전 중심에서 더 멀리 배치해 움직임 크게
    transform: 'translate(-50%, -50%)',
    width: '45px',
    height: '45px',
    background: '#222',
    borderRadius: '50%',
    border: '4px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // [추가] 눈동자 안의 하이라이트 (이게 없으면 생기가 없어요!)
  const glossStyle = {
    position: 'absolute',
    top: '20%',
    left: '25%',
    width: '12px',
    height: '12px',
    background: '#fff',
    borderRadius: '50%',
    opacity: 0.8,
  };

  return (
    <div 
      ref={containerRef}
      className="flex justify-center items-center gap-12 md:gap-20 py-10"
    >
      {[0, 1].map((i) => (
        <div key={i} style={{ perspective: '1000px' }}>
          <div
            className="eye-outer"
            style={eyeStyle}
          >
            {/* 눈동자 회전축 */}
            <div
              ref={(el) => (eyeRefs.current[i] = el)}
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <div style={pupilStyle}>
                <div style={glossStyle} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EyesFollow;